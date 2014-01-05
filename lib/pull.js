map = require('map-stream');
var gutil = require('gulp-util');
var exec = require('child_process').exec;

module.exports = function (opt) {
  if(!opt) opt = {};

  function pull(file, cb) {

    var cmd = "git pull " + opt.remote + " " + opt.branch;
    git = exec(cmd, function(err, stdout, stderr){
      if(err) return cb(new Error(err));
      console.log(cmd, stdout, stderr);
    });

    cb(null, file);
  }

  return map(pull);
};