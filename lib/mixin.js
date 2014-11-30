/**
 * Import(s)
 */

var validates = require('./validates')
var directive = require('./directive')


/**
 * Export `v-validator` component with mixin
 */

module.exports = {
  inherit: true,

  created: function () {
    this._initValidationVariables()
    this._initOptions()
    this._mixinCustomValidates()
    this._defineComputed()
    this._defineValidationScope()
    this._registerDirective()
  },

  methods: {
    _getValidationNamespace: function (key) {
      return this.$options.validator.namespace[key]
    },

    _initValidationVariables: function () {
      this._validators = {}
      this._validates = validates
    },

    _initOptions: function () {
      var validator = this.$options.validator = 
        (this.$parent && this.$parent.$options.validator) || {}
      var namespace = validator.namespace = validator.namespace || {}
      namespace.validation = namespace.validation || 'validation'
      namespace.valid = namespace.valid || 'valid'
      namespace.invalid = namespace.invalid || 'invalid'
      namespace.dirty = namespace.dirty || 'dirty'
      namespace.directive = namespace.directive || 'validate'
    },

    _mixinCustomValidates: function () {
      var validates = this.$options.validator.validates
      for (var key in validates) {
        this._validates[key] = validates[key]
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
          return !this[self._getValidationNamespace('valid')]
        }
      })
    },

    _defineComputed: function () {
      this._defineValidProperty(this, function () {
        var self = this
        var ret = true
        var validationName = this._getValidationNamespace('validation')
        var validName = this._getValidationNamespace('valid')

        Object.keys(this[validationName]).forEach(function (model) {
          if (!self[validationName][model][validName]) {
            ret = false
          }
        })
        return ret
      })

      this._defineInvalidProperty(this)
    },

    _defineValidationScope: function () {
      this.$add(this._getValidationNamespace('validation'), {})
    },

    _defineModelValidationScope: function (key, init) {
      var self = this
      var validationName = this._getValidationNamespace('validation')
      var dirtyName = this._getValidationNamespace('dirty')

      this[validationName].$add(key, {})
      this[validationName][key].$add(dirtyName, false)
      this._defineValidProperty(this[validationName][key], function () {
        var ret = true
        var validators = self._validators[key]
        validators.forEach(function (validator) {
          if (self[validationName][key][validator.name]) {
            ret = false
          }
        })
        return ret
      })
      this._defineInvalidProperty(this[validationName][key])
      
      this._validators[key] = []

      this._watchModel(key, function (val, old) {
        self[validationName][key][dirtyName] = (init !== val)
        var validators = self._validators[key]
        validators.forEach(function (validator) {
          self[validationName][key][validator.name] = 
            !validates[validator.name].call(self, val, validator.arg)
        })
      })
    },

    _defineValidatorToValidationScope: function (target, validator) {
      this[this._getValidationNamespace('validation')][target].$add(validator, null)
    },

    _addValidator: function (target, validator, arg) {
      this._validators[target].push({ name: validator, arg: arg })
    },

    _registerDirective: function () {
      this.$options.directives[this._getValidationNamespace('directive')] = directive
    },

    _watchModel: function (key, fn) {
      this.$watch(key, fn, false, true)
    }
  }
}
