var gutil = require('gulp-util');
var exec = require('child_process').exec;

module.exports = function (opt, cb) {

  if( typeof opt === 'function' ){
    cb = opt;
    opt = null;
  }

  opt = opt || { };
  opt.log  = opt.log  || !cb;
  opt.args = opt.args || ' ';

  var cwd = opt.cwd || process.cwd();
  var cmd = "git status " + opt.args;

  return exec(cmd, { cwd : cwd }, function(err, stdout, stderr){
    if(err) return cb(err);

    if( opt.log )
      gutil.log(cmd + '\n' + stdout, stderr);
    else
      gutil.log(cmd + ' (log : false)', stderr);

    !cb || cb(stdout);
  });
};
