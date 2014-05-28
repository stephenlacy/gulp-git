var through = require('through2');
var gutil = require('gulp-util');
var exec = require('child_process').exec;
var escape = require('any-shell-escape');

module.exports = function (opt) {
  if(!opt) opt = {};
  if(!opt.args) opt.args = ' ';

  function rm(file, enc, cb) {
    gutil.log(file.path);
    if(!file.path) throw new Error('gulp-git: file is required');
    var that = this;
    var cmd = "git rm " + opt.args + " " + escape([file.path]);
    exec(cmd, {cwd: file.cwd}, function(err, stdout, stderr){
      if(err) return cb(err);
      gutil.log(stdout, stderr);
      that.push(file);
      cb(null);
    });
  }

  // Return a stream
  return through.obj(rm);
};
