define([
  'model',
  'requests/observations_for_date',
  'models/clock',
  'core_extensions/date',
  'core_extensions/number'
], function (model, observationsForDate, clock) {
  return model('observations', function () {
    var self = this

    var initAndAddToCollection = function (attrs) {
      self.collection.add(new self (attrs))
    }

    var dateAsPercentage = function (date) {
      var daysAgo = (new Date).daysBetween(date)
      return (15 - daysAgo) / 14
    }

    this.load = function (date) {
      var date = date || (14).daysAgo()

      return observationsForDate(date)
        .then(function (data) {
          data.forEachWait(initAndAddToCollection)
        })
        .then(this.emit.bind(this, 'loaded', dateAsPercentage(date)))
        .then(this.loadNext.bind(this, date))
    }

    this.loadNext = function (date) {
      var nextDay = date.nextDay()

      if (nextDay.isToday()) return

      setTimeout(this.load.bind(this, nextDay), 1200)
    }

    this.findByDate = function (date, fn) {
      this.collection.forEach(function (observation, idx, arr) {
        if (observation.isForDate(date)) fn(observation, idx, arr)
      })
    }

    this.averageForDate = function (date) {
      var arr = []

      this.findByDate(date, function (observation) {
        arr.push(observation.get('temperature'))
      })

      return arr.reduce(function (total, n) { return total + n }) / arr.length
    }

    this.findByDateAndSelect = function (date) {
      this.findByDate(date, function (observation) {
        observation.select()
      })
    }

    clock.on('tick', this.findByDateAndSelect, this)

    clock.on('tick', function (date) {
      var hoursAgo = (new Date).hoursBetween(date),
          hoursAsPercentage = (360 - hoursAgo) / 336

      this.emit('played', hoursAsPercentage)
    }, this)

    this.prototype.initialize = function () {
      this.set('date', new Date(Date.parse(this.get('date'))))
    }

    this.prototype.select = function () {
      this.set('selected', true)
      this.emit('selected')
    }

    this.prototype.isForDate = function (date) {
      var d = this.get('date')

      return d.getFullYear() == date.getFullYear() &&
             d.getMonth() == date.getMonth() &&
             d.getDate() == date.getDate() &&
             d.getHours() == date.getHours()
    }
  })
})
