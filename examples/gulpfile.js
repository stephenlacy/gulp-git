var gulp = require('gulp');
var git = require('../');


gulp.task('init', function(){
  gulp.src('./')
  .pipe(git.init());
});

gulp.task('add', function(){
  gulp.src('./git-test/*')
  .pipe(git.add());
});

gulp.task('commit', function(){
  gulp.src('./git-test/*', {buffer:false})
  .pipe(git.commit({message:'initial commit'}));
});

gulp.task('remote', function(){
  gulp.src('./')
  .pipe(git.addRemote({remote:'origin', url:'https://github.com/stevelacy/git-test'}));
});

gulp.task('push', function(){
  gulp.src('./')
  .pipe(git.push({remote:'origin', branch:'master'}));
});

gulp.task('pull', function(){
  gulp.src('./')
  .pipe(git.pull({remote:'origin', branch:'master'}));
});




gulp.task('default', function(){
  gulp.run('add');
});
