define([
  'ctrl',
  'favicon',
  'models/observation',
  'color_scale'
], function (ctrl, favicon, Observation, colorScale) {
  return ctrl('faviconController', function () {
    this.modelEvent('tick', 'updateFavicon')

    this.include({
      updateFavicon: function () {
        var average = Observation.averageForDate(this.model.get('date')),
            color = colorScale(average)

        favicon(Math.floor(average), color)
      }
    })
  })
})
