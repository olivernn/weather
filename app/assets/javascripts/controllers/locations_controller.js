define(['ctrl', 'd3', 'projection'], function (ctrl, d3, projection) {
  return ctrl('locationsController', function () {
    this.afterInitialize(function () {
      this.cells = this.options.svg
                     .append('svg:g')
                     .attr('id', 'cells')

      this.drawLocations()
    })

    this.include({
      bounds: function () {
        var nw = [-7.572168, 49.96],
            sw = [-7.572168, 58.635],
            ne = [1.681531, 49.96],
            se = [1.681531, 58.635]

        return d3.geom.polygon([projection(nw), projection(sw), projection(ne), projection(se)])
      },

      drawLocations: function () {
        var bounds = this.bounds(),
            positions = this.model.map(function (location) { return projection(location.lnglat()) }),
            polygons = d3.geom.voronoi(positions)

        var group = this.cells
                      .selectAll('g')
                      .data(this.model.toArray())
                      .enter()
                        .append('svg:g')

        group.append('svg:path')
          .attr('class', 'cell')
          .attr('d', function (d, i) { return 'M' + polygons[i].join('L') + 'Z' })
      }
    })
  })
})
