import assert from 'power-assert'
import Vue from 'vue'
import { trigger } from '../../src/util'


describe('valid', () => {
  let el, vm

  beforeEach((done) => {
    el = document.createElement('div')
    el.innerHTML = 
      '<validator name="validator1">' +
      '<form novalidate>' +
      '<input type="text" v-validate:field1="{ required: true, maxlength: 3 }">' +
      '<input type="text" value="foo" v-validate:field2="{ required: true, minlength: 1 }">' +
      '</form>' +
      '</validator>'
    vm = new Vue({
      el: el
    })
    vm.$nextTick(done)
  })

  context('default', () => {
    it('field1.valid should be false', () => {
      assert(vm.$validator1.field1.valid === false)
    })
    it('field2.valid should be true', () => {
      assert(vm.$validator1.field2.valid === true)
    })
    it('top level valid should be false', () => {
      assert(vm.$validator1.valid === false)
    })

    context('input value', () => {
      let field1
      beforeEach((done) => {
        field1 = el.getElementsByTagName('input')[0]
        field1.value = 'hi'
        trigger(field1, 'input')
        vm.$nextTick(done)
      })

      it('field1.valid should be true', () => {
        assert(vm.$validator1.field1.valid === true)
      })
      it('field2.valid should be true', () => {
        assert(vm.$validator1.field2.valid === true)
      })
      it('top level valid should be true', () => {
        assert(vm.$validator1.valid === true)
      })

      context('back to default value', () => {
        beforeEach((done) => {
          field1.value = ''
          trigger(field1, 'input')
          vm.$nextTick(done)
        })

        it('field1.valid should be false', () => {
          assert(vm.$validator1.field1.valid === false)
        })
        it('field2.valid should be true', () => {
          assert(vm.$validator1.field2.valid === true)
        })
        it('top level valid should be false', () => {
          assert(vm.$validator1.valid === false)
        })
      })
    })
  })
})
