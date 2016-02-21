import assert from 'power-assert'
import Vue from 'vue'
import { trigger } from '../../src/util'


describe('field', () => {
  let el, vm

  beforeEach(() => {
    el = document.createElement('div')
  })


  describe('static', () => {
    beforeEach((done) => {
      el.innerHTML = 
        '<validator name="validator1">' +
        '<form novalidate>' +
        '<input type="text" field="field1" v-validate="{ required: true }">' +
        '<input type="text" value="hello" v-validate:field2="{ minlength: 4 }">' +
        '</form>' +
        '</validator>'
      vm = new Vue({
        el: el
      })
      vm.$nextTick(done)
    })

    it('should be validated', (done) => {
      assert(vm.$validator1.field1.required)
      assert(vm.$validator1.field1.valid === false)
      assert(vm.$validator1.field1.dirty === false)
      assert(vm.$validator1.field1.modified === false)
      assert(vm.$validator1.field1.touched === false)
      assert(vm.$validator1.valid === false)
      assert(vm.$validator1.dirty === false)
      assert(vm.$validator1.modified === false)
      assert(vm.$validator1.touched === false)

      let field1 = el.getElementsByTagName('input')[0]
      field1.value = 'hi'
      trigger(field1, 'input')
      trigger(field1, 'blur')
      vm.$nextTick(() => {
        assert(vm.$validator1.field1.required === false)
        assert(vm.$validator1.field1.valid === true)
        assert(vm.$validator1.field1.dirty === true)
        assert(vm.$validator1.field1.modified === true)
        assert(vm.$validator1.field1.touched === true)
        assert(vm.$validator1.valid === true)
        assert(vm.$validator1.dirty === true)
        assert(vm.$validator1.modified === true)
        assert(vm.$validator1.touched === true)
        
        done()
      })
    })
  })


  describe('dynamic', () => {
    beforeEach((done) => {
      el.innerHTML = 
        '<validator name="validator1">' +
        '<form novalidate>' +
        '<input type="text" :field="field.name" v-validate="field.validate" v-for="field in fields">' +
        '</form>' +
        '</validator>'
      vm = new Vue({
        el: el,
        data: {
          fields: [{
            name: 'title', validate: { minlength: { rule: 8, message: 'occured min length error' } }
          }, {
            name: 'description', validate: { required: true }
          }]
        }
      })
      vm.$nextTick(done)
    })

    it('should be validated', (done) => {
      assert(vm.$validator1.title.minlength)
      assert(vm.$validator1.title.valid === false)
      assert(vm.$validator1.title.dirty === false)
      assert(vm.$validator1.title.modified === false)
      assert(vm.$validator1.title.touched === false)
      assert(vm.$validator1.description.required)
      assert(vm.$validator1.description.valid === false)
      assert(vm.$validator1.description.dirty === false)
      assert(vm.$validator1.description.modified === false)
      assert(vm.$validator1.description.touched === false)
      assert(vm.$validator1.valid === false)
      assert(vm.$validator1.dirty === false)
      assert(vm.$validator1.modified === false)
      assert(vm.$validator1.touched === false)

      let field1 = el.getElementsByTagName('input')[0]
      let field2 = el.getElementsByTagName('input')[1]
      field1.value = 'hello world !!'
      field2.value = 'test'
      trigger(field1, 'input')
      trigger(field1, 'blur')
      trigger(field2, 'input')
      trigger(field2, 'blur')
      vm.$nextTick(() => {
        assert(vm.$validator1.title.minlength === false)
        assert(vm.$validator1.title.valid === true)
        assert(vm.$validator1.title.dirty === true)
        assert(vm.$validator1.title.modified === true)
        assert(vm.$validator1.title.touched === true)
        assert(vm.$validator1.description.required === false)
        assert(vm.$validator1.description.valid === true)
        assert(vm.$validator1.description.dirty === true)
        assert(vm.$validator1.description.modified === true)
        assert(vm.$validator1.description.touched === true)
        assert(vm.$validator1.valid === true)
        assert(vm.$validator1.dirty === true)
        assert(vm.$validator1.modified === true)
        assert(vm.$validator1.touched === true)
        
        done()
      })
    })
  })
})
