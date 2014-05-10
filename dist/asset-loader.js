/*!
 * asset-loader
 * Utility to lazy load and manage JS and CSS assets using Promises
 * @version v0.1.0
 * @author Garth Poitras <garth22@gmail.com> (http://garthpoitras.com/)
 * @license MIT
 */
(function(exports, document) {

'use strict';

/*
 * @property EXTENSIONS
 * @private
 * File type extensions supported by AssetLoader
 */
var EXTENSIONS = { 
  js   : 'js', 
  css  : 'css'
};

/**
 * @method getHead
 * @private
 * @returns document head
 * Lazy evalulate and cache document head lookup
 */
function getHead() {
  _head = _head || document.head || document.getElementsByTagName('head')[0];
  return _head;
}
var _head;

/**
 * @method map
 * @private
 * Alias to Array.prototype.map
 * with a simple polyfill (for internal use)
 */
var map = [].map || function(callback) {
  var array = this,
      length = array && array.length,
      mapped = [], i;
  for(i = 0; i < length; i++) {
    mapped.push(callback(array[i]));
  }
  return mapped;
};

/**
 * @class Deferred
 * @private
 * Deferred promise for cleaner coding
 */
function Deferred() {
  var deferred = {};
  deferred.promise = new AssetLoader.Promise(function (resolve, reject) {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  return deferred;
}

/**
 * @private
 * @method loadScript
 * @returns Promise
 */
function loadScript(url) {
  var script = document.createElement('script'),
      deferred = new Deferred();

  // Modern browser support
  if ('onload' in script) {
    script.onload = script.onerror = function() {
      deferred.resolve(script);
    };
  } else {
    script.onreadystatechange = function() {
      if (this.readyState === 'loaded' || this.readyState === 'complete') {
        script.onload = this.onreadystatechange = null;
        deferred.resolve(script);
      }
    };
  }

  script.src = url;
  getHead().appendChild(script);

  return deferred.promise;
}

/**
 * @private
 * @method loadCSS
 * @returns Promise
 */
function loadCSS(url) {
  var link = document.createElement('link'), 
      deferred = new Deferred(), img;

  link.rel  = 'stylesheet';
  link.href = url;
  getHead().appendChild(link);

  // Modern browsers support onload/onerror for link elements.
  // Some browsers (old webkit) return a false positive for support, never firing :(
  //if(link.onload === null) {
  //  link.onload = link.onerror = function() { 
  //    deferred.resolve(link);
  //  };
  //} else {
    // Fallback for browsers that won't fire link onload events
    img = new Image();
    img.onerror = function() { 
      deferred.resolve(link);
    };
    img.src = url;
  //}
  
  return deferred.promise;
}

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

/**
 * @class AssetLoader
 * @static
 */
var AssetLoader = {
  /**
   * @property cache
   * Simple cache of path (key) / asset node (value)
   */
  cache: [],

  /**
   * @property Promise
   * @default window.Promise
   * Class to use for Promise callback support.
   * Uses native Promise if available.  Can override
   * to use another A+ spec library (i.e. RSVP)
   */
  Promise: window.Promise,

  /**
   * @method load
   * @param options 
   *   files : file paths to load
   *   path  : optional root path of files
   * @returns Promise
   * Loads a set of files
   */
  load: function(options) {
    return new AssetPackage(options.files, options.path).load();
  }
};

/**
 * Namespace & export classes
 */
AssetLoader.AssetPackage = AssetPackage;
AssetLoader.AssetFile    = AssetFile;
exports.AssetLoader      = AssetLoader;

}(this, document));
