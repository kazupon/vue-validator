import assert from 'power-assert'
import Vue from 'vue'
import classes from 'component-classes'
import { trigger } from '../../../src/util'


describe('validate-class directive', () => {
  let el, vm

  beforeEach(() => {
    el = document.createElement('div')
  })


  describe('text', () => {
    beforeEach((done) => {
      el.innerHTML = `
        <validator name="validator1">
          <form novalidate>
            <div v-validate-class>
              <input type="text" v-validate:field1="{ required: true, minlength: 4 }">
            </div>
          </form>
        </validator>
      `
      vm = new Vue({ el: el })
      vm.$nextTick(done)
    })

    it('should be added', (done) => {
      let field1 = el.getElementsByTagName('input')[0]
      let div = el.getElementsByTagName('div')[0]
      let cls1 = classes(div)
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
      el.innerHTML = `
        <validator name="validator1">
          <form novalidate>
            <div v-validate-class>
              <input type="checkbox" value="foo" v-validate:field1="{ required: true, minlength: 2 }">
              <input type="checkbox" value="bar" v-validate:field1>
              <input type="checkbox" value="buz" v-validate:field1>
            </div>
          </form>
        </validator>
      ` 
      vm = new Vue({ el: el })
      vm.$nextTick(done)
    })

    it('should be added', (done) => {
      let checkbox1 = el.getElementsByTagName('input')[0]
      let checkbox2 = el.getElementsByTagName('input')[1]
      let div = el.getElementsByTagName('div')[0]
      let cls = classes(div)

      assert(!cls.has('valid'))
      assert(cls.has('invalid'))
      assert(!cls.has('touched'))
      assert(cls.has('untouched'))
      assert(cls.has('pristine'))
      assert(!cls.has('dirty'))
      assert(!cls.has('modified'))

      checkbox1.checked = true
      trigger(checkbox1, 'change')
      trigger(checkbox1, 'blur')
      vm.$nextTick(() => {
        assert(!cls.has('valid'))
        assert(cls.has('invalid'))
        assert(cls.has('touched'))
        assert(!cls.has('untouched'))
        assert(!cls.has('pristine'))
        assert(cls.has('dirty'))
        assert(cls.has('modified'))

        checkbox2.checked = true
        trigger(checkbox2, 'change')
        trigger(checkbox2, 'blur')
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
  })


  describe('radio', () => {
    beforeEach((done) => {
      el.innerHTML = `
        <validator name="validator1">
          <form novalidate>
            <fieldset v-validate-class>
              <label for="radio1">radio1</label>
              <input type="radio" id="radio1" name="r1" checked value="foo" v-validate:field1="{ required: true }">
              <label for="radio2">radio2</label>
              <input type="radio" id="radio2" name="r1" value="bar" v-validate:field1="{ required: true }">
            </fieldset>
            <fieldset v-validate-class>
              <label for="radio3">radio3</label>
              <input type="radio" id="radio3" name="r2" value="buz" v-validate:field2="{ required: true }">
              <label for="radio4">radio4</label>
              <input type="radio" id="radio4" name="r2" value="hoge" v-validate:field2="{ required: true }">
            </fieldset>
          </form>
        </validator>
      ` 
      vm = new Vue({ el: el })
      vm.$nextTick(done)
    })

    it('should be added', (done) => {
      let radio1 = el.getElementsByTagName('input')[0]
      let radio2 = el.getElementsByTagName('input')[1]
      let radio3 = el.getElementsByTagName('input')[2]
      let fieldset1 = el.getElementsByTagName('fieldset')[0]
      let fieldset2 = el.getElementsByTagName('fieldset')[1]
      let cls1 = classes(fieldset1)
      let cls2 = classes(fieldset2)

      assert(cls1.has('valid'))
      assert(!cls1.has('invalid'))
      assert(!cls1.has('touched'))
      assert(cls1.has('untouched'))
      assert(cls1.has('pristine'))
      assert(!cls1.has('dirty'))
      assert(!cls1.has('modified'))

      assert(!cls2.has('valid'))
      assert(cls2.has('invalid'))
      assert(!cls2.has('touched'))
      assert(cls2.has('untouched'))
      assert(cls2.has('pristine'))
      assert(!cls2.has('dirty'))
      assert(!cls2.has('modified'))

      radio1.checked = false
      radio3.checked = true
      trigger(radio2, 'change')
      trigger(radio2, 'blur')
      trigger(radio3, 'change')
      trigger(radio3, 'blur')
      vm.$nextTick(() => {
        assert(!cls1.has('valid'))
        assert(cls1.has('invalid'))
        assert(cls1.has('touched'))
        assert(!cls1.has('untouched'))
        assert(!cls1.has('pristine'))
        assert(cls1.has('dirty'))
        assert(cls1.has('modified'))

        assert(cls2.has('valid'))
        assert(!cls2.has('invalid'))
        assert(cls2.has('touched'))
        assert(!cls2.has('untouched'))
        assert(!cls2.has('pristine'))
        assert(cls2.has('dirty'))
        assert(cls2.has('modified'))

        done()
      })
    })
  })


  describe('select', () => {
    beforeEach((done) => {
      el.innerHTML = `
        <validator name="validator1">
          <form novalidate>
            <div v-validate-class>
              <select multiple v-validate:lang="{ required: true, minlength: 2 }">
                <option value="en">english</option>
                <option value="ja">japanese</option>
                <option value="zh">chinese</option>
                <option value="fr">french</option>
                <option value="de">German</option>
              </select>
            </div>
          </form>
        </validator>
      ` 
      vm = new Vue({ el: el })
      vm.$nextTick(done)
    })

    it('should be added', (done) => {
      let select = el.getElementsByTagName('select')[0]
      let option2 = el.getElementsByTagName('option')[1]
      let option3 = el.getElementsByTagName('option')[2]
      let div = el.getElementsByTagName('div')[0]
      let cls = classes(div)

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
})
