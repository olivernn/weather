/*  js-model JavaScript library, version 1.0.0.beta1
 *  (c) 2010-2011 Ben Pickles
 *
 *  Released under MIT license.
 */
var Model = function(name, func) {
  var model = Model.Model.extend()
  model._name = name

  // Generate a model-specific Collection subclass.
  var Collection = model.Collection = Model.Collection.extend()

  // Assign a default collection to the model and have it auto add/remove a
  // model on save/destroy.
  model.collection = new Collection()
  model.collection.listenTo(model.anyInstance)

  if (Model.Utils.isFunction(func)) {
    func.call(model, model, model.prototype, Collection.prototype)
  }

  return model;
};
Model.VERSION = "1.0.0.beta1";
Model.Utils = {
  extend: function(receiver) {
    var objs = Array.prototype.slice.call(arguments, 1)

    for (var i = 0, length = objs.length; i < length; i++) {
      for (var property in objs[i]) {
        receiver[property] = objs[i][property]
      }
    }

    return receiver
  },

  inherits: function(parent) {
    var ctor = function() {}
    ctor.prototype = parent.prototype

    var child = function() {
      parent.apply(this, arguments)
    }

    child.prototype = new ctor()
    child.prototype.constructor = child

    return child
  },

  isFunction: function(obj) {
    return Object.prototype.toString.call(obj) === "[object Function]"
  }
}
;(function(Model) {
  var EventEmitter = Model.EventEmitter = function() {}

  function prepareEvent(name) {
    if (!this._events) this._events = {}
    if (!this._events[name]) this._events[name] = []
    return this._events[name]
  }

  EventEmitter.prototype.off = function(name, callback, scope) {
    var events = prepareEvent.call(this, name)

    if (callback) {
      for (var i = events.length - 1; i >= 0; i--) {
        var cb = events[i].callback
        var scp = events[i].scope

        if (cb === callback && scp === scope) {
          events.splice(i, 1)
        }
      }
    } else {
      delete this._events[name]
    }

    return this
  }

  EventEmitter.prototype.on = function(name, callback, scope) {
    prepareEvent.call(this, name).push({ callback: callback, scope: scope })
    return this
  }

  EventEmitter.prototype.emit = function(name) {
    var args = Array.prototype.slice.call(arguments, 1)
    var events = prepareEvent.call(this, name).slice()

    for (var i = 0, length = events.length; i < length; i++) {
      var callback = events[i].callback
      var scope = events[i].scope || this
      callback.apply(scope, args)
    }

    return this
  }
})(Model);
Model.UID = {
  counter: 0,

  generate: function() {
    return [new Date().valueOf(), this.counter++].join("-")
  },

  reset: function() {
    this.counter = 0
    return this
  }
};
;(function(Model) {
  Model.Model = function(attributes) {
    this.attributes = Model.Utils.extend({}, attributes)
    this.changes = {}
    this.errors = new Model.Errors(this)
    this.uid = [name, Model.UID.generate()].join("-")
    if (Model.Utils.isFunction(this.initialize)) this.initialize()
    this.emit("initialize", this)
  }

  Model.Model.extend = function() {
    var child = Model.Utils.inherits(this)
    child.anyInstance = new Model.EventEmitter()
    child.persistence = Model.NullPersistence
    child.unique_key = "id"
    Model.Utils.extend(child, Model.ClassMethods)
    return child
  }

  function set(name, value) {
    var from = this.get(name)

    // Don't write to attributes yet, store in changes for now.
    if (this.attributes[name] === value) {
      // Clean up any stale changes.
      delete this.changes[name]
    } else {
      this.changes[name] = value
    }

    if (from !== value) this.emit("change:" + name, this, from, value)
  }

  Model.Model.prototype = {
    destroy: function(callback) {
      var self = this

      this.constructor.persistence.destroy(this, function(success) {
        if (success) {
          self.emit("destroy", self)
        }

        if (callback) callback.apply(this, arguments)
      })

      return this
    },

    emit: function() {
      var anyInstance = this.constructor.anyInstance
      if (anyInstance) anyInstance.emit.apply(anyInstance, arguments)
      Model.EventEmitter.prototype.emit.apply(this, arguments)
    },

    get: function(name) {
      if (arguments.length) {
        // Changes take precedent over attributes.
        return (name in this.changes) ?
          this.changes[name] :
          this.attributes[name]
      } else {
        // Combined attributes/changes object.
        return Model.Utils.extend({}, this.attributes, this.changes)
      }
    },

    id: function() {
      return this.attributes[this.constructor.unique_key]
    },

    newRecord: function() {
      return this.constructor.persistence.newRecord(this)
    },

    off: Model.EventEmitter.prototype.off,
    on: Model.EventEmitter.prototype.on,

    reset: function() {
      this.errors.clear()
      this.changes = {}
      return this
    },

    save: function(callback) {
      if (this.valid()) {
        var self = this

        this.constructor.persistence.save(this, function(success) {
          if (success) {
            Model.Utils.extend(self.attributes, self.changes)
            self.reset()
            self.emit("save", self)
          }

          if (callback) callback.apply(self, arguments)
        })
      } else if (callback) {
        callback(false)
      }

      return this
    },

    set: function(name, value) {
      if (arguments.length == 2) {
        set.call(this, name, value)
      } else if (typeof name == "object") {
        // Mass-assign attributes.
        for (var key in name) {
          set.call(this, key, name[key])
        }
      }

      this.emit("change", this)

      return this
    },

    toJSON: function() {
      return this.get()
    },

    valid: function() {
      this.errors.clear()
      this.validate()
      return this.errors.size() === 0
    },

    validate: function() {
      return this
    }
  }
})(Model);
Model.ClassMethods = {
  find: function(id) {
    return this.collection.detect(function(model) {
      return model.id() == id
    })
  },

  load: function(callback) {
    var self = this

    this.persistence.read(function(models) {
      for (var i = 0, length = models.length; i < length; i++) {
        self.collection.add(models[i])
      }

      if (callback) callback.call(self, models)
    })

    return this
  },

  use: function(plugin) {
    var args = Array.prototype.slice.call(arguments, 1)
    args.unshift(this)
    plugin.apply(this, args)
    return this
  }
};

