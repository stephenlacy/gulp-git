var map = require('map-stream');
var gutil = require('gulp-util');
var exec = require('child_process').exec;
var escape = require('shell-escape');

module.exports = function (opt) {
  if(!opt) opt = {};

  function add(file, cb) {
    var cmd = "git add " + escape([file.path]) + " " + opt.args;
    exec(cmd, {cwd: file.cwd}, function(err, stdout, stderr){
      if(err) gutil.log(err);
      gutil.log(stdout, stderr);
      cb(err, file);
    });
  }

  // Return a stream
  return map(add);
};