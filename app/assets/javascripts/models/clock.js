define(['model', 'core_extensions/number'], function (model) {
  var Clock = model('clock', function () {

    var currentDate = function () {
      return (new Date).beginningOfDay()
    }

    this.prototype.initialize = function () {
      this.set('tick_rate', 200)
      this.set('interval', null)
      this.set('running', false)

      var date = (14).daysAgo()

      date.setHours(0)
      date.setMinutes(0)
      date.setSeconds(0)
      date.setMilliseconds(0)

      this.set('date', date)
    }

    this.prototype.tick = function () {
      if (!this.get('running')) return

      this.incrementDate()
      setTimeout(this.tick.bind(this), this.get('tick_rate'))
    }

    this.prototype.start = function () {
      if (this.get('running')) return

      this.set('running', true)
      this.tick()
      this.emit('started')
    }

    this.prototype.stop = function () {
      if (!this.get('running')) return

      this.set('running', false)
      this.emit('stopped')
    }

    this.prototype.prevDay = function () {
      var date = this.get('date')
      date.setDate(date.getDate() - 1)
      date.setHours(0)
      this.setDate(date)
    }

    this.prototype.nextDay = function () {
      var date = this.get('date')
      date.setDate(date.getDate() + 1)
      date.setHours(0)
      this.setDate(date)
    }

    this.prototype.incrementDate = function () {
      var date = this.get('date')
      date.setHours(date.getHours() + 1)
      this.setDate(date)
    }

    this.prototype.setDate = function (date) {
      if (date > currentDate() || date < (14).daysAgo().beginningOfDay()) return

      this.set('date', date)
      this.emit('tick', date)
      if (date >= currentDate()) this.stop()
    }

  })

  return new Clock
})

