map = require('map-stream');
var gutil = require('gulp-util');
var exec = require('child_process').exec;
var escape = require('shell-escape');

module.exports = function (opt) {
  if(!opt) opt = '';

  function add(file, cb) {
    if (!file.path) return cb(null, file); // pass along
    var cmd = "git add " + escape([file.path]) + " " + opt;
    git = exec(cmd, {cwd: file.cwd}, function(err, stdout, stderr){
      if(err) return cb(new Error(err));
      gutil.log(stdout, stderr);
      cb(null, file);
    });
  }

  // Return a stream
  return map(add);
};