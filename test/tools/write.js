module.exports = function write(stream) {
  var writes = [];
  for (var i = 1; i < arguments.length; i++) {
    writes[i - 1] = arguments[i];
  }
  writes.forEach(function (write) {
    stream.write(write);
  });
  stream.emit('end');
};
