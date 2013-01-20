define(['ctrl', 'progress_bar'], function (ctrl) {
  return ctrl('loadingProgressController', function () {
    this.modelEvent('loaded', 'updateProgress')

    this.include({
      updateProgress: function (progress) {
        this.elem.progressBar(progress)
      }
    })
  })
})
