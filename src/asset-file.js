/**
 * @class AssetFile
 * A single asset file
 */
function AssetFile(path) {
  if (path) {
    this.path = path;
    var type = this.type = path.substr((Math.max(0, path.lastIndexOf('.')) || Infinity) + 1).toLowerCase();
    if(!(type in EXTENSIONS)) {
      throw new Error('"' + type + '" file type is not supported');
    }
  }
}

/**
 * @method load
 * @returns Promise
 * Loads the file
 */
AssetFile.prototype.load = function() {
  var path = this.path, type = this.type,
      cachedFile = AssetLoader.cache[path],
      loadPromise;

  if (cachedFile) {
    return AssetLoader.Promise.resolve(cachedFile);
  }

  switch (type) {
    case EXTENSIONS.js:
      loadPromise = loadScript(path);
      break;
    case EXTENSIONS.css:
      loadPromise = loadCSS(path);
      break;
  }

  if (loadPromise) {
    // Add file to cache when complete
    loadPromise.then(function(file) {
      AssetLoader.cache[path] = file;
    });
    return loadPromise;
  }

  return AssetLoader.Promise.reject();
};
