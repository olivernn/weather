define(['ctrl', 'd3'], function (ctrl, d3) {
  return ctrl('locationController', function () {

    this.modelEvent('change:current_observation', 'updateColor')

    this.afterInitialize(function () {
      this.colorScale = d3.scale.linear()
                          .domain([-15,-3,2,10,15])
                          .range(['#2b63d4', '#26d6d9', '#38c78e', '#31ce49', '#94bd42'])
    })

    this.include({
      updateColor: function (_, _, obs) {
        var color = this.colorScale(obs.get('temperature'))
        this.elem.select('path').transition()
          .duration(200)
          .attr('fill', color)
      }
    })
  })
})
