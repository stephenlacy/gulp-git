var map = require('map-stream');
var gutil = require('gulp-util');
var exec = require('child_process').exec;
var escape = require('shell-escape');

module.exports = function (message, opt) {
  if(!opt) opt = {};
  if(!message) throw new Error('gulp-git: Branch name is require .git.checkout("name")');
  
  function checkout(file, cb) {
    var cmd = "git checkout " + escape([message]) + " " + opt.args;
    exec(cmd, {cwd: file.cwd}, function(err, stdout, stderr){
      if(err) gutil.log(err);
      gutil.log(stdout, stderr);
      cb(err, file);
    });
  }

  // Return a stream
  return map(checkout);
};
