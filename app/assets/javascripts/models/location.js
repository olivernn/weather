define(['model', 'requests/all_locations', 'models/observation', 'models/clock'], function (model, allLocations, Observation, clock) {

  var observationIndex = new model.Indexer(Observation.collection, 'location_id')

  return model('location', function () {
    this.load = function () {
      var ctor = this
      var initAndAddToCollection = function (attrs) {
        ctor.collection.add(new ctor (attrs))
      }

      return allLocations()
        .then(function (data) {
          data.forEach(initAndAddToCollection)
        })
        .then(function () {
          Observation.load()
        })
    }

    this.prototype.initialize = function () {
      this.set('observation_index', 0)
      clock.on('tick', this.updateCurrentObservation, this)
    }

    this.prototype.lnglat = function () {
      return [this.get('lng'), this.get('lat')]
    }

    this.prototype.observations = function () {
      return observationIndex.get(this.id())
    }

    this.prototype.updateCurrentObservation = function (date) {
      var observation = this.observations().detect(function (observation) {
        return observation.isForDate(date)
      })

      if (observation) this.set('current_observation', observation)
    }
  })
})
