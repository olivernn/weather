define(['ctrl', 'polymaps', 'd3'], function (ctrl, polymaps, d3) {
  return ctrl('mapController', function () {
    this.afterInitialize(function () {
      this.svg = d3.select('#map').append('svg:svg')

      this.map = polymaps.map()
        .container(this.svg.node())
        .zoom(8)
        .center(this.options.mapCenter)
        .add(polymaps.interact())

      this.map.add(polymaps.image().url(this.imageTilesUrl()))

      this.addControls()
      this.addLocationsLayer()
      this.addVoronoiLayer()
    })

    this.include({
      imageTilesUrl: function () {
        var mapsUrl = 'http://{S}tile.cloudmade.com/973afee76f35426db974aea3c5e47553/998/256/{Z}/{X}/{Y}.png'
        return polymaps.url(mapsUrl).hosts(['a.', 'b.', 'c.', ''])
      },

      addControls: function () {
        this.map.add(polymaps.compass().pan('none'))
      },

      addLocationsLayer: function () {
        var locations = this.model.collection.map(function (location) {
          return location.latlng()
        })

        var transform = function (d) {
          d = this.map.locationPoint({lon: d[1], lat: d[0]})
          return 'translate(' + d.x + ',' + d.y + ')'
        }

        var layer = this.svg.insert('svg:g', '.compass')

        var marker = layer
          .selectAll('g')
          .data(locations)
          .enter()
          .append('svg:g')
          .attr('transform', transform.bind(this))

        marker.append('svg:circle')
          .attr('cx', function (d, i) { return locations[i][0] })
          .attr('cy', function (d, i) { return locations[i][1] })
          .attr('r', 5.5)

      },

      addVoronoiLayer: function () {
        var locations = this.model.collection.map(function (location) { return location.latlng() }),
            polygons = d3.geom.voronoi(locations),
            layer = this.svg.insert('svg:g', '.compass')

        var transform = function (d) {
          d = this.map.locationPoint({lon: d[1], lat: d[0]})
          return 'translate(' + d.x + ',' + d.y + ')'
        }

        var marker = layer
          .selectAll('g')
          .data(locations)
          .enter()
          .append('svg:g')
          .attr('transform', transform.bind(this))

        marker.append('svg:path')
          .attr('class', 'cell')
          .attr('d', function (d, i) { return 'M' + polygons[i].join('L') + 'Z'})

      }
    })
  })
})
