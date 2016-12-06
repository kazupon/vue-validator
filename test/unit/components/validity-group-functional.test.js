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
})
