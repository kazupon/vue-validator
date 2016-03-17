import { warn } from '../util'
import Validator from '../validator'


export default function (Vue) {
  const _ = Vue.util
  const FragmentFactory = Vue.FragmentFactory
  const parseTemplate = Vue.parsers.template.parseTemplate
  const vIf = Vue.directive('if')
  const camelize = Vue.util.camelize


  /**
   * `validator` element directive
   */

  Vue.elementDirective('validator', {
    params: ['name', 'groups', 'lazy'],

    bind () {
      const params = this.params

      if (!params.name) {
        warn('validator element directive need to specify \'name\' param attribute: '
            + '(e.g. <validator name="validator1">...</validator>)'
        )
        return
      }

      this.validatorName = '$' + camelize(params.name)
      if (!this.vm._validatorMaps) {
        throw new Error('Invalid validator management error')
      }

      this.setupValidator()
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
        if (_.isArray(params.groups)) {
          groups = params.groups
        } else if (!_.isPlainObject(params.groups)
            && typeof params.groups === 'string') {
          groups.push(params.groups)
        }
      }

      return groups
    },

    setupValidator () {
      const validator 
        = this.validator 
        = new Validator(this.validatorName, this, this.getGroups())
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
        this.anchor = _.createAnchor('vue-validator')
        _.replace(this.el, this.anchor)
        _.extend(vm.$options, { _validator: this.validatorName })
        this.factory = new FragmentFactory(vm, parseTemplate(this.el, true))
        vIf.insert.call(this)
      })

      !lazy && vm.$activateValidator()
    },

    teardownFragment () {
      vIf.unbind.call(this)
    }
  })
}