;(['on', 'off', 'emit']).forEach(function (methodName) {
  Model.ClassMethods[methodName] = Model.EventEmitter.prototype[methodName]
})

Model.Errors = function(model) {
  this.errors = {};
  this.model = model;
};

Model.Errors.prototype = {
  add: function(attribute, message) {
    if (!this.errors[attribute]) this.errors[attribute] = [];
    this.errors[attribute].push(message);
    return this
  },

  all: function() {
    return this.errors;
  },

  clear: function() {
    this.errors = {};
    return this
  },

  each: function(func) {
    for (var attribute in this.errors) {
      for (var i = 0; i < this.errors[attribute].length; i++) {
        func.call(this, attribute, this.errors[attribute][i]);
      }
    }
    return this
  },

  on: function(attribute) {
    return this.errors[attribute] || [];
  },

  size: function() {
    var count = 0;
    this.each(function() { count++; });
    return count;
  }
};
;(function(Model) {
  var Collection = Model.Collection = function(array) {
    array = array || []

    this.length = 0
    this.models = []

    for (var i = 0, length = array.length; i < length; i++) {
      this.push(array[i])
    }
  }

  Collection.extend = function() {
    return Model.Utils.inherits(this)
  }

  var methods = [
    // name      chainable?   enumerable?  updateLength?
    "every",       false,       true,         false,
    "filter",      true,        true,         false,
    "forEach",     false,       true,         false,
    "indexOf",     false,       false,        false,
    "lastIndexOf", false,       false,        false,
    "map",         false,       true,         false,
    "pop",         false,       false,        true,
    "push",        false,       false,        true,
    "reverse",     true,        false,        false,
    "shift",       false,       false,        true,
    "some",        false,       true,         false,
    "sort",        true,        false,        false,
    "splice",      true,        false,        true,
    "unshift",     false,       false,        true
  ]

  for (var i = 0; i < methods.length; i += 4) {
    (function(name, clone, enumerable, updateLength) {
      Collection.prototype[name] = function(callback, context) {
        var self = this
          , models = this.models
          , value

        if (enumerable) {
          // Ensure enumerable method callbacks are passed this collection as
          // as the third argument instead of the `this.models` array.
          value = models[name](function() {
            arguments[2] = self
            return callback.apply(this, arguments)
          }, context)
        } else {
          value = models[name].apply(models, arguments)
        }

        if (updateLength) this.length = this.models.length

        // Ensure appropriate methods return another collection instance.
        return clone ? this.clone(value) : value
      }
    })(methods[i], methods[i + 1], methods[i + 2], methods[i + 3])
  }

  Collection.prototype.add = function(model) {
    if (!~this.indexOf(model)) {
      var length = this.push(model)
      this.emit("add", model)
      return length
    }
  }

  Collection.prototype.at = function(index) {
    return this.models[index]
  }

  Collection.prototype.clone = function(collection) {
    return new this.constructor(collection)
  }

  Collection.prototype.detect = function(callback, context) {
    var i = 0
      , length = this.length
      , collection = this
      , model

    for (; i < length; i++) {
      model = this.at(i)
      if (callback.call(context, model, i, collection)) return model
    }
  }

  Collection.prototype.first = function() {
    return this.at(0)
  }

  Collection.prototype.last = function() {
    return this.at(this.length - 1)
  }

  Collection.prototype.listenTo = function(emitter) {
    emitter
      .on("save",    this.add,    this)
      .on("destroy", this.remove, this)
  }

  Collection.prototype.pluck = function(attribute) {
    return this.map(function(model) {
      return model.get(attribute)
    })
  }

  Collection.prototype.remove = function(model) {
    var index = this.indexOf(model)

    if (~index) {
      this.splice(index, 1)
      this.emit("remove", model)
      return this.length
    }
  }

  Collection.prototype.sortBy = function(attribute_or_func) {
    var is_func = Model.Utils.isFunction(attribute_or_func)
    var extract = function(model) {
      return attribute_or_func.call(model)
    }

    return this.sort(function(a, b) {
      var a_attr = is_func ? extract(a) : a.get(attribute_or_func)
      var b_attr = is_func ? extract(b) : b.get(attribute_or_func)

      if (a_attr < b_attr) {
        return -1
      } else if (a_attr > b_attr) {
        return 1
      } else {
        return 0
      }
    })
  }

  var nav = function (stepper) {
    return function (fn) {
      var currentItem = this.detect(fn),
          currentItemIndex = this.indexOf(currentItem),
          newIndex = stepper(currentItemIndex)

      return this.at(newIndex)
    }
  }

  Collection.prototype.next = nav(function (idx) { return idx + 1})
  Collection.prototype.prev = nav(function (idx) { return idx - 1})

  Collection.prototype.empty = function () {
    this.models = []
    this.length = 0
  }

  Collection.prototype.toArray = function() {
    return this.models.slice()
  }

  Collection.prototype.toJSON = function() {
    return this.map(function(model) {
      return model.toJSON()
    })
  }

  Collection.prototype.on   = Model.EventEmitter.prototype.on
  Collection.prototype.off  = Model.EventEmitter.prototype.off
  Collection.prototype.emit = Model.EventEmitter.prototype.emit
})(Model);
Model.Log = function() {
  if (window.console) window.console.log.apply(window.console, arguments);
};
;(function(Model) {
  Model.REST = function(klass, resource, methods) {
    klass.persistence = new Model.REST.Persistence(klass, resource, methods)
  }

  var PARAM_NAME_MATCHER = /:([\w\d]+)/g

  var persistence = Model.REST.Persistence = function(klass, resource, methods) {
    this.klass = klass
    this.resource = resource
    this.resource_param_names = []

    var param_name

    while ((param_name = PARAM_NAME_MATCHER.exec(resource)) !== null) {
      this.resource_param_names.push(param_name[1])
    }

    for (var name in methods) {
      this[name] = methods[name]
    }
  }

  Model.Utils.extend(persistence.prototype, {
    create: function(model, callback) {
      return this.xhr('POST', this.create_path(model), model, callback);
    },

    create_path: function(model) {
      return this.path(model);
    },

    destroy: function(model, callback) {
      return this.xhr('DELETE', this.destroy_path(model), model, callback);
    },

    destroy_path: function(model) {
      return this.update_path(model);
    },

    newRecord: function(model) {
      return !model.id()
    },

    params: function(model) {
      var params;
      if (model) {
        var attributes = model.toJSON()
        delete attributes[model.constructor.unique_key];
        params = {};
        params[model.constructor._name.toLowerCase()] = attributes;
      } else {
        params = null;
      }
      if(jQuery.ajaxSettings.data){
        params = Model.Utils.extend({}, jQuery.ajaxSettings.data, params)
      }
      return JSON.stringify(params)
    },

    path: function(model) {
      var path = this.resource
      jQuery.each(this.resource_param_names, function(i, param) {
        path = path.replace(":" + param, model.attributes[param]);
      });
      return path;
    },

    read: function(callback) {
      var klass = this.klass

      return this.xhr("GET", this.read_path(), null, function(success, xhr, data) {
        data = jQuery.makeArray(data)
        var models = []

        for (var i = 0, length = data.length; i < length; i++) {
          models.push(new klass(data[i]))
        }

        callback(models)
      })
    },

    read_path: function() {
      return this.resource
    },

    save: function(model, callback) {
      var method = this.newRecord(model) ? "create" : "update"
      return this[method](model, callback)
    },

    update: function(model, callback) {
      return this.xhr('PUT', this.update_path(model), model, callback);
    },

    update_path: function(model) {
      return [this.path(model), model.id()].join('/');
    },

    xhr: function(method, url, model, callback) {
      var self = this;
      var data = method == 'GET' ? undefined : this.params(model);

      return jQuery.ajax({
        type: method,
        url: url,
        contentType: "application/json",
        dataType: "json",
        data: data,
        dataFilter: function(data, type) {
          return /\S/.test(data) ? data : undefined;
        },
        complete: function(xhr, textStatus) {
          self.xhrComplete(xhr, textStatus, model, callback)
        }
      });
    },

    xhrComplete: function(xhr, textStatus, model, callback) {
      // Allow custom handlers to be defined per-HTTP status code.
      var handler = Model.REST["handle" + xhr.status]
      if (handler) handler.call(this, xhr, textStatus, model)

      var success = textStatus === "success"
      var data = Model.REST.parseResponseData(xhr)

      // Remote data is the definitive source, update model.
      if (success && model && data) model.set(data)

      if (callback) callback.call(model, success, xhr, data)
    }
  })

  // Rails' preferred failed validation response code, assume the response
  // contains errors and replace current model errors with them.
  Model.REST.handle422 = function(xhr, textStatus, model) {
    var data = Model.REST.parseResponseData(xhr);

    if (data) {
      model.errors.clear()

      for (var attribute in data) {
        for (var i = 0; i < data[attribute].length; i++) {
          model.errors.add(attribute, data[attribute][i])
        }
      }
    }
  };

  Model.REST.parseResponseData = function(xhr) {
    try {
      return /\S/.test(xhr.responseText) ?
        jQuery.parseJSON(xhr.responseText) :
        undefined;
    } catch(e) {
      Model.Log(e);
    }
  };
})(Model);
Model.NullPersistence = {
  destroy: function(model, callback) {
    callback(true)
  },

  newRecord: function(model) {
    return false
  },

  read: function(callback) {
    callback([])
  },

  save: function(model, callback) {
    callback(true)
  }
}
;(function(Model) {
  Model.localStorage = function(klass) {
    klass.persistence = new Model.localStorage.Persistence(klass)
  }

  var persistence = Model.localStorage.Persistence = function(klass) {
    this.klass = klass
    this.collection_id = [klass._name, "collection"].join("-")
  }

  var del = function(key) {
    localStorage.removeItem(key)
  }

  var get = function(key) {
    var data = localStorage.getItem(key)
    return data && JSON.parse(data)
  }

  var set = function(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  }

  var sadd = function(key, member) {
    var members = get(key) || []

    if (!~members.indexOf(member)) {
      members.push(member)
      set(key, members)
    }
  }

  var srem = function(key, member) {
    var members = get(key) || []
    var index = members.indexOf(member)

    if (~index) {
      members.splice(index, 1)
      set(key, members)
    }
  }

  Model.Utils.extend(persistence.prototype, {
    destroy: function(model, callback) {
      del(model.uid)
      srem(this.collection_id, model.uid)
      if (callback) callback(true)
    },

    newRecord: function(model) {
      var uids = get(this.collection_id) || []
      return ~uids.indexOf(model.uid)
    },

    read: function(callback) {
      if (!callback) return

      var existing_uids = this.klass.collection.map(function(model) {
        return model.uid
      })
      var uids = get(this.collection_id) || []
      var models = []
      var attributes, model, uid

      for (var i = 0, length = uids.length; i < length; i++) {
        uid = uids[i]

        if (!~existing_uids.indexOf(uid)) {
          attributes = get(uid)
          model = new this.klass(attributes)
          model.uid = uid
          models.push(model)
        }
      }

      callback(models)
    },

    save: function(model, callback) {
      set(model.uid, model)
      sadd(this.collection_id, model.uid)
      callback(true)
    }
  })
})(Model);
;(function(Model) {
  Model.Indexer = function(collection, attribute) {
    this.collection = collection
    this.attribute = attribute
    this.index = {}
    this.collection.on("add", this.add, this)
    this.collection.on("remove", this.remove, this)
    this.collection.forEach(this.add, this)
  }

  Model.Indexer.prototype.add = function(model) {
    this.get(this.toKey(model)).add(model)
    model.on("change:" + this.attribute, this.change, this)
  }

  Model.Indexer.prototype.change = function(model, from, to) {
    this.get(from).remove(model)
    this.get(to).add(model)
  }

  Model.Indexer.prototype.get = function(key) {
    return this.index[key] || (this.index[key] = new Model.Collection())
  }

  Model.Indexer.prototype.remove = function(model) {
    this.get(this.toKey(model)).remove(model)
    model.off("change:" + this.attribute, this.change, this)
  }

  Model.Indexer.prototype.toKey = function(model) {
    return model.get(this.attribute)
  }
})(Model);

define(function (dependencies) {
  return Model
})
