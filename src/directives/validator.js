import { warn } from '../util'
import Validator from '../validator'


export default function (Vue) {
  const _ = Vue.util
  const FragmentFactory = Vue.FragmentFactory
  const vIf = Vue.directive('if')
  const camelize = Vue.util.camelize

  Vue.elementDirective('validator', {
    params: ['name', 'groups', 'lazy'],

    bind () {
      if (!this.params.name) {
        warn('validator element directive need to specify \'name\' param attribute: '
            + '(e.g. <validator name="validator1">...</validator>)'
        )
        return
      }

      this.validatorName = '$' + camelize(this.params.name)
      if (!this.vm._validatorMaps) {
        throw new Error('Invalid validator management error')
      }

      this.setupValidator()
      this.setupFragment(this.params.lazy)
    },
    
    unbind () {
      this.teardownFragment()
      this.teardownValidator()
    },

    getGroups () {
      let groups = []

      if (this.params.groups) {
        if (_.isArray(this.params.groups)) {
          groups = this.params.groups
        } else if (!_.isPlainObject(this.params.groups)
            && typeof this.params.groups === 'string') {
          groups.push(this.params.groups)
        }
      }

      return groups
    },

    setupValidator () {
      let validator = this.validator = new Validator(this.validatorName, this, this.getGroups())
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
      this.validator.waitFor(() => {
        this.anchor = _.createAnchor('vue-validator')
        _.replace(this.el, this.anchor)
        _.extend(this.vm.$options, { _validator: this.validatorName })
        this.factory = new FragmentFactory(this.vm, this.el.innerHTML)
        vIf.insert.call(this)

        this.validator.validate()
      })

      if (!lazy) {
        this.vm.$activateValidator()
      }
    },

    teardownFragment () {
      vIf.unbind.call(this)
    }
  })
}
