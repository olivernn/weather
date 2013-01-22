define([
  'ctrl',
  'd3',
  'projection',
  'controllers/location_controller'
], function (ctrl, d3, projection, LocationController) {
  return ctrl('locationsController', function () {
    this.afterInitialize(function () {
      this.cells = this.options.svg
                     .append('svg:g')
                     .attr('id', 'cells')
                     .attr('clip-path', 'url(#uk-outline)')

      this.drawLocations()
    })

    this.include({
      bounds: function () {
        //top left, bottom left, bottom right, top right
        var nw = [-7.572168, 49.96],
            sw = [-7.572168, 58,635],
            se = [1.681531, 58.635]
            ne = [1.681531, 49.96]

        return d3.geom.polygon([projection(nw), projection(sw), projection(se), projection(ne)])
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

        var self = this
        group.each(function (model) {
          self.initChildView(LocationController, {
            model: model,
            elem: d3.select(this)
          })
        })
      }
    })
  })
})
