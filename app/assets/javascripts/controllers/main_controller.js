define(['ctrl', 'controllers/map_controller', 'models/location'], function (ctrl, MapController, Location) {
  return ctrl('mainController', function () {
    this.afterInitialize(function () {
      Location.load().then(this.initMapController.bind(this))
    })

    this.include({
      initMapController: function () {
        this.initChildView(MapController, {
          elem: this.elem.find('#map'),
          model: Location.collection,
          mapCenter: {lat: 51.507, lon: -0.128 }
        })
      }
    })
  })
})
