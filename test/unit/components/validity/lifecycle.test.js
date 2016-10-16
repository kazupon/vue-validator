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
            return this.child = h('input', { attrs: { type: 'text' }})
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
            return this.child = h('fieldset', [
              h('input', { ref: 'input1', attrs: { type: 'checkbox', value: 'one' }}),
              h('input', { ref: 'input2', attrs: { type: 'checkbox', value: 'two' }}),
              h('input', { ref: 'input3', attrs: { type: 'checkbox', value: 'three' }})
            ])
          },
          propsData: {
            field: 'field1',
            multiple: true,
            child: {}, // dummy
            validators: {
              required: true
            }
          }
        }).$mount()
        const { input1, input2, input3 } = vm.$refs
        assert.equal(vm._elementable.constructor.name, 'MultiElement')
        triggerEvent(input1, 'focusout')
        waitForUpdate(() => {
          assert(vm.touched === true)
          input2.checked = true
          triggerEvent(input2, 'change')
        }).then(() => {
          assert(vm.dirty === true)
          assert(vm.modified === true)
          input2.checked = false
          triggerEvent(input2, 'change')
        }).then(() => {
          assert(vm.modified === false)
          vm.$destroy()
        }).then(done)
      })
    })
  })
})
