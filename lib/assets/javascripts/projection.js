define(['d3'], function (d3) {
  return d3.geo.azimuthal()
           .mode('equidistant')
           .origin([-2,54])
           .scale(2800)
})
