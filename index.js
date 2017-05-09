var json = require('./json')
var Store = require('./store')

module.exports = function (dir, codec) {
  codec = codec || json
  return Store(function read (id, cb) {
    fs.readFile(path.join(dir, id), function (err, value) {
      if(err) return cb(err)
      try { value = codec.decode(value) }
      catch (err) { return cb(err) }
      return cb(null, value)
    })
  }, function write (id, value, cb) {
    try { value = codec.encode(value) }
    catch (err) { return cb(err) }
    fs.writeFile(path.join(dir, id), value, cb)
  })
}

