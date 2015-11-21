import assert from 'power-assert'
import Vue from 'vue'
import { trigger } from '../../src/util'


describe('pristine', () => {
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
    it('field1.pristine should be true', () => {
      assert(vm.$validator1.field1.pristine === true)
    })
    it('field2.pristine should be true', () => {
      assert(vm.$validator1.field2.pristine === true)
    })
    it('top level pristine should be true', () => {
      assert(vm.$validator1.pristine === true)
    })

    context('input value', () => {
      let field2
      beforeEach((done) => {
        field2 = el.getElementsByTagName('input')[1]
        field2.value = 'foo'
        trigger(field2, 'input')
        vm.$nextTick(done)
      })

      it('field1.pristine should be true', () => {
        assert(vm.$validator1.field1.pristine === true)
      })
      it('field2.pristine should be false', () => {
        assert(vm.$validator1.field2.pristine === false)
      })
      it('top level pristine should be false', () => {
        assert(vm.$validator1.pristine === false)
      })

      context('back to default value', () => {
        beforeEach((done) => {
          field2.value = ''
          trigger(field2, 'input')
          vm.$nextTick(done)
        })

        it('field1.pristine should be true', () => {
          assert(vm.$validator1.field1.pristine === true)
        })
        it('field2.pristine should be false', () => {
          assert(vm.$validator1.field2.pristine === false)
        })
        it('top level pristine should be false', () => {
          assert(vm.$validator1.pristine === false)
        })
      })
    })
  })
})
