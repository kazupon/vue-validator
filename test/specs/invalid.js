import assert from 'power-assert'
import Vue from 'vue'
import { trigger } from '../../src/util'


describe('invalid', () => {
  let el, vm

  beforeEach((done) => {
    el = document.createElement('div')
    el.innerHTML = `
      <validator name="validator1">
        <form novalidate>
          <input type="text" v-validate:field1="{ required: true, maxlength: 3 }">
          <input type="text" value="foo" v-validate:field2="{ required: true, minlength: 1 }">
        </form>
      </validator>
    ` 
    vm = new Vue({
      el: el
    })
    vm.$nextTick(done)
  })

  context('default', () => {
    it('field1.invalid should be false', () => {
      assert(vm.$validator1.field1.invalid === true)
    })
    it('field2.invalid should be false', () => {
      assert(vm.$validator1.field2.invalid === false)
    })
    it('top level invalid should be true', () => {
      assert(vm.$validator1.invalid === true)
    })

    context('input value', () => {
      let field1
      beforeEach((done) => {
        field1 = el.getElementsByTagName('input')[0]
        field1.value = 'hi'
        trigger(field1, 'input')
        vm.$nextTick(done)
      })

      it('field1.invalid should be false', () => {
        assert(vm.$validator1.field1.invalid === false)
      })
      it('field2.invalid should be false', () => {
        assert(vm.$validator1.field2.invalid === false)
      })
      it('top level invalid should be false', () => {
        assert(vm.$validator1.invalid === false)
      })

      context('back to default value', () => {
        beforeEach((done) => {
          field1.value = ''
          trigger(field1, 'input')
          vm.$nextTick(done)
        })

        it('field1.invalid should be false', () => {
          assert(vm.$validator1.field1.invalid === true)
        })
        it('field2.invalid should be false', () => {
          assert(vm.$validator1.field2.invalid === false)
        })
        it('top level invalid should be true', () => {
          assert(vm.$validator1.invalid === true)
        })
      })
    })
  })
})
