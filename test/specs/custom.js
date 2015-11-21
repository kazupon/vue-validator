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
        '<input type="text" value="hi" v-validate:field1.numeric>' +
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


  describe('caml-case', () => {
    it.skip('should be validated', (done) => {
      // TODO:
      done()
    })
  })


  describe('kebab-case', () => {
    it.skip('should be validated', (done) => {
      // TODO:
      done()
    })
  })
})
