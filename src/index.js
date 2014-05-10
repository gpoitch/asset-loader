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
