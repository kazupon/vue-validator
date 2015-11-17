import { warn, each } from '../util'
import Validation from '../validation'


export default function (Vue) {
  
  const _ = Vue.util

  Vue.directive('validate', {
    params: ['group'],

    bind () {
      console.log('validate:bind', this, this.arg)

      let vm = this.vm
      let validatorName = vm.$options._validator
      if (!validatorName) {
        // TODO: should be implemented error message
        _.warn('TODO: should be implemented error message')
        return
      }

      let validator = this.validator = this.vm._validatorMaps[validatorName]
      let validation = this.validation = new Validation(this)
      validator.addValidation(validation)

      if (this.params.group) {
        validator.addGroupValidation(this.params.group, validation)
      }

      this.on('blur', _.bind(this.validation.listener, this.validation))
      this.on('input', _.bind(this.validation.listener, this.validation))
    },

    update (value, old) {
      console.log('validate:update', this.arg, value, old, typeof value, this)
      if (!value) {
        return
      }

      if (_.isPlainObject(value)) {
        this.handleObject(value)
      } else {
        this.handleSingle(value)
      }

      this.validator.validate(this.validation)
    },

    handleSingle (value) {
      let validateKey = Object.keys(this.validation.validates)[0]
      this.validation.updateValidate(validateKey, value)
    },

    handleObject (value) {
      each(value, (val, key) => {
        this.validation.updateValidate(key, val)
      }, this)
    },

    unbind () {
      console.log('validate:unbind', this)

      if (this.validator && this.validation) {
        if (this.params.group) {
          this.validator.removeGroupValidation(this.params.group, this.validation)
        }
        this.validator.removeValidation(this.validation)
        this.validator = null
        this.validation = null
      }
    }
  })
}
