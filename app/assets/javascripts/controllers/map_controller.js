define(['ctrl', 'gmaps', 'voronoi_map_layer'], function (ctrl, gmaps, VoronoiMapLayer) {
  return ctrl('mapController', function () {
    this.afterInitialize(function () {
      this.map = new gmaps.Map(this.elem.get(0), {
        mapTypeId: gmaps.MapTypeId.ROADMAP,
        center: new gmaps.LatLng(51.5171, 0.1062),
        zoom: 8
      })

      var voronoiMapOverlay = new VoronoiMapLayer ({
        locations: this.model.map(function (l) { return l.latlng() })
      })

      voronoiMapOverlay.setMap(this.map)
    })
  })
})
