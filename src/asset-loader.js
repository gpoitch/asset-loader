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
