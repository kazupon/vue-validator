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
      var self = this
      var vm = this.vm

      if (!vm[componentName]) {
        vm[componentName] = vm.$addChild({
          validator: vm.$options.validator
        }, Vue.extend(require('./lib/validator')))
      }

      var $validator = vm[componentName]
      var el = this.el
      var validation = $validator._getValidationNamespace('validation')
      var keypath = this._keypath = this._parseModelAttribute(el.getAttribute(Vue.config.prefix + 'model'))
      var validator = this.arg ? this.arg : this.expression
      var arg = this.arg ? this.expression : null
      var init = el.getAttribute('value') || vm.$get(keypath)
      var readyEvent = el.getAttribute('wait-for')

      if (readyEvent && !$validator._isRegistedReadyEvent(keypath)) {
        $validator._addReadyEvents(keypath, this._checkParam('wait-for'))
      }
      
      if (!$validator._isRegistedReadyEvent(keypath)) {
        this._setupValidator($validator, keypath, validation, validator, arg, init)
      } else {
        vm.$once($validator._getReadyEvents(keypath), function (prop, val) {
          vm.$set(prop, val)
          self._setupValidator($validator, keypath, validation, validator, arg, val)
        })
      }
    },

    unbind: function () {
      var vm = this.vm
      var keypath = this._keypath
      var validator = this.arg ? this.arg : this.expression
      var $validator = vm[componentName]

      $validator._deleteManagedValidator(keypath, validator)
      $validator._undefineValidatorToValidationScope(keypath, validator)
      $validator._undefineModelValidationScope(keypath)

      if (!$validator._isManagedValidator()) {
        $validator.$destroy()
        vm[componentName] = null
        delete vm[componentName]
      }
    },

    _setupValidator: function ($validator, keypath, validation, validator, arg, init) {
      if (!getVal($validator[validation], keypath)) {
        $validator._defineModelValidationScope(keypath, init)
      }

      if (!getVal($validator[validation], [keypath, validator].join('.'))) {
        $validator._defineValidatorToValidationScope(keypath, validator)
        $validator._addValidators(keypath, validator, arg)
      }

      $validator._addManagedValidator(keypath, validator)

      $validator._doValidate(keypath, init, $validator.$get(keypath))
    },

    _parseModelAttribute: function (attr) {
      var res = Vue.parsers.directive.parse(attr)
      return res[0].arg ? res[0].arg : res[0].expression
    }
  })
}
