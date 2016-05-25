import { warn } from '../util'
import Validator from '../validator'


export default function (Vue) {
  const FragmentFactory = Vue.FragmentFactory
  const vIf = Vue.directive('if')
  const {
    isArray, isPlainObject, createAnchor,
    replace, extend, camelize
  } = Vue.util


  /**
   * `validator` element directive
   */

  Vue.elementDirective('validator', {
    params: ['name', 'groups', 'lazy', 'classes'],

    bind () {
      const params = this.params

      if (process.env.NODE_ENV !== 'production' && !params.name) {
        warn('validator element requires a \'name\' attribute: '
          + '(e.g. <validator name="validator1">...</validator>)'
        )
        return
      }

      this.validatorName = '$' + camelize(params.name)
      if (!this.vm._validatorMaps) {
        throw new Error('Invalid validator management error')
      }

      let classes = {}
      if (isPlainObject(this.params.classes)) {
        classes = this.params.classes
      }

      this.setupValidator(classes)
      this.setupFragment(params.lazy)
    },
    
    unbind () {
      this.teardownFragment()
      this.teardownValidator()
    },

    getGroups () {
      const params = this.params
      let groups = []

      if (params.groups) {
        if (isArray(params.groups)) {
          groups = params.groups
        } else if (!isPlainObject(params.groups)
            && typeof params.groups === 'string') {
          groups.push(params.groups)
        }
      }

      return groups
    },

    setupValidator (classes) {
      const validator 
        = this.validator 
        = new Validator(this.validatorName, this, this.getGroups(), classes)
      validator.enableReactive()
      validator.setupScope()
      validator.registerEvents()
    },

    teardownValidator () {
      this.validator.unregisterEvents()
      this.validator.disableReactive()

      if (this.validatorName) {
        this.validatorName = null
        this.validator = null
      }
    },

    setupFragment (lazy) {
      const vm = this.vm

      this.validator.waitFor(() => {
        this.anchor = createAnchor('vue-validator')
        replace(this.el, this.anchor)
        extend(vm.$options, { _validator: this.validatorName })
        this.factory = new FragmentFactory(vm, this.el.innerHTML)
        vIf.insert.call(this)
      })

      !lazy && vm.$activateValidator()
    },

    teardownFragment () {
      vIf.unbind.call(this)
    }
  })
}
