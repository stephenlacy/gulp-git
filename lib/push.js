map = require('map-stream');
var gutil = require('gulp-util');
var exec = require('child_process').exec;

module.exports = function (remote, branch) {
  if(!branch) branch = 'master';
  if(!remote) remote = 'origin';

  function push(file, cb) {

    var cmd = "git push " + remote + " " + branch;
    git = exec(cmd, {cwd: file.cwd}, function(err, stdout, stderr){
      if(err) return cb(new Error(err));
      console.log(stdout, stderr);
    });

    cb(null, file);
  }

  return map(push);
};