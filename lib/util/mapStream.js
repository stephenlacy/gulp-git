'use strict';

var through = require('through2');
var gutil = require('gulp-util');
var readStream = require('./readStream');
var Readable = require('stream').Readable;

function log(stdout) {
  if (!stdout) {
    return;
  }
  if (stdout instanceof Readable) {
    var spawnargs = stdout.spawnargs;
    readStream(stdout).then(function(stdout) {
      return gutil.log(spawnargs.join(' ') + (stdout ? '\n' + stdout : ''));
    });
  } else if (stdout) {
    gutil.log(stdout);
  }
}

module.exports = function (transform, flush) {
  function _transform(file, enc, cb) {
    var _this = this;
    Promise.resolve(transform(file)).then(function(newFile) {
      cb(null, newFile || file);
    }).catch(function(error) {
      _this.emit('error', new gutil.PluginError('gulp-git', error));
    });
  }

  function _flush(cb) {
    if (!flush) {
      return cb();
    }
    Promise.resolve(flush()).then(function(stdout) {
      log(stdout);
      cb();
    }).catch(cb);
  }

  return through.obj(_transform, _flush);
};
