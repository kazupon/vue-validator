import States from '../../../src/components/validity/states'
import Render from '../../../src/components/validity/render'
import SingleElement from '../../../src/elements/single'

const { props, data } = States(Vue)
const { render } = Render(Vue)

describe('SingleElement class', () => {
  describe('#getValue', () => {
    describe('input[type="text"]', () => {
      it('should be work', () => {
        const vm = new Vue({
          data: {
            child: null
          },
          render (h) {
            const child = this.child = h('input', { staticAttrs: { type: 'text' }})
            return child
          }
        }).$mount()
        const single = new SingleElement(vm, vm.child)
        assert.equal(single.getValue(), '')
        vm.$el.value = 'hello'
        assert.equal(single.getValue(), 'hello')
      })
    })

    describe('input[type="checkbox"]', () => {
      it('should be work', () => {
        const vm = new Vue({
          data: {
            child: null
          },
          render (h) {
            const child = this.child = h('input', { staticAttrs: { type: 'checkbox' }})
            return child
          }
        }).$mount()
        const single = new SingleElement(vm, vm.child)
        assert(single.getValue() === false)
        vm.$el.checked = true
        assert(single.getValue() === true)
      })
    })

    describe('select', () => {
      it('should be work', () => {
        const vm = new Vue({
          data: {
            child: null
          },
          render (h) {
            const child = this.child = h('select', [
              h('option', { staticAttrs: { value: 'one' }}),
              h('option', { staticAttrs: { value: 'two' }}),
              h('option', { staticAttrs: { value: 'three' }})
            ])
            return child
          }
        }).$mount()
        const single = new SingleElement(vm, vm.child)
        assert.deepEqual(single.getValue(), ['one'])
        vm.$el.selectedIndex = 1
        assert.deepEqual(single.getValue(), ['two'])
        vm.$el.multiple = true
        vm.$el.options[1].selected = true
        vm.$el.options[2].selected = true
        assert.deepEqual(single.getValue(), ['two', 'three'])
      })
    })

    describe('component', () => {
      it('should be work', done => {
        const vm = new Vue({
          components: {
            validity: {
              props,
              data,
              render
            },
            comp: {
              props: {
                value: {
                  type: String,
                  default: 'hello'
                }
              },
              render (h) {
                return h('input', { staticAttrs: { type: 'text'}})
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
        const { validity, my } = vm.$refs
        const single = new SingleElement(validity, validity.child)
        assert.equal(single.getValue(), 'hello')
        my.value = 'world'
        waitForUpdate(() => {
          assert.equal(single.getValue(), 'world')
        }).then(done)
      })
    })
  })

  describe('#checkModified', () => {
    describe('input[type="text"]', () => {
      it('should be work', () => {
        const vm = new Vue({
          data: {
            child: null
          },
          render (h) {
            const child = this.child = h('input', { staticAttrs: { type: 'text' }})
            return child
          }
        }).$mount()
        const single = new SingleElement(vm, vm.child)
        assert(single.checkModified() === false)
        vm.$el.value = 'hello'
        assert(single.checkModified() === true)
        vm.$el.value = ''
        assert(single.checkModified() === false)
      })
    })

    describe('input[type="checkbox"]', () => {
      it('should be work', () => {
        const vm = new Vue({
          data: {
            child: null
          },
          render (h) {
            const child = this.child = h('input', { staticAttrs: { type: 'checkbox' }})
            return child
          }
        }).$mount()
        const single = new SingleElement(vm, vm.child)
        assert(single.checkModified() === false)
        vm.$el.checked = true
        assert(single.checkModified() === true)
        vm.$el.checked = false
        assert(single.checkModified() === false)
      })
    })

    describe('select', () => {
      it('should be work', () => {
        const vm = new Vue({
          data: {
            child: null
          },
          render (h) {
            const child = this.child = h('select', [
              h('option', { staticAttrs: { value: 'one' }}),
              h('option', { staticAttrs: { value: 'two' }}),
              h('option', { staticAttrs: { value: 'three' }})
            ])
            return child
          }
        }).$mount()
        const single = new SingleElement(vm, vm.child)
        assert(single.checkModified() === false)
        vm.$el.selectedIndex = 1
        assert(single.checkModified() === true)
        vm.$el.multiple = true
        vm.$el.options[1].selected = true
        vm.$el.options[2].selected = true
        assert(single.checkModified() === true)
        vm.$el.options[0].selected = true
        vm.$el.options[1].selected = false
        vm.$el.options[2].selected = false
        assert(single.checkModified() === false)
      })
    })

    describe('component', () => {
      it('should be work', done => {
        const vm = new Vue({
          components: {
            validity: {
              props,
              data,
              render
            },
            comp: {
              props: {
                value: {
                  type: String,
                  default: 'hello'
                }
              },
              render (h) {
                return h('input', { staticAttrs: { type: 'text'}})
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
        const { validity, my } = vm.$refs
        const single = new SingleElement(validity, validity.child)
        assert(single.checkModified() === false)
        my.value = 'world'
        waitForUpdate(() => {
          assert(single.checkModified() === true)
          my.value = 'hello'
        }).then(() => {
          assert(single.checkModified() === false)
        }).then(done)
      })
    })
  })
})
