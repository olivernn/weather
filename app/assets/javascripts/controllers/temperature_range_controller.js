define([
  'ctrl',
  'color_scale',
  'template!temperature_range',
  'models/observation',
  'temperature_range'
], function (ctrl, colorScale, template, Observation) {
  return ctrl('temperatureRangeController', function () {
    this.template(template)

    this.modelEvent('tick', 'updateTemperature')

    this.include({
      updateTemperature: function () {
        var avg = Observation.averageForDate(this.model.get('date'))
        this.elem.temperatureRange(avg)
      }
    })
  })
})
