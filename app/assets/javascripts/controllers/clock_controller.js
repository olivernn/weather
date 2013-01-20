define(['ctrl'], function (ctrl) {
  return ctrl('clockController', function () {
    this
      .domEvent('click', '.prev', '!prevDay')
      .domEvent('click', '.play', '!startClock')
      .domEvent('click', '.pause', '!stopClock')
      .domEvent('click', '.next', '!nextDay')

    this
      .modelEvent('stopped', 'displayStartButton')
      .modelEvent('started', 'displayStopButton')

    this.include({
      startClock: function () {
        this.model.start()
      },

      stopClock: function () {
        this.model.stop()
      },

      nextDay: function () {
        this.model.nextDay()
      },

      prevDay: function () {
        this.model.prevDay()
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
