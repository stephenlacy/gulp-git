'use strict';
/**
 * Convert stream to buffer
 * @param   {Stream}  stream   stream that what to read
 * @returns {Promise.<Buffer>} buffer
 * @memberof git.util
 */
function readStream(stream) {
  return new Promise(function(resolve, reject) {
    stream.once('error', reject);
    var buf;
    stream.on('data', function(data) {
      if (buf) {
        buf = Buffer.concat([buf, data]);
      } else {
        buf = data;
      }
    });
    stream.once('finish', function() {
      resolve(buf);
    });
  });
}

module.exports = readStream;
