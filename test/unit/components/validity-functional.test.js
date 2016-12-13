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
    'my-comp': {
      props: ['value'],
      render (h) {
        return h('input', { attrs: { type: 'text' }})
      }
    },
    'comp-input': {
      props: ['options', 'value'],
      mounted () {
        this._handle = e => {
          this.$emit('input', e.target.value)
        }
        this.$el.addEventListener('change', this._handle)
      },
      destroyed () {
        this.$el.removeEventListener('change', this._handle)
      },
      render (h) {
        const options = this.options.map((option, index) => {
          return h('option', { ref: `option${index + 1}`, domProps: { value: option.value }}, [option.text])
        })
        return h('select', { ref: 'select' }, options)
      }
    }
  }

  beforeEach(() => {
    el = document.createElement('div')
  })

  describe('rendering', () => {
    it('should be work', () => {
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
      assert.equal(vm.$el.outerHTML, '<div><input type="text" class="untouched pristine"></div>')
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
              h('input', { ref: 'textbox', attrs: { type: 'text' }})
            ])
          ])
        }
      }).$mount(el)
      const { validity, textbox } = vm.$refs
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
      textbox.value = 'hello'
      triggerEvent(textbox, 'input')
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
        triggerEvent(textbox, 'focusout')
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
        textbox.value = ''
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
                ref: 'textbox',
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
      const { textbox } = vm.$refs
      textbox.value = 'hello'
      triggerEvent(textbox, 'input')
      waitForUpdate(() => {
        assert(dirty.calls.count() === 1)
        assert(modified.calls.count() === 1)
      }).then(() => {
        triggerEvent(textbox, 'focusout')
      }).thenWaitFor(1).then(() => {
        assert(touched.calls.count() === 1)
        assert(valid.calls.count() === 1)
        assert(invalid.calls.count() === 0)
      }).then(() => {
        textbox.value = ''
        triggerEvent(textbox, 'input')
      }).thenWaitFor(1).then(() => {
        assert(dirty.calls.count() === 1)
        assert(modified.calls.count() === 2)
      }).then(() => {
        triggerEvent(textbox, 'focusout')
      }).thenWaitFor(1).then(() => {
        assert(touched.calls.count() === 1)
        assert(valid.calls.count() === 1)
        assert(invalid.calls.count() === 1)
      }).then(done)
    })
  })

  describe('validate', () => {
    describe('text', () => {
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
                h('input', { ref: 'textbox', attrs: { type: 'text' }})
              ])
            ])
          }
        }).$mount(el)
        const { validity, textbox } = vm.$refs
        let result
        waitForUpdate(() => {
          textbox.value = ''
          triggerEvent(textbox, 'input')
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
          textbox.value = 'hello'
          triggerEvent(textbox, 'input')
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

    describe('checkbox', () => {
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
                h('input', { ref: 'checkbox', attrs: { type: 'checkbox' }})
              ])
            ])
          }
        }).$mount(el)
        const { validity, checkbox } = vm.$refs
        let result
        waitForUpdate(() => {
          checkbox.checked = false
          triggerEvent(checkbox, 'change')
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
          checkbox.checked = true
          triggerEvent(checkbox, 'change')
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

    describe('select', () => {
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
                h('select', { ref: 'select' }, [
                  h('option', { ref: 'option1', ettrs: { value: 'one' }}),
                  h('option', { ref: 'option2', attrs: { value: 'two' }}),
                  h('option', { ref: 'option3', attrs: { value: 'three' }})
                ])
              ])
            ])
          }
        }).$mount(el)
        const { validity, select, option1, option2, option3 } = vm.$refs
        let result
        waitForUpdate(() => {
          option1.selected = false
          option2.selected = false
          option3.selected = false
          triggerEvent(select, 'change')
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
          option1.selected = false
          option2.selected = true
          option3.selected = false
          triggerEvent(select, 'change')
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

    describe('component', () => {
      it('should be work', done => {
        const vm = new Vue({
          data: { value: 'hello' },
          components,
          render (h) {
            return h('div', [
              h('validity', {
                props: {
                  field: 'field1',
                  validators: {
                    required: {
                      props: {
                        value: {
                          rule: true
                        }
                      }
                    }
                  }
                },
                ref: 'validity'
              }, [
                h('my-comp', { props: { value: this.value }})
              ])
            ])
          }
        }).$mount(el)
        const { validity } = vm.$refs
        let result
        waitForUpdate(() => {
          vm.value = ''
        }).thenWaitFor(1).then(() => {
          validity.validate() // validate !!
        }).thenWaitFor(1).then(() => {
          result = validity.result
          assert(result.value.required === true)
          assert.deepEqual(result.errors, [{
            field: 'field1',
            validator: 'required',
            prop: 'value'
          }])
          assert(validity.valid === false)
          assert(validity.invalid === true)
          assert(result.valid === false)
          assert(result.invalid === true)
        }).then(() => {
          vm.value = 'hello'
        }).thenWaitFor(1).then(() => {
          validity.validate() // validate !!
        }).thenWaitFor(1).then(() => {
          result = validity.result
          assert(result.value.required === false)
          assert(result.errors === undefined)
          assert(validity.valid === true)
          assert(validity.invalid === false)
          assert(result.valid === true)
          assert(result.invalid === false)
        }).then(done)
      })
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
              h('input', { ref: 'textbox', attrs: { type: 'text' }})
            ])
          ])
        }
      }).$mount(el)
      const { validity, textbox } = vm.$refs
      let result
      waitForUpdate(() => {
        textbox.value = 'hello' // invalid value inputing
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
        textbox.value = '123' // valid value inputing
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
              h('input', { ref: 'textbox', attrs: { type: 'text' }})
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
      const { validity, textbox } = vm.$refs
      let result
      waitForUpdate(() => {
        textbox.value = '' // invalid value inputing
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
        textbox.value = '-123' // valid value inputing
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
              h('input', { ref: 'textbox', attrs: { type: 'text' }})
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
      const { validity, textbox } = vm.$refs
      let result
      waitForUpdate(() => {
        textbox.value = '' // invalid value inputing
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
        textbox.value = 'dio' // valid value inputing
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

  describe('classes', () => {
    describe('basic', () => {
      it('should be work', done => {
        const vm = new Vue({
          data: { value: 'hello' },
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
                  validators: {
                    required: { props: { value: { rule: true }}}
                  }
                },
                ref: 'validity2'
              }, [
                h('my-comp', { props: { value: this.value }, class: ['class2'] })
              ])
            ])
          }
        }).$mount(el)
        const { validity1, validity2 } = vm.$refs
        const classes1 = classes(validity1.$el)
        const classes2 = classes(validity2.$el)
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
        }).then(() => {
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
        }).then(() => {
          // update
          validity1.$el.value = 'hello'
          triggerEvent(validity1.$el, 'input')
          vm.value = ''
        }).thenWaitFor(1).then(() => {
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
        }).then(() => {
          // back to initial data
          validity1.$el.value = ''
          triggerEvent(validity1.$el, 'input')
        }).thenWaitFor(1).then(() => {
          vm.value = 'hello'
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
        }).then(() => {
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
          data: { value: 'hello' },
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
                  validators: {
                    required: { props: { value: { rule: true }}}
                  },
                  classes: classesProp2
                },
                ref: 'validity2'
              }, [
                h('my-comp', { props: { value: this.value }, class: ['class2'] })
              ])
            ])
          }
        }).$mount(el)
        const { validity1, validity2 } = vm.$refs
        const classes1 = classes(validity1.$el)
        const classes2 = classes(validity2.$el)
        waitForUpdate(() => {
          // focus
          triggerEvent(validity1.$el, 'focusout')
          triggerEvent(validity2.$el, 'focusout')
          // update
          validity1.$el.value = 'hello'
          triggerEvent(validity1.$el, 'input')
          vm.value = ''
        }).thenWaitFor(1).then(() => {
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
        }).then(() => {
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
          data: { value: 'hello' },
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
                  validators: {
                    required: { props: { value: { rule: true }}}
                  }
                },
                ref: 'validity2'
              }, [
                h('my-comp', { props: { value: this.value }, class: ['class2'] })
              ])
            ])
          }
        }).$mount(el)
        const { validity1, validity2 } = vm.$refs
        const classes1 = classes(validity1.$el)
        const classes2 = classes(validity2.$el)
        waitForUpdate(() => {
          // focus
          triggerEvent(validity1.$el, 'focusout')
          triggerEvent(validity2.$el, 'focusout')
          // update
          validity1.$el.value = 'hello'
          triggerEvent(validity1.$el, 'input')
          vm.value = ''
        }).thenWaitFor(1).then(() => {
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
        }).then(() => {
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

  describe('v-model', () => {
    it('should be work', done => {
      function createModelDirective (key, value, modifier) {
        const modifiers = modifier ? { validity: true } : {}
        return [{
          expression: key,
          modifiers,
          name: 'model',
          rawName: 'v-model',
          value: value
        }]
      }
      const vm = new Vue({
        data: { validation: {}},
        components,
        validators: {
          exist (val) {
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                val === 'dio' ? resolve() : reject()
              }, 5)
            })
          }
        },
        render (h) {
          const input = function ($event) { this.validation = $event }.bind(this)
          return h('div', [
            h('validity', {
              props: {
                field: 'field1',
                validators: ['required', 'numeric', 'exist']
              },
              directives: createModelDirective('validation', this.validation),
              on: { input },
              ref: 'validity'
            }, [
              h('input', { ref: 'textbox', attrs: { type: 'text' }})
            ])
          ])
        }
      }).$mount(el)
      const { validity } = vm.$refs
      waitForUpdate(() => {
        validity.validate() // validate !!
      }).thenWaitFor(1).then(() => {
        assert.deepEqual(vm.validation, {
          result: validity.result,
          progress: validity.progress,
          progresses: validity.progresses
        })
      }).thenWaitFor(6).then(() => {
        assert.deepEqual(vm.validation, {
          result: validity.result,
          progress: validity.progress,
          progresses: validity.progresses
        })
      }).then(done)
    })
  })

  describe('manually touch', () => {
    it('should be work', done => {
      const vm = new Vue({
        components,
        render (h) {
          return h('div', [
            h('validity', {
              ref: 'validity',
              props: {
                field: 'field1',
                autotouch: 'off',
                validators: { required: true }
              }
            }, [
              h('input', { ref: 'textbox', attrs: { type: 'text' }})
            ])
          ])
        }
      }).$mount(el)
      const { validity, textbox } = vm.$refs
      let result
      waitForUpdate(() => {
        triggerEvent(textbox, 'focusout')
      }).thenWaitFor(1).then(() => {
        result = validity.result
        assert(result.touched === false)
        assert(result.untouched === true)
        // manually touch with API
        validity.touch()
      }).thenWaitFor(1).then(() => {
        result = validity.result
        assert(result.touched === true)
        assert(result.untouched === false)
      }).then(done)
    })
  })
})
