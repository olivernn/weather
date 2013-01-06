define([
  'model',
  'requests/observations_for_date',
  'models/clock'
], function (model, observationsForDate, clock) {
  return model('observations', function () {

    var defaultDate = function () {
      var d = new Date (2012, 11, 9)
      //d.setDate(d.getDate() - 30)
      return d
    }

    this.load = function (date) {
      var ctor = this,
          date = date || defaultDate()

      var initAndAddToCollection = function (attrs) {
        ctor.collection.add(new ctor (attrs))
      }

      return observationsForDate(date)
        .then(function (data) {
          data.forEachWait(initAndAddToCollection)
        })
    }

    this.loadNext = function (d) {
      if (d.getHours() !== 0) return

      console.log('loading observations for', d)

      var date = new Date
      date.setFullYear(d.getFullYear())
      date.setMonth(d.getMonth())
      date.setDate(d.getDate() + 1)

      this.load(date)
    }

    this.findByDateAndSelect = function (date) {
      this.collection.forEach(function (observation) {
        if (observation.isForDate(date)) observation.select()
      })
    }

    clock.on('tick', this.findByDateAndSelect, this)
    clock.on('tick', this.loadNext, this)

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
