var gutil = require('gulp-util');
var exec = require('child_process').exec;
var escape = require('shell-escape');

module.exports = function (message, opt, cb) {
  if(!opt) opt = {};
  if (!opt.cwd) {
    opt.cwd = process.cwd();
  }
  
  if(!message) return cb(new Error('gulp-git: Branch name is require .git.merge("name")'));

  var cmd = "git merge " + escape([message]) + " " + opt.args;
  return exec(cmd, {cwd: opt.cwd}, function(err, stdout, stderr){
    if(err) gutil.log(err);
    gutil.log(stdout, stderr);
    cb(err);
  });
};
