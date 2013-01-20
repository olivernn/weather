define([
  'ctrl',
  'models/observation',
  'models/clock',
  'controllers/loading_progress_controller',
  'controllers/playing_progress_controller'
], function (ctrl, Observation, clock, LoadingProgressController, PlayingProgressControler) {
  return ctrl('timelineController', function () {
    this.afterInitialize(function () {
      this.initLoadingProgressController()
      this.initPlayingProgressController()
    })

    this.include({
      initLoadingProgressController: function () {
        this.initChildView(LoadingProgressController, {
          elem: this.elem.find('.loaded'),
          model: Observation
        })
      },

      initPlayingProgressController: function () {
        this.initChildView(PlayingProgressControler, {
          elem: this.elem.find('.played'),
          model: Observation
        })
      }
    })
  })
})
