'use strict';

var gutil = require('gulp-util');
var exec = require('child_process').exec;

/**
 * Add the given repository as a submodule at the given path.
 * @example
gulp.task('addSubmodule', function() {
  git.addSubmodule('https://github.com/stevelacy/git-test', 'git-test', {args: '-b master'});
});
 * @memberof git
 */

function addSubmodule(url, name, opt, cb) {
  if (!cb || typeof cb !== 'function') cb = function () {};
  if (!url) return cb(new Error('gulp-git: Repo URL is required git.submodule.add("https://github.com/user/repo.git", "repoName")'));
  if (!name) name = '';
  if (!opt) opt = {};
  if (!opt.cwd) opt.cwd = process.cwd();
  if (!opt.args) opt.args = '';

  var maxBuffer = opt.maxBuffer || 200 * 1024;

  var cmd = 'git submodule add ' + opt.args + ' ' + url + ' ' + name;
  return exec(cmd, {cwd: opt.cwd, maxBuffer: maxBuffer}, function(err, stdout, stderr) {
    if (err && cb) return cb(err);
    if (!opt.quiet) gutil.log(stdout, stderr);
    if (cb) cb();
  });
}

module.exports = addSubmodule;
