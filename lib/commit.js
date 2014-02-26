var map = require('map-stream');
var gutil = require('gulp-util');
var exec = require('child_process').exec;
var escape = require('any-shell-escape');

module.exports = function (message, opt) {
  if(!opt) opt = {};
  if(!message) throw new Error('gulp-git: Commit message is required git.commit("commit message")');
  if(!opt.args) opt.args = '';
  
  function commit(file, cb) {
    var cmd = 'git commit -m "' + message + '" ' + escape([file.path]) + ' ' + opt.args;
    exec(cmd, {cwd: file.cwd}, function(err, stdout, stderr){
      if(err) gutil.log(err);
      gutil.log(stdout, stderr);
      cb(null, file);
    });
  }

  // Return a stream
  return map(commit);
};