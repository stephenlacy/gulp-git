map = require('map-stream');
var gutil = require('gulp-util');
var exec = require('child_process').exec;

module.exports = function (opt) {
  if(!opt) opt = {};
  if(!opt.branch) opt.branch = 'master';
  if(!opt.remote) opt.remote = 'origin';

  function push(file, cb) {

    var cmd = "git push " + opt.remote + " " + opt.branch;
    git = exec(cmd, {cwd: file.cwd}, function(err, stdout, stderr){
      if(err) return cb(new Error(err));
      console.log(stdout, stderr);
    });

    cb(null, file);
  }

  return map(push);
};