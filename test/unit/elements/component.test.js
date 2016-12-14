import ComponentElementClass from '../../../src/elements/component'

const ComponentElement = ComponentElementClass(Vue)

describe('ComponentElement class', () => {
  describe('#getValue', () => {
    describe('component', () => {
      it('should be work', done => {
        const vm = new Vue({
          data: {
            child: null,
            value: 'hello',
            prop1: 'foo'
          },
          components: {
            comp: {
              props: ['value', 'prop1'],
              render (h) {
                return h('input', { attrs: { type: 'text' }})
              }
            }
          },
          render (h) {
            return (this.child = h('comp', { props: { value: this.value, prop1: this.prop1 }}))
          }
        }).$mount()
        const component = new ComponentElement(vm, vm.child)
        // set stup
        component._validatorProps = () => { return ['value', 'prop1'] }
        assert.deepEqual(component.getValue(), { value: 'hello', prop1: 'foo' })
        waitForUpdate(() => {
          vm.value = 'world'
          vm.prop1 = 'bar'
        }).thenWaitFor(1).then(() => {
          assert.deepEqual(component.getValue(), { value: 'world', prop1: 'bar' })
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
            value: 'hello',
            prop1: 'foo'
          },
          components: {
            comp: {
              props: ['value', 'prop1'],
              render (h) {
                return h('input', { attrs: { type: 'text' }})
              }
            }
          },
          render (h) {
            return (this.child = h('comp', { props: { value: this.value, prop1: this.prop1 }}))
          }
        }).$mount()
        const component = new ComponentElement(vm, vm.child, () => ['value', 'prop1'])
        assert(component.checkModified() === false)
        waitForUpdate(() => {
          vm.value = 'world'
          vm.prop1 = 'bar'
        }).thenWaitFor(1).then(() => {
          assert(component.checkModified() === true)
          vm.value = 'hello'
          vm.prop1 = 'foo'
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
        data: {
          child: null,
          value: 'hello'
        },
        components: {
          comp: {
            props: ['value', 'prop1'],
            render (h) {
              return h('input', { attrs: { type: 'text' }})
            }
          }
        },
        render (h) {
          return (this.child = h('comp', { props: { value: this.value }}))
        },
        methods: {
          willUpdateTouched: handleFocusout
        }
      }).$mount()
      const component = new ComponentElement(vm, vm.child)
      // set stup
      component._validatorProps = () => { return ['value', 'prop1'] }
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
            value: 'hello',
            prop1: 'foo'
          },
          components: {
            comp: {
              props: ['value', 'prop1'],
              render (h) {
                return h('input', { attrs: { type: 'text' }})
              }
            }
          },
          render (h) {
            return (this.child = h('comp', { props: { value: this.value, prop1: this.prop1 }}))
          },
          methods: { watchInputable }
        }).$mount()
        const component = new ComponentElement(vm, vm.child)
        // set stup
        component._validatorProps = () => { return ['value', 'prop1'] }
        component.listenInputableEvent()
        waitForUpdate(() => {
          vm.value = 'world'
          vm.prop1 = 'bar'
        }).thenWaitFor(1).then(() => {
          assert(watchInputable.calls.count() === 2)
          component.unlistenInputableEvent()
          vm.value = 'hello'
          vm.prop1 = 'foo'
        }).thenWaitFor(1).then(() => {
          assert(watchInputable.calls.count() === 2)
        }).then(done)
      })
    })
  })
})
