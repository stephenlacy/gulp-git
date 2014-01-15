map = require('map-stream');
var gutil = require('gulp-util');
var exec = require('child_process').exec;
var escape = require('shell-escape');

module.exports = function (remote, url, opt) {
    if(!url) cb(new Error('gulp-git: Repo URL is required .git.addRemote("origin", "https://github.com/user/repo.git")'));
    if(!remote) remote = 'origin';
    if(!opt) opt = '';

  function addRemote(file, cb) {

    var cmd = "git remote add " + escape([remote, url]) + " " + opt;
    git = exec(cmd, {cwd: file.cwd}, function(err, stdout, stderr){
      if(err) gutil.log(err);
      gutil.log(stdout, stderr);
      cb(null, file);
    });
  }

  // Return a stream
  return map(addRemote);
};