'use strict';

var spawn = require('./spawn');
var readStream = require('./readStream');
var parseDate = require('./parseDate');

var formats = [
  '%H',
  '%T',
  '%P',
  '%aN',
  '%aE',
  '%at',
  '%cN',
  '%cE',
  '%ct',
  '%B'
].join('```git.log.split.prop```') + '```git.log.split.log```';
function getReaslt(data) {
  var result = [];
  if (data && data.length) {
    return data.toString().split('```git.log.split.log```\n').filter(Boolean).map(function(log) {
      log = log.trim().split('```git.log.split.prop```');
      return {
        hash: log[0],
        treeHash: log[1],
        parentHash: log[2].split(' '),
        authorName: log[3],
        authorEmail: log[4],
        authorDate: parseDate(log[5]),
        commitName: log[6],
        commitEmail: log[7],
        commitDate: parseDate(log[8]),
        body: log[9],
      };
    });
  }
  return result;
}

module.exports = function (args, cwd, config) {
  return readStream(spawn(['log', '--format=' + formats].concat(args), cwd, config)).then(getReaslt);
};

module.exports('--max-count=6').then(result => {
  console.log(result);
});
