define(['ctrl', 'd3', 'controllers/map_controller', 'controllers/locations_controller', 'requests/geo', 'models/location'], function (ctrl, d3, MapController, LocationsController, geoLocations, Location) {
  return ctrl('mainController', function () {
    this.afterInitialize(function () {
      this.svg = d3.select('#map').insert('svg:svg')
                   .attr('width', 1280)
                   .attr('height', 800)

      geoLocations().then(this.initMapController.bind(this))
      Location.load().then(this.initLocationsController.bind(this))
    })

    this.include({
      initMapController: function (data) {
        this.initChildView(MapController, {
          elem: this.elem.find('#map'),
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
      }
    })
  })
})
