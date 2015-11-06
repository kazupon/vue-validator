import { attr, warn } from '../util'
import Validation from '../validation'


export default function (Vue) {
  
  const _ = Vue.util

  Vue.directive('validate', {
    bind () {
      console.log('validate:bind', this)

      let el = this.el
      let vm = this.vm

      console.log('model', this.arg)

      this.validation = this.createValidation(this.fieldName, el.value, el)

      //_.on(el, 'blur', this._validation.listener.bind(this._validation))
      this.on('input', this.validation.listener.bind(this.validation))
    },

    createValidation (field, value, el) {
      let validation = new Validation(field, value, el)
      return validation
    },

    update (value, old) {
      console.log('validate:update', value, old, this, this.validator, this.validation)
    },

    unbind () {
      console.log('validate:unbind', this)

      if (this.validation) {
        this.validation = null
      }
    }
  })
}
