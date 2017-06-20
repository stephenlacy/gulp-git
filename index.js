'use strict';
var requireDir = require('require-dir');
/**
 * git
 * @namespace git
 * @example const git = require('gulp-git');
 */
var git = requireDir('./lib');
git.util = require('./lib/util');
module.exports = git;
