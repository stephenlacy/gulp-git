map = require('map-stream');
var gutil = require('gulp-util');
var exec = require('child_process').exec;

module.exports = function (message, opt) {
  if(!opt) opt = '';
  
  function commit(file, cb) {
    if(!message) cb(new Error('gulp-git: Commit message is required .git.commit({message:"commit message"})'));
    if (file.isNull()) return cb(null, file); // pass along

    var cmd = "git commit " + "-m '" + message + "' " + opt + " " + file.path;
    var templ = gutil.template(cmd, {file:file});
    
    git = exec(templ, {cwd: file.cwd}, function(err, stdout, stderr){
      if(err) return cb(new Error(err, stdout, stderr));
      console.log(stdout, stderr);
    });

    cb(null, file);
  }

  // Return a stream
  return map(commit);
};