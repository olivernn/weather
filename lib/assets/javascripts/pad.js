define(function () {
  var pad = function (n, len) {
    var str = '' + n
    if (str.length == len) return str
    return pad('0' + str, len)
  }

  return pad
})
