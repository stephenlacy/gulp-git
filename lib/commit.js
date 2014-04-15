var through = require('through2');
var gutil = require('gulp-util');
var spawn = require('child_process').spawn;

module.exports = function (message, opt) {
  if(!opt) opt = {};
  if(!message) throw new Error('gulp-git: Commit message is required.\ngit.commit("commit message")');
  if(!opt.cwd) opt.cwd = process.cwd();

  var files = [];
  var cwd = opt.cwd;

  return through.obj( function(file, enc, cb) {
    this.push(file);
    files.push(file.path);
    cwd = file.cwd;
    cb();
  }, function(cb) {
    var args = ['commit', '-m', message];
    if (typeof opt.args === 'string') {
      args = args.concat(opt.args.split(' '));
    }
    else if (opt.args != null) {
      args = args.concat(opt.args);
    }
    args = args.concat(files);

    gutil.log('git-commit:');
    var git = spawn('git', args, {cwd: cwd, env: process.env});
    function onData(data) {
      process.stdout.write(data);
    }
    git.stdout.on('data', onData);
    git.stderr.on('data', onData);
    git.on('error', function(error) {
      if(err) {
        gutil.log('git-commit: error:\n' + gutil.colors.red(error) );
        cb('git-commit: error: ' + error);
      }
    });
    git.on('exit', function(code) {
      if(code) {
        gutil.log('git-commit: exit: ' + gutil.colors.magenta(code) );
        return cb('git-commit: exit: ' + code);
      }
      gutil.log('git-commit: ' + gutil.colors.green('Done.') );
      cb();
    });
  });
};
