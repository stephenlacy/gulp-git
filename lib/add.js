'use strict';

var Transform = require('stream').Transform;
var log = require('fancy-log');
var exec = require('child_process').exec;
var escape = require('any-shell-escape');

function addFiles(files, opt, cb) {
  var cwd = opt.cwd || files[files.length - 1].cwd;
  var cmd = 'git add ' + escape(files.map(function(file) { return file.path; })) + ' ' + opt.args;
  var maxBuffer = opt.maxBuffer || 200 * 1024;

  exec(cmd, {cwd: cwd, maxBuffer: maxBuffer}, function(err, stdout, stderr) {
    if (err) return cb(err);
    if (!opt.quiet) log(stdout, stderr);
    cb();
  });
}

module.exports = function (opt) {
  if (!opt) opt = {};
  if (!opt.args) opt.args = ' ';

  var files = [];
  var maxFiles = opt.maxFiles || Infinity;

  var write = function(file, enc, cb) {
    var that = this;

    files.push(file);

    if (files.length >= maxFiles)
      addFiles(files.splice(0, maxFiles), opt, function(err)  {
        if (err) return cb(err);
        files.forEach(that.push.bind(that));
        cb();
      });
    else
      cb();
  }

  var flush = function(cb) {
    var that = this;

    if (files.length > 0) {
      addFiles(files, opt, function(err) {
        if (err) return cb(err);
        files.forEach(that.push.bind(that));
        that.emit('end');
        cb();
      });
    } else {
      that.emit('end');
      cb();
    }
  }

  return new Transform({
    objectMode: true,
    transform: write,
    flush
  });
};
