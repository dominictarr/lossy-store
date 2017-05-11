'use strict'
var json = require('./json')
var Store = require('./store')
var fs = require('fs')
var path = require('path')

module.exports = function (dir, codec) {
  if(!dir)
    return Store(
      function (v, cb) { cb() },
      function (k,v,cb) { cb() }
    )

  codec = codec || json
  var ready = false
  function mkdir (cb) {
    if(ready) cb()
    else mkdirp(dir, function () {
      ready = true
      cb()
    })
  }

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
    mkdir(function () {
      fs.writeFile(path.join(dir, id), value, cb)
    })
  })
}










