'use strict';

var gutil = require('gulp-util');
var exec = require('child_process').exec;
var escape = require('any-shell-escape');

/**
 * Adds remote repo url
 * @example
git.addRemote('origin', 'git-repo-url', function (err) {
  //if (err) ...
});
 * @param    {string}   remote String, name of remote, default: `origin`
 * @param    {string}   url    String, url of remote
 * @param    {Object}   [opt]  options
 * @param    {Function} cb     function, passed err if any
 * @memberof git
 */
function addRemote(remote, url, opt, cb) {
  if (!cb && typeof opt === 'function') {
    // optional options
    cb = opt;
    opt = {};
  }
  if (!cb || typeof cb !== 'function') cb = function () {};
  if (!url) return cb(new Error('gulp-git: Repo URL is required git.addRemote("origin", "https://github.com/user/repo.git")'));
  if (!remote) remote = 'origin';
  if (!opt) opt = {};
  if (!opt.cwd) opt.cwd = process.cwd();
  if (!opt.args) opt.args = ' ';

  var maxBuffer = opt.maxBuffer || 200 * 1024;

  var cmd = 'git remote add ' + opt.args + ' ' + escape([remote, url]);
  return exec(cmd, {cwd: opt.cwd, maxBuffer: maxBuffer}, function(err, stdout, stderr) {
    if (err) return cb(err);
    if (!opt.quiet) gutil.log(stdout, stderr);
    cb();
  });
}

module.exports = addRemote;
