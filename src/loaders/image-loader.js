/**
 * @private
 * @method loadImage
 * @returns Promise
 */
function loadImage(url) {
  return new AssetLoader.Promise(function(resolve) {
    var image = new Image();
    image.onload = image.onerror = function() {
      resolve(image);
    };
    image.src = url;
  });
}
