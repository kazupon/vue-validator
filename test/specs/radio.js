import assert from 'power-assert'
import Vue from 'vue'
import { trigger } from '../../src/util'


describe('radio', () => {
  let el, vm

  beforeEach(() => {
    el = document.createElement('div')
  })


  describe('normal', () => {
    beforeEach((done) => {
      el.innerHTML = `
        <validator name="validator1">
          <form novalidate>
            <fieldset>
              <label for="radio1">radio1</label>
              <input type="radio" id="radio1" name="r1" checked value="foo" v-validate:field1="{ required: true }">
              <label for="radio2">radio2</label>
              <input type="radio" id="radio2" name="r1" value="bar" v-validate:field1>
            </fieldset>
            <fieldset>
              <label for="radio3">radio3</label>
              <input type="radio" id="radio3" name="r2" value="buz" v-validate:field2="{ required: true }">
              <label for="radio4">radio4</label>
              <input type="radio" id="radio4" name="r2" value="hoge" v-validate:field2>
            </fieldset>
          </form>
        </validator>
      `
      vm = new Vue({
        el: el
      })
      vm.$nextTick(done)
    })

    it('should be validated', (done) => {
      // default
      assert(vm.$validator1.field1.required === false)
      assert(vm.$validator1.field1.valid === true)
      assert(vm.$validator1.field1.touched === false)
      assert(vm.$validator1.field1.dirty === false)
      assert(vm.$validator1.field1.modified === false)
      assert(vm.$validator1.field2.required)
      assert(vm.$validator1.field2.valid === false)
      assert(vm.$validator1.field2.touched === false)
      assert(vm.$validator1.field2.dirty === false)
      assert(vm.$validator1.field2.modified === false)
      assert(vm.$validator1.valid === false)
      assert(vm.$validator1.touched === false)
      assert(vm.$validator1.dirty === false)
      assert(vm.$validator1.modified === false)

      let radio2 = el.getElementsByTagName('input')[1]
      let radio3 = el.getElementsByTagName('input')[2]

      // change
      radio2.checked = true
      radio3.checked = true
      trigger(radio2, 'change')
      trigger(radio2, 'blur')
      trigger(radio3, 'change')
      trigger(radio3, 'blur')
      vm.$nextTick(() => {
        assert(vm.$validator1.field1.required === false)
        assert(vm.$validator1.field1.valid === true)
        assert(vm.$validator1.field1.touched === true)
        assert(vm.$validator1.field1.dirty === true)
        assert(vm.$validator1.field1.modified === true)
        assert(vm.$validator1.field2.required === false)
        assert(vm.$validator1.field2.valid === true)
        assert(vm.$validator1.field2.touched === true)
        assert(vm.$validator1.field2.dirty === true)
        assert(vm.$validator1.field2.modified === true)
        assert(vm.$validator1.valid === true)
        assert(vm.$validator1.touched === true)
        assert(vm.$validator1.dirty === true)
        assert(vm.$validator1.modified === true)

        done()
      })
    })
  })
})
