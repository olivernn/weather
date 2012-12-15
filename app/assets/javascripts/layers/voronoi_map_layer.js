define(['d3', 'gmaps'], function (d3, gmaps) {
  var VoronoiMapLayer = function (settings) {
    this.locations = settings.locations
    this.height = this.width = '960px'
  }

  VoronoiMapLayer.prototype = new gmaps.OverlayView()

  VoronoiMapLayer.prototype.onAdd = function () {
    this.layer = d3.select(this.getPanes().overlayLayer).append('div')
                 .attr('class', 'voronoi-map-layer')

    this.svg = this.layer.append('svg')
                 .attr('width', this.width)
                 .attr('height', this.height)
  }

  VoronoiMapLayer.prototype.draw = function () {
    this.positionOverlay()

    var voronoi = d3.geom.voronoi(this.locations)

    var edges = this.svg.selectAll('path')
                  .data(voronoi)
                  .enter()
                  .append('svg:svg')
                    .attr('width', this.width)
                    .attr('height', this.height)
                    .append('svg:path')
                      .attr('d', this.generatePath.bind(this))
                      .attr('fill', 'none')
                      .attr('stroke', 'black')
  }

  VoronoiMapLayer.prototype.positionOverlay = function () {
    debugger
    var overlayProjection = this.getProjection(),
        sw = overlayProjection.fromLatLngToDivPixel(this.map.getBounds().getSouthWest()),
        ne = overlayProjection.fromLatLngToDivPixel(this.map.getBounds().getNorthEast())

    this.layer.style({
      left: sw.x + 'px',
      top: ne.y + 'px',
      width: (ne.x - sw.x) + 'px',
      height: (sw.y - ne.y) + 'px'
    })
  }

  VoronoiMapLayer.prototype.generatePath = function (d) {
    return 'M' + d.map(this.pixelCoordinates, this).join('L') + 'Z'
  }

  VoronoiMapLayer.prototype.pixelCoordinates = function (coords) {
    var gmapCoords = new gmaps.LatLng (coords[0], coords[1]),
        pixelCoords = this.getProjection().fromLatLngToDivPixel(gmapCoords)

    return [pixelCoords.x, pixelCoords.y]
  }

  return VoronoiMapLayer
})
