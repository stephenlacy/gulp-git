var through = require('through2');
var gutil = require("gulp-util");
var exec = require("child_process").exec;
var escape = require("any-shell-escape");

module.exports = function (opt) {
  if(!opt) opt = {};
  if(!opt.args) opt.args = ' ';

  function add(file, enc, cb) {

    var cmd = "git add " + opt.args + " " + escape([file.path]);
    exec(cmd, {cwd: file.cwd}, function(err, stdout, stderr){
      if(err) return cb(err);
      gutil.log(stdout, stderr);
      cb(null, file);
    });
  }

  // Return a stream
  return through.obj(add);
};
