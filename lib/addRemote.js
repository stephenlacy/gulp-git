map = require('map-stream');
var gutil = require('gulp-util');
var exec = require('child_process').exec;

module.exports = function (remote, url) {
    if(!url) cb(new Error('gulp-git: Repo URL is required .git.addRemote("origin", "https://github.com/user/repo.git")'));
    if(!remote) remote = 'origin';

  function addRemote(file, cb) {


    var cmd = "git remote add " + remote + " " + url;
    git = exec(cmd, {cwd: file.cwd}, function(err, stdout, stderr){
      console.log(stdout);
    });

    cb(null, file);
  }

  // Return a stream
  return map(addRemote);
};