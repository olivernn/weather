define([
  'ctrl',
  'd3',
  'controllers/map_controller',
  'controllers/locations_controller',
  'controllers/clock_controller',
  'controllers/location_detail_controller',
  'controllers/temperature_range_controller',
  'controllers/timeline_controller',
  'requests/geo',
  'models/location',
  'models/observation',
  'models/clock'
], function (ctrl, d3, MapController, LocationsController, ClockController, LocationDetailController, TemperatureRangeController, TimelineController, geoLocations, Location, Observation, clock) {
  return ctrl('mainController', function () {
    this.afterInitialize(function () {
      this.svg = d3.select('.map').insert('svg:svg')
                   .attr('width', 800)
                   .attr('height', 600)

      geoLocations().then(this.initMapController.bind(this))
      Location.load().then(this.initLocationsController.bind(this))

      Location.anyInstance.on('selected', this.renderLocationDetailController, this)

      this.initClockController()
      this.initTimelineController()
      this.renderTemperatureRangeController()
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
      },

      initTimelineController: function () {
        this.initChildView(TimelineController, {
          elem: this.elem.find('.timeline-container')
        })
      },

      renderTemperatureRangeController: function () {
        var html = $('<article>', {
          'class': 'temperature-range'
        })

        var temperatureController = this.initChildView(TemperatureRangeController, {
          elem: html.appendTo(this.elem.find('.temp-scale-container')),
          model: clock
        })

        temperatureController.render()
      },

      renderLocationDetailController: function (location) {
        var html = $('<article>', {
          'class': 'location-detail',
          'data-location-id': location.id()
        })

        var locationDetailController = this.initChildView(LocationDetailController, {
          elem: html.appendTo(this.elem.find('.temp-scale-container')),
          model: location
        })

        locationDetailController.render()
      }
    })
  })
})
