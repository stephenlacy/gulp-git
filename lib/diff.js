'use strict';
var Vinyl = require('vinyl');
var through = require('through2');
var gutil = require('gulp-util');
var path = require('path');
var catFile = require('./catFile');
var diffHelper = require('./util/diff');

/**
 * get `git diff` result as a stream of vinyl `File` objects.
 *
 * @example
const git = require('gulp-git');
const eslint = require('gulp-eslint');
git.diff('--cached', {
  args: '-- *.js'
})
.pipe(eslint())
 * @param {string}   compare compare arg for `git diff`
 * @param {Object}   [opt] options
 * @param {string[]} [opt.args=['--diff-filter=ACM']] Command parameter for `git diff`
 * @param {string}   [opt.base] {@link https://github.com/gulpjs/vinyl-fs#optionsbase}
 * @param {boolean}  [opt.buffer=true]   {@link https://github.com/gulpjs/vinyl-fs#optionsbuffer}
 * @param {string}   [opt.cwd=process.cwd()] {@link https://github.com/gulpjs/vinyl-fs#optionscwd}
 * @param {boolean}  [opt.log=true] show log in console
 * @param {boolean}  [opt.read=true] {@link https://github.com/gulpjs/vinyl-fs#optionsread}
 * @param {boolean}  [opt.stripBOM=true] {@link https://github.com/gulpjs/vinyl-fs#optionsstripbom}
 * @returns {Stream}    stream of vinyl `File` objects.
 * @memberof git
 */
function diff(compare, opt) {
  opt = Object.assign({
    cwd: process.cwd(),
    log: true,
    read: true,
    args: ['--diff-filter=ACM'],
  }, opt);

  var srcStream = through.obj();

  var args = opt.args.concat(compare);

  diffHelper(args, opt.cwd, opt.config).then(function(files) {
    if (opt.log) {
      gutil.log('git diff --name-status ' + args.join(' ') + '\n' + files.map(function(diff) {
        return diff.status + '\t' + diff.dstPath;
      }).join('\n'));
    }

    files.forEach(function(diff) {
      srcStream.write(new Vinyl({
        path: path.resolve(opt.cwd, diff.dstPath),
        cwd: opt.cwd,
        base: opt.base,
        git: {
          hash: diff.dstHash,
          diff: diff
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

module.exports = diff;
