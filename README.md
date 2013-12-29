# memlively

Pure memory implementation of LivelyDb for doing real-time data binding of a database with local javascript objects.

Just one of multiple database implementations for the livedb real-time
data-binding framework for replicating databases to local javascript objects.

[![build status](https://secure.travis-ci.org/eugeneware/memlively.png)](http://travis-ci.org/eugeneware/memlively)

## Installation

This module is installed via npm:

``` bash
$ npm install memlively
```

## Example Usage

``` js
var MemLively = require('memlively');

// Write to the memory database
var memdb = new MemLively();
memdb.put('my key', 'my value, function (err) {
  // I/O or other error, pass it up the callback chain
  if (err) return callback(err);
});

// Read from the memory database
memdb.get('my key', function (err, value) {
  if (err) {
    if (err.notFound) {
      // handle not found error
      return;
    } else {
      // I/O or other error, pass it up the callback chain
      return callback(err);
    }
  }
});

// Delete from the memory database
memdb.del('my key', function (err) {
  // I/O or other error, pass it up the callback chain
  if (err) return callback(err);
});
```
