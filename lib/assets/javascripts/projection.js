define(['d3'], function (d3) {
  return d3.geo.azimuthal()
           .mode('equidistant')
           .origin([-2,55.5])
           .scale(3500)
})
