import assert from 'power-assert'
import Vue from 'vue'
import * as validators from '../../src/validators'
import VueValidator from '../../src/index'


describe('assets', () => {
  beforeEach(() => {
    let el = document.createElement('div')
    el.setAttribute('id', 'app')
    document.body.appendChild(el)
    Vue.use(VueValidator)
  })

  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild)
    }
    VueValidator.installed = false
  })


  describe('build-in validator', () => {
    it('should be installed', () => {
      for (let validator in validators) {
        assert(VueValidator.assets(validator) === validators[validator])
      }
    })
  })

  describe('custom validator', () => {
    it('should be registered', () => {
      let validator = (val, ...args) => { return false }
      VueValidator.assets('custom', validator)
      assert(VueValidator.assets('custom') === validator)
    })
  })

  describe('reference validator', () => {
    context('component', () => {
      it('should be referenced', (done) => {
        let validator = (val, ...args) => { return false }
        VueValidator.assets('custom', validator)

        const Component = Vue.extend({
          created () {
            assert(Vue.util.resolveAsset(this.$options, 'validators', 'custom') === validator)
            done()
          }
        })
        new Component()
      })
    })

    context('create component with v-repeat', () => {
      it('should be referenced', (done) => {
        let validator = (val, ...args) => { return false }
        VueValidator.assets('custom', validator)

        const Component = Vue.extend({
          template: '<span>{{name}}</span>',
          created () {
            assert(Vue.util.resolveAsset(this.$options, 'validators', 'custom') === validator)
            done()
          }
        })
        new Vue({
          el: '#app',
          components: { item: Component },
          template: '<item v-repeat="item in items"></item>',
          data: {
            items: [{ name: 'foo' }]
          }
        })
      })
    })
  })
})
