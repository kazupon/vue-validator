import assert from 'power-assert'
import Vue from 'vue'
import { trigger } from '../../src/util'


describe('touched', () => {
  let el, vm

  beforeEach((done) => {
    el = document.createElement('div')
    el.innerHTML = `
      <validator name="validator1">
        <form novalidate>
          <input type="text" v-validate:field1="{ required: true }">
          <input type="text" v-validate:field2="{ required: true }">
        </form>
      </validator>
    `
    vm = new Vue({
      el: el
    })
    vm.$nextTick(done)
  })

  context('default', () => {
    it('field1.touched should be false', () => {
      assert(vm.$validator1.field1.touched === false)
    })
    it('field2.touched should be false', () => {
      assert(vm.$validator1.field2.touched === false)
    })
    it('top level touched should be false', () => {
      assert(vm.$validator1.touched === false)
    })

    context('occured blur on field1', () => {
      let field1, field2
      beforeEach((done) => {
        field1 = el.getElementsByTagName('input')[0]
        field2 = el.getElementsByTagName('input')[1]
        trigger(field1, 'blur')
        vm.$nextTick(done)
      })

      it('field1.touched should be true', () => {
        assert(vm.$validator1.field1.touched === true)
      })
      it('field2.touched should be false', () => {
        assert(vm.$validator1.field2.touched === false)
      })
      it('top level touched should be true', () => {
        assert(vm.$validator1.touched === true)
      })

      context('occured blur on field2', () => {
        beforeEach((done) => {
          trigger(field2, 'blur')
          vm.$nextTick(done)
        })

        it('field1.touched should be true', () => {
          assert(vm.$validator1.field1.touched === true)
        })
        it('field2.touched should be true', () => {
          assert(vm.$validator1.field2.touched === true)
        })
        it('top level touched should be true', () => {
          assert(vm.$validator1.touched === true)
        })
      })
    })
  })
})
