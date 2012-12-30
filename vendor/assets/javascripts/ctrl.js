define(['jquery'], function ($) {

  var decodeEntities = function (obj) {
    var div = $('<div></div>', {html: obj})
    return div.text()
  }

  var preventingDefault = function (fn) {
    var ctx = this

    return function (e) {
      e.preventDefault()
      fn.apply(ctx, Array.prototype.slice.call(e))
    }
  }

  var viewProto = {
    autoBind: function () {
      var self = this

      if (!this.elem.find) return

      var dataBind = function (property) {
        return function () {
          var elem = $(this),
              attrName = elem.data('bind-' + property)

          self.model.on(['change', attrName].join(':'), function () {
            var attrVal = self.model.get(attrName)
            if (property === 'val') {
              elem.val(decodeEntities(attrVal))
            } else if (elem[property]) {
              elem[property](attrVal)
            } else {
              elem.attr(property, attrVal)
            };
          })
        }
      }

      this.elem
        .find('[data-bind-text]').each(dataBind('text')).end()
        .find('[data-bind-html]').each(dataBind('html')).end()
        .find('[data-bind-val]').each(dataBind('val')).end()
        .find('[data-bind-src]').each(dataBind('src')).end()
        .find('[data-bind-href]').each(dataBind('href')).end()

    },

    bindToModel: function () {
      this._modelEvents.forEach(function (eventDetails) {
        var eventName = eventDetails[0],
            callbackNames = eventDetails.slice(1)

        callbackNames.forEach(function (callbackName) {
          var callback = this[callbackName]
          if (!callback) throw "No method called `" + callbackName + "` is defined in view `" + this.name + "`"

          this.model.on(eventName, callback, this)
        }, this)

      }, this)

      if (this.model && this.model.on) this.model.on('destroy', this.destroy, this)
    },

    addBehaviour: function () {
      this._domEvents.forEach(function (eventDetails) {
        var eventDetailsCopy = eventDetails.slice(),
            givenMethodName = eventDetailsCopy.pop(),
            preventDefaultRegex = /^!/,
            methodName = givenMethodName,
            callback

        if (typeof givenMethodName === 'string') {
          if (givenMethodName.match(preventDefaultRegex)) {
            methodName = givenMethodName.replace(preventDefaultRegex, '')
          }

          if (!this[methodName]) {
            throw "No method called `" + methodName + "` is defined in view `" + this.name + "`"
          }

          callback = this[methodName].bind(this)
          if (givenMethodName.match(preventDefaultRegex)) {
            callback = preventingDefault(callback)
          }

        } else if (typeof givenMethodName === 'function') {
          callback = givenMethodName

        } else {
          throw new Error ('event handler must be a method name or a function')
        }

        eventDetailsCopy.push(callback)

        this.elem.on.apply(this.elem, eventDetailsCopy)
      }, this)
    },

    render: function () {
      var presenter = this.presenter
      if (this.template) this.elem.html(this.template(presenter(this.model, this)))
      if (this.afterRender) this.afterRender()
      this.autoBind()
      return this.elem
    },

    initChildView: function (constructor, opts) {
      var view = new constructor (opts)
      this.childViews.push(view)
      return view
    },

    renderChildView: function (constructor, opts) {
      var view = this.initChildView(constructor, opts)
      view.render()
      return view
    },

    destroy: function () {
      this._modelEvents.forEach(function (eventDetails) {
        var eventName = eventDetails[0],
            callbackNames = eventDetails.slice(1),
            callback

        callbackNames.forEach(function (callbackName) {
          callback = this[callbackName]
          this.model.off(eventName, callback, this)
        }, this)
      }, this)

      // also clean up any child views that this view may have
      this.childViews.forEach(function (childView) {
        childView.destroy()
      })

      this.elem.off().remove()
    },

    include: function (obj) {
      $.extend(this, obj)
    },

    on: function (eventName, handler) {
      if (!this._events[eventName]) this._events[eventName] = []
      this._events[eventName].push(handler)
    },

    emit: function (eventName) {
      if (this._events[eventName]) {
        this._events[eventName].forEach(function (handler) { handler.call(this, this)}, this)
      }
    },

    __debug__: function () {
      console.log('debug', arguments)
    }
  }

  var basicPresenter = function (model) {
    return model.toJSON()
  }

  var Factory = function (viewName) {
    this._viewName = viewName
    this._domEvents = []
    this._modelEvents = []
    this._afterInitialize = $.noop
    this._afterRender = $.noop
    this._presenter = basicPresenter
    this._include = {}
  }

  Factory.prototype = {
    toView: function () {
      var self = this

      var View = function (settings) {
        this.name = self._viewName
        this.elem = settings.elem || $('<div>')
        this.model = settings.model
        this.options = settings
        this.presenter = self._presenter
        this.template = self._template
        this._events = {}
        this._domEvents = self._domEvents
        this._modelEvents = self._modelEvents
        this.childViews = []
        this.addBehaviour()
        this.bindToModel()
        this.autoBind()
        self._afterInitialize.call(this)
        this.afterRender = self._afterRender
      }

      $.extend(View.prototype, viewProto, self._include)

      return View
    }
  }

  ;(['domEvent', 'modelEvent']).forEach(function (methodName) {
    Factory.prototype[methodName] = function () {
      var property = '_' + methodName + 's',
          args = Array.prototype.slice.call(arguments)

      this[property].push(args)
      return this
    }
  })

  ;(['presenter', 'template', 'afterInitialize', 'afterRender', 'include']).forEach(function (methodName) {
    Factory.prototype[methodName] = function (obj) {
      var property = '_' + methodName
      this[property] = obj
    }
  })

  return function (name, fn) {
    var factory = new Factory (name)
    if (fn && fn.call) fn.call(factory, factory)
    return factory.toView()
  }
})
