import assert from 'power-assert'
import Vue from 'vue'


describe('lazy', () => {
  let el, vm

  beforeEach((done) => {
    el = document.createElement('div')
    el.innerHTML = '<p>{{val1}}</p>'
      + '<validator lazy name="validator1">'
      + '<form novalidate>'
      + '<input type="text" :value="val1" v-validate:field1="{ required: true }">'
      + '<input type="text" :value="val2" v-validate:field2="{ required: true }">'
      + '</form>'
      + '</validator>'
      + '<p>{{val2}}</p>'
    vm = new Vue({
      el: el,
      data: { val1: '', val2: 0 }
    })
    vm.$nextTick(done)
  })

  it('should be delayed validation', (done) => {
    vm.$set('val1', 'hello')
    vm.$set('val2', 100)

    vm.$nextTick(() => {
      vm.$activateValidator()

      vm.$nextTick(() => {
        assert(vm.$validator1.field1.required === false)
        assert(vm.$validator1.field2.required === false)
        done()
      })
    })
  })
})
