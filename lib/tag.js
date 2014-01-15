var map = require('map-stream');
var gutil = require('gulp-util');
var exec = require('child_process').exec;
var escape = require('shell-escape');

module.exports = function (version, message, signed) {
  if(!version) cb(new Error('Version must be defined'));
  if(!message) cb(new Error('Message must be defined'));

  function tag(file, cb) {

    signed ? signed = " -s " : signed = " -a ";

    var cmd = "git tag " + signed + escape([version])+ " -m " + escape([message]);
    var templ = gutil.template(cmd, {file:file});
    
    git = exec(templ, {cwd: file.cwd}, function(err, stdout, stderr){
      if(err) return cb(new Error(err));
      gutil.log(stdout, stderr);
    });

    cb(null, file);
  }

  // Return a stream
  return map(tag);
};