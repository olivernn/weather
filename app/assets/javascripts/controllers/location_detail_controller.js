define([
  'ctrl',
  'color_scale',
  'template!location_detail'
], function (ctrl, colorScale, template) {
  return ctrl('locationDetailController', function () {
    this.template(template)

    this.modelEvent('deselected', 'destroy')
    this.modelEvent('change:current_observation', 'updateTemperature', 'updateColor')

    this.include({
      updateTemperature: function (_, _, obs) {
        var temp = Math.floor(obs.get('temperature'))
        this.elem.find('.temperature p').html(temp)
      },

      updateColor: function (_, _, obs) {
        this.elem.find('.temperature').css('background-color', colorScale(obs.get('temperature')))
      }
    })
  })
})
