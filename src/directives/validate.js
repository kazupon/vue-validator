import { warn, each } from '../util'


export default function (Vue) {
  
  const _ = Vue.util

  Vue.directive('validate', {
    params: ['group'],

    bind () {
      let vm = this.vm
      let validatorName = vm.$options._validator
      if (!validatorName) {
        // TODO: should be implemented error message
        warn('TODO: should be implemented error message')
        return
      }

      let validator = this.validator = this.vm._validatorMaps[validatorName]

      let field = this.field = _.camelize(this.arg)
      if (this.el.type === 'checkbox') {
        this.validation = validator.manageMultipleValidation(field, vm, this.el)
      } else if (this.el.type === 'radio') {
        this.validation = validator.manageRadioValidation(field, vm, this.el)
      } else {
        this.validation = validator.addValidation(field, vm, this.el)
      }
      let validation = this.validation

      if (this.params.group) {
        validator.addGroupValidation(this.params.group, this.field)
      }

      this.on('blur', _.bind(validation.listener, validation))
      if (this.el.type === 'checkbox' || this.el.type === 'radio') {
        this.on('change', _.bind(validation.listener, validation))
      } else {
        this.on('input', _.bind(validation.listener, validation))
      }
    },

    update (value, old) {
      if (!value) {
        return
      }

      if (_.isPlainObject(value)) {
        this.handleObject(value)
      } else if (Array.isArray(value)) {
        this.handleArray(value)
      }

      this.validator.validate(this.validation)
    },

    handleArray (value) {
      each(value, (val) => {
        this.validation.setValidation(val)
      }, this)
    },

    handleObject (value) {
      each(value, (val, key) => {
        if (_.isPlainObject(val)) {
          if ('rule' in val) {
            let msg = 'message' in val ? val.message : null
            this.validation.setValidation(key, val.rule, msg)
          }
        } else {
          this.validation.setValidation(key, val)
        }
      }, this)
    },

    unbind () {
      if (this.validator && this.validation) {
        if (this.params.group) {
          this.validator.removeGroupValidation(this.params.group, this.field)
        }

        if (this.el.type === 'checkbox') {
          this.validator.unmanageMultipleValidation(this.field, this.el)
        } else if (this.el.type === 'radio') {
          this.validator.unmanageRadioValidation(this.field, this.el)
        } else {
          this.validator.removeValidation(this.field)
        }
        this.validator = null
        this.validation = null
      }
    }
  })
}
