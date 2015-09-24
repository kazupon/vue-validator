/**
 * Import(s)
 */

var validates = require('./validates')
var _ = require('./util')


/**
 * Export(s)
 */


/**
 * `v-validator` component with mixin
 */

module.exports = {
  inherit: true,

  created: function () {
    this._initValidationVariables()
    this._initOptions()
    this._mixinCustomValidates()
    this._defineProperties()
    this._defineValidationScope()
  },

  methods: {
    _getValidationNamespace: function (key) {
      return this._namespace[key]
    },

    _initValidationVariables: function () {
      this._validators = {}
      this._validates = {}
      this._initialValues = {}
      for (var key in validates) {
        this._validates[key] = validates[key]
      }
      this._validatorWatchers = {}
      this._readyEvents = {}
    },

    _initOptions: function () {
      this._namespace = getCustomNamespace(this.$options)
      this._namespace.validation = this._namespace.validation || 'validation'
      this._namespace.valid = this._namespace.valid || 'valid'
      this._namespace.invalid = this._namespace.invalid || 'invalid'
      this._namespace.dirty = this._namespace.dirty || 'dirty'
    },

    _mixinCustomValidates: function () {
      var customs = _.getCustomValidators(this.$options)
      for (var key in customs) {
        this._validates[key] = customs[key]
      }
    },

    _defineValidProperty: function (target, getter) {
      Object.defineProperty(target, this._getValidationNamespace('valid'), {
        enumerable: true,
        configurable: true,
        get: getter
      })
    },

    _undefineValidProperty: function (target) {
      delete target[this._getValidationNamespace('valid')]
    },

    _defineInvalidProperty: function (target) {
      var self = this
      Object.defineProperty(target, this._getValidationNamespace('invalid'), {
        enumerable: true,
        configurable: true,
        get: function () {
          return !target[self._getValidationNamespace('valid')]
        }
      })
    },

    _undefineInvalidProperty: function (target) {
      delete target[this._getValidationNamespace('invalid')]
    },

    _defineDirtyProperty: function (target, getter) {
      Object.defineProperty(target, this._getValidationNamespace('dirty'), {
        enumerable: true,
        configurable: true,
        get: getter
      })
    },

    _undefineDirtyProperty: function (target) {
      delete target[this._getValidationNamespace('dirty')]
    },

    _defineProperties: function () {
      var self = this

      var walk = function (obj, propName, namespaces) {
        var ret = false
        var keys = Object.keys(obj)
        var i = keys.length
        var key, last
        while (i--) {
          key = keys[i]
          last = obj[key]
          if (!(key in namespaces) && typeof last === 'object') {
            ret = walk(last, propName, namespaces)
            if ((propName === self._getValidationNamespace('valid') && !ret) ||
                (propName === self._getValidationNamespace('dirty') && ret)) {
              break
            }
          } else if (key === propName && typeof last !== 'object') {
            ret = last
            if ((key === self._getValidationNamespace('valid') && !ret) ||
                (key === self._getValidationNamespace('dirty') && ret)) {
              break
            }
          }
        }
        return ret
      }

      this._defineValidProperty(this.$parent, function () {
        var validationName = self._getValidationNamespace('validation')
        var validName = self._getValidationNamespace('valid')
        return walk(this[validationName], validName, self._namespace)
      })

      this._defineInvalidProperty(this.$parent)

      this._defineDirtyProperty(this.$parent, function () {
        var validationName = self._getValidationNamespace('validation')
        var dirtyName = self._getValidationNamespace('dirty')
        return walk(this[validationName], dirtyName, self._namespace)
      })
    },

    _undefineProperties: function () {
      this._undefineDirtyProperty(this.$parent)
      this._undefineInvalidProperty(this.$parent)
      this._undefineValidProperty(this.$parent)
    },

    _defineValidationScope: function () {
      this.$parent.$add(this._getValidationNamespace('validation'), {})
    },

    _undefineValidationScope: function () {
      var validationName = this._getValidationNamespace('validation')
      this.$parent.$delete(validationName)
    },

    _defineModelValidationScope: function (keypath) {
      var self = this
      var validationName = this._getValidationNamespace('validation')
      var dirtyName = this._getValidationNamespace('dirty')

      var keys = keypath.split('.')
      var last = this[validationName]
      var obj, key
      for (var i = 0; i < keys.length; i++) {
        key = keys[i]
        obj = last[key]
        if (!obj) {
          obj = {}
          last.$add(key, obj)
        }
        last = obj
      }
      last.$add(dirtyName, false)

      this._defineValidProperty(last, function () {
        var ret = true
        var validators = self._validators[keypath]
        var i = validators.length
        var validator
        while (i--) {
          validator = validators[i]
          if (last[validator.name]) {
            ret = false
            break
          }
        }
        return ret
      })
      this._defineInvalidProperty(last)
      
      this._validators[keypath] = []

      this._watchModel(keypath, function (val, old) {
        self._updateDirtyProperty(keypath, val)
        self._validators[keypath].forEach(function (validator) {
          self._doValidate(keypath, validator.name, val)
        })
      })
    },

    _undefineModelValidationScope: function (keypath, validator) {
      if (this.$parent) {
        var targetPath = [this._getValidationNamespace('validation'), keypath].join('.')
        var target = this.$parent.$get(targetPath)
        if (target && Object.keys(target).length === 3 &&
            this._getValidationNamespace('valid') in target &&
            this._getValidationNamespace('invalid') in target &&
            this._getValidationNamespace('dirty') in target) {
          this._unwatchModel(keypath)
          this._undefineDirtyProperty(target)
          this._undefineInvalidProperty(target)
          this._undefineValidProperty(target)
          removeValidationProperties(
            this.$parent.$get(this._getValidationNamespace('validation')),
            keypath
          )
        }
      }
    },

    _defineValidatorToValidationScope: function (keypath, validator) {
      var target = _.getTarget(this[this._getValidationNamespace('validation')], keypath)
      target.$add(validator, null)
    },

    _undefineValidatorToValidationScope: function (keypath, validator) {
      var validationName = this._getValidationNamespace('validation')
      if (this.$parent) {
        var targetPath = [validationName, keypath].join('.')
        var target = this.$parent.$get(targetPath)
        if (target) {
          target.$delete(validator)
        }
      }
    },

    _getInitialValue: function (keypath) {
      return this._initialValues[keypath]
    },

    _setInitialValue: function (keypath, val) {
      this._initialValues[keypath] = val
    },

    _addValidator: function (keypath, validator, arg) {
      this._validators[keypath].push({ name: validator, arg: arg })
    },

    _changeValidator: function (keypath, validator, arg) {
      var validators = this._validators[keypath]
      var i = validators.length
      while (i--) {
        if (validators[i].name === validator) {
          validators[i].arg = arg
          break
        }
      }
    },

    _findValidator: function (keypath, validator) {
      var found = null
      var validators = this._validators[keypath]
      var i = validators.length
      while (i--) {
        if (validators[i].name === validator) {
          found = validators[i]
          break
        }
      }
      return found
    },

    _watchModel: function (keypath, fn) {
      this._validatorWatchers[keypath] =
        this.$watch(keypath, fn, { deep: false, immediate: true })
    },

    _unwatchModel: function (keypath) {
      var unwatch = this._validatorWatchers[keypath]
      if (unwatch) {
        unwatch()
        delete this._validatorWatchers[keypath]
      }
    },
    
    _addReadyEvents: function (id, event) {
      this._readyEvents[id] = event
    },

    _getReadyEvents: function (id) {
      return this._readyEvents[id]
    },

    _isRegistedReadyEvent: function (id) {
      return id in this._readyEvents
    },

    _updateDirtyProperty: function (keypath, val) {
      var validationName = this._getValidationNamespace('validation')
      var dirtyName = this._getValidationNamespace('dirty')

      var target = _.getTarget(this[validationName], keypath)
      if (target) {
        target.$set(dirtyName, this._getInitialValue(keypath) !== val)
      }
    },

    _doValidate: function (keypath, validateName, val) {
      var validationName = this._getValidationNamespace('validation')

      var target = _.getTarget(this[validationName], keypath)
      var validator = this._findValidator(keypath, validateName)
      if (target && validator) {
        this._invokeValidator(
          this._validates[validateName],
          val, validator.arg,
          function (result) {
            target.$set(validateName, !result)
          })
      }
    },
    
    _invokeValidator: function (validator, val, arg, fn) {
      var future = validator.call(this, val, arg)
      if (typeof future === 'function') { // async
        if (future.resolved) {
          // cached
          fn(future.resolved)
        } else if (future.requested) {
          // pool callbacks
          future.pendingCallbacks.push(fn)
        } else {
          future.requested = true
          var fns = future.pendingCallbacks = [fn]
          future(function resolve () {
            future.resolved = true
            for (var i = 0, l = fns.length; i < l; i++) {
              fns[i](true)
            }
          }, function reject () {
            fn(false)
          })
        }
      } else { // sync
        fn(future)
      }
    }
  }
}

/**
 * Remove properties from target validation
 *
 * @param {Object} validation
 * @param {String} keypath
 */

function removeValidationProperties (validation, keypath) {
  var keys = keypath.split('.')
  var key, obj
  while (keys.length) {
    key = keys.pop()
    if (keys.length !== 0) {
      obj = _.getTarget(validation, keys.join('.'))
      obj.$delete(key)
    } else {
      validation.$delete(key)
    }
  }
}

/**
 * Get custom namespace
 *
 * @param {Object} options
 * @return {Object}
 */

function getCustomNamespace (options) {
  var namespace = {}
  var key
  var context
  do {
    if (options['validator'] && options['validator']['namespace']) {
      for (key in options['validator']['namespace']) {
        if (!namespace.hasOwnProperty(key)) {
          namespace[key] = options['validator']['namespace'][key]
        }
      }
    }
    context = options._context || options._parent
    if (context) {
      options = context.$options
    }
  } while (context || options._parent)
  return namespace
}
