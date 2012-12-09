define(['ctrl', 'polymaps', 'd3'], function (ctrl, polymaps, d3) {
  return ctrl('mapController', function () {
    this.afterInitialize(function () {
      this.map = polymaps.map()
        .container(d3.select('#map').append('svg:svg').node())
        .zoom(8)
        .add(polymaps.interact())

      this.map.add(polymaps.image().url(this.imageTilesUrl()))

      this.addControls()
    })

    this.include({
      imageTilesUrl: function () {
        var mapsUrl = 'http://{S}tile.cloudmade.com/973afee76f35426db974aea3c5e47553/998/256/{Z}/{X}/{Y}.png'
        return polymaps.url(mapsUrl).hosts(['a.', 'b.', 'c.', ''])
      },

      addControls: function () {
        this.map.add(polymaps.compass().pan('none'))
      }
    })
  })
})
