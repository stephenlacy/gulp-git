map = require('map-stream');
var gutil = require('gulp-util');
var exec = require('child_process').exec;
var escape = require('shell-escape');

module.exports = function (remote, branch) {
  if(!branch) branch = 'master';
  if(!remote) remote = 'origin';

  function pull(file, cb) {

    var cmd = "git pull " + escape([remote, branch]);
    git = exec(cmd, {cwd: file.cwd}, function(err, stdout, stderr){
      if(err) return cb(new Error(err));
      gutil.log(cmd, stdout, stderr);
    });

    cb(null, file);
  }

  return map(pull);
};