define(['ctrl', 'keymaster'], function (ctrl, key) {
  return ctrl('keyboardController', function () {

    var preventingDefault = function (fn, ctx) {
      return function (e) {
        fn.call(ctx, e)
        return false
      }
    }

    this.afterInitialize(function () {
      key('space', preventingDefault(this.playPause, this))
      key('left',  preventingDefault(this.prev, this))
      key('right', preventingDefault(this.next, this))
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
