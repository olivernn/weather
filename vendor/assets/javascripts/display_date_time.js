define(['jquery'], function ($) {

  var pad = function (n, len) {
    var str = '' + n
    if (str.length == len) return str
    return pad('0' + str, len)
  }

  var months = ['Jan', 'Feb', 'Mar',
                'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep',
                'Oct', 'Nov', 'Dec']

  var parts = {
    'year': function (date) { return date.getFullYear() },
    'month': function (date) { return months[date.getMonth()] },
    'day': function (date) { return date.getDate() },
    'hours': function (date) { return pad(date.getHours(), 2) }
  }

  $.fn.displayDateTime = function (date) {
    var html = this

    html.find('[data-date-section]').each(function () {
      var el = $(this),
          part = el.data('date-section')

      el.text(parts[part](date))
    })
  }
})
