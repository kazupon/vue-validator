import Validity from '../../../src/components/validity.js'

const validity = Validity(Vue)

describe('validity functional component', () => {
  let el
  const components = { validity }
  beforeEach(() => {
    el = document.createElement('div')
  })

  describe('rendering', () => {
    it('should be work', done => {
      const vm = new Vue({
        components,
        render (h) {
          return h('div', [
            h('validity', {
              props: {
                field: 'field1',
                validators: { required: true }
              }
            }, [
              h('input', { attrs: { type: 'text' }})
            ])
          ])
        }
      }).$mount(el)
      waitForUpdate(() => {
        assert.equal(vm.$el.outerHTML, '<div><input type="text"></div>')
      }).then(done)
    })
  })

  describe('properties', () => {
    it('should be work', done => {
      const vm = new Vue({
        components,
        render (h) {
          return h('div', [
            h('validity', {
              props: {
                field: 'field1',
                validators: { required: { rule: true, message: 'required !!' }}
              },
              ref: 'validity'
            }, [
              h('input', { attrs: { type: 'text' }})
            ])
          ])
        }
      }).$mount(el)
      // created instance
      let result = vm.$refs.validity.result
      assert(result.valid === true)
      assert(result.invalid === false)
      assert(result.dirty === false)
      assert(result.pristine === true)
      assert(result.touched === false)
      assert(result.untouched === true)
      assert(result.modified === false)
      assert(result.required === false)
      const input = vm.$el.querySelector('input')
      // simulate inputing
      input.value = 'hello'
      triggerEvent(input, 'input')
      waitForUpdate(() => {
        result = vm.$refs.validity.result
        assert(result.valid === true)
        assert(result.invalid === false)
        assert(result.dirty === true) // change
        assert(result.pristine === false) // change
        assert(result.touched === false)
        assert(result.untouched === true)
        assert(result.modified === true) // change
        assert(result.required === false)
        // simulate focusout
        triggerEvent(input, 'focusout')
      }).then(() => {
        result = vm.$refs.validity.result
        assert(result.valid === true)
        assert(result.invalid === false)
        assert(result.dirty === true)
        assert(result.pristine === false)
        assert(result.touched === true) // change
        assert(result.untouched === false) // change
        assert(result.modified === true)
        assert(result.required === false)
        // simulate inputing
        input.value = ''
        // validate
        vm.$refs.validity.validate()
        assert.equal(vm.$refs.validity.progresses.required, 'running')
      }).then(() => { // waiting validator running
        assert.equal(vm.$refs.validity.progresses.required, '')
        result = vm.$refs.validity.result
        assert(result.valid === true)
        assert(result.invalid === false)
        assert(result.dirty === true)
        assert(result.pristine === false)
        assert(result.touched === true)
        assert(result.untouched === false)
        assert(result.modified === true)
        assert.equal(result.required, 'required !!') // change
        assert.deepEqual(result.errors, [{
          field: 'field1',
          validator: 'required',
          message: 'required !!'
        }]) // add
      }).then(() => { // waiting watch event
        result = vm.$refs.validity.result
        assert(result.valid === false) // change
        assert(result.invalid === true) // change
        assert(result.dirty === true)
        assert(result.pristine === false)
        assert(result.touched === true)
        assert(result.untouched === false)
        assert(result.modified === true)
        assert.equal(result.required, 'required !!')
        assert.deepEqual(result.errors, [{
          field: 'field1',
          validator: 'required',
          message: 'required !!'
        }])
      }).then(done)
    })
  })

  describe('event handling', () => {
    it('should be work', done => {
      const valid = jasmine.createSpy()
      const invalid = jasmine.createSpy()
      const touched = jasmine.createSpy()
      const dirty = jasmine.createSpy()
      const modified = jasmine.createSpy()
      const vm = new Vue({
        components,
        render (h) {
          return h('div', [
            h('validity', {
              props: {
                field: 'field1',
                validators: { required: true }
              },
              on: {
                valid,
                invalid,
                touched,
                dirty,
                modified
              }
            }, [
              h('input', {
                attrs: { type: 'text' },
                on: {
                  focusout (e) {
                    e.target.$validity.validate()
                  }
                }
              })
            ])
          ])
        }
      }).$mount(el)
      const input = vm.$el.querySelector('input')
      input.value = 'hello'
      triggerEvent(input, 'input')
      waitForUpdate(() => {
        assert(dirty.calls.count() === 1)
        assert(modified.calls.count() === 1)
        triggerEvent(input, 'focusout')
      }).then(() => {
        assert(touched.calls.count() === 1)
      }).then(() => { // validation waiting
        assert(valid.calls.count() === 1)
        assert(invalid.calls.count() === 0)
        input.value = ''
        triggerEvent(input, 'input')
      }).then(() => {
        assert(dirty.calls.count() === 1)
        assert(modified.calls.count() === 2)
        triggerEvent(input, 'focusout')
      }).then(() => {
        assert(touched.calls.count() === 1)
      }).then(() => { // validation waiting
        assert(valid.calls.count() === 1)
        assert(invalid.calls.count() === 1)
      }).then(done)
    })
  })

  describe('multiple validate', () => {
    it('should be work', done => {
      const vm = new Vue({
        components,
        render (h) {
          return h('div', [
            h('validity', {
              props: {
                field: 'field1',
                validators: {
                  pattern: { rule: '/^[-+]?[0-9]+$/', message: 'not pattern !!' },
                  maxlength: { rule: 4, message: 'too long !!' }
                }
              },
              ref: 'validity'
            }, [
              h('input', { attrs: { type: 'text' }})
            ])
          ])
        }
      }).$mount(el)
      const validity = vm.$refs.validity
      const input = vm.$el.querySelector('input')
      let result
      waitForUpdate(() => {
        input.value = 'hello' // invalid value inputing
        validity.validate() // validate !!
      }).then(() => { // waiting validator running
        result = validity.result
        assert.equal(result.pattern, 'not pattern !!')
        assert.equal(result.maxlength, 'too long !!')
        assert.deepEqual(result.errors, [{
          field: 'field1',
          validator: 'pattern',
          message: 'not pattern !!'
        }, {
          field: 'field1',
          validator: 'maxlength',
          message: 'too long !!'
        }])
      }).then(() => { // waiting watch event
        result = validity.result
        assert(validity.valid === false)
        assert(validity.invalid === true)
        assert(result.valid === false)
        assert(result.invalid === true)
      }).then(() => {
        // valid value inputing
        input.value = '123' // valid value inputing
        validity.validate() // validate !!
      }).then(() => { // waiting validator running
        result = validity.result
        assert(result.pattern === false)
        assert(result.maxlength === false)
        assert(result.errors === undefined)
      }).then(() => { // waiting watch event
        result = validity.result
        assert(validity.valid === true)
        assert(validity.invalid === false)
        assert(result.valid === true)
        assert(result.invalid === false)
      }).then(done)
    })
  })
})
