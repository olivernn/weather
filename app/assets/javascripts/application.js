require(['controllers/main_controller', 'core_extensions/array'], function (MainController) {
  new MainController ({
    elem: $('body')
  })
})

