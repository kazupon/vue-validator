import assert from 'power-assert'
import Vue from 'vue'
import { trigger } from '../../src/util'


describe('event', () => {
  let el, vm

  beforeEach(() => {
    el = document.createElement('div')
  })


  describe('valid', () => {
    it('should be occured event', (done) => {
      el.innerHTML = 
        '<validator name="validator1">' +
        '<input type="text" @valid="onValid" v-validate:field1.required>' +
        '</validator>'
      vm = new Vue({
        el: el,
        methods: {
          onValid () {
            assert(true)
            done()
          }
        }
      })
      vm.$nextTick(() => {
        let input = el.getElementsByTagName('input')[0]
        input.value = 'foo'
        trigger(input, 'input')
      })
    })
  })

  describe('invalid', () => {
    it('should be occured event', (done) => {
      el.innerHTML = 
        '<validator name="validator1">' +
        '<input type="text" value="hello" @invalid="onInValid" v-validate:field1.required>' +
        '</validator>'
      vm = new Vue({
        el: el,
        methods: {
          onInValid () {
            assert(true)
            done()
          }
        }
      })
      vm.$nextTick(() => {
        let input = el.getElementsByTagName('input')[0]
        input.value = ''
        trigger(input, 'input')
      })
    })
  })
})
