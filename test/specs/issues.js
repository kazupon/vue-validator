import assert from 'power-assert'
import Vue from 'vue'


describe('github issues', () => {
  let el, vm

  beforeEach(() => {
    el = document.createElement('div')
  })


  describe('#195', () => {
    beforeEach((done) => {
      el.innerHTML = '<validator name="validator1">'
        + '<form novalidate>'
        + '<input type="text" v-model="value" number>'
        + '<input type="text" v-model="value" number v-validate:value="[\'required\']">'
        + '</form>'
        + '</validator>'
      vm = new Vue({ el: el, data: { value: 0 } })
      vm.$nextTick(done)
    })

    it('should be validated', (done) => {
      let field1 = el.getElementsByTagName('input')[0]
      let field2 = el.getElementsByTagName('input')[1]
      assert(field1.value === '0')
      assert(field2.value === '0')
      done()
    })
  })
})
