import { warn, each } from '../util'


export default function (Vue) {
  
  const _ = Vue.util
  const vIf = Vue.directive('if')
  const FragmentFactory = Vue.FragmentFactory

  // register `v-validate` as terminal directive
  Vue.compiler.terminalDirectives.push('validate')

  /**
   * `v-validate` directive
   */

  Vue.directive('validate', {
    priority: vIf.priority + 1,
    params: ['group', 'field'],

    bind () {
      if (this.el.__vue__) {
        warn(
          'v-validate="' + this.expression + '" cannot be ' +
          'used on an instance root element.'
        )
        return
      }

      let validatorName = this.vm.$options._validator
      if (!validatorName) {
        warn(
          'v-validate need to use into validator element directive: ' +
          '(e.g. <validator name="validator">' +
          '<input type="text" v-validate:field1="[\'required\']">' +
          '</validator>).'
        )
        return
      }

      this.model = this.el.getAttribute('v-model')

      this.setupFragment()
      this.setupValidate(validatorName, this.model)
      this.listen()
    },

    update (value, old) {
      if (!value) { return }

      if (_.isPlainObject(value)) {
        this.handleObject(value)
      } else if (Array.isArray(value)) {
        this.handleArray(value)
      }

      this.validator.validate(this.validation)
    },

    unbind () {
      this.unlisten()
      this.teardownValidate()
      this.teardownFragment()

      this.model = null
    },

    setupValidate (name, model) {
      let params = this.params
      let validator = this.validator = this.vm._validatorMaps[name]

      this.field = _.camelize(this.arg ? this.arg : params.field)

      this.validation = validator.manageValidation(
        this.field, model, this.vm, this.frag.node, this._scope
      )

      if (params.group) {
        validator.addGroupValidation(params.group, this.field)
      }
    },

    listen () {
      let model = this.model
      let validation = this.validation
      let el = this.frag.node

      this.onBlur = _.bind(validation.listener, validation)
      _.on(el, 'blur', this.onBlur)
      if ((el.type === 'checkbox' 
          || el.type === 'radio' 
          || el.tagName === 'SELECT') && !model) {
        this.onChange = _.bind(validation.listener, validation)
        _.on(el, 'change', this.onChange)
      } else {
        if (!model) {
          this.onInput = _.bind(validation.listener, validation)
          _.on(el, 'input', this.onInput)
        }
      }
    },

    unlisten () {
      let el = this.frag.node

      if (this.onInput) {
        _.off(el, 'input', this.onInput)
        this.onInput = null
      }

      if (this.onChange) {
        _.off(el, 'change', this.onChange)
        this.onChange = null
      }

      if (this.onBlur) {
        _.off(el, 'blur', this.onBlur)
        this.onBlur = null
      }
    },

    teardownValidate () {
      if (this.validator && this.validation) {
        let el = this.frag.node

        if (this.params.group) {
          this.validator.removeGroupValidation(this.params.group, this.field)
        }

        this.validator.unmanageValidation(this.field, el)

        this.validator = null
        this.validation = null
        this.field = null
      }
    },

    setupFragment () {
      this.anchor = _.createAnchor('v-validate')
      _.replace(this.el, this.anchor)

      this.factory = new FragmentFactory(this.vm, this.el)
      this.frag = this.factory.create(this._host, this._scope, this._frag)
      this.frag.before(this.anchor)
    },

    teardownFragment () {
      if (this.frag) {
        this.frag.remove()
        this.frag = null
        this.factory = null
      }

      _.replace(this.anchor, this.el)
      this.anchor = null
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
    }
  })
}
