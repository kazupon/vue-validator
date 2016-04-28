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

  describe('#208', () => {
    describe('radio', () => {
      beforeEach((done) => {
        el.innerHTML = '<validator name="validator1">'
          + '<form novalidate>'
          + '<h1>Survey</h1>'
          + '<fieldset>'
          + '<legend>Which do you like fruit ?</legend>'
          + '<input id=\"apple\" type=\"radio\" name=\"fruit\" initial=\"off\" value=\"apple\" v-validate:fruits=\"{'
          + '  required: true'
          + '}\">'
          + '<label for=\"apple\">Apple</label>'
          + '<input id=\"orange\" type=\"radio\" name=\"fruit\" value=\"orange\" initial=\"off\" v-validate:fruits>' 
          + '<label for=\"orange\">Orage</label>'
          + '<input id=\"grape\" type=\"radio\" name=\"fruit\" value=\"grape\" initial=\"off\" v-validate:fruits>'
          + '<label for=\"grape\">Grape</label>'
          + '<input id=\"banana\" type=\"radio\" name=\"fruit\" value=\"banana\" initial=\"off\" v-validate:fruits>'
          + '<label for=\"banana\">Banana</label>'
          + '<p v-if=\"$validator1.fruits.required\">required fields</p>'
          + '</fieldset>'
          + '</form>'
          + '</validator>'
        vm = new Vue({ el: el })
        vm.$nextTick(done)
      })

      it('should not validated', (done) => {
        assert(vm.$validator1.fruits.valid === true)
        assert(vm.$validator1.fruits.invalid === false)
        assert(vm.$validator1.fruits.required === false)
        assert(vm.$validator1.valid === true)
        assert(vm.$validator1.invalid === false)
        done()
      })
    })

    describe('checkbox', () => {
      beforeEach((done) => {
        el.innerHTML = '<validator name="validator1">'
          + '<form novalidate>'
          + '<input type="checkbox" initial="off" value="foo" v-validate:field1="{ required: true, minlength: 1 }">'
          + '<input type="checkbox" initial="off" value="bar" v-validate:field1="{ required: true, minlength: 1 }">'
          + '</form>'
          + '</validator>'
        vm = new Vue({
          el: el
        })
        vm.$nextTick(done)
      })

      it('should be validated', (done) => {
        assert(vm.$validator1.field1.required === false)
        assert(vm.$validator1.field1.minlength === false)
        assert(vm.$validator1.field1.valid === true)
        assert(vm.$validator1.field1.touched === false)
        assert(vm.$validator1.field1.dirty === false)

        done()
      })
    })

    describe('select', () => {
      beforeEach((done) => {
        el.innerHTML = '<validator name="validator1">'
          + '<form novalidate>'
          + '<select initial="off" v-validate:lang="{ required: true }">'
          + '<option value="en">english</option>'
          + '<option value="ja">japanese</option>'
          + '<option value="zh">chinese</option>'
          + '</select>'
          + '</form>'
          + '</validator>'
        vm = new Vue({ el: el })
        vm.$nextTick(done)
      })

      it('should be validated', (done) => {
        assert(vm.$validator1.lang.required === false)
        assert(vm.$validator1.lang.valid === true)
        assert(vm.$validator1.lang.touched === false)
        assert(vm.$validator1.lang.dirty === false)
        assert(vm.$validator1.lang.modified === false)
        assert(vm.$validator1.valid === true)
        assert(vm.$validator1.touched === false)
        assert(vm.$validator1.dirty === false)
        assert(vm.$validator1.modified === false)

        done()
      })
    })
  })
})
