define(['ctrl', 'd3', 'projection'], function (ctrl, d3, projection) {
  return ctrl('mapController', function () {
    this.afterInitialize(function () {
      this.map = this.options.svg.append('svg:g').attr('class', 'uk-path')
      this.drawMap()
    })

    this.include({
      drawMap: function () {
        this.map
          .selectAll('path')
          .data(this.model.features)
          .enter()
            .append('svg:path')
            .attr('d', d3.geo.path().projection(projection))
      }
    })
  })
})
