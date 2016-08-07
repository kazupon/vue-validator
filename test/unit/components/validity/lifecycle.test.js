import States from '../../../../src/components/validity/states'
import Lifecycles from '../../../../src/components/validity/lifecycles'
import Methods from '../../../../src/components/validity/methods'

const { props, data } = States(Vue)
const { created, mounted } = Lifecycles(Vue)
const methods = Methods(Vue)

describe('validity component: lifecycle', () => {
  describe('#mounted', () => {
    describe('SingleElement', () => {
      it('should be created a instance', () => {
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
        assert(vm._elementable.isBuiltIn !== undefined)
      })
    })

    describe('MultiElement', () => {
      it('should be created a instance', () => {
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
        assert(vm._elementable.getCheckedValue !== undefined)
      })
    })
  })
})
