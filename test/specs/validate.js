import assert from 'power-assert'
import Vue from 'vue'


describe('$validate', () => {
  let el, vm

  beforeEach(() => {
    el = document.createElement('div')
  })


  describe('text', () => {
    beforeEach((done) => {
      el.innerHTML = '<validator name="validator1">'
        + '<form novalidate>'
        + '<input type="number" v-validate:field1="{ required: true, min: 0, max: 10 }">'
        + '<input type="text" value="hello" v-validate:field2="{ minlength: 4 }">'
        + '</form>'
        + '</validator>'
      vm = new Vue({ el: el })
      vm.$nextTick(done)
    })

    it('should be validated', (done) => {
      assert(vm.$validator1.field1.required)
      assert(vm.$validator1.field1.min === false)
      assert(vm.$validator1.field1.max === false)
      assert(vm.$validator1.field1.valid === false)
      assert(vm.$validator1.field1.dirty === false)
      assert(vm.$validator1.field1.modified === false)
      assert(vm.$validator1.field1.touched === false)
      assert(vm.$validator1.field2.minlength === false)
      assert(vm.$validator1.field2.valid === true)
      assert(vm.$validator1.field2.dirty === false)
      assert(vm.$validator1.field2.modified === false)
      assert(vm.$validator1.field2.touched === false)
      assert(vm.$validator1.valid === false)
      assert(vm.$validator1.dirty === false)
      assert(vm.$validator1.modified === false)
      assert(vm.$validator1.touched === false)

      let field1 = el.getElementsByTagName('input')[0]
      let field2 = el.getElementsByTagName('input')[1]
      field1.value = '11'
      field2.value = 'hi'
      vm.$nextTick(() => {
        vm.$validate('field1', () => {
          vm.$validate('field2', () => {
            assert(vm.$validator1.field1.required === false)
            assert(vm.$validator1.field1.min === false)
            assert(vm.$validator1.field1.max === true)
            assert(vm.$validator1.field1.valid === false)
            assert(vm.$validator1.field1.dirty === true)
            assert(vm.$validator1.field1.modified === true)
            assert(vm.$validator1.field1.touched === false)
            assert(vm.$validator1.field2.minlength === true)
            assert(vm.$validator1.field2.valid === false)
            assert(vm.$validator1.field2.dirty === true)
            assert(vm.$validator1.field2.modified === true)
            assert(vm.$validator1.field2.touched === false)
            assert(vm.$validator1.valid === false)
            assert(vm.$validator1.dirty === true)
            assert(vm.$validator1.modified === true)
            assert(vm.$validator1.touched === false)

            done()
          })
        })
      })
    })
  })


  describe('checkbox', () => {
    beforeEach((done) => {
      el.innerHTML = '<validator name="validator1">'
        + '<form novalidate>'
        + '<input type="checkbox" value="foo" v-validate:field1="{ required: true, minlength: 1 }">'
        + '<input type="checkbox" value="bar" v-validate:field1>'
        + '<input type="checkbox" value="buz" v-validate:field1>'
        + '</form>'
        + '</validator>'
      vm = new Vue({ el: el })
      vm.$nextTick(done)
    })

    it('should be validated', (done) => {
      assert(vm.$validator1.field1.required)
      assert(vm.$validator1.field1.minlength === true)
      assert(vm.$validator1.field1.valid === false)
      assert(vm.$validator1.field1.touched === false)
      assert(vm.$validator1.field1.dirty === false)
      assert(vm.$validator1.field1.modified === false)
      assert(vm.$validator1.valid === false)
      assert(vm.$validator1.dirty === false)
      assert(vm.$validator1.modified === false)
      assert(vm.$validator1.touched === false)

      let checkbox1 = el.getElementsByTagName('input')[0]
      let checkbox2 = el.getElementsByTagName('input')[1]
      checkbox1.checked = true
      checkbox2.checked = true
      vm.$nextTick(() => {
        vm.$validate('field1')

        assert(vm.$validator1.field1.required === false)
        assert(vm.$validator1.field1.minlength === false)
        assert(vm.$validator1.field1.valid === true)
        assert(vm.$validator1.field1.touched === false)
        assert(vm.$validator1.field1.dirty === true)
        assert(vm.$validator1.field1.modified === true)
        assert(vm.$validator1.valid === true)
        assert(vm.$validator1.dirty === true)
        assert(vm.$validator1.modified === true)
        assert(vm.$validator1.touched === false)

        done()
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

      // change
      let radio2 = el.getElementsByTagName('input')[1]
      let radio3 = el.getElementsByTagName('input')[2]
      radio2.checked = true
      radio3.checked = true
      vm.$nextTick(() => {
        vm.$validate('field1', () => {
          vm.$validate('field2', () => {
            assert(vm.$validator1.field1.required === false)
            assert(vm.$validator1.field1.valid === true)
            assert(vm.$validator1.field1.touched === false)
            assert(vm.$validator1.field1.dirty === true)
            assert(vm.$validator1.field1.modified === true)
            assert(vm.$validator1.field2.required === false)
            assert(vm.$validator1.field2.valid === true)
            assert(vm.$validator1.field2.touched === false)
            assert(vm.$validator1.field2.dirty === true)
            assert(vm.$validator1.field2.modified === true)
            assert(vm.$validator1.valid === true)
            assert(vm.$validator1.touched === false)
            assert(vm.$validator1.dirty === true)
            assert(vm.$validator1.modified === true)

            done()
          })
        })
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
      vm = new Vue({
        el: el
      })
      vm.$nextTick(done)
    })

    it('should be validated', (done) => {
      // default
      assert(vm.$validator1.lang.required)
      assert(vm.$validator1.lang.minlength === true)
      assert(vm.$validator1.lang.valid === false)
      assert(vm.$validator1.lang.touched === false)
      assert(vm.$validator1.lang.dirty === false)
      assert(vm.$validator1.lang.modified === false)
      assert(vm.$validator1.valid === false)
      assert(vm.$validator1.touched === false)
      assert(vm.$validator1.dirty === false)
      assert(vm.$validator1.modified === false)

      // change
      let option2 = el.getElementsByTagName('option')[1]
      let option3 = el.getElementsByTagName('option')[2]
      option2.selected = true
      option3.selected = true
      vm.$nextTick(() => {
        vm.$validate('lang')

        assert(vm.$validator1.lang.required === false)
        assert(vm.$validator1.lang.minlength === false)
        assert(vm.$validator1.lang.valid === true)
        assert(vm.$validator1.lang.touched === false)
        assert(vm.$validator1.lang.dirty === true)
        assert(vm.$validator1.lang.modified === true)
        assert(vm.$validator1.valid === true)
        assert(vm.$validator1.touched === false)
        assert(vm.$validator1.dirty === true)
        assert(vm.$validator1.modified === true)

        done()
      })
    })
  })


  describe('arguments', () => {
    beforeEach((done) => {
      el.innerHTML = '<validator name="validator1">'
        + '<form novalidate>'
        + '<input type="number" v-validate:field1="{ required: true, min: 0, max: 10 }">'
        + '<input type="text" value="hello" v-validate:field2="{ minlength: 4 }">'
        + '<input type="checkbox" value="foo" v-validate:checkbox="{ required: true, minlength: 1 }">'
        + '<input type="checkbox" value="bar" v-validate:checkbox>'
        + '<input type="checkbox" value="buz" v-validate:checkbox>'
        + '<fieldset>'
        + '<label for="radio1">radio1</label>'
        + '<input type="radio" id="radio1" name="r1" checked value="foo" v-validate:radio="{ required: true }">'
        + '<label for="radio2">radio2</label>'
        + '<input type="radio" id="radio2" name="r1" value="bar" v-validate:radio="{ required: true }">'
        + '</fieldset>'
        + '<select multiple v-validate:select="{ required: true, minlength: 2 }">'
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

    describe('not specify', () => {
      it('should be validated', (done) => {
        assert(vm.$validator1.field1.required)
        assert(vm.$validator1.field1.min === false)
        assert(vm.$validator1.field1.max === false)
        assert(vm.$validator1.field1.valid === false)
        assert(vm.$validator1.field1.dirty === false)
        assert(vm.$validator1.field1.modified === false)
        assert(vm.$validator1.field1.touched === false)
        assert(vm.$validator1.field2.minlength === false)
        assert(vm.$validator1.field2.valid === true)
        assert(vm.$validator1.field2.dirty === false)
        assert(vm.$validator1.field2.modified === false)
        assert(vm.$validator1.field2.touched === false)
        assert(vm.$validator1.valid === false)
        assert(vm.$validator1.dirty === false)
        assert(vm.$validator1.modified === false)
        assert(vm.$validator1.touched === false)

        let field1 = el.getElementsByTagName('input')[0]
        let field2 = el.getElementsByTagName('input')[1]
        field1.value = '11'
        field2.value = 'hi'
        vm.$nextTick(() => {
          vm.$validate(() => {
            assert(vm.$validator1.field1.required === false)
            assert(vm.$validator1.field1.min === false)
            assert(vm.$validator1.field1.max === true)
            assert(vm.$validator1.field1.valid === false)
            assert(vm.$validator1.field1.dirty === true)
            assert(vm.$validator1.field1.modified === true)
            assert(vm.$validator1.field1.touched === false)
            assert(vm.$validator1.field2.minlength === true)
            assert(vm.$validator1.field2.valid === false)
            assert(vm.$validator1.field2.dirty === true)
            assert(vm.$validator1.field2.modified === true)
            assert(vm.$validator1.field2.touched === false)
            assert(vm.$validator1.valid === false)
            assert(vm.$validator1.dirty === true)
            assert(vm.$validator1.modified === true)
            assert(vm.$validator1.touched === false)

            done()
          })
        })
      })
    })

    describe('touched', () => {
      it('should be validated', (done) => {
        assert(vm.$validator1.field1.required)
        assert(vm.$validator1.field1.min === false)
        assert(vm.$validator1.field1.max === false)
        assert(vm.$validator1.field1.valid === false)
        assert(vm.$validator1.field1.dirty === false)
        assert(vm.$validator1.field1.modified === false)
        assert(vm.$validator1.field1.touched === false)
        assert(vm.$validator1.field2.minlength === false)
        assert(vm.$validator1.field2.valid === true)
        assert(vm.$validator1.field2.dirty === false)
        assert(vm.$validator1.field2.modified === false)
        assert(vm.$validator1.field2.touched === false)
        assert(vm.$validator1.valid === false)
        assert(vm.$validator1.dirty === false)
        assert(vm.$validator1.modified === false)
        assert(vm.$validator1.touched === false)

        let field2 = el.getElementsByTagName('input')[1]
        field2.value = 'hi'
        vm.$nextTick(() => {
          vm.$validate('field2', true)

          assert(vm.$validator1.field1.required)
          assert(vm.$validator1.field1.min === false)
          assert(vm.$validator1.field1.max === false)
          assert(vm.$validator1.field1.valid === false)
          assert(vm.$validator1.field1.dirty === false)
          assert(vm.$validator1.field1.modified === false)
          assert(vm.$validator1.field1.touched === false)
          assert(vm.$validator1.field2.minlength === true)
          assert(vm.$validator1.field2.valid === false)
          assert(vm.$validator1.field2.dirty === true)
          assert(vm.$validator1.field2.modified === true)
          assert(vm.$validator1.field2.touched === true)
          assert(vm.$validator1.valid === false)
          assert(vm.$validator1.dirty === true)
          assert(vm.$validator1.modified === true)
          assert(vm.$validator1.touched === true)
          
          done()
        })
      })
    })

    describe('touched for all validatable elements', () => {
      it('should be validated', (done) => {
        assert(vm.$validator1.field1.touched === false)
        assert(vm.$validator1.field2.touched === false)
        assert(vm.$validator1.checkbox.touched === false)
        assert(vm.$validator1.radio.touched === false)
        assert(vm.$validator1.select.touched === false)
        assert(vm.$validator1.touched === false)

        vm.$nextTick(() => {
          vm.$validate('field2')
          vm.$validate('checkbox')
          vm.$validate('radio')
          vm.$validate('select')

          assert(vm.$validator1.field1.touched === false)
          assert(vm.$validator1.field2.touched === false)
          assert(vm.$validator1.checkbox.touched === false)
          assert(vm.$validator1.radio.touched === false)
          assert(vm.$validator1.select.touched === false)
          assert(vm.$validator1.touched === false)

          vm.$validate('field2', true)
          vm.$validate('checkbox', true)
          vm.$validate('radio', true)
          vm.$validate('select', true)

          assert(vm.$validator1.field1.touched === false)
          assert(vm.$validator1.field2.touched === true)
          assert(vm.$validator1.checkbox.touched === true)
          assert(vm.$validator1.radio.touched === true)
          assert(vm.$validator1.select.touched === true)
          assert(vm.$validator1.touched === true)

          done()
        })
      })
    })
  })
})
