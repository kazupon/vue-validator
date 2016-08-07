import States from '../../../../src/components/validity/states'
import Lifecycles from '../../../../src/components/validity/lifecycles'
import Methods from '../../../../src/components/validity/methods'

const { props, data } = States(Vue)
const { created, mounted } = Lifecycles(Vue)
const methods = Methods(Vue)

describe('validity component: lifecycle', () => {
  describe('#mounted', () => {
    describe('SingleElement', () => {
      it('should be work', done => {
        const vm = new Vue({
          props,
          data,
          created,
          mounted,
          methods,
          render (h) {
            const child = this.child = h('input', { attrs: { type: 'text' }})
            return child
          },
          propsData: {
            field: 'field1',
            child: {}, // dummy
            validators: {
              required: true
            }
          }
        }).$mount()
        assert.equal(vm._elementable.constructor.name, 'SingleElement')
        const input = vm.$el
        triggerEvent(input, 'focusout')
        waitForUpdate(() => {
          assert(vm.touched === true)
          input.value = 'value'
          triggerEvent(input, 'input')
        }).then(() => {
          assert(vm.dirty === true)
          assert(vm.modified === true)
          input.value = ''
          triggerEvent(input, 'input')
        }).then(() => {
          assert(vm.modified === false)
          vm.$destroy()
        }).then(done)
      })
    })

    describe('MultiElement', () => {
      it('should be work', done => {
        const vm = new Vue({
          props,
          data,
          created,
          mounted,
          methods,
          render (h) {
            const child = this.child = h('fieldset', [
              h('input', { attrs: { type: 'checkbox', value: 'one' }}),
              h('input', { attrs: { type: 'checkbox', value: 'two' }}),
              h('input', { attrs: { type: 'checkbox', value: 'three' }})
            ])
            return child
          },
          propsData: {
            field: 'field1',
            child: {}, // dummy
            validators: {
              required: true
            }
          }
        }).$mount()
        assert.equal(vm._elementable.constructor.name, 'MultiElement')
        const items = vm.$el.querySelectorAll('input[type="checkbox"]')
        triggerEvent(items[1], 'focusout')
        waitForUpdate(() => {
          assert(vm.touched === true)
          items[2].checked = true
          triggerEvent(items[2], 'change')
        }).then(() => {
          assert(vm.dirty === true)
          assert(vm.modified === true)
          items[2].checked = false
          triggerEvent(items[2], 'change')
        }).then(() => {
          assert(vm.modified === false)
          vm.$destroy()
        }).then(done)
      })
    })
  })
})
