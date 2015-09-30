'use strict';

var gutil = require('gulp-util');
var exec = require('child_process').exec;
var escape = require('any-shell-escape');

module.exports = function (remote, branch, opt, cb) {
  if (!cb && typeof opt === 'function') {
    // optional options
    cb = opt;
    opt = {};
  }
  if (!cb || typeof cb !== 'function') cb = function () {};
  if (!branch) branch = '';
  if (!opt) opt = {};
  if (!opt.cwd) opt.cwd = process.cwd();
  if (!opt.args) opt.args = ' ';
  if (!remote && opt.args.indexOf('--all') === -1) remote = 'origin';

  var cmd = 'git fetch ' + opt.args;
  var args = [];
  if(remote)
    args.push(remote);
  if(branch)
    args.push(branch);
  if(args.length > 0)
    cmd += escape(args);
  return exec(cmd, {cwd: opt.cwd}, function(err, stdout, stderr){
    if (err) return cb(err);
    if (!opt.quiet) gutil.log(stdout, stderr);
    cb();
  });
};
