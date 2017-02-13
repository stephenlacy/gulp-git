'use strict';

var through = require('through2');
var gutil = require('gulp-util');
var exec = require('child_process').exec;
var escape = require('any-shell-escape');
var stripBom = require('strip-bom-stream');
var BufferStreams = require('bufferstreams');

module.exports = function (opt) {
  if (!opt) opt = {};
  // https://github.com/gulpjs/vinyl-fs#optionsstripbom
  if (undefined === opt.stripBOM || null === opt.stripBOM) opt.stripBOM = true;
  // https://github.com/gulpjs/vinyl-fs#optionsbuffer
  if (undefined === opt.buffer || null === opt.buffer) opt.buffer = true;

  var write = function(file, enc, cb) {
    var hash = file.git && file.git.hash;

    if (!hash || /^0+$/.test(hash)) {
      return cb(null, file);
    }

    var cmd = 'git cat-file blob ' + hash;
    var contents = exec(cmd, {cwd: file.cwd, maxBuffer: Number.MAX_VALUE}, function(err, stdout, stderr) {
      if (err)return cb(err);
      if (contents) {
        file.contents = contents;
      }
      return cb(null, file);
    }).stdout;

    if (opt.stripBOM) {
      contents = contents.pipe(stripBom());
    }

    if (opt.buffer) {
      contents.pipe(new BufferStreams(function (err, buf, cb) {
        contents = buf;
        return cb(err, buf);
      }));
    }

  };

  return through.obj(write);
};
