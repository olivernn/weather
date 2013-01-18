define(function () {
  Number.prototype.daysAgo = function () {
    var d = new Date
    d.setDate(d.getDate() - this)
    return d
  }
})
