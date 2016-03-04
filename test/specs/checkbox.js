import assert from 'power-assert'
import Vue from 'vue'
import { trigger } from '../../src/util'


describe('checkbox', () => {
  let el, vm

  beforeEach(() => {
    el = document.createElement('div')
  })


  describe('single', () => {
    beforeEach((done) => {
      el.innerHTML = '<validator name="validator1">'
        + '<form novalidate>'
        + '<input type="checkbox" v-validate:field1="[\'required\']">'
        + '</form>'
        + '</validator>'
      vm = new Vue({
        el: el
      })
      vm.$nextTick(done)
    })

    it('should be validated', (done) => {
      // default
      assert(vm.$validator1.field1.required)
      assert(vm.$validator1.field1.valid === false)
      assert(vm.$validator1.field1.touched === false)
      assert(vm.$validator1.field1.dirty === false)
      assert(vm.$validator1.field1.modified === false)
      assert(vm.$validator1.valid === false)
      assert(vm.$validator1.touched === false)
      assert(vm.$validator1.dirty === false)
      assert(vm.$validator1.modified === false)

      // checked checkbox
      let checkbox = el.getElementsByTagName('input')[0]
      checkbox.checked = true
      trigger(checkbox, 'change')
      vm.$nextTick(() => {
        assert(vm.$validator1.field1.required === false)
        assert(vm.$validator1.field1.valid === true)
        assert(vm.$validator1.field1.touched === false)
        assert(vm.$validator1.field1.dirty === true)
        assert(vm.$validator1.field1.modified === true)
        assert(vm.$validator1.valid === true)
        assert(vm.$validator1.touched === false)
        assert(vm.$validator1.dirty === true)
        assert(vm.$validator1.modified === true)

        // move focus
        trigger(checkbox, 'blur')
        vm.$nextTick(() => {
          assert(vm.$validator1.field1.required === false)
          assert(vm.$validator1.field1.valid === true)
          assert(vm.$validator1.field1.touched === true)
          assert(vm.$validator1.field1.dirty === true)
          assert(vm.$validator1.field1.modified === true)
          assert(vm.$validator1.valid === true)
          assert(vm.$validator1.touched === true)
          assert(vm.$validator1.dirty === true)
          assert(vm.$validator1.modified === true)
          done()
        })
      })
    })
  })


  describe('multiple', () => {
    beforeEach((done) => {
      el.innerHTML = '<validator name="validator1">'
        + '<form novalidate>'
        + '<input type="checkbox" value="foo" v-validate:field1="{ required: true, minlength: 1 }">'
        + '<input type="checkbox" value="bar" v-validate:field1="{ required: true, minlength: 1 }">'
        + '</form>'
        + '</validator>'
      vm = new Vue({
        el: el
      })
      vm.$nextTick(done)
    })

    it('should be validated', (done) => {
      // default
      assert(vm.$validator1.field1.required)
      assert(vm.$validator1.field1.minlength === true)
      assert(vm.$validator1.field1.valid === false)
      assert(vm.$validator1.field1.touched === false)
      assert(vm.$validator1.field1.dirty === false)

      // checked checkbox1
      let checkbox1 = el.getElementsByTagName('input')[0]
      checkbox1.checked = true
      trigger(checkbox1, 'change')
      vm.$nextTick(() => {
        assert(vm.$validator1.field1.required === false)
        assert(vm.$validator1.field1.minlength === false)
        assert(vm.$validator1.field1.valid === true)
        assert(vm.$validator1.field1.touched === false)
        assert(vm.$validator1.field1.dirty === true)

        // move focus
        trigger(checkbox1, 'blur')
        vm.$nextTick(() => {
          assert(vm.$validator1.field1.required === false)
          assert(vm.$validator1.field1.minlength === false)
          assert(vm.$validator1.field1.valid === true)
          assert(vm.$validator1.field1.touched === true)
          assert(vm.$validator1.field1.dirty === true)

          // checked checkbox2
          // move focus
          // unchecked checkbox1
          let checkbox2 = el.getElementsByTagName('input')[1]
          checkbox2.checked = true
          checkbox1.checked = false
          trigger(checkbox2, 'change')
          trigger(checkbox2, 'blur')
          trigger(checkbox1, 'change')
          vm.$nextTick(() => {
            assert(vm.$validator1.field1.required === false)
            assert(vm.$validator1.field1.minlength === false)
            assert(vm.$validator1.field1.valid === true)
            assert(vm.$validator1.field1.touched === true)
            assert(vm.$validator1.field1.dirty === true)

            // unchecked checkbox2
            checkbox2.checked = false
            trigger(checkbox2, 'blur')
            trigger(checkbox2, 'change')
            vm.$nextTick(() => {
              assert(vm.$validator1.field1.required)
              assert(vm.$validator1.field1.minlength === true)
              assert(vm.$validator1.field1.valid === false)
              assert(vm.$validator1.field1.touched === true)
              assert(vm.$validator1.field1.dirty === true)
              done()
            })
          })
        })
      })
    })
  })


  describe('complex', () => {
    beforeEach((done) => {
      el.innerHTML = '<validator :groups="[\'group1\',\'group2\'] "name="validator1">'
        + '<form novalidate>'
        + '<fieldset>'
        + '<input type="checkbox" group="group1" checked value="foo" v-validate:field1="{ required: true, minlength: 1 }">'
        + '<input type="checkbox" group="group1" value="bar" v-validate:field1>'
        + '</fieldset>'
        + '<fieldset>'
        + '<input type="checkbox" group="group2" checked v-validate:field2="{ required: true }">'
        + '</fieldset>'
        + '</form>'
        + '</validator>'
      vm = new Vue({
        el: el
      })
      vm.$nextTick(done)
    })

    it('should be validated', (done) => {
      // default
      assert(vm.$validator1.field1.required === false)
      assert(vm.$validator1.field1.minlength === false)
      assert(vm.$validator1.field1.valid === true)
      assert(vm.$validator1.field1.touched === false)
      assert(vm.$validator1.field1.dirty === false)
      assert(vm.$validator1.field2.required === false)
      assert(vm.$validator1.field2.valid === true)
      assert(vm.$validator1.field2.touched === false)
      assert(vm.$validator1.field2.dirty === false)
      assert(vm.$validator1.group1.valid === true)
      assert(vm.$validator1.group1.dirty === false)
      assert(vm.$validator1.group1.modified === false)
      assert(vm.$validator1.group1.touched === false)
      assert(vm.$validator1.group2.valid === true)
      assert(vm.$validator1.group2.dirty === false)
      assert(vm.$validator1.group2.modified === false)
      assert(vm.$validator1.group2.touched === false)

      let checkbox1 = el.getElementsByTagName('input')[0]
      let checkbox2 = el.getElementsByTagName('input')[1]
      let checkbox3 = el.getElementsByTagName('input')[2]

      // all unchecked
      checkbox1.checked = false
      checkbox3.checked = false
      trigger(checkbox1, 'change')
      trigger(checkbox1, 'blur')
      trigger(checkbox3, 'change')
      trigger(checkbox3, 'blur')
      vm.$nextTick(() => {
        assert(vm.$validator1.field1.required)
        assert(vm.$validator1.field1.minlength === true)
        assert(vm.$validator1.field1.valid === false)
        assert(vm.$validator1.field1.touched === true)
        assert(vm.$validator1.field1.dirty === true)
        assert(vm.$validator1.field1.modified === true)
        assert(vm.$validator1.field2.required)
        assert(vm.$validator1.field2.valid === false)
        assert(vm.$validator1.field2.touched === true)
        assert(vm.$validator1.field2.dirty === true)
        assert(vm.$validator1.field2.modified === true)
        assert(vm.$validator1.group1.valid === false)
        assert(vm.$validator1.group1.dirty === true)
        assert(vm.$validator1.group1.modified === true)
        assert(vm.$validator1.group1.touched === true)
        assert(vm.$validator1.group2.valid === false)
        assert(vm.$validator1.group2.dirty === true)
        assert(vm.$validator1.group2.modified === true)
        assert(vm.$validator1.group2.touched === true)

        // all checked
        checkbox1.checked = true
        checkbox2.checked = true
        checkbox3.checked = true
        trigger(checkbox1, 'change')
        trigger(checkbox1, 'blur')
        trigger(checkbox2, 'change')
        trigger(checkbox2, 'blur')
        trigger(checkbox3, 'change')
        trigger(checkbox3, 'blur')
        vm.$nextTick(() => {
          assert(vm.$validator1.field1.required === false)
          assert(vm.$validator1.field1.minlength === false)
          assert(vm.$validator1.field1.valid === true)
          assert(vm.$validator1.field1.touched === true)
          assert(vm.$validator1.field1.dirty === true)
          assert(vm.$validator1.field1.modified === true)
          assert(vm.$validator1.field2.required === false)
          assert(vm.$validator1.field2.valid === true)
          assert(vm.$validator1.field2.touched === true)
          assert(vm.$validator1.field2.dirty === true)
          assert(vm.$validator1.field2.modified === false)
          assert(vm.$validator1.group1.valid === true)
          assert(vm.$validator1.group1.dirty === true)
          assert(vm.$validator1.group1.modified === true)
          assert(vm.$validator1.group1.touched === true)
          assert(vm.$validator1.group2.valid === true)
          assert(vm.$validator1.group2.dirty === true)
          assert(vm.$validator1.group2.modified === false)
          assert(vm.$validator1.group2.touched === true)
          done()
        })
      })
    })
  })


  describe('v-if', () => {
    context('a part', () => {
      beforeEach((done) => {
        el.innerHTML = '<validator name="validator1">'
          + '<form novalidate>'
          + '<input type="checkbox" value="foo" v-validate:field1="{ required: true }">'
          + '<input type="checkbox" v-if="enabled" checked value="bar" v-validate:field1>'
          + '</form>'
          + '</validator>'
        vm = new Vue({
          el: el,
          data: {
            enabled: true
          }
        })
        vm.$nextTick(done)
      })

      it('should be validated', (done) => {
        // default
        assert(vm.$validator1.field1.required === false)
        assert(vm.$validator1.field1.valid === true)
        assert(vm.$validator1.field1.touched === false)
        assert(vm.$validator1.field1.dirty === false)

        vm.$set('enabled', false)
        vm.$nextTick(() => {
          assert(vm.$validator1.field1.required)
          assert(vm.$validator1.field1.valid === false)
          assert(vm.$validator1.field1.touched === false)
          assert(vm.$validator1.field1.dirty === false)

          let checkbox1 = el.getElementsByTagName('input')[0]
          checkbox1.checked = true
          trigger(checkbox1, 'change')
          trigger(checkbox1, 'blur')

          vm.$nextTick(() => {
            assert(vm.$validator1.field1.required === false)
            assert(vm.$validator1.field1.valid === true)
            assert(vm.$validator1.field1.touched === true)
            assert(vm.$validator1.field1.dirty === true)

            vm.$set('enabled', true)
            vm.$nextTick(() => {
              assert(vm.$validator1.field1.required === false)
              assert(vm.$validator1.field1.valid === true)
              assert(vm.$validator1.field1.touched === true)
              assert(vm.$validator1.field1.dirty === true)

              let checkbox2 = el.getElementsByTagName('input')[1]
              checkbox2.checked = false
              trigger(checkbox2, 'blur')
              trigger(checkbox2, 'change')
              vm.$nextTick(() => {
                assert(vm.$validator1.field1.required === false)
                assert(vm.$validator1.field1.valid === true)
                assert(vm.$validator1.field1.touched === true)
                assert(vm.$validator1.field1.dirty === true)
                done()
              })
            })
          })
        })
      })
    })

    context('all', () => {
      beforeEach((done) => {
        el.innerHTML = '<validator name="validator1">'
          + '<form novalidate v-if="enabled">'
          + '<input type="checkbox" value="foo" v-validate:field1="{ required: true }">'
          + '<input type="checkbox" checked value="bar" v-validate:field1>'
          + '</form>'
          + '</validator>'
        vm = new Vue({
          el: el,
          data: {
            enabled: true
          }
        })
        vm.$nextTick(done)
      })

      it('should be validated', (done) => {
        // default
        assert(vm.$validator1.field1.required === false)
        assert(vm.$validator1.field1.valid === true)
        assert(vm.$validator1.field1.touched === false)
        assert(vm.$validator1.field1.dirty === false)

        // uncheckd checkbox
        let checkbox2 = el.getElementsByTagName('input')[1]
        checkbox2.checked = false
        trigger(checkbox2, 'change')
        trigger(checkbox2, 'blur')
        vm.$nextTick(() => {
          assert(vm.$validator1.field1.required)
          assert(vm.$validator1.field1.valid === false)
          assert(vm.$validator1.field1.touched === true)
          assert(vm.$validator1.field1.dirty === true)

          // set enabled property
          vm.$set('enabled', false)
          vm.$nextTick(() => {
            assert(vm.$validator1.field1 === undefined)

            // set enabled property
            vm.$set('enabled', true)
            vm.$nextTick(() => {
              assert(vm.$validator1.field1.required === false)
              assert(vm.$validator1.field1.valid === true)
              assert(vm.$validator1.field1.touched === false)
              assert(vm.$validator1.field1.dirty === false)

              done()
            })
          })
        })
      })
    })
  })
})
