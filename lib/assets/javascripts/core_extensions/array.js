define(function () {
  Array.prototype.forEachWait = function (fn, ctx) {
    this.forEach(function (el, idx, arr) {
      setTimeout(fn.bind(ctx, el, idx, arr), 15)
    })
  }
})
