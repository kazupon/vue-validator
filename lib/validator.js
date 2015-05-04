/**
 * Import(s)
 */

var validates = require('./validates')


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
      return this.$options.validator.namespace[key]
    },

    _initValidationVariables: function () {
      this._validators = {}
      this._validates = {}
      for (var key in validates) {
        this._validates[key] = validates[key]
      }
    },

    _initOptions: function () {
      var validator = this.$options.validator = this.$options.validator || {}
      var namespace = validator.namespace = validator.namespace || {}
      namespace.validation = namespace.validation || 'validation'
      namespace.valid = namespace.valid || 'valid'
      namespace.invalid = namespace.invalid || 'invalid'
      namespace.dirty = namespace.dirty || 'dirty'
    },

    _mixinCustomValidates: function () {
      var customs = this.$options.validator.validates
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

    _defineProperties: function () {
      var self = this
      this._defineValidProperty(this.$parent, function () {
        var validationName = self._getValidationNamespace('validation')
        var validName = self._getValidationNamespace('valid')
        var namespaces = self.$options.validator.namespace

        var walkValid = function (obj) {
          var ret = true
          var keys = Object.keys(obj)
          var i = keys.length
          var key, last
          while (i--) {
            key = keys[i]
            last = obj[key]
            if (!(key in namespaces) && typeof last === 'object') {
              ret = walkValid(last)
              if (!ret) { break }
            } else if (key === validName && typeof last !== 'object') {
              ret = last
              if (!ret) { break }
            }
          }
          return ret
        }

        return walkValid(this[validationName])
      })

      this._defineInvalidProperty(this.$parent)
    },

    _defineValidationScope: function () {
      this.$parent.$add(this._getValidationNamespace('validation'), {})
    },

    _defineModelValidationScope: function (keypath, init) {
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
        self._doValidate(keypath, init, val)
      })
    },

    _defineValidatorToValidationScope: function (keypath, validator) {
      var target = getTarget(this[this._getValidationNamespace('validation')], keypath)
      target.$add(validator, null)
    },

    _addValidators: function (keypath, validator, arg) {
      this._validators[keypath].push({ name: validator, arg: arg })
    },

    _watchModel: function (key, fn) {
      this.$watch(key, fn, false, true)
    },

    _doValidate: function (keypath, init, val) {
      var self = this
      var validationName = this._getValidationNamespace('validation')
      var dirtyName = this._getValidationNamespace('dirty')

      var target = getTarget(this[validationName], keypath)
      target[dirtyName] = (init !== val)
      this._validators[keypath].forEach(function (validator) {
        target[validator.name] = 
          !self._validates[validator.name].call(self, val, validator.arg)
      })
    }
  }
}

/**
 * Get target validatable object
 *
 * @param {Object} validation
 * @param {String} keypath
 * @return {Object} validatable object
 */

function getTarget (validation, keypath) {
  var last = validation
  var keys = keypath.split('.')
  var key, obj
  for (var i = 0; i < keys.length; i++) {
    key = keys[i]
    obj = last[key]
    last = obj
  }
  return last
}
