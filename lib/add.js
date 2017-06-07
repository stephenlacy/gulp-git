'use strict';

var through = require('through2');
var gutil = require('gulp-util');
var exec = require('child_process').exec;
var escape = require('any-shell-escape');

/**
 * Adds files to repo
 * @example
gulp.src('./*')
  .pipe(git.add());
});
 * @param    {Object}   [opt]                       options
 * @param    {string}   [opt.args]                  {@link https://git-scm.com/docs/git-add}
 * @param    {boolean}  [opt.quiet=true]            quiet
 * @param    {number}   [opt.maxBuffer=200 * 1024]  {@link https://nodejs.org/docs/latest/api/child_process.html#child_process_maxbuffer_and_unicode}
 * @memberof git
 */
function add(opt) {
  if (!opt) opt = {};
  if (!opt.args) opt.args = ' ';

  var paths = [];
  var files = [];
  var fileCwd = process.cwd;

  var write = function(file, enc, cb) {
    paths.push(file.path);
    files.push(file);
    fileCwd = file.cwd;
    cb();
  };

  var flush = function(cb) {
    var cwd = opt.cwd || fileCwd;

    var cmd = 'git add ' + escape(paths) + ' ' + opt.args;
    var that = this;
    var maxBuffer = opt.maxBuffer || 200 * 1024;

    exec(cmd, {cwd: cwd, maxBuffer: maxBuffer}, function(err, stdout, stderr) {
      if (err) cb(err);
      if (!opt.quiet) gutil.log(stdout, stderr);
      files.forEach(that.push.bind(that));
      that.emit('end');
      cb();
    });
  };

  return through.obj(write, flush);
}

module.exports = add;
