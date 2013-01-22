require(['controllers/main_controller', 'core_extensions/array', 'augment'], function (MainController) {
  new MainController ({
    elem: $('body')
  })
})

