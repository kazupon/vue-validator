import assert from 'power-assert'
import Vue from 'vue'
import { trigger } from '../../src/util'


describe('multiple', () => {
  let el, vm

  before((done) => {
    el = document.createElement('div')
    el.innerHTML = `
      <validator name="validator1">
        <input type="text" v-validate:field1="{ required: true }">
      </validator>
      <validator name="validator2">
        <input type="text" v-validate:field1="{ required: true }">
      </validator>
    `
    vm = new Vue({
      el: el
    })
    vm.$nextTick(done)
  })

  it('should be validated', (done) => {
    // default
    assert(vm.$validator1.field1.valid === false)
    assert(vm.$validator1.valid === false)
    assert(vm.$validator2.field1.valid === false)
    assert(vm.$validator2.valid === false)

    // change fields
    let field1 = el.getElementsByTagName('input')[0]
    field1.value = 'foo'
    trigger(field1, 'input')
    vm.$nextTick(() => {
      assert(vm.$validator1.field1.valid === true)
      assert(vm.$validator1.valid === true)
      assert(vm.$validator2.field1.valid === false)
      assert(vm.$validator2.valid === false)

      let field2 = el.getElementsByTagName('input')[1]
      field2.value = 'foo'
      trigger(field2, 'input')
      vm.$nextTick(() => {
        assert(vm.$validator1.field1.valid === true)
        assert(vm.$validator1.valid === true)
        assert(vm.$validator2.field1.valid === true)
        assert(vm.$validator2.valid === true)
        done()
      })
    })
  })
})
