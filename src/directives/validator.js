import { warn } from '../util'
import Validator from '../validator'


export default function (Vue) {
  const _ = Vue.util
  const FragmentFactory = Vue.FragmentFactory
  const vIf = Vue.directive('if')
  const bind = Vue.util.bind
  const camelize = Vue.util.camelize

  Vue.elementDirective('validator', {
    params: ['name', 'groups', 'lazy'],

    bind () {
      if (!this.params.name) {
        // TODO: should be implemented validator:bind name params nothing error'
        warn('TODO: should be implemented validator:bind name params nothing error')
        return
      }

      let validatorName = this.validatorName = '$' + camelize(this.params.name)
      if (!this.vm._validatorMaps) {
        // TODO: should be implemented error message'
        warn('TODO: should be implemented error message')
        return
      }

      let groups = []
      if (this.params.groups) {
        if (_.isArray(this.params.groups)) {
          groups = this.params.groups
        } else if (!_.isPlainObject(this.params.groups) && 
            typeof this.params.groups === 'string') {
          groups.push(this.params.groups)
        }
      }

      let validator = this.validator = new Validator(validatorName, this, groups)
      validator.enableReactive()
      validator.setupScope()

      validator.waitFor(bind(() => {
        this.render(validator, validatorName)
        validator.validate()
      }, this))

      if (!this.params.lazy) {
        this.vm.$activateValidator()
      }
    },
    
    render (validator, validatorName) {
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
      vIf.unbind.call(this)

      this.validator.disableReactive()

      if (this.validatorName) {
        this.validatorName = null
        this.validator = null
      }
    }
  })
}
