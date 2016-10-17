import ValidityControl from '../../../src/components/validity/index'
import ValidityGroup from '../../../src/components/validity-group.js'

const validityControl = ValidityControl(Vue)
const validityGroup = ValidityGroup(Vue)

describe('validity-group functional component', () => {
  let el
  const components = {
    validityControl,
    'validity-group': validityGroup,
    comp: {
      data () {
        return { value: 'hello' }
      },
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
    describe('default', () => {
      it('should be render with fieldset tag', () => {
        const vm = new Vue({
          components,
          render (h) {
            return h('div', [
              h('validity-group', {
                props: {
                  field: 'field1',
                  validators: ['required']
                }
              }, [
                h('input', { attrs: { type: 'radio', name: 'group', value: 'one' }}),
                h('input', { attrs: { type: 'radio', name: 'group', value: 'two' }}),
                h('input', { attrs: { type: 'radio', name: 'group', value: 'three' }})
              ])
            ])
          }
        }).$mount(el)
        assert.equal(vm.$el.outerHTML, '<div><fieldset class="untouched pristine"><input type="radio" name="group" value="one"><input type="radio" name="group" value="two"><input type="radio" name="group" value="three"></fieldset></div>')
      })
    })

    describe('tag specify', () => {
      it('should be render with specify tag', () => {
        const vm = new Vue({
          components,
          render (h) {
            return h('div', [
              h('validity-group', {
                props: {
                  tag: 'header',
                  field: 'field1',
                  validators: ['required']
                }
              }, [
                h('input', { attrs: { type: 'radio', name: 'group', value: 'one' }}),
                h('input', { attrs: { type: 'radio', name: 'group', value: 'two' }}),
                h('input', { attrs: { type: 'radio', name: 'group', value: 'three' }})
              ])
            ])
          }
        }).$mount(el)
        assert.equal(vm.$el.outerHTML, '<div><header class="untouched pristine"><input type="radio" name="group" value="one"><input type="radio" name="group" value="two"><input type="radio" name="group" value="three"></header></div>')
      })
    })
  })


  describe('validate', () => {
    describe('checkbox', () => {
      it('should be work', done => {
        const vm = new Vue({
          components,
          render (h) {
            return h('div', [
              h('validity-group', {
                props: {
                  field: 'field1',
                  validators: {
                    required: true,
                    minlength: 2
                  }
                },
                ref: 'validity'
              }, [
                h('input', { ref: 'checkbox1', attrs: { type: 'checkbox', value: 'one' }}),
                h('input', { ref: 'checkbox2', attrs: { type: 'checkbox', value: 'two' }}),
                h('input', { ref: 'checkbox3', attrs: { type: 'checkbox', value: 'three' }})
              ])
            ])
          }
        }).$mount(el)
        const { validity, checkbox1, checkbox2, checkbox3 } = vm.$refs
        let result
        waitForUpdate(() => {
          validity.validate() // validate !!
        }).thenWaitFor(1).then(() => {
          result = validity.result
          assert(result.required === true)
          assert(result.minlength === true)
          assert.deepEqual(result.errors, [{
            field: 'field1',
            validator: 'required'
          }, {
            field: 'field1',
            validator: 'minlength'
          }])
          assert(validity.valid === false)
          assert(validity.invalid === true)
          assert(result.valid === false)
          assert(result.invalid === true)
        }).then(() => {
          checkbox1.checked = true
          validity.validate() // validate !!
        }).thenWaitFor(1).then(() => {
          result = validity.result
          assert(result.required === false)
          assert(result.minlength === true)
          assert.deepEqual(result.errors, [{
            field: 'field1',
            validator: 'minlength'
          }])
          assert(validity.valid === false)
          assert(validity.invalid === true)
          assert(result.valid === false)
          assert(result.invalid === true)
        }).then(() => {
          checkbox2.checked = true
          checkbox3.checked = true
          validity.validate() // validate !!
        }).thenWaitFor(1).then(() => {
          result = validity.result
          assert(result.required === false)
          assert(result.minlength === false)
          assert(result.errors === undefined)
          assert(validity.valid === true)
          assert(validity.invalid === false)
          assert(result.valid === true)
          assert(result.invalid === false)
        }).then(done)
      })
    })

    describe('radio', () => {
      it('should be work', done => {
        const vm = new Vue({
          components,
          render (h) {
            return h('div', [
              h('validity-group', {
                props: {
                  field: 'field1',
                  validators: ['required']
                },
                ref: 'validity'
              }, [
                h('input', { ref: 'radio1', attrs: { type: 'radio', name: 'group', value: 'one' }}),
                h('input', { ref: 'radio2', attrs: { type: 'radio', name: 'group', value: 'two' }}),
                h('input', { ref: 'radio3', attrs: { type: 'radio', name: 'group', value: 'three' }})
              ])
            ])
          }
        }).$mount(el)
        const { validity, radio1, radio2, radio3 } = vm.$refs
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
          radio1.checked = true
          validity.validate() // validate !!
        }).thenWaitFor(1).then(() => {
          result = validity.result
          assert(result.required === false)
          assert(result.errors === undefined)
          assert(validity.valid === true)
          assert(validity.invalid === false)
          assert(result.valid === true)
          assert(result.invalid === false)
        }).then(() => {
          radio1.checked = false
          radio2.checked = false
          radio3.checked = true
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
  })


  describe('v-model integrations', () => {
    const props = {
      field: 'field1',
      validators: { required: { rule: true, message: 'required !!' }}
    }

    function createModelDirective (key, value, modifier) {
      const modifiers = modifier ? { validity: true } : {}
      return [{
        expression: key,
        modifiers,
        name: 'model',
        value: value
      }]
    }

    function checkboxModelHandler (prop, value) {
      return function ($event) {
        const $$a = this[prop]
        const $$el = $event.target
        const $$c = $$el.checked ? true : false
        if (Array.isArray($$a)) {
          const $$v = value
          const $$i = this._i($$a, $$v)
          if ($$c) {
            $$i < 0 && (this[prop] = $$a.concat($$v))
          } else {
            $$i > -1 && (this[prop] = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
          }
        } else {
          this[prop]= $$c
        }
      }
    }

    function radioModelHanlder (prop, value) {
      return function ($event) { this[prop] = value }
    }


    describe('checkbox', () => {
      it('should be work', done => {
        let valid = true
        const vm = new Vue({
          data: { items: [] },
          components,
          render (h) {
            return h('div', [
              h('p', [this.items]),
              h('validity-group', { props }, [
                h('input', {
                  ref: 'checkbox1',
                  attrs: { type: 'checkbox', value: 'one' },
                  directives: createModelDirective('items', this.items, true),
                  on: {
                    change: [
                      checkboxModelHandler('items', 'one'),
                      (e, $apply) => { valid && $apply() }
                    ]
                  }
                }),
                h('input', {
                  ref: 'checkbox2',
                  attrs: { type: 'checkbox', value: 'two' },
                  directives: createModelDirective('items', this.items, true),
                  on: {
                    change: [
                      checkboxModelHandler('items', 'two'),
                      (e, $apply) => { valid && $apply() }
                    ]
                  }
                })
              ])
            ])
          }
        }).$mount(el)
        const { checkbox1, checkbox2 } = vm.$refs
        console.log(vm.$el.outerHTML)
        waitForUpdate(() => {
          checkbox1.checked = true
          triggerEvent(checkbox1, 'change')
        }).thenWaitFor(1).then(() => {
          assert.deepEqual(vm.items, ['one'])
        }).then(() => {
          // simulate valid value changing
          valid = false
          checkbox2.checked = true
          triggerEvent(checkbox2, 'change')
        }).thenWaitFor(1).then(() => {
          assert.deepEqual(vm.items, ['one'])
        }).then(() => {
          // simulate invalid value changing
          valid = true
          triggerEvent(checkbox2, 'change')
        }).thenWaitFor(1).then(() => {
          assert.deepEqual(vm.items, ['one', 'two'])
        }).then(done)
      })
    })


    describe('radio', () => {
      it('should be work', done => {
        let valid = true
        const vm = new Vue({
          data: { checked: '' },
          components,
          render (h) {
            return h('div', [
              h('p', [this.checked]),
              h('validity-group', { props }, [
                h('input', {
                  ref: 'radio1',
                  attrs: { type: 'radio', name: 'g1', value: 'one' },
                  directives: createModelDirective('checked', 'one', true),
                  on: {
                    change: [
                      radioModelHanlder('checked', 'one'),
                      (e, $apply) => { valid && $apply() }
                    ]
                  }
                }),
                h('input', {
                  ref: 'radio2',
                  attrs: { type: 'radio', name: 'g1', value: 'two' },
                  directives: createModelDirective('checked', 'two', true),
                  on: {
                    change: [
                      radioModelHanlder('checked', 'two'),
                      (e, $apply) => { valid && $apply() }
                    ]
                  }
                })
              ])
            ])
          }
        }).$mount(el)
        const { radio1, radio2 } = vm.$refs
        waitForUpdate(() => {
          radio1.checked = true
          triggerEvent(radio1, 'change')
        }).thenWaitFor(1).then(() => {
          assert.equal(vm.checked, 'one')
        }).then(() => {
          // simulate valid value changing
          valid = false
          radio2.checked = true
          triggerEvent(radio2, 'change')
        }).thenWaitFor(1).then(() => {
          assert.equal(vm.checked, 'one')
        }).then(() => {
          // simulate invalid value changing
          valid = true
          triggerEvent(radio2, 'change')
        }).thenWaitFor(1).then(() => {
          assert.equal(vm.checked, 'two')
        }).then(done)
      })
    })
  })
})
