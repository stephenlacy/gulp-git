var gulp = require('gulp');
var git = require('../');



// Init a git repo

gulp.task('init', function(){
  gulp.src('./')
  .pipe(git.init());
});


// Add files

gulp.task('add', function(){
  gulp.src('./*')
  .pipe(git.add());
});


// Commit files

gulp.task('commit', function(){
  gulp.src('./*', {buffer:false})
  .pipe(git.commit('initial commit', '-u'));
});

// Commit files with arguments
gulp.task('commitopts', function(){
  gulp.src('./*')
  .pipe(git.commit('initial commit', '-a'));
});

// Commit files with templates
gulp.task('committemplate', function(){
  gulp.src('./*')
  .pipe(git.commit('initial commit file: <%= file.path%>', '-a'));
});


// Add remote

gulp.task('remote', function(){
  gulp.src('./')
  .pipe(git.addRemote('origin', 'https://github.com/stevelacy/git-test'));
});


// Push to remote repo

gulp.task('push', function(){
  gulp.src('./')
  .pipe(git.push('origin', 'master'));
});


// Pull from remote repo

gulp.task('pull', function(){
  gulp.src('./')
  .pipe(git.pull('origin', 'master'));
});

// Tag the repo

gulp.task('tag', function(){
  gulp.src('./')
  .pipe(git.tag('v1.1.1', 'Version message'));
});

// Tag the repo WITH signed key
gulp.task('tagsec', function(){
  gulp.src('./')
  .pipe(git.tag('v1.1.1', 'Version message with signed key', true));
});


// Run default gulp task

gulp.task('default', function(){
  gulp.run('add');
});
