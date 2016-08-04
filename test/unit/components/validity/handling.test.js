import States from '../../../../src/components/validity/states'
import Computed from '../../../../src/components/validity/computed'
import Lifecycles from '../../../../src/components/validity/lifecycles'
import Methods from '../../../../src/components/validity/methods'
import Render from '../../../../src/components/validity/render'

const { props, data } = States(Vue)
const computed = Computed(Vue)
const { created } = Lifecycles(Vue)
const methods = Methods(Vue)
const { render } = Render(Vue)

describe('validity component: input data handling', () => {
  let orgUpdateDirty
  let orgUpdateModified
  beforeEach(() => {
    orgUpdateDirty = methods.willUpdateDirty
    orgUpdateModified = methods.willUpdateModified
  })

  afterEach(() => {
    methods.willUpdateDirty = orgUpdateDirty
    methods.willUpdateModified = orgUpdateModified
  })

  describe('element: flag updating methods', () => {
    it('should be called', () => {
      methods.willUpdateDirty = jasmine.createSpy()
      methods.willUpdateModified = jasmine.createSpy()
      const vm = new Vue({
        props,
        data,
        computed,
        created,
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
      vm.handleInputable({ target: vm.$el })
      assert(methods.willUpdateDirty.calls.count() === 1)
      assert(methods.willUpdateModified.calls.count() === 1)
    })
  })

  describe('component: flag updating methods', () => {
    it('should be called', () => {
      methods.willUpdateDirty = jasmine.createSpy()
      methods.willUpdateModified = jasmine.createSpy()
      const vm = new Vue({
        components: {
          validity: {
            props,
            data,
            render,
            computed,
            created,
            methods
          },
          comp: {
            props: {
              value: {
                type: String,
                default: 'hello'
              }
            },
            render (h) {
              return h('input', { attrs: { type: 'text' }})
            }
          }
        },
        render (h) {
          return h('div', [
            h('validity', {
              ref: 'validity',
              props: {
                field: 'field1',
                validators: { required: true },
                child: h('comp', { ref: 'my' })
              }
            })
          ])
        }
      }).$mount()
      vm.$refs.validity.watchInputable({})
      assert(methods.willUpdateDirty.calls.count() === 1)
      assert(methods.willUpdateModified.calls.count() === 1)
    })
  })
})
