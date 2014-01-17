map = require('map-stream');
var gutil = require('gulp-util');
var exec = require('child_process').exec;
var escape = require('shell-escape');

module.exports = function (message, opt) {
  if(!opt) opt = '';
  
  function branch(file, cb) {
    if(!message) cb(new Error('gulp-git: Branch name is require .git.branch("name")'));

    var cmd = "git branch " + escape([message]) + " " + opt;
    git = exec(cmd, {cwd: file.cwd}, function(err, stdout, stderr){
      if(err) gutil.log(err);
      gutil.log(stdout, stderr);
      cb(null, file);
    });
  }

  // Return a stream
  return map(branch);
};
