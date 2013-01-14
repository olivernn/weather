// a require.js plugin for loading templates and wrapping them in a function
// that will render the template with mustache and wrap the result in jquery
define({
  load: function (name, req, load, config) {
    var templateDep = 'text!' + name + '.mustache'

    req([templateDep, 'mustache', 'jquery'], function (template, mustache, $) {
      load(function (data) {
        return $(mustache.render(template, data))
      })
    })
  }
})
