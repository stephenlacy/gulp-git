'use strict';

var gutil = require('gulp-util');
var exec = require('child_process').exec;
var escape = require('any-shell-escape');

module.exports = function (version, message, opt, cb) {
  if (!cb && typeof opt === 'function') {
    // optional options
    cb = opt;
    opt = {};
  }
  if (!cb && typeof version === 'function') {
    cb = version;
    version = '';
    message = '';
  }
  if (!cb || typeof cb !== 'function') cb = function () {};
  if (!opt) opt = {};
  if (!message) opt.lightWeight = true; else message = escape([message]);
  if (!opt.cwd) opt.cwd = process.cwd();
  if (!opt.args) opt.args = ' ';

  var maxBuffer = opt.maxBuffer || 200 * 1024;

  var signedarg = opt.signed ? ' -s ' : ' -a ';

  var cmd = 'git tag';
  if (version !== '') {
    if (!opt.lightWeight) {
      cmd += ' ' + signedarg + ' -m ' + message + ' ';
    }
    cmd += opt.args + ' ' + escape([version]);
  }
  var templ = gutil.template(cmd, {file: message});
  return exec(templ, {cwd: opt.cwd, maxBuffer: maxBuffer}, function(err, stdout, stderr) {
    if (err) return cb(err);
    if (!opt.quiet && version !== '') gutil.log(stdout, stderr);
    if (version === '') {
      stdout = stdout.split('\n');
    }
    return cb(null, stdout);
  });
};
