import { PRIORITY_VALIDATE, REGEX_FILTER } from '../const'
import { warn, each } from '../util'


export default function (Vue) {
  const vIf = Vue.directive('if')
  const FragmentFactory = Vue.FragmentFactory
  const parseDirective = Vue.parsers.directive.parseDirective
  const {
    inBrowser, bind, on, off, createAnchor,
    replace, camelize, isPlainObject
  } = Vue.util

  // Test for IE10/11 textarea placeholder clone bug
  function checkTextareaCloneBug () {
    if (inBrowser) {
      let t = document.createElement('textarea')
      t.placeholder = 't'
      return t.cloneNode(true).value === 't'
    } else {
      return false
    }
  }
  const hasTextareaCloneBug = checkTextareaCloneBug()


  /**
   * `v-validate` directive
   */

  Vue.directive('validate', {
    terminal: true,
    priority: vIf.priority + PRIORITY_VALIDATE,
    params: ['group', 'field', 'detect-blur', 'detect-change', 'initial', 'classes'],

    paramWatchers: {
      detectBlur (val, old) {
        if (this._invalid) { return }
        this.validation.detectBlur = this.isDetectBlur(val) 
        this.validator.validate(this.field)
      },

      detectChange (val, old) {
        if (this._invalid) { return }
        this.validation.detectChange = this.isDetectChange(val)
        this.validator.validate(this.field)
      }
    },

    bind () {
      const el = this.el

      if ((process.env.NODE_ENV !== 'production') && el.__vue__) {
        warn('v-validate="' + this.expression + '" cannot be '
          + 'used on an instance root element.')
        this._invalid = true
        return
      }

      if ((process.env.NODE_ENV !== 'production') 
          && (el.hasAttribute('v-if') || el.hasAttribute('v-for'))) {
        warn('v-validate cannot be used `v-if` or `v-for` build-in terminal directive '
          + 'on an element. these is wrapped with `<template>` or other tags: '
          + '(e.g. <validator name="validator">'
          + '<template v-if="hidden">'
          + '<input type="text" v-validate:field1="[\'required\']">'
          + '</template>'
          + '</validator>).')
        this._invalid = true
        return
      }

      let validatorName = this.vm.$options._validator
      if ((process.env.NODE_ENV !== 'production') && !validatorName) {
        warn('v-validate need to use into validator element directive: '
          + '(e.g. <validator name="validator">'
          + '<input type="text" v-validate:field1="[\'required\']">'
          + '</validator>).')
        this._invalid = true
        return
      }

      let raw = el.getAttribute('v-model')
      let { model, filters } = this.parseModelRaw(raw)
      this.model = model

      this.setupFragment()
      this.setupValidate(validatorName, model, filters)
      this.listen()
    },

    update (value, old) {
      if (!value || this._invalid) { return }

      if (isPlainObject(value)) {
        this.handleObject(value)
      } else if (Array.isArray(value)) {
        this.handleArray(value)
      }

      let options = { field: this.field, noopable: this._initialNoopValidation }
      if (this.frag) {
        options.el = this.frag.node
      }
      this.validator.validate(options)

      if (this._initialNoopValidation) {
        this._initialNoopValidation = null
      }
    },

    unbind () {
      if (this._invalid) { return }

      this.unlisten()
      this.teardownValidate()
      this.teardownFragment()

      this.model = null
    },

    parseModelRaw (raw) {
      if (REGEX_FILTER.test(raw)) {
        let parsed = parseDirective(raw)
        return { model: parsed.expression, filters: parsed.filters }
      } else {
        return { model: raw }
      }
    },

    setupValidate (name, model, filters) {
      const params = this.params
      let validator = this.validator = this.vm._validatorMaps[name]

      this.field = camelize(this.arg ? this.arg : params.field)

      this.validation = validator.manageValidation(
        this.field, model, this.vm, this.frag.node, this._scope, filters,
        this.isDetectBlur(params.detectBlur), 
        this.isDetectChange(params.detectChange)
      )

      isPlainObject(params.classes)
        && this.validation.setValidationClasses(params.classes)

      params.group
        && validator.addGroupValidation(params.group, this.field)

      this._initialNoopValidation = this.isInitialNoopValidation(params.initial)
    },

    listen () {
      const model = this.model
      const validation = this.validation
      const el = this.frag.node

      this.onBlur = bind(validation.listener, validation)
      on(el, 'blur', this.onBlur)
      if ((el.type === 'radio' 
          || el.tagName === 'SELECT') && !model) {
        this.onChange = bind(validation.listener, validation)
        on(el, 'change', this.onChange)
      } else if (el.type === 'checkbox') {
        if (!model) {
          this.onChange = bind(validation.listener, validation)
          on(el, 'change', this.onChange)
        } else {
          this.onClick = bind(validation.listener, validation)
          on(el, 'click', this.onClick)
        }
      } else {
        if (!model) {
          this.onInput = bind(validation.listener, validation)
          on(el, 'input', this.onInput)
        }
      }
    },

    unlisten () {
      const el = this.frag.node

      if (this.onInput) {
        off(el, 'input', this.onInput)
        this.onInput = null
      }

      if (this.onClick) {
        off(el, 'click', this.onClick)
        this.onClick = null
      }

      if (this.onChange) {
        off(el, 'change', this.onChange)
        this.onChange = null
      }

      if (this.onBlur) {
        off(el, 'blur', this.onBlur)
        this.onBlur = null
      }
    },

    teardownValidate () {
      if (this.validator && this.validation) {
        let el = this.frag.node

        this.params.group 
          && this.validator.removeGroupValidation(this.params.group, this.field)

        this.validator.unmanageValidation(this.field, el)

        this.validator = null
        this.validation = null
        this.field = null
      }
    },

    setupFragment () {
      this.anchor = createAnchor('v-validate')
      replace(this.el, this.anchor)

      this.factory = new FragmentFactory(this.vm, this.shimNode(this.el))
      this.frag = this.factory.create(this._host, this._scope, this._frag)
      this.frag.before(this.anchor)
    },

    teardownFragment () {
      if (this.frag) {
        this.frag.remove()
        this.frag = null
        this.factory = null
      }

      replace(this.anchor, this.el)
      this.anchor = null
    },

    handleArray (value) {
      each(value, (val) => {
        this.validation.setValidation(val)
      })
    },

    handleObject (value) {
      each(value, (val, key) => {
        if (isPlainObject(val)) {
          if ('rule' in val) {
            let msg = 'message' in val ? val.message : null
            let initial = 'initial' in val ? val.initial : null
            this.validation.setValidation(key, val.rule, msg, initial)
          }
        } else {
          this.validation.setValidation(key, val)
        }
      })
    },

    isDetectBlur (detectBlur) {
      return detectBlur === undefined 
        || detectBlur === 'on' || detectBlur === true
    },

    isDetectChange (detectChange) {
      return detectChange === undefined 
        || detectChange === 'on' || detectChange === true
    },

    isInitialNoopValidation (initial) {
      return initial === 'off' || initial === false
    },
    
    shimNode (node) {
      let ret = node
      if (hasTextareaCloneBug) {
        if (node.tagName === 'TEXTAREA') {
          ret = node.cloneNode(true)
          ret.value = node.value
          let i = ret.childNodes.length
          while (i--) {
            ret.removeChild(ret.childNodes[i])
          }
        }
      }
      return ret
    }
  })
}
