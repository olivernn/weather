define(['ctrl', 'pad'], function (ctrl, pad) {
  return ctrl('urlController', function () {
    this.modelEvent('tick', 'changeUrl')

    this.include({
      changeUrl: function () {
        window.history.replaceState({}, this.model.get('date'), this.datePath())
      },

      datePath: function () {
        var date = this.model.get('date')

        return '/' + [
          date.getFullYear(),
          pad(date.getMonth() + 1, 2),
          pad(date.getDate(), 2),
          pad(date.getHours(), 2) + ':00'
        ].join('/')
      }
    })
  })
})
