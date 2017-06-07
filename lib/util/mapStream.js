'use strict';
var through = require('through2');
var gutil = require('gulp-util');

/**
 * function that transform file
 * @callback transformFunction
 * @param    {vinyl}           file         file
 * @returns  {(Promise.<vinyl>|vinyl|void)}   file transformed
 */

/**
 * finish up any processing that may be in progress.
 * @callback flushFunction
 * @returns  {Promise.<any>}
 */

/**
 * transform files in stream
 *
 * @param   {transformFunction} transform [transformFunction]{@link module:gulp-git/lib/util/mapStream~transformFunction}
 * @param   {flushFunction}     [flush]   [flushFunction]{@link module:gulp-git/lib/util/mapStream~flushFunction}
 * @returns {stream}            stream that transform files
 * @memberof git.util
 */
function mapStream(transform, flush) {
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
    Promise.resolve(flush()).then(function() {
      cb();
    }).catch(cb);
  }

  return through.obj(_transform, _flush);
}

module.exports = mapStream;
