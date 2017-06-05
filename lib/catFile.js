'use strict';
/**
 * catFile
 * @module gulp-git/lib/catFile
 */

var mapStream = require('./util/mapStream');
var spawn = require('./util/spawn');
var stripBom = require('strip-bom-stream');
var readStream = require('./util/readStream');

/**
 * @typedef {object}    catFileOptions
 * @property {boolean}  stripBOM {@link https://github.com/gulpjs/vinyl-fs#optionsstripbom}
 * @property {boolean}  buffer {@link https://github.com/gulpjs/vinyl-fs#optionsbuffer}
 */

/**
 * read vinyl file contents from git
 * @param {catFileOptions} opt [catFileOptions]{@link module:gulp-git/lib/catFile~catFileOptions}
 * @returns {stream}       stream of vinyl `File` objects.
 */
module.exports = function (opt) {
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
};
