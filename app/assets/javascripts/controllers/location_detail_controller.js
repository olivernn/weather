define([
  'ctrl',
  'color_scale',
  'template!location_detail',
  'temperature_range'
], function (ctrl, colorScale, template) {
  return ctrl('locationDetailController', function () {
    this.template(template)

    this.presenter(function (model) {
      return {
        temperature: model.currentTemperature(),
        name: model.get('name')
      }
    })

    this.modelEvent('deselected', 'destroy')
    this.modelEvent('change:current_observation', 'updateTemperature')

    this.afterRender(function () {
      this.updateTemperature()
    })

    this.include({
      updateTemperature: function () {
        this.elem.temperatureRange(this.model.currentTemperature())
      }
    })
  })
})
