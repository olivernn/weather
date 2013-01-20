define(['jquery', 'color_scale'], function ($, colorScale) {
  $.fn.temperatureRange = function (temp) {
    var temperature = Math.floor(temp),
        top = (30 - temperature) / 45 * 100 + '%',
        temperatureColor = colorScale(temperature)

    this
      .css('top', top)
      .find('.temperature')
        .css('background-color', temperatureColor)
        .find('p')
          .html(temperature)

    return this
  }
})
