define(function () {
  var parseDate = function (prop) {
    var d = new Date
    d.setTime(Date.parse(window.ENV[prop]))
    return d
  }

  return {
    startDate: parseDate('startDate'),
    endDate: parseDate('endDate'),
    duration: window.ENV.duration
  }
})
