'use strict';

var spawn = require('./spawn');
var readStream = require('./readStream');
var RE_DIFF_RESULT = /\:(\w+)\s+(\w+)\s+(\w+)(?:\.{3})?\s+(\w+)(?:\.{3})?\s+(\w+)(\u0000|\t|\s+)(.+?)(?:\6|\n)(?:([^:]+?)\6)?/g;

function getReaslt(data) {
  var result = [];
  if (data && data.length) {
    var str = data.toString();
    var match;
    RE_DIFF_RESULT.lastIndex = 0;
    while ((match = RE_DIFF_RESULT.exec(str))) {
      result.push({
        // mode for compare "src"
        srcMode: match[1],
        // mode for compare "dst"
        dstMode: match[2],
        // sha1 for compare "src"
        srcHash: match[3],
        // sha1 for compare "dst"
        dstHash: match[4],
        // status
        status: match[5],
        // path for compare "src"
        srcPath: match[7],
        // path for compare "dst"
        dstPath: match[8] || match[7],
      });
    }
  }
  return result;
}

module.exports = function(args, cwd, config) {
  return readStream(spawn(['diff', '--raw', '-z'].concat(args), cwd, config)).then(getReaslt);
};
