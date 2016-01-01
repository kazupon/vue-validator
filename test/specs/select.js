import assert from 'power-assert'
import Vue from 'vue'
import { trigger } from '../../src/util'


describe('select', () => {
  let el, vm

  beforeEach(() => {
    el = document.createElement('div')
  })


  describe('single', () => {
    context('default selected', () => {
      beforeEach((done) => {
        el.innerHTML = 
          '<validator name="validator1">' +
          '<form novalidate>' +
          '<select v-validate:lang="{ required: true }">' +
          '<option value="en">english</option>' +
          '<option value="ja">japanese</option>' +
          '<option value="zh">chinese</option>' +
          '</select>' +
          '</form>' +
          '</validator>'
        vm = new Vue({
          el: el
        })
        vm.$nextTick(done)
      })

      it('should be validated', (done) => {
        // default
        assert(vm.$validator1.lang.required === false)
        assert(vm.$validator1.lang.valid === true)
        assert(vm.$validator1.lang.touched === false)
        assert(vm.$validator1.lang.dirty === false)
        assert(vm.$validator1.lang.modified === false)
        assert(vm.$validator1.valid === true)
        assert(vm.$validator1.touched === false)
        assert(vm.$validator1.dirty === false)
        assert(vm.$validator1.modified === false)

        let select = el.getElementsByTagName('select')[0]

        // select a language
        let option2 = el.getElementsByTagName('option')[1]
        option2.selected = true
        trigger(select, 'change')
        trigger(select, 'blur')
        vm.$nextTick(() => {
          assert(vm.$validator1.lang.required === false)
          assert(vm.$validator1.lang.valid === true)
          assert(vm.$validator1.lang.touched === true)
          assert(vm.$validator1.lang.dirty === true)
          assert(vm.$validator1.lang.modified === true)
          assert(vm.$validator1.valid === true)
          assert(vm.$validator1.touched === true)
          assert(vm.$validator1.dirty === true)
          assert(vm.$validator1.modified === true)

          done()
        })
      })
    })

    context('selected', () => {
      beforeEach((done) => {
        el.innerHTML = 
          '<validator name="validator1">' +
          '<form novalidate>' +
          '<select v-validate:lang="{ required: true }">' +
          '<option value="en">english</option>' +
          '<option selected value="ja">japanese</option>' +
          '<option value="zh">chinese</option>' +
          '</select>' +
          '</form>' +
          '</validator>'
        vm = new Vue({
          el: el
        })
        vm.$nextTick(done)
      })

      it('should be validated', (done) => {
        // default
        assert(vm.$validator1.lang.required === false)
        assert(vm.$validator1.lang.valid === true)
        assert(vm.$validator1.lang.touched === false)
        assert(vm.$validator1.lang.dirty === false)
        assert(vm.$validator1.lang.modified === false)
        assert(vm.$validator1.valid === true)
        assert(vm.$validator1.touched === false)
        assert(vm.$validator1.dirty === false)
        assert(vm.$validator1.modified === false)

        let select = el.getElementsByTagName('select')[0]

        // select a language
        let option1 = el.getElementsByTagName('option')[0]
        option1.selected = true
        trigger(select, 'change')
        trigger(select, 'blur')
        vm.$nextTick(() => {
          assert(vm.$validator1.lang.required === false)
          assert(vm.$validator1.lang.valid === true)
          assert(vm.$validator1.lang.touched === true)
          assert(vm.$validator1.lang.dirty === true)
          assert(vm.$validator1.lang.modified === true)
          assert(vm.$validator1.valid === true)
          assert(vm.$validator1.touched === true)
          assert(vm.$validator1.dirty === true)
          assert(vm.$validator1.modified === true)

          // select a default selected language
          let option2 = el.getElementsByTagName('option')[1]
          option2.selected = true
          trigger(select, 'change')
          trigger(select, 'blur')
          vm.$nextTick(() => {
            assert(vm.$validator1.lang.required === false)
            assert(vm.$validator1.lang.valid === true)
            assert(vm.$validator1.lang.touched === true)
            assert(vm.$validator1.lang.dirty === true)
            assert(vm.$validator1.lang.modified === false)
            assert(vm.$validator1.valid === true)
            assert(vm.$validator1.touched === true)
            assert(vm.$validator1.dirty === true)
            assert(vm.$validator1.modified === false)

            done()
          })
        })
      })
    })

    context('placeholder', () => {
      beforeEach((done) => {
        el.innerHTML = 
          '<validator name="validator1">' +
          '<form novalidate>' +
          '<select v-validate:lang="{ required: true }">' +
          '<option value="">select a language</option>' +
          '<option value="en">english</option>' +
          '<option value="ja">japanese</option>' +
          '<option value="zh">chinese</option>' +
          '</select>' +
          '</form>' +
          '</validator>'
        vm = new Vue({
          el: el
        })
        vm.$nextTick(done)
      })

      it('should be validated', (done) => {
        // default
        assert(vm.$validator1.lang.required === true)
        assert(vm.$validator1.lang.valid === false)
        assert(vm.$validator1.lang.touched === false)
        assert(vm.$validator1.lang.dirty === false)
        assert(vm.$validator1.lang.modified === false)
        assert(vm.$validator1.valid === false)
        assert(vm.$validator1.touched === false)
        assert(vm.$validator1.dirty === false)
        assert(vm.$validator1.modified === false)

        let select = el.getElementsByTagName('select')[0]

        // select a language
        let option1 = el.getElementsByTagName('option')[1]
        option1.selected = true
        trigger(select, 'change')
        trigger(select, 'blur')
        vm.$nextTick(() => {
          assert(vm.$validator1.lang.required === false)
          assert(vm.$validator1.lang.valid === true)
          assert(vm.$validator1.lang.touched === true)
          assert(vm.$validator1.lang.dirty === true)
          assert(vm.$validator1.lang.modified === true)
          assert(vm.$validator1.valid === true)
          assert(vm.$validator1.touched === true)
          assert(vm.$validator1.dirty === true)
          assert(vm.$validator1.modified === true)

          // select the placeholder
          let placeholder = el.getElementsByTagName('option')[0]
          placeholder.selected = true
          trigger(select, 'change')
          trigger(select, 'blur')
          vm.$nextTick(() => {
            assert(vm.$validator1.lang.required === true)
            assert(vm.$validator1.lang.valid === false)
            assert(vm.$validator1.lang.touched === true)
            assert(vm.$validator1.lang.dirty === true)
            assert(vm.$validator1.lang.modified === false)
            assert(vm.$validator1.valid === false)
            assert(vm.$validator1.touched === true)
            assert(vm.$validator1.dirty === true)
            assert(vm.$validator1.modified === false)

            done()
          })
        })
      })
    })
  })


  describe('multiple', () => {
    context('nothing default selected', () => {
      beforeEach((done) => {
        el.innerHTML = 
          '<validator name="validator1">' +
          '<form novalidate>' +
          '<select multiple v-validate:lang="{ required: true, minlength: 2 }">' +
          '<option value="en">english</option>' +
          '<option value="ja">japanese</option>' +
          '<option value="zh">chinese</option>' +
          '<option value="fr">french</option>' +
          '<option value="de">German</option>' +
          '</select>' +
          '</form>' +
          '</validator>'
        vm = new Vue({
          el: el
        })
        vm.$nextTick(done)
      })

      it('should be validated', (done) => {
        // default
        assert(vm.$validator1.lang.required === true)
        assert(vm.$validator1.lang.minlength === true)
        assert(vm.$validator1.lang.valid === false)
        assert(vm.$validator1.lang.touched === false)
        assert(vm.$validator1.lang.dirty === false)
        assert(vm.$validator1.lang.modified === false)
        assert(vm.$validator1.valid === false)
        assert(vm.$validator1.touched === false)
        assert(vm.$validator1.dirty === false)
        assert(vm.$validator1.modified === false)

        let select = el.getElementsByTagName('select')[0]

        // select a language
        let option2 = el.getElementsByTagName('option')[1]
        let option3 = el.getElementsByTagName('option')[2]
        option2.selected = true
        option3.selected = true
        trigger(select, 'change')
        trigger(select, 'blur')
        vm.$nextTick(() => {
          assert(vm.$validator1.lang.required === false)
          assert(vm.$validator1.lang.minlength === false)
          assert(vm.$validator1.lang.valid === true)
          assert(vm.$validator1.lang.touched === true)
          assert(vm.$validator1.lang.dirty === true)
          assert(vm.$validator1.lang.modified === true)
          assert(vm.$validator1.valid === true)
          assert(vm.$validator1.touched === true)
          assert(vm.$validator1.dirty === true)
          assert(vm.$validator1.modified === true)

          done()
        })
      })
    })

    context('default selected', () => {
      beforeEach((done) => {
        el.innerHTML = 
          '<validator name="validator1">' +
          '<form novalidate>' +
          '<select multiple v-validate:lang="{ required: true, minlength: 2 }">' +
          '<option selected value="en">english</option>' +
          '<option selected value="ja">japanese</option>' +
          '<option selected value="zh">chinese</option>' +
          '<option value="fr">french</option>' +
          '<option value="de">German</option>' +
          '</select>' +
          '</form>' +
          '</validator>'
        vm = new Vue({
          el: el
        })
        vm.$nextTick(done)
      })

      it('should be validated', (done) => {
        // default
        assert(vm.$validator1.lang.required === false)
        assert(vm.$validator1.lang.minlength === false)
        assert(vm.$validator1.lang.valid === true)
        assert(vm.$validator1.lang.touched === false)
        assert(vm.$validator1.lang.dirty === false)
        assert(vm.$validator1.lang.modified === false)
        assert(vm.$validator1.valid === true)
        assert(vm.$validator1.touched === false)
        assert(vm.$validator1.dirty === false)
        assert(vm.$validator1.modified === false)

        let select = el.getElementsByTagName('select')[0]

        // select a language
        let option4 = el.getElementsByTagName('option')[3]
        let option5 = el.getElementsByTagName('option')[4]
        option4.selected = true
        option5.selected = true
        trigger(select, 'change')
        trigger(select, 'blur')
        vm.$nextTick(() => {
          assert(vm.$validator1.lang.required === false)
          assert(vm.$validator1.lang.minlength === false)
          assert(vm.$validator1.lang.valid === true)
          assert(vm.$validator1.lang.touched === true)
          assert(vm.$validator1.lang.dirty === true)
          assert(vm.$validator1.lang.modified === true)
          assert(vm.$validator1.valid === true)
          assert(vm.$validator1.touched === true)
          assert(vm.$validator1.dirty === true)
          assert(vm.$validator1.modified === true)

          // back to default selected states
          option4.selected = false
          option5.selected = false
          trigger(select, 'change')
          trigger(select, 'blur')
          vm.$nextTick(() => {
            assert(vm.$validator1.lang.required === false)
            assert(vm.$validator1.lang.minlength === false)
            assert(vm.$validator1.lang.valid === true)
            assert(vm.$validator1.lang.touched === true)
            assert(vm.$validator1.lang.dirty === true)
            assert(vm.$validator1.lang.modified === false)
            assert(vm.$validator1.valid === true)
            assert(vm.$validator1.touched === true)
            assert(vm.$validator1.dirty === true)
            assert(vm.$validator1.modified === false)

            done()
          })
        })
      })
    })

    context('placeholder', () => {
      beforeEach((done) => {
        el.innerHTML = 
          '<validator name="validator1">' +
          '<form novalidate>' +
          '<select multiple="true" v-validate:lang="{ required: true, minlength: 2 }">' +
          '<option value="">select languages</option>' +
          '<option value="en">english</option>' +
          '<option value="ja">japanese</option>' +
          '<option value="zh">chinese</option>' +
          '<option value="fr">french</option>' +
          '<option value="de">German</option>' +
          '</select>' +
          '</form>' +
          '</validator>'
        vm = new Vue({
          el: el
        })
        vm.$nextTick(done)
      })

      it('should be validated', (done) => {
        // default
        assert(vm.$validator1.lang.required === true)
        assert(vm.$validator1.lang.minlength === true)
        assert(vm.$validator1.lang.valid === false)
        assert(vm.$validator1.lang.touched === false)
        assert(vm.$validator1.lang.dirty === false)
        assert(vm.$validator1.lang.modified === false)
        assert(vm.$validator1.valid === false)
        assert(vm.$validator1.touched === false)
        assert(vm.$validator1.dirty === false)
        assert(vm.$validator1.modified === false)

        let select = el.getElementsByTagName('select')[0]

        // select some language (include placeholder)
        let option1 = el.getElementsByTagName('option')[0]
        let option2 = el.getElementsByTagName('option')[1]
        option1.selected = true
        option2.selected = true
        trigger(select, 'change')
        trigger(select, 'blur')
        vm.$nextTick(() => {
          assert(vm.$validator1.lang.required === true)
          assert(vm.$validator1.lang.minlength === false)
          assert(vm.$validator1.lang.valid === false)
          assert(vm.$validator1.lang.touched === true)
          assert(vm.$validator1.lang.dirty === true)
          assert(vm.$validator1.lang.modified === true)
          assert(vm.$validator1.valid === false)
          assert(vm.$validator1.touched === true)
          assert(vm.$validator1.dirty === true)
          assert(vm.$validator1.modified === true)

          // add selecting language
          let option3 = el.getElementsByTagName('option')[2]
          option3.selected = true
          trigger(select, 'change')
          trigger(select, 'blur')
          vm.$nextTick(() => {
            assert(vm.$validator1.lang.required === true)
            assert(vm.$validator1.lang.minlength === false)
            assert(vm.$validator1.lang.valid === false)
            assert(vm.$validator1.lang.touched === true)
            assert(vm.$validator1.lang.dirty === true)
            assert(vm.$validator1.lang.modified === true)
            assert(vm.$validator1.valid === false)
            assert(vm.$validator1.touched === true)
            assert(vm.$validator1.dirty === true)
            assert(vm.$validator1.modified === true)

            // remove placeholder selecting
            option1.selected = false
            trigger(select, 'change')
            trigger(select, 'blur')
            vm.$nextTick(() => {
              assert(vm.$validator1.lang.required === false)
              assert(vm.$validator1.lang.minlength === false)
              assert(vm.$validator1.lang.valid === true)
              assert(vm.$validator1.lang.touched === true)
              assert(vm.$validator1.lang.dirty === true)
              assert(vm.$validator1.lang.modified === true)
              assert(vm.$validator1.valid === true)
              assert(vm.$validator1.touched === true)
              assert(vm.$validator1.dirty === true)
              assert(vm.$validator1.modified === true)

              done()
            })
          })
        })
      })
    })
  })
})
