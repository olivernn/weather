define([
  'ctrl',
  'd3',
  'controllers/map_controller',
  'controllers/locations_controller',
  'controllers/clock_controller',
  'requests/geo',
  'models/location',
  'models/clock'
], function (ctrl, d3, MapController, LocationsController, ClockController, geoLocations, Location, clock) {
  return ctrl('mainController', function () {
    this.afterInitialize(function () {
      this.svg = d3.select('.map').insert('svg:svg')
                   .attr('width', 800)
                   .attr('height', 600)

      geoLocations().then(this.initMapController.bind(this))
      Location.load().then(this.initLocationsController.bind(this))

      this.initClockController()
    })

    this.include({
      initMapController: function (data) {
        this.initChildView(MapController, {
          elem: this.elem.find('.map'),
          model: data,
          svg: this.svg
        })
      },

      initLocationsController: function () {
        this.initChildView(LocationsController, {
          elem: this.elem.find('#map'),
          model: Location.collection,
          svg: this.svg
        })
      },

      initClockController: function () {
        this.initChildView(ClockController, {
          elem: this.elem.find('.clock'),
          model: clock
        })
      }
    })
  })
})
