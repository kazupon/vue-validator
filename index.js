/**
 * Import(s)
 */

var validates = require('./lib/validates')
var _ = require('./lib/util')


/**
 * Export(s)
 */

module.exports = install


/**
 * Install plugin
 */

function install (Vue, options) {
  options = options || {}
  var componentName = options.component = options.component || '$validator'
  var directiveName = options.directive = options.directive || 'validate'
  var path = Vue.parsers.path
  var util = Vue.util


  // custom validators merge strategy setting
  Vue.config.optionMergeStrategies.validator = function (parent, child, vm, k) {
    var validatorOptions = { validates: {}, namespace: {} }
    if (!parent && !child) {
      return validatorOptions
    } else if (!parent && child) {
      util.extend(validatorOptions['validates'], child['validates'])
      util.extend(validatorOptions['namespace'], child['namespace'])
      return validatorOptions
    } else if (parent && !child) {
      util.extend(validatorOptions['validates'], parent['validates'])
      util.extend(validatorOptions['namespace'], parent['namespace'])
      return validatorOptions
    } else if (parent && child) {
      var key
      if ('validates' in parent) {
        util.extend(validatorOptions['validates'], parent['validates'])
      }
      if ('namespace' in parent) {
        util.extend(validatorOptions['namespace'], parent['namespace'])
      }
      if ('validates' in child) {
        for (key in child['validates']) {
          if ('validates' in parent && !parent['validates'].hasOwnProperty(key)) {
            validatorOptions['validates'][key] = child['validates'][key]
          }
        }
      }
      if ('namespace' in child) {
        for (key in child['namespace']) {
          if ('namespace' in parent && !parent['namespace'].hasOwnProperty(key)) {
            validatorOptions['namespace'][key] = child['namespace'][key]
          }
        }
      }
      return validatorOptions
    } else {
      _.warn('unexpected validator option merge strategy')
      return validatorOptions
    }
  }


  function getVal (obj, keypath) {
    var ret = null
    try {
      ret = path.get(obj, keypath)
    } catch (e) { }
    return ret
  }


  Vue.directive(directiveName, {

    priority: 1024,

    bind: function () {
      var vm = this.vm
      var el = this.el
      var $validator = vm[componentName]
      var keypath = this._keypath = this._parseModelAttribute(el.getAttribute(Vue.config.prefix + 'model'))
      var validator = this.arg ? this.arg : this.expression
      var arg = this.arg ? this.expression : null

      var customs = _.getCustomValidators(vm.$options)
      if (!this._checkValidator(validator, validates, customs)) {
        _.warn("specified invalid '"
          + validator + "' validator at v-validate directive !! please check '"
          + validator + "' validator !!")
        this._ignore = true
        return
      }

      if (!$validator) {
        vm[componentName] = $validator = vm.$addChild(
          {}, // null option
          Vue.extend(require('./lib/validator'))
        )
      }

      var value = el.getAttribute('value')
      if (el.getAttribute('number') !== null) {
        value = util.toNumber(value)
      }
      this._init = value

      var validation = $validator._getValidationNamespace('validation')
      var init = value || vm.$get(keypath)
      var readyEvent = el.getAttribute('wait-for')

      if (readyEvent && !$validator._isRegistedReadyEvent(keypath)) {
        $validator._addReadyEvents(keypath, this._checkParam('wait-for'))
      }
      
      this._setupValidator($validator, keypath, validation, validator, el, arg, init)
    },

    update: function (val, old) {
      if (this._ignore) { return }

      var self = this
      var vm = this.vm
      var keypath = this._keypath
      var validator = this.arg ? this.arg : this.expression
      var $validator = vm[componentName]

      $validator._changeValidator(keypath, validator, val)
      if (!$validator._isRegistedReadyEvent(keypath)) { // normal
        this._updateValidator($validator, validator, keypath)
      } else { // wait-for
        vm.$once($validator._getReadyEvents(keypath), function (val) {
          $validator._setInitialValue(keypath, val)
          vm.$set(keypath, val)
          self._updateValidator($validator, validator, keypath)
        })
      }
    },

     
    unbind: function () {
      if (this._ignore) { return }

      var vm = this.vm
      var keypath = this._keypath
      var validator = this.arg ? this.arg : this.expression
      var $validator = vm[componentName]

      this._teardownValidator(vm, $validator, keypath, validator)
    },

    _parseModelAttribute: function (attr) {
      var res = Vue.parsers.directive.parse(attr)
      return res[0].arg ? res[0].arg : res[0].expression
    },

    _checkValidator: function (validator, validates, customs) {
      var items = Object.keys(validates).concat(Object.keys(customs))
      return items.some(function (item) {
        return item === validator
      })
    },

    _setupValidator: function ($validator, keypath, validation, validator, el, arg, init) {
      var vm = this.vm

      if (!getVal($validator[validation], keypath)) {
        $validator._defineModelValidationScope(keypath)
        if (el.tagName === 'INPUT' && el.type === 'radio') {
          if (getVal(vm, keypath) === init) {
            $validator._setInitialValue(keypath, init)
          }
        } else {
          $validator._setInitialValue(keypath, init)
        }
      }

      if (!getVal($validator[validation], [keypath, validator].join('.'))) {
        $validator._defineValidatorToValidationScope(keypath, validator)
        $validator._addValidator(keypath, validator, getVal(vm, arg) || arg)
      }
    },

    _updateValidator: function ($validator, validator, keypath) {
      var value = $validator.$get(keypath)
      var el = this.el

      if (this._init) {
        value = this._init
        delete this._init
      }

      if (el.tagName === 'INPUT' && el.type === 'radio') {
        if (value === $validator.$get(keypath)) {
          $validator._updateDirtyProperty(keypath, value)
        }
      } else {
        $validator._updateDirtyProperty(keypath, value)
      }

      $validator._doValidate(keypath, validator, $validator.$get(keypath))
    },

    _teardownValidator: function (vm, $validator, keypath, validator) {
      $validator._undefineValidatorToValidationScope(keypath, validator)
      $validator._undefineModelValidationScope(keypath, validator)
    }
  })
}
