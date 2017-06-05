'use strict';
/**
 * lsFiles
 * @module gulp-git/lib/lsFiles
 */

var Vinyl = require('vinyl');
var through = require('through2');
var gutil = require('gulp-util');
var path = require('path');
var catFile = require('./catFile');
var lsFiles = require('./util/lsFiles');

/**
 * @typedef {Object} lsFilesOptions
 * @property {string}   cwd {@link https://github.com/gulpjs/vinyl-fs#optionscwd}
 * @property {string}   base {@link https://github.com/gulpjs/vinyl-fs#optionsbase}
 * @property {boolean}  read {@link https://github.com/gulpjs/vinyl-fs#optionsread}
 * @property {boolean}  buffer {@link https://github.com/gulpjs/vinyl-fs#optionsbuffer}
 * @property {boolean}  stripBOM {@link https://github.com/gulpjs/vinyl-fs#optionsstripbom}
 * @property {boolean}  log show log in console
 * @property {string[]} args Command parameter for `git lsFiles`
 */

/**
 * get git lsFiles result as a stream of vinyl `File` objects.
 *
 * @example
const git = require('gulp-git');
const eslint = require('gulp-eslint');
git.lsFiles('--cached', {
  args: '-- *.js'
})
.pipe(eslint())
 * @param {lsFilesOptions} opt [lsFilesOptions]{@link module:gulp-git/lib/lsFiles~lsFilesOptions}
 * @returns {stream}    stream of vinyl `File` objects.
 */
module.exports = function (opt) {
  opt = Object.assign({
    cwd: process.cwd(),
    log: true,
    read: true,
    args: [],
  }, opt);

  var srcStream = through.obj();

  lsFiles(opt.args, opt.cwd, opt.config).then(function(files) {
    if (opt.log) {
      gutil.log('git ls-files --stage ' + opt.args.join(' ') + '\n' + files.map(function(file) {
        return [
          file.tag,
          file.mode,
          file.hash,
          file.stage
        ].filter(Boolean).join(' ') + '\t' + file.path;
      }).join('\n'));
    }

    files.forEach(function(file) {
      srcStream.write(new Vinyl({
        path: path.resolve(opt.cwd, file.path),
        cwd: opt.cwd,
        base: opt.base,
        git: {
          tag: file.tag,
          mode: file.mode,
          hash: file.hash,
          stage: file.stage
        }
      }));
    });

    srcStream.end();
  });

  if (opt.read) {
    // read file contents when opt.read is `true`
    return srcStream.pipe(catFile(opt));
  }

  return srcStream;
};
