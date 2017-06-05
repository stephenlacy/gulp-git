'use strict';
/**
 * readStream
 * @module gulp-git/lib/util/readStream
 */

/**
 * Convert stream to buffer
 *
 * @param   {Stream} stream stream that what to read
 * @param   {readStreamCallback} callback function that receive buffer
 * @returns {void}
 */
function readStream(stream, callback) {
  var buf;
  stream.on('data', function(data) {
    if (buf) {
      buf = Buffer.concat([buf, data]);
    } else {
      buf = data;
    }
  });
  stream.once('finish', function() {
    callback(buf);
  });
}

/**
 * Convert stream to buffer
 * @param   {Stream}  stream stream that what to read
 * @returns {Promise} promise of buffer
 */
module.exports = function(stream) {
  return new Promise(function(resolve, reject) {
    stream.once('error', reject);
    readStream(stream, resolve);
  });
};
