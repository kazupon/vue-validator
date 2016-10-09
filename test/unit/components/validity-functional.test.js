import ValidityControl from '../../../src/components/validity/index'
import Validity from '../../../src/components/validity.js'
import classes from 'component-classes'

const validityControl = ValidityControl(Vue)
const validity = Validity(Vue)

describe('validity functional component', () => {
  let el
  const components = {
    validityControl,
    validity,
    comp: {
      data () {
        return { value: 'hello' }
      },
      render (h) {
        return h('input', { attrs: { type: 'text' }})
      }
    }
  }

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
        assert.equal(vm.$el.outerHTML, '<div><input type="text" class="untouched pristine"></div>')
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
      const { validity } = vm.$refs
      const input = vm.$el.querySelector('input')
      let result = validity.result
      // created instance
      assert(result.valid === true)
      assert(result.invalid === false)
      assert(result.dirty === false)
      assert(result.pristine === true)
      assert(result.touched === false)
      assert(result.untouched === true)
      assert(result.modified === false)
      assert(result.required === false)
      // simulate inputing
      input.value = 'hello'
      triggerEvent(input, 'input')
      waitForUpdate(() => {
        result = validity.result
        assert(result.valid === true)
        assert(result.invalid === false)
        assert(result.dirty === true) // change
        assert(result.pristine === false) // change
        assert(result.touched === false)
        assert(result.untouched === true)
        assert(result.modified === true) // change
        assert(result.required === false)
      }).then(() => {
        // simulate focusout
        triggerEvent(input, 'focusout')
      }).thenWaitFor(1).then(() => {
        result = validity.result
        assert(result.valid === true)
        assert(result.invalid === false)
        assert(result.dirty === true)
        assert(result.pristine === false)
        assert(result.touched === true) // change
        assert(result.untouched === false) // change
        assert(result.modified === true)
        assert(result.required === false)
      }).then(() => {
        // simulate inputing
        input.value = ''
        // validate
        validity.validate()
        assert.equal(validity.progresses.required, 'running')
      }).thenWaitFor(1).then(() => {
        assert.equal(validity.progresses.required, '')
        result = validity.result
        assert(result.valid === false) // change
        assert(result.invalid === true) // change
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
      }).then(() => {
        triggerEvent(input, 'focusout')
      }).thenWaitFor(1).then(() => {
        assert(touched.calls.count() === 1)
        assert(valid.calls.count() === 1)
        assert(invalid.calls.count() === 0)
      }).then(() => {
        input.value = ''
        triggerEvent(input, 'input')
      }).thenWaitFor(1).then(() => {
        assert(dirty.calls.count() === 1)
        assert(modified.calls.count() === 2)
      }).then(() => {
        triggerEvent(input, 'focusout')
      }).thenWaitFor(1).then(() => {
        assert(touched.calls.count() === 1)
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
      const { validity } = vm.$refs
      const input = vm.$el.querySelector('input')
      let result
      waitForUpdate(() => {
        input.value = 'hello' // invalid value inputing
        validity.validate() // validate !!
      }).thenWaitFor(1).then(() => {
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
        assert(validity.valid === false)
        assert(validity.invalid === true)
        assert(result.valid === false)
        assert(result.invalid === true)
      }).then(() => {
        // valid value inputing
        input.value = '123' // valid value inputing
        validity.validate() // validate !!
      }).thenWaitFor(1).then(() => {
        result = validity.result
        assert(result.pattern === false)
        assert(result.maxlength === false)
        assert(result.errors === undefined)
        assert(validity.valid === true)
        assert(validity.invalid === false)
        assert(result.valid === true)
        assert(result.invalid === false)
      }).then(done)
    })
  })

  describe('custom validate', () => {
    it('should be work', done => {
      const vm = new Vue({
        components,
        render (h) {
          return h('div', [
            h('validity', {
              props: {
                field: 'field1',
                validators: ['required', 'numeric']
              },
              ref: 'validity'
            }, [
              h('input', { attrs: { type: 'text' }})
            ])
          ])
        },
        validators: {
          numeric: {
            message (field) {
              return `invalid ${field} value`
            },
            check (val) {
              return /^[-+]?[0-9]+$/.test(val)
            }
          }
        }
      }).$mount(el)
      const { validity } = vm.$refs
      const input = vm.$el.querySelector('input')
      let result
      waitForUpdate(() => {
        input.value = '' // invalid value inputing
        validity.validate() // validate !!
      }).thenWaitFor(1).then(() => {
        result = validity.result
        assert(result.required === true)
        assert.equal(result.numeric, 'invalid field1 value')
        assert.deepEqual(result.errors, [{
          field: 'field1',
          validator: 'required'
        }, {
          field: 'field1',
          validator: 'numeric',
          message: 'invalid field1 value'
        }])
        assert(validity.valid === false)
        assert(validity.invalid === true)
        assert(result.valid === false)
        assert(result.invalid === true)
      }).then(() => {
        input.value = '-123' // valid value inputing
        validity.validate() // validate !!
      }).thenWaitFor(1).then(() => {
        result = validity.result
        assert(result.required === false)
        assert(result.numeric === false)
        assert(result.errors === undefined)
        assert(validity.valid === true)
        assert(validity.invalid === false)
        assert(result.valid === true)
        assert(result.invalid === false)
      }).then(done)
    })
  })

  describe('async validate', () => {
    it('should be work', done => {
      const vm = new Vue({
        components,
        render (h) {
          return h('div', [
            h('validity', {
              props: {
                field: 'field1',
                validators: ['exist']
              },
              ref: 'validity'
            }, [
              h('input', { attrs: { type: 'text' }})
            ])
          ])
        },
        validators: {
          exist (val) {
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                val === 'dio' ? resolve() : reject()
              }, 5)
            })
          }
        }
      }).$mount(el)
      const { validity } = vm.$refs
      const input = vm.$el.querySelector('input')
      let result
      waitForUpdate(() => {
        input.value = '' // invalid value inputing
        validity.validate() // validate !!
      }).thenWaitFor(6).then(() => {
        result = validity.result
        assert(result.exist === true)
        assert.deepEqual(result.errors, [{
          field: 'field1',
          validator: 'exist'
        }])
        assert(validity.valid === false)
        assert(validity.invalid === true)
        assert(result.valid === false)
        assert(result.invalid === true)
      }).then(() => {
        input.value = 'dio' // valid value inputing
        validity.validate() // validate !!
      }).thenWaitFor(6).then(() => {
        result = validity.result
        assert(result.exist === false)
        assert(result.errors === undefined)
        assert(validity.valid === true)
        assert(validity.invalid === false)
        assert(result.valid === true)
        assert(result.invalid === false)
      }).then(done)
    })
  })

  describe('multi element validate', () => {
    it('should be work', done => {
      const vm = new Vue({
        components,
        render (h) {
          return h('div', [
            h('validity', {
              props: {
                field: 'field1',
                validators: ['required']
              },
              ref: 'validity'
            }, [
              h('fieldset', [
                h('input', { attrs: { type: 'radio', name: 'group', value: 'one' }}),
                h('input', { attrs: { type: 'radio', name: 'group', value: 'two' }}),
                h('input', { attrs: { type: 'radio', name: 'group', value: 'three' }})
              ])
            ])
          ])
        }
      }).$mount(el)
      const { validity } = vm.$refs
      const items = vm.$el.querySelectorAll('input[type="radio"]')
      let result
      waitForUpdate(() => {
        validity.validate() // validate !!
      }).thenWaitFor(1).then(() => {
        result = validity.result
        assert(result.required === true)
        assert.deepEqual(result.errors, [{
          field: 'field1',
          validator: 'required'
        }])
        assert(validity.valid === false)
        assert(validity.invalid === true)
        assert(result.valid === false)
        assert(result.invalid === true)
      }).then(() => {
        items[1].checked = true
        validity.validate() // validate !!
      }).thenWaitFor(1).then(() => {
        result = validity.result
        assert(result.required === false)
        assert(result.errors === undefined)
        assert(validity.valid === true)
        assert(validity.invalid === false)
        assert(result.valid === true)
        assert(result.invalid === false)
      }).then(done)
    })
  })

  describe('component validate', () => {
    it('should be work', done => {
      const vm = new Vue({
        components,
        render (h) {
          return h('div', [
            h('validity', {
              props: {
                field: 'field1',
                validators: ['required']
              },
              ref: 'validity'
            }, [
              h('comp', { ref: 'my' })
            ])
          ])
        }
      }).$mount(el)
      const { validity, my } = vm.$refs
      let result
      waitForUpdate(() => {
        my.value = ''
        validity.validate() // validate !!
      }).thenWaitFor(1).then(() => {
        result = validity.result
        assert(result.required === true)
        assert.deepEqual(result.errors, [{
          field: 'field1',
          validator: 'required'
        }])
        assert(validity.valid === false)
        assert(validity.invalid === true)
        assert(result.valid === false)
        assert(result.invalid === true)
      }).then(() => {
        my.value = 'hello'
        validity.validate() // validate !!
      }).thenWaitFor(1).then(() => {
        result = validity.result
        assert(result.required === false)
        assert(result.errors === undefined)
        assert(validity.valid === true)
        assert(validity.invalid === false)
        assert(result.valid === true)
        assert(result.invalid === false)
      }).then(done)
    })
  })

  describe('classes', () => {
    describe('basic', () => {
      it('should be work', done => {
        const vm = new Vue({
          components,
          render (h) {
            return h('div', [
              h('validity', {
                props: {
                  field: 'field1',
                  validators: ['required', 'numeric']
                },
                ref: 'validity1'
              }, [
                h('input', { class: ['class1'], attrs: { type: 'text' }})
              ]),
              h('validity', {
                props: {
                  field: 'field2',
                  validators: ['required']
                },
                ref: 'validity2'
              }, [
                h('comp', { ref: 'my', class: ['class2'] })
              ])
            ])
          }
        }).$mount(el)
        const { validity1, validity2, my } = vm.$refs
        let classes1, classes2
        classes1 = classes(validity1.$el)
        classes2 = classes(validity2.$el)
        // initialized
        assert(classes1.has('class1'))
        assert(!classes1.has('touched'))
        assert(classes1.has('untouched'))
        assert(!classes1.has('dirty'))
        assert(classes1.has('pristine'))
        assert(!classes1.has('valid'))
        assert(!classes1.has('invalid'))
        assert(!classes1.has('modified'))
        assert(classes2.has('class2'))
        assert(!classes2.has('touched'))
        assert(classes2.has('untouched'))
        assert(!classes2.has('dirty'))
        assert(classes2.has('pristine'))
        assert(!classes2.has('valid'))
        assert(!classes2.has('invalid'))
        assert(!classes2.has('modified'))
        waitForUpdate(() => {
          // validate
          validity1.validate()
          validity2.validate()
        }).thenWaitFor(1).then(() => {
          assert(classes1.has('class1'))
          assert(!classes1.has('touched'))
          assert(classes1.has('untouched'))
          assert(!classes1.has('dirty'))
          assert(classes1.has('pristine'))
          assert(!classes1.has('modified'))
          assert(!classes1.has('valid'))
          assert(classes1.has('invalid'))
          assert(classes2.has('class2'))
          assert(!classes2.has('touched'))
          assert(classes2.has('untouched'))
          assert(!classes2.has('dirty'))
          assert(classes2.has('pristine'))
          assert(!classes2.has('modified'))
          assert(classes2.has('valid'))
          assert(!classes2.has('invalid'))
          // focus
          triggerEvent(validity1.$el, 'focusout')
          triggerEvent(validity2.$el, 'focusout')
        }).thenWaitFor(1).then(() => {
          assert(classes1.has('class1'))
          assert(classes1.has('touched'))
          assert(!classes1.has('untouched'))
          assert(!classes1.has('dirty'))
          assert(classes1.has('pristine'))
          assert(!classes1.has('modified'))
          assert(!classes1.has('valid'))
          assert(classes1.has('invalid'))
          assert(classes2.has('class2'))
          assert(classes2.has('touched'))
          assert(!classes2.has('untouched'))
          assert(!classes2.has('dirty'))
          assert(classes2.has('pristine'))
          assert(!classes2.has('modified'))
          assert(classes2.has('valid'))
          assert(!classes2.has('invalid'))
          // update
          validity1.$el.value = 'hello'
          triggerEvent(validity1.$el, 'input')
          my.value = ''
          // validate
          validity1.validate()
          validity2.validate()
        }).thenWaitFor(1).then(() => {
          assert(classes1.has('class1'))
          assert(classes1.has('touched'))
          assert(!classes1.has('untouched'))
          assert(classes1.has('dirty'))
          assert(!classes1.has('pristine'))
          assert(classes1.has('modified'))
          assert(classes1.has('valid'))
          assert(!classes1.has('invalid'))
          assert(classes2.has('class2'))
          assert(classes2.has('touched'))
          assert(!classes2.has('untouched'))
          assert(classes2.has('dirty'))
          assert(!classes2.has('pristine'))
          assert(classes2.has('modified'))
          assert(!classes2.has('valid'))
          assert(classes2.has('invalid'))
          // back to initial data
          validity1.$el.value = ''
          triggerEvent(validity1.$el, 'input')
          my.value = 'hello'
        }).thenWaitFor(1).then(() => {
          assert(classes1.has('class1'))
          assert(classes1.has('touched'))
          assert(!classes1.has('untouched'))
          assert(classes1.has('dirty'))
          assert(!classes1.has('pristine'))
          assert(!classes1.has('modified'))
          assert(classes1.has('valid'))
          assert(!classes1.has('invalid'))
          assert(classes2.has('class2'))
          assert(classes2.has('touched'))
          assert(!classes2.has('untouched'))
          assert(classes2.has('dirty'))
          assert(!classes2.has('pristine'))
          assert(!classes2.has('modified'))
          assert(!classes2.has('valid'))
          assert(classes2.has('invalid'))
          // reset
          validity1.reset()
          validity2.reset()
        }).thenWaitFor(1).then(() => {
          assert(classes1.has('class1'))
          assert(!classes1.has('touched'))
          assert(classes1.has('untouched'))
          assert(!classes1.has('dirty'))
          assert(classes1.has('pristine'))
          assert(!classes1.has('valid'))
          assert(!classes1.has('invalid'))
          assert(!classes1.has('modified'))
          assert(classes2.has('class2'))
          assert(!classes2.has('touched'))
          assert(classes2.has('untouched'))
          assert(!classes2.has('dirty'))
          assert(classes2.has('pristine'))
          assert(!classes2.has('valid'))
          assert(!classes2.has('invalid'))
          assert(!classes2.has('modified'))
        }).then(done)
      })
    })

    describe('local custom class name', () => {
      it('should be work', done => {
        const classesProp1 = {
          valid: 'valid-1',
          invalid: 'invalid-1',
          touched: 'touched-1',
          untouched: 'untouched-1',
          pristine: 'pristine-1',
          dirty: 'dirty-1',
          modified: 'modified-1'
        }
        const classesProp2 = {
          valid: 'valid-2',
          invalid: 'invalid-2',
          touched: 'touched-2',
          untouched: 'untouched-2',
          pristine: 'pristine-2',
          dirty: 'dirty-2',
          modified: 'modified-2'
        }
        const vm = new Vue({
          components,
          render (h) {
            return h('div', [
              h('validity', {
                props: {
                  field: 'field1',
                  validators: ['required', 'numeric'],
                  classes: classesProp1
                },
                ref: 'validity1'
              }, [
                h('input', { class: ['class1'], attrs: { type: 'text' }})
              ]),
              h('validity', {
                props: {
                  field: 'field2',
                  validators: ['required'],
                  classes: classesProp2
                },
                ref: 'validity2'
              }, [
                h('comp', { ref: 'my', class: ['class2'] })
              ])
            ])
          }
        }).$mount(el)
        const { validity1, validity2, my } = vm.$refs
        let classes1, classes2
        classes1 = classes(validity1.$el)
        classes2 = classes(validity2.$el)
        waitForUpdate(() => {
          // focus
          triggerEvent(validity1.$el, 'focusout')
          triggerEvent(validity2.$el, 'focusout')
          // update
          validity1.$el.value = 'hello'
          triggerEvent(validity1.$el, 'input')
          my.value = ''
          // validate
          validity1.validate()
          validity2.validate()
        }).thenWaitFor(1).then(() => {
          assert(classes1.has('class1'))
          assert(classes1.has(classesProp1.touched))
          assert(!classes1.has(classesProp1.untouched))
          assert(classes1.has(classesProp1.dirty))
          assert(!classes1.has(classesProp1.pristine))
          assert(classes1.has(classesProp1.modified))
          assert(classes1.has(classesProp1.valid))
          assert(!classes1.has(classesProp1.invalid))
          assert(classes2.has('class2'))
          assert(classes2.has(classesProp2.touched))
          assert(!classes2.has(classesProp2.untouched))
          assert(classes2.has(classesProp2.dirty))
          assert(!classes2.has(classesProp2.pristine))
          assert(classes2.has(classesProp2.modified))
          assert(!classes2.has(classesProp2.valid))
          assert(classes2.has(classesProp2.invalid))
          // reset
          validity1.reset()
          validity2.reset()
        }).thenWaitFor(1).then(() => {
          assert(classes1.has('class1'))
          assert(!classes1.has(classesProp1.touched))
          assert(classes1.has(classesProp1.untouched))
          assert(!classes1.has(classesProp1.dirty))
          assert(classes1.has(classesProp1.pristine))
          assert(!classes1.has(classesProp1.modified))
          assert(!classes1.has(classesProp1.valid))
          assert(!classes1.has(classesProp1.invalid))
          assert(classes2.has('class2'))
          assert(!classes2.has(classesProp2.touched))
          assert(classes2.has(classesProp2.untouched))
          assert(!classes2.has(classesProp2.dirty))
          assert(classes2.has(classesProp2.pristine))
          assert(!classes2.has(classesProp2.modified))
          assert(!classes2.has(classesProp2.valid))
          assert(!classes2.has(classesProp2.invalid))
        }).then(done)
      })
    })

    describe('global custom class name', () => {
      let orgSetting
      const localClasses = {
        valid: 'valid-1',
        invalid: 'invalid-1',
        touched: 'touched-1',
        untouched: 'untouched-1',
        pristine: 'pristine-1',
        dirty: 'dirty-1',
        modified: 'modified-1'
      }
      const globalClasses = {
        valid: 'valid-2',
        invalid: 'invalid-2',
        touched: 'touched-2',
        untouched: 'untouched-2',
        pristine: 'pristine-2',
        dirty: 'dirty-2',
        modified: 'modified-2'
      }
      beforeEach(() => {
        orgSetting = Vue.config.validator.classes
        Vue.config.validator.classes = globalClasses
      })
      afterEach(() => {
        Vue.config.validator.classes = orgSetting
      })

      it('should be work', done => {
        const vm = new Vue({
          components,
          render (h) {
            return h('div', [
              h('validity', {
                props: {
                  field: 'field1',
                  validators: ['required', 'numeric'],
                  classes: localClasses
                },
                ref: 'validity1'
              }, [
                h('input', { class: ['class1'], attrs: { type: 'text' }})
              ]),
              h('validity', {
                props: {
                  field: 'field2',
                  validators: ['required']
                },
                ref: 'validity2'
              }, [
                h('comp', { ref: 'my', class: ['class2'] })
              ])
            ])
          }
        }).$mount(el)
        const { validity1, validity2, my } = vm.$refs
        let classes1, classes2
        classes1 = classes(validity1.$el)
        classes2 = classes(validity2.$el)
        waitForUpdate(() => {
          // focus
          triggerEvent(validity1.$el, 'focusout')
          triggerEvent(validity2.$el, 'focusout')
          // update
          validity1.$el.value = 'hello'
          triggerEvent(validity1.$el, 'input')
          my.value = ''
          // validate
          validity1.validate()
          validity2.validate()
        }).thenWaitFor(1).then(() => {
          assert(classes1.has('class1'))
          assert(classes1.has(localClasses.touched))
          assert(!classes1.has(localClasses.untouched))
          assert(classes1.has(localClasses.dirty))
          assert(!classes1.has(localClasses.pristine))
          assert(classes1.has(localClasses.modified))
          assert(classes1.has(localClasses.valid))
          assert(!classes1.has(localClasses.invalid))
          assert(classes2.has('class2'))
          assert(classes2.has(globalClasses.touched))
          assert(!classes2.has(globalClasses.untouched))
          assert(classes2.has(globalClasses.dirty))
          assert(!classes2.has(globalClasses.pristine))
          assert(classes2.has(globalClasses.modified))
          assert(!classes2.has(globalClasses.valid))
          assert(classes2.has(globalClasses.invalid))
          // reset
          validity1.reset()
          validity2.reset()
        }).thenWaitFor(1).then(() => {
          assert(classes1.has('class1'))
          assert(!classes1.has(localClasses.touched))
          assert(classes1.has(localClasses.untouched))
          assert(!classes1.has(localClasses.dirty))
          assert(classes1.has(localClasses.pristine))
          assert(!classes1.has(localClasses.modified))
          assert(!classes1.has(localClasses.valid))
          assert(!classes1.has(localClasses.invalid))
          assert(classes2.has('class2'))
          assert(!classes2.has(globalClasses.touched))
          assert(classes2.has(globalClasses.untouched))
          assert(!classes2.has(globalClasses.dirty))
          assert(classes2.has(globalClasses.pristine))
          assert(!classes2.has(globalClasses.modified))
          assert(!classes2.has(globalClasses.valid))
          assert(!classes2.has(globalClasses.invalid))
        }).then(done)
      })
    })
  })
})
