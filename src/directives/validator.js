import { warn, attr } from '../util'
import Validator from '../validator'


export default function (Vue) {
  const _ = Vue.util
  const FragmentFactory = Vue.FragmentFactory
  const vIf = Vue.directive('if')

  Vue.elementDirective('validator', {
    params: ['name'],

    bind () {
      console.log('validator:bind', this)

      if (!this.params.name) {
        // TODO: should be implemented validator:bind name params nothing error'
        _.warn('TODO: should be implemented validator:bind name params nothing error')
        return
      }

      let validatorName = this.validatorName = '$' + this.params.name
      if (!this.vm._validatorMaps) {
        // TODO: should be implemented error message'
        _.warn('TODO: should be implemented error message')
        return
      }

      let validator = this.validator = new Validator(validatorName, this)
      _.defineReactive(this.vm, validatorName, validator.scope)
      validator.setupScope()
      this.vm._validatorMaps[validatorName] = validator

      this.anchor = _.createAnchor('vue-validator')
      _.replace(this.el, this.anchor)
      this.insert(validatorName)

      this.vm.$on('hook:compiled', () => {
        validator.validate()
      })
    },

    insert (name) {
      _.extend(this.vm.$options, { _validator: name })
      this.factory = new FragmentFactory(this.vm, this.el.innerHTML)
      vIf.insert.call(this)
    },

    unbind () {
      console.log('validator:unbind', this)

      vIf.unbind.call(this)

      if (this.vm._validatorMaps[this.validatorName]) {
        this.vm._validatorMaps[this.validatorName] = null
      }

      if (this.validatorName) {
        this.vm[this.validatorName] = null
        this.validatorName = null
        this.validator = null
      }
    }
  })
}
