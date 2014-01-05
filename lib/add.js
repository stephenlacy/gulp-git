map = require('map-stream');
var gutil = require('gulp-util');
var exec = require('child_process').exec;

module.exports = function (opt) {
  if(!opt) opt = {};

  function add(file, cb) {
    if (!file.base) return cb(null, file); // pass along
    var base = '';
    if (!file.isNull()) base = file.path;
    if (file.isNull()) base = file.base;

    var cmd = "git add " + base;
    git = exec(cmd, {cwd: file.cwd}, function(err, stdout, stderr){
      if(err) return cb(new Error(err));
      console.log(stdout, stderr);
    });

    cb(null, file);
  }

  // Return a stream
  return map(add);
};