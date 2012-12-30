define(function () {

  var tickHandlers = [],
      tickRate = 200,
      interval

  var date = new Date (2012, 11, 9)
  //date.setDate(date.getDate() - 30)
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)

  var onTick = function (fn, ctx) {
    tickHandlers.push({fn: fn, ctx: ctx})
  }

  var incrementDate = function () {
    date.setHours(date.getHours() + 1)
    callTickHandlers()
  }

  var callTickHandlers = function () {
    tickHandlers.forEach(function (handler) {
      handler.fn.call(handler.ctx, date)
    })
  }

  var start = function () {
    interval = setInterval(incrementDate, tickRate)
  }

  var stop = function () {
    clearInterval(interval)
  }

  var setTickRate = function (tickRate) {
    tickRate = tickRate
  }

  return {
    onTick: onTick,
    start: start,
    stop: stop,
    setTickRate: setTickRate,
    incrementDate: incrementDate,
    date: date
  }
})
