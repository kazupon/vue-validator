import { warn, attr } from '../util'


export default function (Vue) {

  const _ = Vue.util
  const FragmentFactory = Vue.FragmentFactory
  const vIf = Vue.directive('if')

  Vue.elementDirective('validator', {
    params: ['name'],

    bind () {
      console.log('validator:bind', this)

      if (!this.params.name) {
        _.warn('TODO: should be implemented validator:bind name params nothing error')
        return
      }
      let validatorName = this.validatorName = '$' + this.params.name

      _.defineReactive(this.vm, validatorName, { a: 1 })

      this.anchor = _.createAnchor('vue-validator')
      _.replace(this.el, this.anchor)
      this.insert(validatorName)
    },
    
    insert (name) {
      _.extend(this.vm.$options, { _validator: name })
      this.factory = new FragmentFactory(this.vm, this.el.innerHTML)
      vIf.insert.call(this)
    },

    unbind () {
      console.log('validator:unbind', this)

      if (this.validatorName) {
        this.vm[this.validatorName] = null
        this.validatorName = null
      }
      
      vIf.unbind.call(this)
    }
  })
}
