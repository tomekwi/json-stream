var assert = require('assert'),
    write = require('./tools/write'),
    JSONStream = require('../'),
    stream;

function expectError(stream, errorMessageRegExps) {
  var errors = [], endCalled = false;
  stream.on('error', function (error) {
    errors.push(error);
  });
  stream.on('end', function () {
    endCalled = true;
  });
  process.on('exit', function () {
    assert(errorMessageRegExps.every(function (message, index) {
      var error = errors[index];
      return (error && message.test(error.message));
    }));
    assert(endCalled);
  });
}

stream = JSONStream();
expectError(stream, [ /unexpected token/i ]);
write(stream, 'random stuff');

stream = JSONStream();
expectError(stream, [ /unexpected token/i ]);
write(stream, '["too", "many", "commas",]');

stream = JSONStream();
expectError(stream, [ /unexpected string/i ]);
write(stream, '"dangling" "values"');

stream = JSONStream();
expectError(stream, [ /unexpected token/i ]);
write(stream, '{unquoted: "object key"}');
