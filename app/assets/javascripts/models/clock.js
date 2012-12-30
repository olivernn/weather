define(['model'], function (model) {
  var Clock = model('clock', function () {
    this.prototype.initialize = function () {
      this.set('tick_rate', 200)
      this.set('interval', null)

      var date = new Date (2012, 11, 9)

      date.setHours(0)
      date.setMinutes(0)
      date.setSeconds(0)
      date.setMilliseconds(0)

      this.set('date', date)
    }

    this.prototype.start = function () {
      this.interval = setInterval(this.incrementDate.bind(this), this.get('tick_rate'))
    }

    this.prototype.stop = function () {
      clearInterval(this.interval)
    }

    this.prototype.incrementDate = function () {
      var date = this.get('date')
      date.setHours(date.getHours() + 1)
      this.set('date', date)
      this.emit('tick', date)
    }
  })

  return new Clock
})

