var LivelyDb = require('livelydb'),
    clone = require('clone'),
    diff = require('changeset'),
    inherits = require('util').inherits;

module.exports = MemLively;
function MemLively() {
  LivelyDb.call(this);
  this.db = { };
}
inherits(MemLively, LivelyDb);

MemLively.prototype.get = function (key, cb) {
  var self = this;
  setImmediate(function () {
    if (typeof self.db[key] === 'undefined') {
      return cb(new LivelyDb.NotFoundError('Key not found in database ' +
                JSON.stringify(key)));
    }
    cb(null, clone(self.db[key]));
  });
};

MemLively.prototype.put = function (key, value, cb) {
  var old = this.db[key];
  var new_ = clone(value);

  var changes = diff(old, new_);
  this.db[key] = new_;
  if (changes.length) this.emit('change', key, changes);
  setImmediate(cb);
}

MemLively.prototype.del = function (key, cb) {
  delete this.db[key];
  setImmediate(cb);
}
