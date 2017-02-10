'use strict';

var gulp = require('gulp');
var git = require('./');
var pkg = require('./package.json');
var eslint = require('gulp-eslint');

function eslintDiff(compare) {
  // get changed files
  return git.diff(compare, {
    args: '-- *.js'
  })
    // Read file contents from git
    .pipe(git.catFile())
    // Lint files that changed
    .pipe(eslint())
    // Outputs the lint results to the console.
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    .pipe(eslint.failAfterError());
}

// Lint changes between HEAD and cached
gulp.task('precommit', function() {
  return eslintDiff('--cached');
});

// Lint changes between last release and HEAD
gulp.task('lint_diff', function() {
  return eslintDiff(pkg.version + '...');
});
