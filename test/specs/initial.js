import assert from 'power-assert'
import Vue from 'vue'
import { trigger } from '../../src/util'


describe('initial', () => {
  let el, vm

  beforeEach((done) => {
    el = document.createElement('div')
    el.innerHTML = '<validator name="validator1">'
      + '<form novalidate>'
      + '<input type="number" v-validate:field1="{ required: { rule: true, initial: \'off\' }, min: 0, max: 10 }">'
      + '<input type="text" value="hello" v-validate:field2="{ minlength: 4 }">'
      + '</form>'
      + '</validator>'
    vm = new Vue({ el: el })
    vm.$nextTick(done)
  })

  it('should be validated', (done) => {
    assert(vm.$validator1.field1.required === false)
    assert(vm.$validator1.field1.min === false)
    assert(vm.$validator1.field1.max === false)
    assert(vm.$validator1.field1.valid === true)
    assert(vm.$validator1.field1.dirty === false)
    assert(vm.$validator1.field1.modified === false)
    assert(vm.$validator1.field1.touched === false)
    assert(vm.$validator1.field2.minlength === false)
    assert(vm.$validator1.field2.valid === true)
    assert(vm.$validator1.field2.dirty === false)
    assert(vm.$validator1.field2.modified === false)
    assert(vm.$validator1.field2.touched === false)
    assert(vm.$validator1.valid === true)
    assert(vm.$validator1.dirty === false)
    assert(vm.$validator1.modified === false)
    assert(vm.$validator1.touched === false)

    let field1 = el.getElementsByTagName('input')[0]
    trigger(field1, 'blur')
    vm.$nextTick(() => {
      assert(vm.$validator1.field1.required)
      assert(vm.$validator1.field1.min === false)
      assert(vm.$validator1.field1.max === false)
      assert(vm.$validator1.field1.valid === false)
      assert(vm.$validator1.field1.dirty === false)
      assert(vm.$validator1.field1.modified === false)
      assert(vm.$validator1.field1.touched === true)
      assert(vm.$validator1.field2.minlength === false)
      assert(vm.$validator1.field2.valid === true)
      assert(vm.$validator1.field2.dirty === false)
      assert(vm.$validator1.field2.modified === false)
      assert(vm.$validator1.field2.touched === false)
      assert(vm.$validator1.valid === false)
      assert(vm.$validator1.dirty === false)
      assert(vm.$validator1.modified === false)
      assert(vm.$validator1.touched === true)
      
      field1.value = '11'
      trigger(field1, 'input')
      vm.$nextTick(() => {
        assert(vm.$validator1.field1.required === false)
        assert(vm.$validator1.field1.min === false)
        assert(vm.$validator1.field1.max === true)
        assert(vm.$validator1.field1.valid === false)
        assert(vm.$validator1.field1.dirty === true)
        assert(vm.$validator1.field1.modified === true)
        assert(vm.$validator1.field1.touched === true)
        assert(vm.$validator1.field2.minlength === false)
        assert(vm.$validator1.field2.valid === true)
        assert(vm.$validator1.field2.dirty === false)
        assert(vm.$validator1.field2.modified === false)
        assert(vm.$validator1.field2.touched === false)
        assert(vm.$validator1.valid === false)
        assert(vm.$validator1.dirty === true)
        assert(vm.$validator1.modified === true)
        assert(vm.$validator1.touched === true)

        done()
      })
    })
  })
})
