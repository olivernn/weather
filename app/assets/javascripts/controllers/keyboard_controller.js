define(['ctrl', 'keymaster'], function (ctrl, key) {
  return ctrl('keyboardController', function () {
    this.afterInitialize(function () {
      key('space', this.playPause.bind(this))
      key('left', this.prev.bind(this))
      key('right', this.next.bind(this))
    })

    this.include({
      playPause: function () {
        this.model.toggleRunning()
      },

      prev: function () {
        this.model.prevDay()
      },

      next: function () {
        this.model.nextDay()
      }
    })
  })
})
