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
