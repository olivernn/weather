define(['ctrl', 'progress_bar'], function (ctrl) {
  return ctrl('playingProgressController', function () {
    this.modelEvent('played', 'updateProgress')

    this.include({
      updateProgress: function (progress) {
        this.elem.progressBar(progress)
      }
    })
  })
})
