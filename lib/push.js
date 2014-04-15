var through = require('through2');
var gutil = require('gulp-util');
var spawn = require('child_process').spawn;

module.exports = function (remote, branch, opt, cb) {
  if(!branch) branch = 'master';
  if(!remote) remote = 'origin';
  if(!opt) opt = {};
  if(!opt.cwd) opt.cwd = process.cwd();

  var cwd = opt.cwd;

  return through.obj( function(file, enc, cb) {
    cwd = file.cwd;
    cb();
  }, function(cb) {
    var args = ['push'];
    if (typeof opt.args === 'string') {
      args = args.concat(opt.args.split(' '));
    }
    else if (opt.args != null) {
      args = args.concat(opt.args);
    }
    args = args.concat([remote, branch]);

    gutil.log('git-push:');
    var git = spawn('git', args, {cwd: cwd, env: process.env});
    function onData(data) {
      process.stdout.write(data);
    }
    git.stdout.on('data', onData);
    git.stderr.on('data', onData);
    git.on('error', function(error) {
      if(error) {
        gutil.log('git-push: error:\n' + gutil.colors.red(err) );
        cb('git-push: error: ' + error);
      }
    });
    git.on('exit', function(code) {
      if(code) {
        gutil.log('git-push: exit: ' + gutil.colors.magenta(code) );
        return cb('git-push: exit: ' + code);
      }
      gutil.log('git-push: ' + gutil.colors.green('Done.') );
      cb();
    });
  });
};
