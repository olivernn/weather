define(function () {
  Date.prototype.nextDay = function () {
    var date = new Date

    date.setFullYear(this.getFullYear())
    date.setMonth(this.getMonth())
    date.setDate(this.getDate() + 1)

    return date
  }

  Date.prototype.isToday = function () {
    var date = new Date

    return date.getFullYear() == this.getFullYear() &&
           date.getMonth() == this.getMonth() &&
           date.getDate() == this.getDate()
  }

  Date.prototype.daysBetween = function (otherDate) {
    return Math.abs(Math.floor((this - otherDate) / 86400000))
  }

  Date.prototype.hoursBetween = function (otherDate) {
    return Math.abs(Math.floor((this - otherDate) / 3600000))
  }
})
