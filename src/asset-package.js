/**
 * @class AssetPackage
 * @namespace AssetLoader
 * A group of asset files
 */
function AssetPackage(filepaths, basepath) {
  if (filepaths) {
    basepath = basepath || '';
    this.files = map.call(filepaths, function(path) {
      return new AssetFile(basepath + path);
    });
  }
}

/**
 * @method load
 * Loads a package of asset files
 * @returns Promise
 */
AssetPackage.prototype.load = function() {
  var requests = map.call(this.files, function(file) {
    return file.load();
  });

  return AssetLoader.Promise.all(requests);
};
