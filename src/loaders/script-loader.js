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
