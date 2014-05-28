var through = require('through2');
var gutil = require("gulp-util");
var exec = require("child_process").exec;
var escape = require("any-shell-escape");

module.exports = function (opt) {
  if(!opt) opt = {};
  if(!opt.args) opt.args = ' ';

  function add(file, enc, cb) {
    var that = this;
    var cmd = "git add " + escape([file.path]) + " " + opt.args;
    exec(cmd, {cwd: file.cwd}, function(err, stdout, stderr){
      if(err) return cb(err);
      gutil.log(stdout, stderr);
      that.push(file);
      cb(null);
    });
  }

  // Return a stream
  return through.obj(add);
};
