
var LS = require('../')

var tape = require('tape')
var urlFriendly = require('base64-url').escape

tape('read and write from a file', function (t) {
  var ls1 = LS('/tmp/lossy-store_test', null, urlFriendly)
  var key = 'abcd/def+123'
  var value = {random: Math.random()}
  ls1.set(key, value)
  ls1.onDrain(function () {
    console.log('DRAINED')
    var ls2 = LS('/tmp/lossy-store_test', null, urlFriendly)
    ls2.ensure(key, function () {
      t.deepEqual(ls2.get(key), value)
      t.end()
    })
  })
})
