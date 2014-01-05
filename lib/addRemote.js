map = require('map-stream');
var gutil = require('gulp-util');
var exec = require('child_process').exec;

module.exports = function (opt) {
  if(!opt) opt = {};

  function addRemote(file, cb) {
    if(!opt.url) cb(new Error('gulp-git: Repo URL is required .git.addRemote({url:"https://github.com/user/repo.git"})'));
    if(!opt.remote) opt.remote = 'origin';

    var cmd = "git remote add " + opt.remote + " " + opt.url;
    git = exec(cmd, {cwd: file.cwd}, function(err, stdout, stderr){
      console.log(stdout);
    });

    cb(null, file);
  }

  // Return a stream
  return map(addRemote);
};