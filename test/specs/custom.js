import assert from 'power-assert'
import Vue from 'vue'
import { trigger } from '../../src/util'


describe('custom', () => {
  let el, vm

  beforeEach(() => {
    el = document.createElement('div')
  })


  describe('normal', () => {
    beforeEach((done) => {
      Vue.validator('numeric', (val) => {
        return /^[-+]?[0-9]+$/.test(val)
      })

      el.innerHTML = 
        '<validator name="validator1">' +
        '<form novalidate>' +
        '<input type="text" value="hi" v-validate:field1="{ numeric: true }">' +
        '</form>' +
        '</validator>'
      vm = new Vue({
        el: el
      })
      vm.$nextTick(done)
    })

    it('should be validated', (done) => {
      // default
      assert(vm.$validator1.field1.numeric === true)

      // change input value
      let input = el.getElementsByTagName('input')[0]
      input.value = '10'
      trigger(input, 'input')
      vm.$nextTick(() => {
        assert(vm.$validator1.field1.numeric === false)
        done()
      })
    })
  })


  describe('with message', () => {
    context('string', () => {
      beforeEach((done) => {
        Vue.validator('numeric', {
          message: 'invalid numeric value',
          check (val) {
            return /^[-+]?[0-9]+$/.test(val)
          }
        })

        el.innerHTML = 
          '<validator name="validator1">' +
          '<form novalidate>' +
          '<input type="text" value="hi" v-validate:field1="[\'numeric\']">' +
          '</form>' +
          '</validator>'
        vm = new Vue({
          el: el
        })
        vm.$nextTick(done)
      })

      it('should be validated', (done) => {
        assert(vm.$validator1.field1.numeric === true)
        assert(vm.$validator1.field1.messages.numeric === 'invalid numeric value')

        let input = el.getElementsByTagName('input')[0]
        input.value = '10'
        trigger(input, 'input')
        vm.$nextTick(() => {
          assert(vm.$validator1.field1.numeric === false)
          assert(vm.$validator1.field1.messages === undefined)
          done()
        })
      })
    })

    context('function', () => {
      beforeEach((done) => {
        Vue.validator('numeric', {
          message (field) {
            return this.format + field
          },
          check (val) {
            return /^[-+]?[0-9]+$/.test(val)
          }
        })

        el.innerHTML = 
          '<validator name="validator1">' +
          '<form novalidate>' +
          '<input type="text" value="hi" v-validate:field1="[\'numeric\']">' +
          '</form>' +
          '</validator>'
        vm = new Vue({
          el: el,
          data: {
            format: 'invalid numeric value : '
          }
        })
        vm.$nextTick(done)
      })

      it('should be validated', (done) => {
        assert(vm.$validator1.field1.numeric === true)
        assert(vm.$validator1.field1.messages.numeric === (vm.format + 'field1'))

        let input = el.getElementsByTagName('input')[0]
        input.value = '10'
        trigger(input, 'input')
        vm.$nextTick(() => {
          assert(vm.$validator1.field1.numeric === false)
          assert(vm.$validator1.field1.messages === undefined)
          done()
        })
      })
    })

    context('build-in', () => {
      let org
      beforeEach((done) => {
        let org = Vue.validator('required')
        let required = {
          message (field) {
            return 'required ' + field
          },
        }
        required.check = org
        Vue.validator('required', required)

        el.innerHTML = 
          '<validator name="validator1">' +
          '<form novalidate>' +
          '<input type="text" value="" v-validate:field1="[\'required\']">' +
          '</form>' +
          '</validator>'
        vm = new Vue({
          el: el
        })
        vm.$nextTick(done)
      })

      afterEach(() => {
        Vue.validator('required', org)
      })

      it('should be validated', (done) => {
        assert(vm.$validator1.field1.required === true)
        assert(vm.$validator1.field1.messages.required === 'required field1')

        let input = el.getElementsByTagName('input')[0]
        input.value = '10'
        trigger(input, 'input')
        vm.$nextTick(() => {
          assert(vm.$validator1.field1.required === false)
          assert(vm.$validator1.field1.messages === undefined)
          done()
        })
      })
    })
  })
})
