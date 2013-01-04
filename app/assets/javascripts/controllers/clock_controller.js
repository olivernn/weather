define(['ctrl', 'display_date_time'], function (ctrl) {
  return ctrl('clockController', function () {
    this
      .domEvent('click', '.start', '!startClock')
      .domEvent('click', '.stop', '!stopClock')
      .domEvent('change', '.tick-rate', '!setTickRate')

    this
      .modelEvent('stopped', 'displayStartButton')
      .modelEvent('started', 'displayStopButton')
      .modelEvent('tick', 'updateClockDisplay')

    this.include({
      startClock: function () {
        this.model.start()
      },

      stopClock: function () {
        this.model.stop()
      },

      setTickRate: function () {
        this.model.setTickRate(this.elem.find('.tick-rate').val())
      },

      updateClockDisplay: function (date) {
        this.elem.find('.datetime').displayDateTime(date)
      },

      displayStartButton: function () {
        this.elem.addClass('is-stopped')
        this.elem.removeClass('is-started')
      },

      displayStopButton: function () {
        this.elem.addClass('is-started')
        this.elem.removeClass('is-stopped')
      }
    })
  })
})
