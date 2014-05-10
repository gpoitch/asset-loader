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
