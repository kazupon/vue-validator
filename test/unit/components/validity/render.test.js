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

describe('validity component: render', () => {
  it('should be work', done => {
    const vm = new Vue({
      components: {
        validity: {
          props,
          data,
          computed,
          created,
          methods,
          render
        }
      },
      render (h) {
        return h('div', [
          h('validity', {
            props: {
              field: 'field1',
              validators: { required: true },
              child: h('input', { attrs: { type: 'text' }})
            }
          })
        ])
      }
    }).$mount()
    assert.equal(vm.$el.outerHTML, '<div><input type="text"></div>')
    done()
  })
})
