'use strict';

var through = require('through2');
var gutil = require('gulp-util');
var spawn = require('child_process').spawn;
var escape = require('any-shell-escape');
var stripBom = require('strip-bom-stream');

function readStream(stream, callback) {
  var buf;
  stream.on('data', function(data) {
    if (buf) {
      buf = Buffer.concat([buf, data]);
    } else {
      buf = data;
    }
  });
  stream.once('finish', function() {
    if (buf) {
      callback(buf);
    }
  });
}

module.exports = function (opt) {
  if (!opt) opt = {};
  // https://github.com/gulpjs/vinyl-fs#optionsstripbom
  if (undefined === opt.stripBOM || null === opt.stripBOM) opt.stripBOM = true;
  // https://github.com/gulpjs/vinyl-fs#optionsbuffer
  if (undefined === opt.buffer || null === opt.buffer) opt.buffer = true;

  var write = function(file, enc, cb) {

    var hash = file.git && file.git.hash;

    if (!hash || /^0+$/.test(hash)) {
      return sendFile();
    }

    var sendFile = function(contents) {
      file.contents = contents;
      return cb(null, file);
    };

    var catFile = spawn('git', ['cat-file', 'blob', hash], {
      cwd: file.cwd
    });

    var contents = catFile.stdout;
    var that = this;

    readStream(catFile.stderr, function(error) {
      that.emit('error', new gutil.PluginError('gulp-git', 'Command failed: ' + catFile.spawnargs.join(' ').trim() + '\n' + error.toString()));
    });

    if (opt.stripBOM) {
      contents = contents.pipe(stripBom());
    }

    if (opt.buffer) {
      readStream(contents, sendFile);
    } else {
      sendFile(contents);
    }
  };
  var stream = through.obj(write);
  return stream;
};
