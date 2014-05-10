# Asset Loader [![Build Status](https://travis-ci.org/gdub22/asset-loader.svg?branch=master)](https://travis-ci.org/gdub22/asset-loader)

Yet another lazy loader. Uses Promises.  
Browser support: IE5+, Firefox, Safari, Chrome


## Usage
Basic: 
``` javascript
AssetLoader.load({
  files: [
    'app/some.js',
    'app/some.css'
  ]
});
```

Path option: 
``` javascript
AssetLoader.load({
  path: 'app/',
  files: [
    'some.js',
    'some.css'
  ]
});
```

Promises: 
``` javascript
AssetLoader.load({
  files: [
    'app/some.js',
    'app/some.css'
  ]
}).then(function(files) {
  // on all files loaded
}, function(error) {
  // on error
});
```

## Add-ons
