
var tape = require('tape')
var Store = require('../store')

//mock exposes the read and write callbacks directly to the tests
//this allows the tests to be absolutely explicit about orderings.

function Mock() {
  var reading = {}
  return mock = {
    store: {},
    reading: reading,
    read: function (k, cb) {
      reading[k] = function (err, value) {
        reading[k] = null
        cb(err, value)
      }
    },
    write: function (k, v, cb) {
      mock.writeKey = k
      mock.writeValue = v

      mock.writing = function (err) {
        mock.writing = null
        mock.writeKey = null
        mock.writeValue = null
        cb(err)
      }
    }
  }
}

tape('simple', function (t) {

  var mock = Mock()
  var store = Store(mock.read, mock.write)

  store.set('foo', {bar: true})
  t.deepEqual(store.get('foo'), {bar:true})
  t.end()
})

tape('ensure', function (t) {

  var mock = Mock(), ensure
  var store = Store(mock.read, mock.write)

  store.ensure('foo', function () {
    ensure = true
    t.deepEqual(store.get('foo'), {bar:false})
  })

  t.ok(mock.reading.foo)
  mock.reading.foo(null, {bar: false})
  t.deepEqual(store.get('foo'), {bar:false})
  t.ok(ensure)
  t.end()
})


tape('write only once at a time', function (t) {

  var mock = Mock(), ensure
  var store = Store(mock.read, mock.write)
  var data = {}

  store.set('foo', 1)
  store.set('bar', 2)
  store.set('baz', 3)
  t.ok(mock.writing)
  while(mock.writing) {
    data[mock.writeKey] = mock.writeValue
    mock.writing()
  }
  t.deepEqual(data, {foo: 1, bar: 2, baz: 3})
  t.end()

})

tape('set fires ensure', function (t) {

  var mock = Mock(), ensure
  var store = Store(mock.read, mock.write)

  store.ensure('foo', function () {
    ensure = true
    t.deepEqual(store.get('foo'), 3)
  })

  t.notOk(ensure)

  store.set('foo', 3)

  t.ok(ensure)

  t.end()

})
