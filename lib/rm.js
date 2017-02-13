'use strict';

var through = require('through2');
var gutil = require('gulp-util');
var exec = require('child_process').exec;
var escape = require('any-shell-escape');

module.exports = function (opt) {
  if (!opt) opt = {};
  if (!opt.args) opt.args = ' ';

  var paths = [];
  var files = [];
  var fileCwd = process.cwd;
  var write = function(file, enc, cb) {
    paths.push(file.path);
    files.push(file);
    fileCwd = file.cwd;
    cb();
  };

  var flush = function(cb) {
    var cwd = opt.cwd || fileCwd;

    var maxBuffer = opt.maxBuffer || 200 * 1024;

    var cmd = 'git rm ' + escape(paths) + ' ' + opt.args;
    var that = this;
    exec(cmd, {cwd: cwd, maxBuffer: maxBuffer}, function(err, stdout, stderr) {
      if (err) cb(err);
      if (!opt.quiet) gutil.log(stdout, stderr);
      files.forEach(that.push.bind(that));
      cb();
    });
  };

  return through.obj(write, flush);
};
