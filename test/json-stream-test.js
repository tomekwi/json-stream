var assert = require('assert'),
    write = require('./tools/write'),
    JSONStream = require('../');

function expect(stream, events) {
  var chunks = [], endCalled = false;
  stream.on('readable', function () {
    var chunk = stream.read();
    if (chunk) {
      chunks.push(chunk);
    }
  });
  stream.on('end', function () {
    endCalled = true;
  });
  process.on('exit', function () {
    assert.deepEqual(chunks, events);
    assert(endCalled);
  });
}

var stream = JSONStream();
expect(stream, [ { a: 42 } ]);
write(stream, '{"a": 42}\n');

stream = JSONStream();
expect(stream, [ { a: 42 } ]);
write(stream, '{"a":', '42}\n');

stream = JSONStream();
expect(stream, [ { a: 42, b: 1337 } ]);
write(stream, '{"a":', '42', ',"b": 1337', '}\n');

stream = JSONStream();
expect(stream, [ { a: 42, b: 1337 }, { hello: 'world' } ]);
write(stream, '{"a":', '42', ',"b": 1337', '}\n{"hel', 'lo": "wor', 'ld"}\n');

stream = JSONStream();
expect(stream, [ { a: 42 }, { hello: 'world' } ]);
write(stream, '{"a":', '42}\n{ blah blah blah }\n{"hel', 'lo": "wor', 'ld"}\n');

stream = JSONStream();
expect(stream, [ { a: 42 }, { hello: 'world' } ]);
write(stream, '{"a":', '42}\n{ blah blah', 'blah }\n{"hel', 'lo": "wor', 'ld"}\n');

stream = JSONStream();
expect(stream, [ { å: '⇢ utf8!', b: 1337 } ]);
write(stream, '{"å": "⇢ utf8!", "b": 1337 }\n');

stream = JSONStream({ async: true });
expect(stream, [ { å: '⇢ utf8!', b: 1337 } ]);
write(stream, '{"å": "⇢ utf8!", "b": 1337 }\n');
