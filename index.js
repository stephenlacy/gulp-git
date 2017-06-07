'use strict';
var requireDir = require('require-dir');
/**
 * git
 * @namespace git
 */
var git = requireDir('./lib');
git.util = require('./lib/util');
module.exports = git;
