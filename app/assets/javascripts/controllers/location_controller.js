define(['ctrl', 'color_scale', 'models/clock'], function (ctrl, colorScale, clock) {
  return ctrl('locationController', function () {

    this.modelEvent('change:current_observation', 'updateColor')
    this.modelEvent('selected', 'addStroke')
    this.modelEvent('deselected', 'removeStroke')

    this.domEvent('click', 'selectLocation')

    this.afterInitialize(function () {
      this.addTitle()
    })

    this.include({
      addTitle: function () {
        this.elem.append('svg:title').text(this.model.get('name'))
      },

      updateColor: function (_, _, obs) {
        var color = d3.hsl(colorScale(obs.get('temperature')))

        this.elem.select('path').transition()
          .duration(clock.get('tick_rate'))
          .attr('fill', color)
      },

      selectLocation: function () {
        this.model.select()
      },

      addStroke: function () {
        this.elem.select('path')
          .style({ 'stroke': '#ffffff', 'stroke-width': '1px' })
      },

      removeStroke: function () {
        this.elem.select('path')
          .style({ 'stroke': null, 'stroke-width': null })
      }

    })
  })
})
