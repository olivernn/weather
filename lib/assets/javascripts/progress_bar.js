define(['jquery'], function ($) {
  $.fn.progressBar = function (progress) {
    var progressPercent = Math.ceil(100 * progress) + '%'
    return this.css('width', progressPercent)
  }
})
