map = require('map-stream');
var gutil = require('gulp-util');
var exec = require('child_process').exec;
var escape = require('shell-escape');

module.exports = function (remote, branch, opt) {
  if(!branch) branch = 'master';
  if(!remote) remote = 'origin';
  if(!opt) opt = '';

  function push(file, cb) {

    var cmd = "git push " + escape([remote, branch, opt]);
    git = exec(cmd, {cwd: file.cwd}, function(err, stdout, stderr){
      if(err) return cb(new Error(err));
      gutil.log(stdout, stderr);
      cb(null, file);
    });
  }

  return map(push);
};