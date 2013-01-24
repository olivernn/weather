define([
  'model',
  'env',
  'core_extensions/number'
], function (model, ENV) {

  var Clock = model('clock', function () {

    this.prototype.initialize = function () {
      this.set('tick_rate', 200)
      this.set('interval', null)
      this.set('running', false)
    }

    this.prototype.tick = function () {
      if (!this.get('running')) return

      this.incrementDate()
      setTimeout(this.tick.bind(this), this.get('tick_rate'))
    }

    this.prototype.toggleRunning = function () {
      if (this.get('running')) {
        this.stop()
      } else {
        this.start()
      }
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
      if (date > ENV.endDate || date < ENV.startDate) return

      this.set('date', date)
      this.emit('tick', date)

      if (date >= ENV.endDate) this.stop()
    }

  })

  return new Clock ({
    date: new Date(ENV.startDate.getTime())
  })
})

