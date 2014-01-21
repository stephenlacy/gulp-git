var gutil = require('gulp-util');
var exec = require('child_process').exec;
var escape = require('shell-escape');

module.exports = function (remote, branch, opt, cb) {
  if(!branch) branch = 'master';
  if(!remote) remote = 'origin';
  if(!opt) opt = {};
  if (!opt.cwd) {
    opt.cwd = process.cwd();
  }

  var cmd = "git pull " + escape([remote, branch])+' '+opt.args;
  return exec(cmd, {cwd: opt.cwd}, function(err, stdout, stderr){
    if(err) gutil.log(err);
    gutil.log(stdout, stderr);
    cb(err);
  });
};