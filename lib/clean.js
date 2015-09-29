'use strict';

var gutil = require('gulp-util');
var exec = require('child_process').exec;
var escape = require('any-shell-escape');

module.exports = function (paths, opt, cb) {
  if(!cb && typeof opt === 'function') {
    // optional options
    if(typeof paths === 'object') {
      cb = opt;
      opt = paths;
      paths = '';
    }
    else {
      cb = opt;
      opt = {};
		}
  }
  else if(typeof paths === 'function') {
    cb = paths;
    paths = '';
    opt = {};
  }
  
  if(!cb || typeof cb !== 'function')
    cb = function () {};
  if(!opt)
    opt = {};
  if(!opt.cwd)
    opt.cwd = process.cwd();
  if(!opt.args)
    opt.args = ' ';
  if(!paths)

  var cmd = 'git clean ' + opt.args;
	if(typeof paths === 'string')
	  cmd += ' -- ' + escape(paths);
  
  return exec(cmd, { cwd: opt.cwd }, function (err, stdout, stderr) {
    if(err)
      return cb(err);
    if(!opt.quiet)
      gutil.log(stdout, stderr);
    cb();
  });
};