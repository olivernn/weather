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

    this.load = function (date) {
      var date = date || (14).daysAgo()

      return observationsForDate(date)
        .then(function (data) {
          data.forEachWait(initAndAddToCollection)
        })
        .then(this.loadNext.bind(this, date))
    }

    this.loadNext = function (date) {
      var nextDay = date.nextDay()

      if (nextDay.isToday()) return

      setTimeout(this.load.bind(this, nextDay), 2000)
    }

    this.findByDateAndSelect = function (date) {
      this.collection.forEach(function (observation) {
        if (observation.isForDate(date)) observation.select()
      })
    }

    clock.on('tick', this.findByDateAndSelect, this)

    this.prototype.initialize = function () {
      this.set('date', new Date(Date.parse(this.get('date'))))
    }

    this.prototype.select = function () {
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
