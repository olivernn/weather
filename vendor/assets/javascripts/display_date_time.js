define(['jquery', 'pad'], function ($, pad) {

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
