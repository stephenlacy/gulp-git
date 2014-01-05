map = require('map-stream');
var gutil = require('gulp-util');
var exec = require('child_process').exec;

module.exports = function (opt) {
  if(!opt) opt = {};
  
  function commit(file, cb) {
    if(!opt.message) cb(new Error('gulp-git: Commit message is required .git.commit({message:"commit message"})'));
    if (file.isNull()) return cb(null, file); // pass along

    var cmd = "git commit " + "-m '" + opt.message + "' " + file.path;
    git = exec(cmd, {cwd: file.cwd}, function(err, stdout, stderr){
      if(err) return cb(new Error(err, stdout, stderr));
      console.log(stdout, stderr);
    });

    cb(null, file);
  }

  // Return a stream
  return map(commit);
};