'use strict';

var gutil = require('gulp-util');
var exec = require('child_process').exec;
var escape = require('any-shell-escape');
var revParse = require('./revParse');

module.exports = function (remote, branch, opt, cb) {

  if (!remote) remote = 'origin';
  if (branch && typeof branch === 'function') {
    cb = branch;
    branch = null;
  }
  if (branch && typeof branch === 'object') {
    opt = branch;
    branch = null;
  }
  if (!branch) {
    revParse({ args: '--abbrev-ref HEAD' },
      function callback(err, out) {
        branch = out;
      });
  }
  if (!cb && typeof opt === 'function') {
    cb = opt;
    opt = {};
  }
  if (!cb || typeof cb !== 'function') cb = function () {};
  if (!opt) opt = {};
  if (!opt.cwd) opt.cwd = process.cwd();
  if (!opt.args) opt.args = ' ';

  var cmd = 'git push ' + escape([].concat(remote, branch)) + ' ' + opt.args;
  var maxBuffer = opt.maxBuffer || 200 * 1024;

  return exec(cmd, {cwd: opt.cwd, maxBuffer: maxBuffer}, function(err, stdout, stderr) {
    if (err) return cb(err);
    if (!opt.quiet) gutil.log(stdout, stderr);
    cb();
  });
};
