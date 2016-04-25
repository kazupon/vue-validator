import assert from 'power-assert'
import Vue from 'vue'
import classes from 'component-classes'
import { each, trigger } from '../../src/util'


describe('validation classes', () => {
  let el, vm

  beforeEach(() => {
    el = document.createElement('div')
  })


  describe('text', () => {
    beforeEach((done) => {
      el.innerHTML = '<validator name="validator1">'
        + '<form novalidate>'
        + '<input type="text" v-validate:field1="{ required: true, minlength: 4 }">'
        + '</form>'
        + '</validator>'
      vm = new Vue({ el: el })
      vm.$nextTick(done)
    })

    it('should be added', (done) => {
      let field1 = el.getElementsByTagName('input')[0]
      let cls1 = classes(field1)
      assert(!cls1.has('valid'))
      assert(cls1.has('invalid'))
      assert(!cls1.has('touched'))
      assert(cls1.has('untouched'))
      assert(cls1.has('pristine'))
      assert(!cls1.has('dirty'))
      assert(!cls1.has('modified'))

      field1.value = 'hello'
      trigger(field1, 'input')
      trigger(field1, 'blur')
      vm.$nextTick(() => {
        assert(cls1.has('valid'))
        assert(!cls1.has('invalid'))
        assert(cls1.has('touched'))
        assert(!cls1.has('untouched'))
        assert(!cls1.has('pristine'))
        assert(cls1.has('dirty'))
        assert(cls1.has('modified'))

        done()
      })
    })
  })


  describe('checkbox', () => {
    beforeEach((done) => {
      el.innerHTML = '<validator name="validator1">'
        + '<form novalidate>'
        + '<input type="checkbox" value="foo" v-validate:field1="{ required: true, minlength: 2 }">'
        + '<input type="checkbox" value="bar" v-validate:field1>'
        + '<input type="checkbox" value="buz" v-validate:field1>'
        + '</form>'
        + '</validator>'
      vm = new Vue({ el: el })
      vm.$nextTick(done)
    })

    it('should be added', (done) => {
      let checkbox1 = el.getElementsByTagName('input')[0]
      let checkbox2 = el.getElementsByTagName('input')[1]
      let checkbox3 = el.getElementsByTagName('input')[2]
      let cls1 = classes(checkbox1)
      let cls2 = classes(checkbox2)
      let cls3 = classes(checkbox3)
      let checkboxClasses = [cls1, cls2, cls3]

      each(checkboxClasses, (cls, index) => {
        assert(!cls.has('valid'))
        assert(cls.has('invalid'))
        assert(!cls.has('touched'))
        assert(cls.has('untouched'))
        assert(cls.has('pristine'))
        assert(!cls.has('dirty'))
        assert(!cls.has('modified'))
      })

      checkbox1.checked = true
      trigger(checkbox1, 'change')
      trigger(checkbox1, 'blur')
      vm.$nextTick(() => {
        each(checkboxClasses, (cls, index) => {
          assert(!cls.has('valid'))
          assert(cls.has('invalid'))
          assert(cls.has('touched'))
          assert(!cls.has('untouched'))
          assert(!cls.has('pristine'))
          assert(cls.has('dirty'))
          assert(cls.has('modified'))
        })

        checkbox2.checked = true
        trigger(checkbox2, 'change')
        trigger(checkbox2, 'blur')
        vm.$nextTick(() => {
          each(checkboxClasses, (cls, index) => {
            assert(cls.has('valid'))
            assert(!cls.has('invalid'))
            assert(cls.has('touched'))
            assert(!cls.has('untouched'))
            assert(!cls.has('pristine'))
            assert(cls.has('dirty'))
            assert(cls.has('modified'))
          })

          done()
        })
      })
    })
  })


  describe('radio', () => {
    beforeEach((done) => {
      el.innerHTML = '<validator name="validator1">'
        + '<form novalidate>'
        + '<fieldset>'
        + '<label for="radio1">radio1</label>'
        + '<input type="radio" id="radio1" name="r1" checked value="foo" v-validate:field1="{ required: true }">'
        + '<label for="radio2">radio2</label>'
        + '<input type="radio" id="radio2" name="r1" value="bar" v-validate:field1="{ required: true }">'
        + '</fieldset>'
        + '<fieldset>'
        + '<label for="radio3">radio3</label>'
        + '<input type="radio" id="radio3" name="r2" value="buz" v-validate:field2="{ required: true }">'
        + '<label for="radio4">radio4</label>'
        + '<input type="radio" id="radio4" name="r2" value="hoge" v-validate:field2="{ required: true }">'
        + '</fieldset>'
        + '</form>'
        + '</validator>'
      vm = new Vue({ el: el })
      vm.$nextTick(done)
    })

    it('should be added', (done) => {
      let radio1 = el.getElementsByTagName('input')[0]
      let radio2 = el.getElementsByTagName('input')[1]
      let radio3 = el.getElementsByTagName('input')[2]
      let radio4 = el.getElementsByTagName('input')[3]
      let cls1 = classes(radio1)
      let cls2 = classes(radio2)
      let cls3 = classes(radio3)
      let cls4 = classes(radio4)
      let group1 = [cls1, cls2]
      let group2 = [cls3, cls4]

      each(group1, (cls, index) => {
        assert(cls.has('valid'))
        assert(!cls.has('invalid'))
        assert(!cls.has('touched'))
        assert(cls.has('untouched'))
        assert(cls.has('pristine'))
        assert(!cls.has('dirty'))
        assert(!cls.has('modified'))
      })
      each(group2, (cls, index) => {
        assert(!cls.has('valid'))
        assert(cls.has('invalid'))
        assert(!cls.has('touched'))
        assert(cls.has('untouched'))
        assert(cls.has('pristine'))
        assert(!cls.has('dirty'))
        assert(!cls.has('modified'))
      })

      radio1.checked = false
      radio3.checked = true
      trigger(radio2, 'change')
      trigger(radio2, 'blur')
      trigger(radio3, 'change')
      trigger(radio3, 'blur')
      vm.$nextTick(() => {
        each(group1, (cls, index) => {
          assert(!cls.has('valid'))
          assert(cls.has('invalid'))
          assert(cls.has('touched'))
          assert(!cls.has('untouched'))
          assert(!cls.has('pristine'))
          assert(cls.has('dirty'))
          assert(cls.has('modified'))
        })
        each(group2, (cls, index) => {
          assert(cls.has('valid'))
          assert(!cls.has('invalid'))
          assert(cls.has('touched'))
          assert(!cls.has('untouched'))
          assert(!cls.has('pristine'))
          assert(cls.has('dirty'))
          assert(cls.has('modified'))
        })

        done()
      })
    })
  })


  describe('select', () => {
    beforeEach((done) => {
      el.innerHTML = '<validator name="validator1">'
        + '<form novalidate>'
        + '<select multiple v-validate:lang="{ required: true, minlength: 2 }">'
        + '<option value="en">english</option>'
        + '<option value="ja">japanese</option>'
        + '<option value="zh">chinese</option>'
        + '<option value="fr">french</option>'
        + '<option value="de">German</option>'
        + '</select>'
        + '</form>'
        + '</validator>'
      vm = new Vue({ el: el })
      vm.$nextTick(done)
    })

    it('should be added', (done) => {
      let select = el.getElementsByTagName('select')[0]
      let option2 = el.getElementsByTagName('option')[1]
      let option3 = el.getElementsByTagName('option')[2]
      let cls = classes(select)

      assert(!cls.has('valid'))
      assert(cls.has('invalid'))
      assert(!cls.has('touched'))
      assert(cls.has('untouched'))
      assert(cls.has('pristine'))
      assert(!cls.has('dirty'))
      assert(!cls.has('modified'))

      option2.selected = true
      option3.selected = true
      trigger(select, 'change')
      trigger(select, 'blur')
      vm.$nextTick(() => {
        assert(cls.has('valid'))
        assert(!cls.has('invalid'))
        assert(cls.has('touched'))
        assert(!cls.has('untouched'))
        assert(!cls.has('pristine'))
        assert(cls.has('dirty'))
        assert(cls.has('modified'))

        done()
      })
    })
  })


  describe('custom classes', () => {
    describe('validator element directive', () => {
      beforeEach((done) => {
        el.innerHTML = '<validator :classes="classes" name="validator1">'
          + '<form novalidate>'
          + '<input type="text" v-validate:field1="{ required: true, minlength: 4 }">'
          + '</form>'
          + '</validator>'
        vm = new Vue({
          el: el,
          data: {
            classes: {
              valid: 'valid-ed-custom',
              invalid: 'invalid-ed-custom',
              touched: 'touched-ed-custom',
              untouched: 'untouched-ed-custom',
              pristine: 'pristine-ed-custom',
              dirty: 'dirty-ed-custom',
              modified: 'modified-ed-custom'
            }
          }
        })
        vm.$nextTick(done)
      })

      it('should be added', (done) => {
        let field1 = el.getElementsByTagName('input')[0]
        let cls1 = classes(field1)
        assert(!cls1.has('valid-ed-custom'))
        assert(cls1.has('invalid-ed-custom'))
        assert(!cls1.has('touched-ed-custom'))
        assert(cls1.has('untouched-ed-custom'))
        assert(cls1.has('pristine-ed-custom'))
        assert(!cls1.has('dirty-ed-custom'))
        assert(!cls1.has('modified-ed-custom'))

        field1.value = 'hello'
        trigger(field1, 'input')
        trigger(field1, 'blur')
        vm.$nextTick(() => {
          assert(cls1.has('valid-ed-custom'))
          assert(!cls1.has('invalid-ed-custom'))
          assert(cls1.has('touched-ed-custom'))
          assert(!cls1.has('untouched-ed-custom'))
          assert(!cls1.has('pristine-ed-custom'))
          assert(cls1.has('dirty-ed-custom'))
          assert(cls1.has('modified-ed-custom'))

          done()
        })
      })
    })

    describe('v-validate directive', () => {
      beforeEach((done) => {
        el.innerHTML = '<validator :classes="classes" name="validator1">'
          + '<form novalidate>'
          + '<input type="text" v-validate:field1="{ required: true, minlength: 4 }"'
          + '  :classes="{'
          + '    valid: \'valid-custom\', invalid: \'invalid-custom\','
          + '    touched: \'touched-custom\', untouched: \'untouched-custom\', '
          + '    pristine: \'pristine-custom\', dirty: \'dirty-custom\','
          + '    modified: \'modified-custom\''
          + '}">'
          + '</form>'
          + '</validator>'
        vm = new Vue({
          el: el,
          data: {
            classes: {
              valid: 'valid-ed-custom',
              invalid: 'invalid-ed-custom',
              touched: 'touched-ed-custom',
              untouched: 'untouched-ed-custom',
              pristine: 'pristine-ed-custom',
              dirty: 'dirty-ed-custom',
              modified: 'modified-ed-custom'
            }
          }
        })
        vm.$nextTick(done)
      })

      it('should be added', (done) => {
        let field1 = el.getElementsByTagName('input')[0]
        let cls1 = classes(field1)
        assert(!cls1.has('valid-custom'))
        assert(cls1.has('invalid-custom'))
        assert(!cls1.has('touched-custom'))
        assert(cls1.has('untouched-custom'))
        assert(cls1.has('pristine-custom'))
        assert(!cls1.has('dirty-custom'))
        assert(!cls1.has('modified-custom'))

        field1.value = 'hello'
        trigger(field1, 'input')
        trigger(field1, 'blur')
        vm.$nextTick(() => {
          assert(cls1.has('valid-custom'))
          assert(!cls1.has('invalid-custom'))
          assert(cls1.has('touched-custom'))
          assert(!cls1.has('untouched-custom'))
          assert(!cls1.has('pristine-custom'))
          assert(cls1.has('dirty-custom'))
          assert(cls1.has('modified-custom'))

          done()
        })
      })
    })
  })
})
