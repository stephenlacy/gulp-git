'use strict';
var Vinyl = require('vinyl');
var through = require('through2');
var gutil = require('gulp-util');
var path = require('path');
var catFile = require('./catFile');
var lsFilesHelper = require('./util/lsFiles');

/**
 * get `git ls-files` result as a stream of `vinyl` file objects.
 *
 * @example
const git = require('gulp-git');
const eslint = require('gulp-eslint');
git.lsFiles({
  args: '-- *.js'
})
.pipe(eslint())
 * @param {Object}   opt                     [lsFilesOptions]{@link module:gulp-git/lib/lsFiles~lsFilesOptions}
 * @param {string[]} [opt.args]              Command parameter for `git diff`
 * @param {string}   [opt.base]              {@link https://github.com/gulpjs/vinyl-fs#optionsbase}
 * @param {boolean}  [opt.buffer=true]       {@link https://github.com/gulpjs/vinyl-fs#optionsbuffer}
 * @param {string}   [opt.cwd=process.cwd()] {@link https://github.com/gulpjs/vinyl-fs#optionscwd}
 * @param {boolean}  [opt.log=true] show log in console
 * @param {boolean}  [opt.read=true] {@link https://github.com/gulpjs/vinyl-fs#optionsread}
 * @param {boolean}  [opt.stripBOM=true] {@link https://github.com/gulpjs/vinyl-fs#optionsstripbom}
 * @returns {Stream}    stream of `vinyl` file objects.
 * @memberof git
 */
function lsFiles (opt) {
  opt = Object.assign({
    cwd: process.cwd(),
    log: true,
    read: true,
    args: [],
  }, opt);

  var srcStream = through.obj();

  lsFilesHelper(opt.args, opt.cwd, opt.config).then(function(files) {
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
}

module.exports = lsFiles;
