import assert from 'power-assert'
import Vue from 'vue'
import * as validators from '../../src/validators'


describe('asset', () => {
  let el

  beforeEach(() => {
    el = document.createElement('div')
  })


  describe('build-in validator', () => {
    it('should be installed', () => {
      for (let validator in validators) {
        assert(Vue.validator(validator) === validators[validator])
      }
    })
  })

  describe('custom validator', () => {
    context('global', () => {
      it('should be registered', () => {
        let validator = (val, ...args) => { return false }
        Vue.validator('custom', validator)
        assert(Vue.validator('custom') === validator)
      })
    })

    context('local', () => {
      let el1
      let el2
      let globalCount = 0
      let localCount = 0
      beforeEach((done) => {
        let template = `
          <validator name="validator1">
            <form novalidate>
              <input type="text" v-validate:field1="{ custom11: true }">
            </form>
          </validator>
        `
        el1 = document.createElement('div')
        el1.innerHTML = template
        el2 = document.createElement('div')
        el2.innerHTML = template
        let global = (val, ...args) => { 
          globalCount++
          return false
        }
        Vue.validator('custom11', global)
        let local = (val, ...args) => {
          localCount++
          return true
        }
        let vm1 = new Vue({
          el: el1
        })
        vm1.$nextTick(() => {
          let vm2 = new Vue({
            el: el2,
            validators: { custom11: local }
          })
          vm2.$nextTick(() => {
            let el3 = document.createElement('div')
            el3.innerHTML = template
            new Vue({
              el: el3
            })
            done()
          })
        })
      })

      it('should be registered', () => {
        assert(globalCount > localCount)
      })
    })
  })

  describe('reference validator', () => {
    context('component', () => {
      it('should be referenced', () => {
        let global = (val, ...args) => { return false }
        let custom1 = (val) => { return true }
        let custom2 = (val) => { return false }
        Vue.validator('global', global)

        const component = {
          template: '<p>{{msg}}</p>',
          props: ['msg'],
          validators: { custom2: custom2 }
        }
        let vm = new Vue({
          el: el,
          components: { myComponent: component },
          template: '<my-component msg="hello" v-ref:component></my-component>',
          validators: { custom1: custom1 }
        })

        assert(Vue.util.resolveAsset(vm.$options, 'validators', 'global') === global)
        assert(Vue.util.resolveAsset(vm.$options, 'validators', 'custom1') === custom1)
        assert(Vue.util.resolveAsset(vm.$options, 'validators', 'custom2') === undefined)

        assert(Vue.util.resolveAsset(vm.$refs.component.$options, 'validators', 'global') === global)
        assert(Vue.util.resolveAsset(vm.$refs.component.$options, 'validators', 'custom1') === undefined)
        assert(Vue.util.resolveAsset(vm.$refs.component.$options, 'validators', 'custom2') === custom2)
      })
    })

    context('created component with v-for', () => {
      it('should be referenced', () => {
        let global = (val, ...args) => { return false }
        let custom = (val) => { return true }
        Vue.validator('global', global)

        const Component = Vue.extend({
          template: '<span>{{name}}</span>',
          validators: { custom: custom }
        })
        let vm = new Vue({
          el: el,
          components: { item: Component },
          template: '<item v-for="item in items"></item>',
          data: {
            items: [{ name: 'foo' }]
          }
        })

        assert(Vue.util.resolveAsset(vm.$children[0].$options, 'validators', 'global') === global)
        assert(Vue.util.resolveAsset(vm.$children[0].$options, 'validators', 'custom') === custom)
      })
    })
  })
})
