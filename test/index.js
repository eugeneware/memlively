var LivelyDb = require('livelydb'),
    MemLively = require('..'),
    expect = require('expect.js'),
    noop = function() { };

describe('LivelyDb', function() {
  var memdb;
  beforeEach(function(done) {
    memdb = new MemLively();
    done();
  });

  it('should be able to create a MemLively DB', function(done) {
    expect(memdb).not.to.be(undefined);
    done();
  });

  it('should be able to put and get values', function(done) {
    var key = 'my key';
    var value = 'my value';

    memdb.put(key, value, get);

    function get(err) {
      if (err) return done(err);
      memdb.get(key, check);
    }

    function check(err, data) {
      if (err) return done(err);
      expect(data).to.equal(value);
      done();
    }
  });

  it('should handle not found errors', function(done) {
    memdb.get('no key', function (err, data) {
      expect(err.notFound).to.equal(true);
      expect(err.name).to.equal('NotFoundError');
      done();
    });
  });

  it('should be able to delete keys', function(done) {
    var key = 'my key';
    var value = 'my value';

    memdb.put(key, value, del);

    function del(err) {
      if (err) return done(err);
      memdb.del(key, get);
    }

    function get(err) {
      if (err) return done(err);
      memdb.get(key, check);
    }

    function check(err, data) {
      expect(err.notFound).to.equal(true);
      done();
    }
  });

  it('should emit change events', function(done) {
    var key = 'eugene';
    var value = { name: 'Eugene', number: 42 };

    var count = 0;
    memdb.on('change', function (key_, change) {
      expect(key_).to.equal(key);
      if (count === 0) {
        expect(change).to.eql([
          { type: 'put', key: [], value: { name: 'Eugene', number: 42 } } ]);
      } else if (count === 1) {
        expect(change).to.eql([
          { type: 'put', key: [ 'name' ], value: 'Susan' },
          { type: 'del', key: [ 'number' ] } ]);
        done();
      }
      count++;
    });

    memdb.put(key, value, change);

    function change(err) {
      if (err) return done(err);
      value.name = 'Susan';
      delete value.number;
      memdb.put(key, value, noop);
    }
  });
});

