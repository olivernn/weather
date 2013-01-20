define(['ctrl', 'display_date_time'], function (ctrl) {
  return ctrl('clockDisplayController', function () {
    this.modelEvent('tick', 'updateClockDisplay')

    this.include({
      updateClockDisplay: function (date) {
        this.elem.displayDateTime(date)
      }
    })
  })
})
