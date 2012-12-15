define(['jquery'], function ($) {
  var path = '/uk_geo.json'

  return function () {
    return $.ajax(path)
  }
})
