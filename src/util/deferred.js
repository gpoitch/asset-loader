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
