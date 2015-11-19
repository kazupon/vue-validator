import assert from 'power-assert'
import Vue from 'vue'
import { trigger } from '../../src/util'


describe('dirty', () => {
  let el, vm

  beforeEach((done) => {
    el = document.createElement('div')
    el.innerHTML = 
      '<validator name="validator1">' +
      '<form novalidate>' +
      '<input type="text" v-validate:field1.required>' +
      '<input type="text" v-validate:field2.required>' +
      '</form>' +
      '</validator>'
    vm = new Vue({
      el: el
    })
    vm.$nextTick(done)
  })

  context('default', () => {
    it('field1.dirty should be false', () => {
      assert(vm.$validator1.field1.dirty === false)
    })
    it('field2.dirty should be false', () => {
      assert(vm.$validator1.field2.dirty === false)
    })
    it('top level dirty should be false', () => {
      assert(vm.$validator1.dirty === false)
    })

    context('input value', () => {
      let field1
      beforeEach((done) => {
        field1 = el.getElementsByTagName('input')[0]
        field1.value = 'foo'
        trigger(field1, 'input')
        vm.$nextTick(done)
      })

      it('field1.dirty should be true', () => {
        assert(vm.$validator1.field1.dirty === true)
      })
      it('field2.dirty should be false', () => {
        assert(vm.$validator1.field2.dirty === false)
      })
      it('top level dirty should be true', () => {
        assert(vm.$validator1.dirty === true)
      })

      context('back to default value', () => {
        beforeEach((done) => {
          field1.value = ''
          trigger(field1, 'input')
          vm.$nextTick(done)
        })

        it('field1.dirty should be true', () => {
          assert(vm.$validator1.field1.dirty === true)
        })
        it('field2.dirty should be false', () => {
          assert(vm.$validator1.field2.dirty === false)
        })
        it('top level dirty should be true', () => {
          assert(vm.$validator1.dirty === true)
        })
      })
    })
  })
})
