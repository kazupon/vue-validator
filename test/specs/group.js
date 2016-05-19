import assert from 'power-assert'
import Vue from 'vue'
import { trigger } from '../../src/util'


describe('group', () => {
  let el, vm

  beforeEach(() => {
    el = document.createElement('div')
  })

  describe('text', () => {
    beforeEach((done) => {
      el.innerHTML = `
        <validator :groups="['group1', 'group2']" name="validator1">
          <input type="text" group="group1" v-validate:field1="{ pattern: '/foo/' }">
          <input type="text" group="group1" value="hoge" v-validate:field2="{ required: true }">
          <input type="text" group="group2" v-validate:field3="{ pattern: '/bar/' }">
          <input type="text" group="group2" v-validate:field4="{ pattern: '/piyo/' }">
        </validator>'
      `
      vm = new Vue({
        el: el
      })
      vm.$nextTick(done)
    })

    describe('default', () => {
      it('should be validated', () => {
        assert(vm.$validator1.group1.valid === false)
        assert(vm.$validator1.group1.invalid === true)
        assert(vm.$validator1.group1.dirty === false)
        assert(vm.$validator1.group1.pristine === true)
        assert(vm.$validator1.group1.modified === false)
        assert(vm.$validator1.group1.touched === false)
        assert(vm.$validator1.group1.untouched === true)
        assert(vm.$validator1.group2.valid === false)
        assert(vm.$validator1.group2.invalid === true)
        assert(vm.$validator1.group2.dirty === false)
        assert(vm.$validator1.group2.pristine === true)
        assert(vm.$validator1.group2.modified === false)
        assert(vm.$validator1.group2.touched === false)
        assert(vm.$validator1.group2.untouched === true)
      })

      describe('change fields', () => {
        beforeEach((done) => {
          // emulate field1 operation
          let field1 = el.getElementsByTagName('input')[0]
          field1.value = 'foo'
          trigger(field1, 'input')
          trigger(field1, 'blur')
          vm.$nextTick(() => {
            // emulate field3 operation
            let field3 = el.getElementsByTagName('input')[2]
            field3.value = 'bar'
            trigger(field3, 'input')
            vm.$nextTick(() => {
              field3.value = ''
              trigger(field3, 'input')
              vm.$nextTick(done)
            })
          })
        })

        it('should be validated', () => {
          assert(vm.$validator1.group1.valid === true)
          assert(vm.$validator1.group1.invalid === false)
          assert(vm.$validator1.group1.dirty === true)
          assert(vm.$validator1.group1.pristine === false)
          assert(vm.$validator1.group1.modified === true)
          assert(vm.$validator1.group1.touched === true)
          assert(vm.$validator1.group1.untouched === false)
          assert(vm.$validator1.group2.valid === false)
          assert(vm.$validator1.group2.invalid === true)
          assert(vm.$validator1.group2.dirty === true)
          assert(vm.$validator1.group2.pristine === false)
          assert(vm.$validator1.group2.modified === false)
          assert(vm.$validator1.group2.touched === false)
          assert(vm.$validator1.group2.untouched === true)
        })
      })
    })
  })
  
  describe('radio', () => {
    beforeEach((done) => {
      el.innerHTML = `
        <validator :groups="['group1', 'group2']" name="validator1">
          <form novalidate>
            <fieldset>
              <label for="radio1">radio1</label>
              <input type="radio" id="radio1" name="r1" group="group1" checked value="foo" v-validate:field1="{ required: true }">
              <label for="radio2">radio2</label>
              <input type="radio" id="radio2" name="r1" group="group1" value="bar" v-validate:field1>
            </fieldset>
            <fieldset>
              <label for="radio3">radio3</label>
              <input type="radio" id="radio3" name="r2" group="group2" value="buz" v-validate:field2="{ required: true }">
              <label for="radio4">radio4</label>
              <input type="radio" id="radio4" name="r2" group="group2" value="hoge" v-validate:field2>
            </fieldset>
          </form>
        </validator>
      `
      vm = new Vue({
        el: el
      })
      vm.$nextTick(done)
    })

    describe('default', () => {
      it('should be validated', () => {
        assert(vm.$validator1.group1.valid === true)
        assert(vm.$validator1.group1.invalid === false)
        assert(vm.$validator1.group1.dirty === false)
        assert(vm.$validator1.group1.pristine === true)
        assert(vm.$validator1.group1.modified === false)
        assert(vm.$validator1.group1.touched === false)
        assert(vm.$validator1.group1.untouched === true)
        assert(vm.$validator1.group2.valid === false)
        assert(vm.$validator1.group2.invalid === true)
        assert(vm.$validator1.group2.dirty === false)
        assert(vm.$validator1.group2.pristine === true)
        assert(vm.$validator1.group2.modified === false)
        assert(vm.$validator1.group2.touched === false)
        assert(vm.$validator1.group2.untouched === true)
      })

      describe('change fields', () => {
        beforeEach((done) => {
          // emulate field1 operation
          let field1 = el.getElementsByTagName('input')[0]
          field1.checked = false
          trigger(field1, 'change')
          trigger(field1, 'blur')
          vm.$nextTick(() => {
            // emulate field3 operation
            let field3 = el.getElementsByTagName('input')[2]
            field3.checked = true
            trigger(field3, 'change')
            trigger(field3, 'input')
            vm.$nextTick(() => {
              field3.checked = false
              trigger(field3, 'change')
              trigger(field3, 'input')
              vm.$nextTick(done)
            })
          })
        })

        it('should be validated', () => {
          assert(vm.$validator1.group1.valid === false)
          assert(vm.$validator1.group1.invalid === true)
          assert(vm.$validator1.group1.dirty === true)
          assert(vm.$validator1.group1.pristine === false)
          assert(vm.$validator1.group1.modified === true)
          assert(vm.$validator1.group1.touched === true)
          assert(vm.$validator1.group1.untouched === false)
          assert(vm.$validator1.group2.valid === false)
          assert(vm.$validator1.group2.invalid === true)
          assert(vm.$validator1.group2.dirty === true)
          assert(vm.$validator1.group2.pristine === false)
          assert(vm.$validator1.group2.modified === false)
          assert(vm.$validator1.group2.touched === false)
          assert(vm.$validator1.group2.untouched === true)
        })
      })
    })
  })
})
