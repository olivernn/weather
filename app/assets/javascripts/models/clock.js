define(['model', 'core_extensions/number'], function (model) {
  var Clock = model('clock', function () {

    var currentDate = function () {
      var date = new Date

      date.setHours(0)
      date.setMinutes(0)
      date.setSeconds(0)
      date.setMilliseconds(0)

      return date
    }

    this.prototype.initialize = function () {
      this.set('tick_rate', 200)
      this.set('interval', null)

      var date = (14).daysAgo()

      date.setHours(0)
      date.setMinutes(0)
      date.setSeconds(0)
      date.setMilliseconds(0)

      this.set('date', date)
    }

    this.prototype.start = function () {
      this.interval = setInterval(this.incrementDate.bind(this), this.get('tick_rate'))
      this.emit('started')
    }

    this.prototype.stop = function () {
      clearInterval(this.interval)
      this.emit('stopped')
    }

    this.prototype.setTickRate = function (rate) {
      this.stop()
      this.set('tick_rate', rate)
      this.start()
    }

    this.prototype.incrementDate = function () {
      var date = this.get('date')
      date.setHours(date.getHours() + 1)
      this.set('date', date)

      this.emit('tick', date)

      if (date >= currentDate()) this.stop()
    }
  })

  return new Clock
})

