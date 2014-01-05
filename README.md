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

// Run git add 
// src is the file(s) to add (or ./*)
gulp.task('add', function(){
  gulp.src('./git-test/*')
  .pipe(git.add());
});

// Run git commit
// src are the files to commit (or ./*)
gulp.task('commit', function(){
  gulp.src('./git-test/*')
  .pipe(git.commit({message:'initial commit'}));
});

// Run git remote add
// remote is the remote repo
// repo is the https url of the repo
gulp.task('remote', function(){
  gulp.src('./')
  .pipe(git.addRemote({remote:'origin', repo:'https://github.com/stevelacy/git-test'}));
});

// Run git push 
// remote is the remote repo
// branch is the remote branch to push to
gulp.task('push', function(){
  gulp.src('./')
  .pipe(git.push({remote:'origin', branch:'master'}));
});

// Run git pull
// remote is the remote repo
// branch is the remote branch to pull from
gulp.task('pull', function(){
  gulp.src('./')
  .pipe(git.pull({remote:'origin', branch:'master'}));
});



// Run gulp's default task
gulp.task('default', function(){
  gulp.run('add');
});

```

##API

### git.init()
`git init`

Creates an empty git repo

### git.add()
`git add <files>`

Adds files to repo

### git.commit()
`git commit -m <message> <files>`

Commits changes to repo

### git.addRemote()
`git remote add <remote> <repo https url>`

    defaults:
    remote: 'origin'

Adds remote repo url

### git.pull()
`git pull <remote> <branch>`

    defaults:
    remote: 'origin'
    branch: 'master'

Pulls changes from remote repo

### git.push()
`git push <remote> <branch>`

    defaults:
    remote: 'origin'
    branch: 'master'

Pushes changes to remote repo






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
