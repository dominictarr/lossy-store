
module.exports = {
  encode: JSON.stringify,
  decode: function (data) { JSON.parse(data.toString()) },
  buffer: false
}



