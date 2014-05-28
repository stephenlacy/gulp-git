var through = require('through2');
var gutil = require('gulp-util');
var exec = require('child_process').exec;
var escape = require('any-shell-escape');

module.exports = function (branch, opt) {
  if(!opt) opt = {};
  if(!branch) throw new Error('gulp-git: Branch name is require git.checkout("name")');
  if(!opt.args) opt.args = ' ';

  function checkout(file, enc, cb) {
    var that = this;
    var cmd = "git checkout " + escape([branch]) + " " + opt.args;
    exec(cmd, {cwd: file.cwd}, function(err, stdout, stderr){
      if(err) return cb(err);
      gutil.log(stdout, stderr);
      that.push(file);
      cb(null);
    });
  }

  // Return a stream
  return through.obj(checkout);
};
