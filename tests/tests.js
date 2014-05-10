module('asset-loader');

var AssetFile    = AssetLoader.AssetFile,
    AssetPackage = AssetLoader.AssetPackage;

test('can create an AssetFile', function() {
  var file = new AssetFile();
  ok ( file, 'AssetFile created' );
  ok ( file instanceof AssetFile, 'instance of AssetFile' );
});

test('AssetFile types', function() {
  var file = new AssetFile();
  equal ( file.type, undefined, 'not providing a path results in no type' );

  file = new AssetFile('test.js');
  equal ( file.type, 'js', 'js type detected' );

  file = new AssetFile('test.css');
  equal ( file.type, 'css', 'css type detected' );

  /*
  file = new AssetFile('test.png');
  equal ( file.type, 'png', 'png type detected' );

  file = new AssetFile('test.gif');
  equal ( file.type, 'gif', 'gif type detected' );

  file = new AssetFile('test.jpg');
  equal ( file.type, 'jpg', 'jpg type detected' );

  file = new AssetFile('test.jpeg');
  equal ( file.type, 'jpeg', 'jpeg type detected' );
  */

  file = new AssetFile('test.min.js');
  equal ( file.type, 'js', 'multi-dot works' );

  throws( function() { new AssetFile('test.js.dev'); }, 'multi-dot takes last segment');
});

test('AssetFile.load() creates promise', function() {
  var file = new AssetFile();
  var promise = file.load();
  ok ( promise.then );
});

asyncTest('AssetFile can load js file', function() {
  expect(2);

  var file = new AssetFile('test-assets/test.js');
  var promise = file.load();

  promise.then(function(file) {
    ok ( file );
    equal ( file.nodeName, 'SCRIPT', 'file is script' );
    start();
  });
});

asyncTest('AssetFile can load css file', function() {
  expect(2);

  var file = new AssetFile('test-assets/test.css');
  var promise = file.load();

  promise.then(function(file) {
    ok ( file );
    equal ( file.nodeName, 'LINK', 'file is link' );
    start();
  });
});

/*
asyncTest('AssetFile can load image file', function() {
  expect(2);

  var file = new AssetFile('test-assets/test.png');
  var promise = file.load();

  promise.then(function(file) {
    ok ( file );
    ok ( file instanceof Image, 'file is image' );
    start();
  });
});
*/

test('AssetFile throws on unsupported file', function() {
  throws( function() { new AssetFile('test.txt'); });
});

/*
asyncTest('AssetFile rejects promise on loading empty file', function() {
  expect(1);

  var file = new AssetFile();
  file.load().then(null, function(error) {
    ok ( error );
    start();
  });
});
*/

/*
asyncTest('AssetFile rejects promise on loading non-existent js file', function() {
  expect(1);

  var file = new AssetFile('non-existent.js');
  file.load().then(null, function(error) {
    ok ( error );
    start();
  });
});
*/

/*
asyncTest('AssetFile rejects promise on loading non-existent remote js file', function() {
  expect(1);

  var file = new AssetFile('http://google.com/non-existent.js');
  file.load().then(null, function(error) {
    ok ( error );
    start();
  });
});
*/

/*
asyncTest('AssetFile rejects promise on loading non-existent css file', function() {
  expect(1);

  var file = new AssetFile('non-existent.css');
  file.load().then(null, function(error) {
    ok ( error );
    start();
  });
});

asyncTest('AssetFile rejects promise on loading non-existent remote css file', function() {
  expect(1);

  var file = new AssetFile('http://google.com/non-existent.css');
  file.load().then(null, function(error) {
    ok ( error );
    start();
  });
});
*/

test('can create an AssetPackage', function() {
  var pkg = new AssetPackage();
  ok ( pkg, 'AssetPackage created' );
  ok ( pkg instanceof AssetPackage, 'instance of AssetPackage' );
});

test('AssetPackage creates files', function() {
  var pkg = new AssetPackage([
    'test-assets/test.js',
    'test-assets/test.css'
  ]);
  equal ( pkg.files.length, 2, 'files created' );
  ok ( pkg.files[0] instanceof AssetFile, 'files are instances of AssetFile' );
});

test('AssetPackage supports path', function() {
  var pkg = new AssetPackage([
    'test.js',
    'test.css'
  ], 'test-assets/');
  equal ( pkg.files.length, 2, 'files created' );
  equal ( pkg.files[0].path, 'test-assets/test.js', 'files are instances of AssetFile' );
});

test('AssetPackage throws error with unsupported files', function() {
  throws( function() {
    new AssetPackage([
      'test-assets/test.js',
      'unsupported1.txt',
      'test-assets/test.css',
      'unsupported2.exe'
    ]);
  }, 'error thrown when attempting to create with unsupported files');
});

asyncTest('AssetPackage loads all its files', function() {
  expect(2);

  var pkg = new AssetPackage([
    'test-assets/test.js',
    'test-assets/test.css'
  ]);

  pkg.load().then(function(files) {
    ok (files, 'files loaded');
    equal ( files.length, 2, 'all files loaded');
    start();
  });
});

test('AssetLoader exists as singleton', function() {
  ok ( window.AssetLoader, 'AssetLoader exists as singleton' );
});

asyncTest('AssetLoader loads files', function() {
  expect(2);

  AssetLoader.load({
    files: [
      'test-assets/test.js',
      'test-assets/test.css'
    ]
  }).then(function(files) {
    ok (files, 'files loaded');
    equal ( files.length, 2, 'all files loaded');
    start();
  });
});

asyncTest('AssetLoader supports path option', function() {
  expect(2);
  
  AssetLoader.load({
    path: 'test-assets/',
    files: [
      'test.js',
      'test.css'
    ]
  }).then(function(files) {
    ok (files, 'files loaded');
    equal ( files.length, 2, 'all files loaded');
    start();
  });
});

test('AssetLoader throws error with unsupported files', function() {
  throws( function() {
    AssetLoader.load({
      files: [
        'test-assets/test.js',
        'unsupported1.txt',
        'test-assets/test.css',
        'unsupported2.exe'
      ]
    });
  }, 'error thrown when attempting to load unsupported files');
});
