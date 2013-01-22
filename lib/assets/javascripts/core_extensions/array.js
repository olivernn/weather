define(function () {
  Array.prototype.forEachWait = function (fn, ctx) {
    var runFn = function (arr) {
      if (!arr.length) return

      var head = arr[0],
          tail = arr.slice(1)

      fn.call(ctx, head)
      setTimeout(function () {
        runFn(tail)
      })
    }

    runFn(this.slice())
  }
})
