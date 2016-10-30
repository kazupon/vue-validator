import ComponentElementClass from '../../../src/elements/component'

const ComponentElement = ComponentElementClass(Vue)

describe('ComponentElement class', () => {
  describe('#getValue', () => {
    describe('component', () => {
      it('should be work', done => {
        const vm = new Vue({
          data: {
            child: null,
            value: 'hello'
          },
          components: {
            comp: {
              props: ['value'],
              render (h) {
                return h('input', { attrs: { type: 'text' }})
              }
            }
          },
          render (h) {
            return (this.child = h('comp', { props: { value: this.value }}))
          }
        }).$mount()
        const component = new ComponentElement(vm, vm.child)
        assert.equal(component.getValue(), 'hello')
        waitForUpdate(() => {
          vm.value = 'world'
        }).thenWaitFor(1).then(() => {
          assert.equal(component.getValue(), 'world')
        }).then(done)
      })
    })
  })

  describe('#checkModified', () => {
    describe('component', () => {
      it('should be work', done => {
        const vm = new Vue({
          data: {
            child: null,
            value: 'hello'
          },
          components: {
            comp: {
              props: ['value'],
              render (h) {
                return h('input', { attrs: { type: 'text' }})
              }
            }
          },
          render (h) {
            return (this.child = h('comp', { props: { value: this.value }}))
          }
        }).$mount()
        const component = new ComponentElement(vm, vm.child)
        assert(component.checkModified() === false)
        waitForUpdate(() => {
          vm.value = 'world'
        }).thenWaitFor(1).then(() => {
          assert(component.checkModified() === true)
          vm.value = 'hello'
        }).thenWaitFor(1).then(() => {
          assert(component.checkModified() === false)
        }).then(done)
      })
    })
  })

  describe('#listenToucheableEvent / #unlistenToucheableEvent', () => {
    it('should be work', done => {
      const handleFocusout = jasmine.createSpy()
      const vm = new Vue({
        methods: { willUpdateTouched: handleFocusout },
        data: {
          child: null,
          value: 'hello'
        },
        components: {
          comp: {
            props: ['value'],
            render (h) {
              return h('input', { attrs: { type: 'text' }})
            }
          }
        },
        render (h) {
          return (this.child = h('comp', { props: { value: this.value }}))
        }
      }).$mount()
      const component = new ComponentElement(vm, vm.child)
      component.listenToucheableEvent()
      triggerEvent(vm.$el, 'focusout')
      waitForUpdate(() => {
      }).then(() => {
        assert(handleFocusout.calls.count() === 1)
        component.unlistenToucheableEvent()
        triggerEvent(vm.$el, 'focusout')
      }).then(() => {
        assert(handleFocusout.calls.count() === 1)
      }).then(done)
    })
  })

  describe('#listenInputableEvent / #unlistenInputableEvent', () => {
    describe('component', () => {
      it('should be work', done => {
        const watchInputable = jasmine.createSpy()
        const vm = new Vue({
          data: {
            child: null,
            value: 'hello'
          },
          methods: { watchInputable },
          components: {
            comp: {
              props: ['value'],
              render (h) {
                return h('input', { attrs: { type: 'text' }})
              }
            }
          },
          render (h) {
            return (this.child = h('comp', { props: { value: this.value }}))
          }
        }).$mount()
        const component = new ComponentElement(vm, vm.child)
        component.listenInputableEvent()
        waitForUpdate(() => {
          vm.value = 'world'
        }).thenWaitFor(1).then(() => {
          assert(watchInputable.calls.count() === 1)
          component.unlistenInputableEvent()
          vm.value = 'hello'
        }).thenWaitFor(1).then(() => {
          assert(watchInputable.calls.count() === 1)
        }).then(done)
      })
    })
  })
})
