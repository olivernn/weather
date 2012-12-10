define(['jquery'], function ($) {
  var path = '/locations.json'

  return function () {
    return $.ajax(path, {
      dataType: 'json'
    })
  }
})
