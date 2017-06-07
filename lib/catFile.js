'use strict';
var mapStream = require('./util/mapStream');
var spawn = require('./util/spawn');
var stripBom = require('strip-bom-stream');
var readStream = require('./util/readStream');

/**
 * Read vinyl file contents from git
 * @param {Object}         [opt]               options
 * @param {boolean}        [opt.stripBOM=true] {@link https://github.com/gulpjs/vinyl-fs#optionsstripbom}
 * @param {boolean}        [opt.buffer=true]   {@link https://github.com/gulpjs/vinyl-fs#optionsbuffer}
 * @returns {stream}                           stream that update `contents` of `vinyl` file objects.
 * @memberof git
 */
function catFile (opt) {
  opt = Object.assign({
    buffer: true,
    stripBOM: true,
  }, opt);

  return mapStream(function(file) {
    var hash = file.git && file.git.hash;

    if (!hash || /^0+$/.test(hash)) {
      return;
    }

    var contents = spawn(['cat-file', 'blob', hash], file.cwd, opt.config);

    if (opt.stripBOM) {
      contents = contents.pipe(stripBom());
    }

    if (opt.buffer) {
      return readStream(contents).then(function(contents) {
        file.contents = contents;
      });
    } else {
      file.contents = contents;
    }
  });
}

module.exports = catFile;
