#gulp-git
[![Build Status](https://travis-ci.org/stevelacy/gulp-git.png?branch=master)](https://travis-ci.org/stevelacy/gulp-git)
[![NPM version](https://badge.fury.io/js/gulp-git.png)](http://badge.fury.io/js/gulp-git)

<table>
<tr> 
<td>Package</td><td>gulp-git</td>
</tr>
<tr>
<td>Description</td>
<td>Git plugin for Gulp (gulpjs.com)</td>
</tr>
<tr>
<td>Node Version</td>
<td>>= 0.8</td>
</tr>
<tr>
<td>Gulp Version</td>
<td>3.x</td>
</tr>
</table>

## Usage
### Install
    npm install gulp-git --save

##Example

```javascript
var gulp = require('gulp');
var git = require('../');

// Run git init 
// src is the root folder for git to initialize
gulp.task('init', function(){
  gulp.src('./')
  .pipe(git.init());
});

// Run git init with options
gulp.task('init', function(){
  gulp.src('./')
  .pipe(git.init('--quiet --bare'));
});

// Run git add 
// src is the file(s) to add (or ./*)
gulp.task('add', function(){
  gulp.src('./git-test/*')
  .pipe(git.add());
});

// Run git add with options
gulp.task('add', function(){
  gulp.src('./git-test/*')
  .pipe(git.add('-f -i -p'));
});

// Run git commit
// src are the files to commit (or ./*)
gulp.task('commit', function(){
  gulp.src('./git-test/*')
  .pipe(git.commit('initial commit'));
});

// Run git commit with options
gulp.task('commit', function(){
  gulp.src('./git-test/*', '-A --amend -s')
  .pipe(git.commit('initial commit'));
});

// Run git remote add
// remote is the remote repo
// repo is the https url of the repo
gulp.task('remote', function(){
  gulp.src('./')
  .pipe(git.addRemote('origin', 'https://github.com/stevelacy/git-test'));
});

// Run git push 
// remote is the remote repo
// branch is the remote branch to push to
gulp.task('push', function(){
  gulp.src('./')
  .pipe(git.push('origin', 'master'));
});

// Run git push with options
// branch is the remote branch to push to
gulp.task('push', function(){
  gulp.src('./')
  .pipe(git.push('origin', 'master', '-f'));
});

// Run git pull
// remote is the remote repo
// branch is the remote branch to pull from
gulp.task('pull', function(){
  gulp.src('./')
  .pipe(git.pull('origin', 'master'));
});

// Tag the repo with a version
gulp.task('tag', function(){
  gulp.src('./')
  .pipe(git.tag('v1.1.1', 'Version message'));
});

// Tag the repo With signed key
gulp.task('tagsec', function(){
  gulp.src('./')
  .pipe(git.tag('v1.1.1', 'Version message with signed key', true));
});



// Run gulp's default task
gulp.task('default', function(){
  gulp.run('add');
});

```

##API

### git.init()
`git init`

Options: String

`.init('options')`

Creates an empty git repo

### git.add()
`git add <files>`

Options: String

`.add('options')`

Adds files to repo

### git.commit()
`git commit -m <message> <files>`

Options: String

`.commit('message','options')`

Commits changes to repo

`message` allows templates:

`git.commit('initial commit file: <%= file.path%>');`

### git.addRemote()
`git remote add <remote> <repo https url>`

    defaults:
    remote: 'origin'

Options: String

`.addRemote('origin', 'git-repo-url', 'options')`

Adds remote repo url

### git.pull()
`git pull <remote> <branch>`

    defaults:
    remote: 'origin'
    branch: 'master'

Options: String

`.pull('origin', 'branch', 'options')`

Pulls changes from remote repo

### git.push()
`git push <remote> <branch>`

    defaults:
    remote: 'origin'
    branch: 'master'

Options: String

`.push('origin', 'master', 'options')`

Pushes changes to remote repo

### git.tag()
`git tag -a/s <version> -m <message>`

Tags repo with release version

if the third variable is set to true the tag will use the git secure key:

`git.tag('v1.1.1', 'Version message with signed key', true);`

***




####You can view more examples in the [example folder.](https://github.com/stevelacy/gulp-git/tree/master/examples)



## LICENSE

(MIT License)

Copyright (c) 2014 Steve Lacy <me@slacy.me> slacy.me - Fractal <contact@wearefractal.com> wearefractal.com

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
