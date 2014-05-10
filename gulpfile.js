var gulp       = require('gulp');
var jshint     = require('gulp-jshint');
var qunit      = require('gulp-qunit');
var concat     = require('gulp-concat');
var uglify     = require('gulp-uglify');
var rename     = require('gulp-rename');
var size       = require('gulp-size');
var header     = require('gulp-header');
var footer     = require('gulp-footer');
var pkg        = require('./package.json');

var src        = ['./src/index.js',
                  './src/util/map.js',
                  './src/util/deferred.js',
                  './src/util/errors.js',
                  './src/loaders/script-loader.js',
                  './src/loaders/css-loader.js',
                  './src/asset-file.js',
                  './src/asset-package.js',
                  './src/asset-loader.js',
                  './src/export.js',
                  ];

var built      = 'asset-loader.js';
var dist       = './dist/';
var testRunner = './tests/test-runner.html';

var info   = ['/*!',
              ' * <%= pkg.name %>',
              ' * <%= pkg.description %>',
              ' * @version v<%= pkg.version %>',
              ' * @author <%= pkg.author %>',
              ' * @license <%= pkg.license %>',
              ' */',
              ''].join('\n');

var iifeHeader = ['(function(exports, document) {',
                  '',"'use strict';",
                  '',''].join('\n'); 
var iifeFooter = ['', '}(this, document));',
                  ''].join('\n'); 

gulp.task('lint', function() {
  return gulp.src(src)
             .pipe(jshint('.jshintrc'))
             .pipe(jshint.reporter('default'));
});

gulp.task('build', ['lint'], function() {
  return gulp.src(src)
             .pipe(concat(built))
             .pipe(header(iifeHeader))
             .pipe(header(info, { pkg : pkg } ))
             .pipe(footer(iifeFooter))
             .pipe(gulp.dest(dist));
});

gulp.task('test', ['build'], function() {
  return gulp.src(testRunner)
             .pipe(qunit());
});

gulp.task('dist', ['build'], function() {
  return gulp.src(dist + built)
             .pipe(size({title: 'before'}))
             .pipe(uglify())
             .pipe(size({title: 'minified'}))
             .pipe(size({title: 'gzipped', gzip: true}))
             .pipe(rename({suffix: '.min'}))
             .pipe(gulp.dest(dist));
});


gulp.task('ci', ['lint', 'test']);
gulp.task('default', ['lint', 'test']);
