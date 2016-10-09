import ValidityControl from '../../../src/components/validity/index'
import Validity from '../../../src/components/validity.js'
import Validation from '../../../src/components/validation'
import Mixin from '../../../src/mixin'
import { mapValidation } from '../../../src/util'

const validityControl = ValidityControl(Vue)
const validity = Validity(Vue)
const validation = Validation(Vue)
const mixin = Mixin(Vue)

describe('validation functional component', () => {
  let el
  const components = { validityControl, validation, validity }

  function createValidity (h, id, data) {
    return h('validity', data, [
      h('input', { attrs: { id, type: 'text' }})
    ])
  }

  beforeEach(() => {
    el = document.createElement('div')
  })

  describe('rendering', () => {
    describe('default', () => {
      it('should be render with form tag', () => {
        const vm = new Vue({
          mixins: [mixin],
          components,
          render (h) {
            return h('div', [
              h('validation', [
                h('h1', ['username']),
                createValidity(h, 'username', {
                  props: {
                    field: 'field1',
                    validators: { required: true }
                  }
                })
              ])
            ])
          }
        }).$mount(el)
        assert.equal(vm.$el.outerHTML, '<div><form novalidate="novalidate"><h1>username</h1><input id="username" type="text" class="untouched pristine"></form></div>')
      })
    })

    describe('tag specify', () => {
      it('should be render with specify tag', () => {
        const vm = new Vue({
          mixins: [mixin],
          components,
          render (h) {
            return h('div', [
              h('validation', { props: { tag: 'div' }}, [
                h('h1', ['username']),
                createValidity(h, 'username', {
                  props: {
                    field: 'field1',
                    validators: { required: true }
                  }
                })
              ])
            ])
          }
        }).$mount(el)
        assert.equal(vm.$el.outerHTML, '<div><div><h1>username</h1><input id="username" type="text" class="untouched pristine"></div></div>')
      })
    })
  })

  describe('validation properties', () => {
    it('should be work', done => {
      const vm = new Vue({
        mixins: [mixin],
        components,
        render (h) {
          return h('div', [
            h('validation', { props: { name: 'validation1' } }, [
              h('h1', ['username']),
              createValidity(h, 'username', {
                props: {
                  field: 'field1',
                  validators: { required: true }
                },
                ref: 'validity1'
              }),
              h('h1', ['password']),
              createValidity(h, 'password', {
                props: {
                  field: 'field2',
                  validators: { required: true }
                },
                ref: 'validity2'
              })
            ])
          ])
        }
      }).$mount(el)
      const { validity1, validity2 } = vm.$refs
      const field1 = vm.$el.querySelector('#username')
      const field2 = vm.$el.querySelector('#password')
      let validation
      waitForUpdate(() => {
        validity1.validate()
        validity2.validate()
      }).thenWaitFor(1).then(() => {
        validation = vm.$validation.validation1
        assert(validation.valid === false)
        assert(validation.invalid === true)
        assert(validation.touched === false)
        assert(validation.dirty === false)
        assert(validation.modified === false)
        assert(validation.field1.valid === false)
        assert(validation.field1.invalid === true)
        assert(validation.field1.touched === false)
        assert(validation.field1.dirty === false)
        assert(validation.field1.modified === false)
        assert(validation.field1.required === true)
        assert(validation.field2.valid === false)
        assert(validation.field2.invalid === true)
        assert(validation.field2.touched === false)
        assert(validation.field2.dirty === false)
        assert(validation.field2.modified === false)
        assert(validation.field2.required === true)
        field1.value = 'hello'
        triggerEvent(field1, 'input')
        triggerEvent(field1, 'focusout')
        validity1.validate()
        validity2.validate()
      }).thenWaitFor(1).then(() => {
        validation = vm.$validation.validation1
        assert(validation.valid === false)
        assert(validation.invalid === true)
        assert(validation.touched === true)
        assert(validation.dirty === true)
        assert(validation.modified === true)
        assert(validation.field1.valid === true)
        assert(validation.field1.invalid === false)
        assert(validation.field1.required === false)
        assert(validation.field1.touched === true)
        assert(validation.field1.dirty === true)
        assert(validation.field1.modified === true)
        assert(validation.field2.valid === false)
        assert(validation.field2.invalid === true)
        assert(validation.field2.required === true)
        assert(validation.field2.touched === false)
        assert(validation.field2.dirty === false)
        assert(validation.field2.modified === false)
        assert(validation.field2.required === true)
        field2.value = 'world'
        triggerEvent(field2, 'input')
        triggerEvent(field2, 'focusout')
        validity1.validate()
        validity2.validate()
      }).thenWaitFor(1).then(() => {
        validation = vm.$validation.validation1
        assert(validation.valid === true)
        assert(validation.invalid === false)
        assert(validation.touched === true)
        assert(validation.dirty === true)
        assert(validation.modified === true)
        assert(validation.field1.valid === true)
        assert(validation.field1.invalid === false)
        assert(validation.field1.required === false)
        assert(validation.field1.touched === true)
        assert(validation.field1.dirty === true)
        assert(validation.field1.modified === true)
        assert(validation.field2.valid === true)
        assert(validation.field2.invalid === false)
        assert(validation.field2.touched === true)
        assert(validation.field2.dirty === true)
        assert(validation.field2.modified === true)
        assert(validation.field2.required === false)
      }).then(done)
    })
  })

  describe('validation properties mapping', () => {
    it('should be work', done => {
      const vm = new Vue({
        computed: mapValidation({
          username: '$validation.validation1.field1',
          passwordValid: '$validation.validation1.field2.valid',
          valid: '$validation.validation1.valid'
        }),
        mixins: [mixin],
        components,
        render (h) {
          return h('div', [
            h('validation', { props: { name: 'validation1' } }, [
              h('h1', ['username']),
              createValidity(h, 'username', {
                props: {
                  field: 'field1',
                  validators: { required: true }
                },
                ref: 'validity1'
              }),
              h('h1', ['password']),
              createValidity(h, 'password', {
                props: {
                  field: 'field2',
                  validators: { required: true }
                },
                ref: 'validity2'
              })
            ])
          ])
        }
      }).$mount(el)
      const { validity1, validity2 } = vm.$refs
      const field1 = vm.$el.querySelector('#username')
      const field2 = vm.$el.querySelector('#password')
      waitForUpdate(() => {
        validity1.validate()
        validity2.validate()
      }).thenWaitFor(1).then(() => {
        assert(vm.valid === false)
        assert(vm.username.valid === false)
        assert(vm.username.invalid === true)
        assert(vm.username.touched === false)
        assert(vm.username.dirty === false)
        assert(vm.username.modified === false)
        assert(vm.username.required === true)
        assert(vm.passwordValid === false)
        field1.value = 'hello'
        triggerEvent(field1, 'input')
        triggerEvent(field1, 'focusout')
        validity1.validate()
        validity2.validate()
      }).thenWaitFor(1).then(() => {
        assert(vm.valid === false)
        assert(vm.username.valid === true)
        assert(vm.username.invalid === false)
        assert(vm.username.touched === true)
        assert(vm.username.dirty === true)
        assert(vm.username.modified === true)
        assert(vm.username.required === false)
        assert(vm.passwordValid === false)
        field2.value = 'world'
        triggerEvent(field2, 'input')
        triggerEvent(field2, 'focusout')
        validity1.validate()
        validity2.validate()
      }).thenWaitFor(1).then(() => {
        assert(vm.valid === true)
        assert(vm.username.valid === true)
        assert(vm.username.invalid === false)
        assert(vm.username.touched === true)
        assert(vm.username.dirty === true)
        assert(vm.username.modified === true)
        assert(vm.username.required === false)
        assert(vm.passwordValid === true)
      }).then(done)
    })
  })

  describe('multiple validation', () => {
    it('should be work', done => {
      const vm = new Vue({
        mixins: [mixin],
        components,
        render (h) {
          return h('div', [
            h('validation', { props: { name: 'validation1' } }, [
              h('h1', ['username']),
              createValidity(h, 'username', {
                props: {
                  field: 'field1',
                  validators: { required: true }
                },
                ref: 'validity1'
              })
            ]),
            h('validation', { props: { name: 'validation2' } }, [
              h('h1', ['password']),
              createValidity(h, 'password', {
                props: {
                  field: 'field2',
                  validators: { required: true }
                },
                ref: 'validity2'
              })
            ])
          ])
        }
      }).$mount(el)
      const { validity1, validity2 } = vm.$refs
      const field1 = vm.$el.querySelector('#username')
      const field2 = vm.$el.querySelector('#password')
      let validation1, validation2
      waitForUpdate(() => {
        validity1.validate()
        validity2.validate()
      }).thenWaitFor(1).then(() => {
        validation1 = vm.$validation.validation1
        validation2 = vm.$validation.validation2
        assert(validation1.valid === false)
        assert(validation1.invalid === true)
        assert(validation1.touched === false)
        assert(validation1.dirty === false)
        assert(validation1.modified === false)
        assert(validation1.field1.valid === false)
        assert(validation1.field1.invalid === true)
        assert(validation1.field1.touched === false)
        assert(validation1.field1.dirty === false)
        assert(validation1.field1.modified === false)
        assert(validation1.field1.required === true)
        assert(validation2.valid === false)
        assert(validation2.invalid === true)
        assert(validation2.touched === false)
        assert(validation2.dirty === false)
        assert(validation2.modified === false)
        assert(validation2.field2.valid === false)
        assert(validation2.field2.invalid === true)
        assert(validation2.field2.touched === false)
        assert(validation2.field2.dirty === false)
        assert(validation2.field2.modified === false)
        assert(validation2.field2.required === true)
        field1.value = 'hello'
        triggerEvent(field1, 'input')
        triggerEvent(field1, 'focusout')
        validity1.validate()
        validity2.validate()
      }).thenWaitFor(1).then(() => {
        validation1 = vm.$validation.validation1
        validation2 = vm.$validation.validation2
        assert(validation1.valid === true)
        assert(validation1.invalid === false)
        assert(validation1.touched === true)
        assert(validation1.dirty === true)
        assert(validation1.modified === true)
        assert(validation1.field1.valid === true)
        assert(validation1.field1.invalid === false)
        assert(validation1.field1.touched === true)
        assert(validation1.field1.dirty === true)
        assert(validation1.field1.modified === true)
        assert(validation1.field1.required === false)
        assert(validation2.valid === false)
        assert(validation2.invalid === true)
        assert(validation2.touched === false)
        assert(validation2.dirty === false)
        assert(validation2.modified === false)
        assert(validation2.field2.valid === false)
        assert(validation2.field2.invalid === true)
        assert(validation2.field2.touched === false)
        assert(validation2.field2.dirty === false)
        assert(validation2.field2.modified === false)
        assert(validation2.field2.required === true)
        field2.value = 'world'
        triggerEvent(field2, 'input')
        triggerEvent(field2, 'focusout')
        validity1.validate()
        validity2.validate()
      }).thenWaitFor(1).then(() => {
        validation1 = vm.$validation.validation1
        validation2 = vm.$validation.validation2
        assert(validation1.valid === true)
        assert(validation1.invalid === false)
        assert(validation1.touched === true)
        assert(validation1.dirty === true)
        assert(validation1.modified === true)
        assert(validation1.field1.valid === true)
        assert(validation1.field1.invalid === false)
        assert(validation1.field1.touched === true)
        assert(validation1.field1.dirty === true)
        assert(validation1.field1.modified === true)
        assert(validation1.field1.required === false)
        assert(validation2.valid === true)
        assert(validation2.invalid === false)
        assert(validation2.touched === true)
        assert(validation2.dirty === true)
        assert(validation2.modified === true)
        assert(validation2.field2.valid === true)
        assert(validation2.field2.invalid === false)
        assert(validation2.field2.touched === true)
        assert(validation2.field2.dirty === true)
        assert(validation2.field2.modified === true)
        assert(validation2.field2.required === false)
      }).then(done)
    })
  })

  describe('group validation', () => {
    it('should be work', done => {
      const vm = new Vue({
        mixins: [mixin],
        components,
        render (h) {
          return h('div', [
            h('validation', { props: { name: 'validation1' } }, [
              h('h1', ['username']),
              createValidity(h, 'username', {
                props: {
                  field: 'field1',
                  group: 'group1',
                  validators: { required: true }
                },
                ref: 'validity1'
              }),
              h('h1', ['password']),
              createValidity(h, 'password', {
                props: {
                  field: 'field2',
                  group: 'group2',
                  validators: { required: true }
                },
                ref: 'validity2'
              }),
              h('h1', ['confirm']),
              createValidity(h, 'confirm', {
                props: {
                  field: 'field3',
                  group: 'group2',
                  validators: { required: true }
                },
                ref: 'validity3'
              })
            ])
          ])
        }
      }).$mount(el)
      const { validity1, validity2, validity3 } = vm.$refs
      const field1 = vm.$el.querySelector('#username')
      const field2 = vm.$el.querySelector('#password')
      const field3 = vm.$el.querySelector('#confirm')
      let validation1, group1, group2
      waitForUpdate(() => {
        validity1.validate()
        validity2.validate()
        validity3.validate()
      }).thenWaitFor(1).then(() => {
        validation1 = vm.$validation.validation1
        group1 = validation1.group1
        group2 = validation1.group2
        assert(validation1.valid === false)
        assert(validation1.invalid === true)
        assert(validation1.touched === false)
        assert(validation1.dirty === false)
        assert(validation1.modified === false)
        assert(group1.valid === false)
        assert(group1.invalid === true)
        assert(group1.touched === false)
        assert(group1.dirty === false)
        assert(group1.modified === false)
        assert(group2.valid === false)
        assert(group2.invalid === true)
        assert(group2.touched === false)
        assert(group2.dirty === false)
        assert(group2.modified === false)
        assert.deepEqual(group1.field1, validity1.result)
        assert.deepEqual(group2.field2, validity2.result)
        assert.deepEqual(group2.field3, validity3.result)
        field1.value = 'hello'
        triggerEvent(field1, 'input')
        triggerEvent(field1, 'focusout')
        field2.value = 'world'
        triggerEvent(field2, 'input')
        triggerEvent(field2, 'focusout')
        field3.value = 'world'
        triggerEvent(field3, 'input')
        triggerEvent(field3, 'focusout')
        validity1.validate()
        validity2.validate()
        validity3.validate()
      }).thenWaitFor(1).then(() => {
        validation1 = vm.$validation.validation1
        group1 = validation1.group1
        group2 = validation1.group2
        assert(validation1.valid === true)
        assert(validation1.invalid === false)
        assert(validation1.touched === true)
        assert(validation1.dirty === true)
        assert(validation1.modified === true)
        assert(group1.valid === true)
        assert(group1.invalid === false)
        assert(group1.touched === true)
        assert(group1.dirty === true)
        assert(group1.modified === true)
        assert(group2.valid === true)
        assert(group2.invalid === false)
        assert(group2.touched === true)
        assert(group2.dirty === true)
        assert(group2.modified === true)
        assert.deepEqual(group1.field1, validity1.result)
        assert.deepEqual(group2.field2, validity2.result)
        assert.deepEqual(group2.field3, validity3.result)
      }).then(done)
    })
  })

  describe('validation properties watching', () => {
    it('should be work', done => {
      const validationHandler = jasmine.createSpy()
      const validHandler = jasmine.createSpy()
      const usernameValidationHandler = jasmine.createSpy()
      const validationGroupHandler = jasmine.createSpy()
      const fieldValidHandler = jasmine.createSpy()
      const vm = new Vue({
        watch: { // automatically watching
          '$validation.validation1.group1.field2.valid': fieldValidHandler,
          '$validation.validation1.group1': validationGroupHandler
        },
        mixins: [mixin],
        components,
        render (h) {
          return h('div', [
            h('validation', { props: { name: 'validation1' } }, [
              h('h1', ['username']),
              createValidity(h, 'username', {
                props: {
                  field: 'field1',
                  validators: { required: true }
                },
                ref: 'validity1'
              }),
              h('h1', ['password']),
              createValidity(h, 'password', {
                props: {
                  field: 'field2',
                  group: 'group1',
                  validators: { required: true }
                },
                ref: 'validity2'
              }),
              h('h1', ['confirm']),
              createValidity(h, 'confirm', {
                props: {
                  field: 'field3',
                  group: 'group1',
                  validators: { required: true }
                },
                ref: 'validity3'
              })
            ])
          ])
        }
      }).$mount(el)
      const { validity1, validity2, validity3 } = vm.$refs
      const field1 = vm.$el.querySelector('#username')
      const field2 = vm.$el.querySelector('#password')
      const field3 = vm.$el.querySelector('#confirm')
      const handlers = [
        validationHandler,
        validHandler,
        usernameValidationHandler,
      ]
      const unwatches = []
      // manually watching
      unwatches.push(vm.$watch('$validation', validationHandler))
      unwatches.push(vm.$watch('$validation.validation1.valid', validHandler))
      unwatches.push(vm.$watch('$validation.validation1.field1', usernameValidationHandler))
      waitForUpdate(() => {
        validity1.validate()
        validity2.validate()
        validity3.validate()
      }).thenWaitFor(1).then(() => {
        assert(validationHandler.calls.count() > 0)
        assert(validHandler.calls.count() > 0)
        assert(usernameValidationHandler.calls.count() > 0)
        assert(validationGroupHandler.calls.count() > 0)
        assert(fieldValidHandler.calls.count() > 0)
        // reset
        handlers.forEach(handler => handler.calls.reset())
        field1.value = 'hello'
        triggerEvent(field1, 'input')
        triggerEvent(field1, 'focusout')
        field2.value = 'world'
        triggerEvent(field2, 'input')
        triggerEvent(field2, 'focusout')
        field3.value = 'world'
        triggerEvent(field3, 'input')
        triggerEvent(field3, 'focusout')
        validity1.validate()
        validity2.validate()
        validity3.validate()
      }).thenWaitFor(1).then(() => {
        assert(validationHandler.calls.count() > 0)
        assert(validHandler.calls.count() > 0)
        assert(usernameValidationHandler.calls.count() > 0)
        assert(validationGroupHandler.calls.count() > 0)
        assert(fieldValidHandler.calls.count() > 0)
        // unwatch
        unwatches.forEach(unwatch => unwatch())
      }).then(done)
    })
  })
})
