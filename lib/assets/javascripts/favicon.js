define(function () {
  var canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d'),
      link = document.getElementById('favicon')

  canvas.height = canvas.width = 16
  ctx.font = 'bold 10px "helvetica"'

  return function (temperature, color) {
    if (isNaN(temperature)) return

    ctx.clearRect(0,0,16,16)

    ctx.fillStyle = color
    ctx.fillRect(0,0,16,16)

    ctx.fillStyle = 'black'
    ctx.fillText(temperature + '', 5, 12)

    link.href = canvas.toDataURL('image/png')
  }
})
