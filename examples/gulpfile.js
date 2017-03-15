'use strict';

var gulp = require('gulp');
var git = require('../');

// Init a git repo

gulp.task('init', function() {
  git.init();
});


// Add files

gulp.task('add', function() {
  gulp.src('./*')
  .pipe(git.add());
});


// Commit files

gulp.task('commit', function() {
  gulp.src('./*', {buffer:false})
  .pipe(git.commit('initial commit'));
});

// Commit files with arguments
gulp.task('commitopts', function() {
  gulp.src('./*')
  .pipe(git.commit('initial commit', {args: '-v'}));
});

// Commit files using raw arguments, without message checking
gulp.task('commitraw', function() {
  gulp.src('./*')
  .pipe(git.commit(undefined, {
    args: '-m "initial commit"',
    disableMessageRequirement: true
  }));
});

// Commit files using raw arguments, without message checking
gulp.task('commitmulti', function() {
  gulp.src('./*')
  .pipe(git.commit(['initial commit', 'additional message']));
});

// Commit files using the multiline option
gulp.task('commitmultiline', function() {
  gulp.src('./*')
  .pipe(git.commit(['initial commit', 'additional message'], { mutiline: true }));
});

// Commit files with multiline messages
gulp.task('commitmultiline', function() {
  gulp.src('./*')
  .pipe(git.commit('initial commit\nadditional message'));
});

// Clone remote repo to current directory ($CWD/git-test)
gulp.task('clone', function() {
  git.clone('https://github.com/stevelacy/git-test', function(err) {
    if (err) {
      console.error(err);
    }
  });
});

// Clone remote repo to sub folder ($CWD/sub/folder/git-test)
gulp.task('clonesub', function() {
  git.clone('https://github.com/stevelacy/git-test', {args: './sub/folder'}, function(err) {
    if (err) {
      console.error(err);
    }
  });
});

// Lint js files in index before git commit
gulp.task('precommit', function() {
  var eslint = require('gulp-eslint');
  // get changes between HEAD and index
  return git.diff('--cached', {
    args: '-- *.js'
  })
    // Read file contents from git index
    .pipe(git.catFile())
    // Lint files that different between HEAD and index
    .pipe(eslint())
    // Outputs the lint results to the console.
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    .pipe(eslint.failAfterError());
});

// Add remote

gulp.task('remote', function() {
  git.addRemote('origin', 'https://github.com/stevelacy/git-test', function (err) {
    if (err) {
      console.error(err);
    }
  });
});


// Push to remote repo

gulp.task('push', function() {
  git.push('origin', 'master', function (err) {
    if (err) {
      console.error(err);
    }
  });
});


// Pull from remote repo

gulp.task('pull', function() {
  git.pull('origin', 'master', function (err) {
    if (err) console.log(err);
  });
});

// Pull from remote repo with only origin

gulp.task('pull-origin', function() {
  git.pull('origin', function (err) {
    if (err) console.log(err);
  });
});

// Pull from all remote branches and tags

gulp.task('pull-all', function() {
  git.pull(function (err) {
    if (err) console.log(err);
  });
});

// Pull from array of branches

gulp.task('pull-array', function() {
  git.pull('origin', ['master', 'development'], function (err) {
    if (err) console.log(err);
  });
});

// Tag the repo

gulp.task('tag', function() {
  git.tag('v1.1.1', 'Version message', function (err) {
    if (err) {
      console.error(err);
    }
  });
});

// Tag the repo WITH signed key
gulp.task('tagsec', function() {
  git.tag('v1.1.1', 'Version message with signed key', {signed:true}, function (err) {
    if (err) {
      console.error(err);
    }
  });
});

gulp.task('push-tag', function() {
  git.push('origin', 'v1.1.1', function (err) {
    if (err) {
      console.error(err);
    }
  });
});


gulp.task('rm', function() {
  gulp.src('./delete')
  .pipe(git.rm({args: '-f'}));
});

gulp.task('addSubmodule', function() {
  git.addSubmodule('https://github.com/stevelacy/git-test', 'git-test', {args: '-b master'});
});

gulp.task('updateSubmodules', function() {
  git.updateSubmodule({args: '--init'});
});

// default gulp task

gulp.task('default', ['add']);
