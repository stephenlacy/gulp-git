'use strict';

var Vinyl = require('vinyl');
var through = require('through2');
var gutil = require('gulp-util');
var path = require('path');
var exec = require('child_process').exec;
var escape = require('any-shell-escape');
var catFile = require('./catFile');

// https://git-scm.com/docs/git-diff#_raw_output_format
var RE_DIFF_RESULT = /\:(\w+)\s+(\w+)\s+(\w+)(?:\.{3})?\s+(\w+)(?:\.{3})?\s+(\w+)(\u0000|\t|\s+)(.+?)(?:\6|\n)(?:([^:]+?)\6)?/g;

function getReaslt(data) {
  var result = [];
  if (data && data.length) {
    var str = data.toString();
    var match;
    RE_DIFF_RESULT.lastIndex = 0;
    while ((match = RE_DIFF_RESULT.exec(str))) {
      result.push({
        // mode for compare "src"
        srcMode: match[1],
        // mode for compare "dst"
        dstMode: match[2],
        // sha1 for compare "src"
        srcHash: match[3],
        // sha1 for compare "dst"
        dstHash: match[4],
        // status
        status: match[5],
        // path for compare "src"
        srcPath: match[7],
        // path for compare "dst"
        dstPath: match[8] || match[7],
      });
    }
  }
  return result;
}

module.exports = function (compare, opt) {
  if (!opt) opt = {};
  if (!opt.cwd) opt.cwd = process.cwd();
  // https://github.com/gulpjs/vinyl-fs#optionsread
  if (undefined === opt.read || null === opt.read) opt.read = true;
  if (undefined === opt.log || null === opt.log) opt.log = true;

  var srcStream = through.obj();
  var cmd = compare;

  if (!/--diff-filter=/.test(opt.args)) {
    cmd += ' --diff-filter=ACM';
  }
  if (opt.args) {
    cmd += ' ' + opt.args;
  }
  exec('git diff --raw -z ' + cmd, {cwd: opt.cwd}, function(err, stdout, stderr) {
    if (err) return srcStream.emit('error', err);
    var files = getReaslt(stdout);

    if (opt.log) {
      gutil.log('git diff --name-status ' + cmd + '\n' + files.map(function(diff) {
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
};
