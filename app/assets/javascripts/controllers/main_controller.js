define(['ctrl', 'controllers/map_controller'], function (ctrl, MapController) {
  return ctrl('mainController', function () {
    this.afterInitialize(function () {
      this.initChildView(MapController, {
        elem: this.elem.find('#map')
      })
    })
  })
})
