var gutil = require('gulp-util');
var exec = require('child_process').exec;
var escape = require('shell-escape');

module.exports = function (version, message, opt, cb) {
  if(!version) return cb(new Error('Version must be defined'));
  if(!message) return cb(new Error('Message must be defined'));

  if(!opt) opt = {};
  if (!opt.cwd) {
    opt.cwd = process.cwd();
  }

  var signedarg = opt.signed ? " -s " : " -a ";

  var cmd = "git tag " + signedarg + escape([version])+ " -m " + escape([message]) + ' '+opt.args;
  var templ = gutil.template(cmd, {message:message});

  return exec(templ, {cwd: opt.cwd}, function(err, stdout, stderr){
    if(err) gutil.log(err);
    gutil.log(stdout, stderr);
    cb(err);
  });
};