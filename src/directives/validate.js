import { warn, attr, each } from '../util'


export default function (Vue) {
  
  const _ = Vue.util
  const vModel = Vue.directive('model')

  Vue.directive('validate', {
    priority: vModel.priority + 1,
    params: ['group', 'field'],

    bind () {
      let vm = this.vm
      let validatorName = vm.$options._validator
      if (!validatorName) {
        // TODO: should be implemented error message
        warn('TODO: should be implemented error message')
        return
      }

      let validator = this.validator = this.vm._validatorMaps[validatorName]

      let field = this.field = _.camelize(this.arg ? this.arg : this.params.field)
      let validation = this.validation = validator.manageValidation(field, vm, this.el)

      if (this.params.group) {
        validator.addGroupValidation(this.params.group, this.field)
      }

      let model = attr(this.el, 'v-model')
      this.on('blur', _.bind(validation.listener, validation))
      if ((this.el.type === 'checkbox' 
          || this.el.type === 'radio' 
          || this.el.tagName === 'SELECT') && !model) {
        this.on('change', _.bind(validation.listener, validation))
      } else {
        if (!model) {
          this.on('input', _.bind(validation.listener, validation))
        }
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

        this.validator.unmanageValidation(this.field, this.el)
        this.validator = null
        this.validation = null
      }
    }
  })
}
