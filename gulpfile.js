 /*
 * node-makensis-cli
 *
 * Copyright (c) 2017 Jan T. Sott
 * Licensed under the MIT license.
 */

 // Dependencies
const gulp = require('gulp');
const debug = require('gulp-debug');
const jsonlint = require('gulp-jsonlint');

// Supported files
const jsonFiles = [
  'package.json'
];

// Lint JSON
gulp.task('lint:json', gulp.series( (done) => {
  gulp.src(jsonFiles)
    .pipe(debug({title: 'json-lint'}))
    .pipe(jsonlint())
    .pipe(jsonlint.failAfterError())
    .pipe(jsonlint.reporter());
  done();
}));

// Available tasks
gulp.task('lint', gulp.parallel('lint:json', (done) => {
  done();
}));
