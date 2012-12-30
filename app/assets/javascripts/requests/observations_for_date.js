define(['jquery'], function ($) {
  var path = '/observations.json'

  return function (date) {
    if (!date) throw new Error ("Missing Date")

    return $.ajax(path, {
      dataType: 'json',
      data: { date: date.toJSON() }
    })
  }
})
