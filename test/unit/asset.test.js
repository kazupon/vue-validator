import * as validators from '../../src/validators'

describe('asset', () => {
  describe('build-in validator', () => {
    it('should be installed', () => {
      let validator
      for (validator in validators) {
        assert(Vue.validator(validator) === validators[validator])
      }
    })
  })

  describe('custom validator', () => {
    describe('global', () => {
      it('should be registered', () => {
        const validator = (val, ...args) => { return false }
        Vue.validator('custom', validator)
        assert(Vue.validator('custom') === validator)
        const Comp = Vue.extend()
        assert(Comp.options['validators'].custom === validator)
        Vue.validator('custom', null) // remove
      })
    })

    describe('local', () => {
      it('should be registered', () => {
        const custom = (val, ...args) => { return false }
        const Comp = Vue.extend()
        const vm = new Comp({ validators: { custom }})
        assert(Vue.util.resolveAsset(vm.$options, 'validators', 'custom') === custom)
      })
    })
  })
})
