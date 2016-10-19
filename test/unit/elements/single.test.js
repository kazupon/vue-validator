import SingleElement from '../../../src/elements/single'

describe('SingleElement class', () => {
  describe('#getValue', () => {
    describe('input[type="text"]', () => {
      it('should be work', () => {
        const vm = new Vue({
          data: { child: null },
          render (h) {
            return (this.child = h('input', { attrs: { type: 'text' }}))
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
          data: { child: null },
          render (h) {
            return (this.child = h('input', { attrs: { type: 'checkbox' }}))
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
          data: { child: null },
          render (h) {
            return (this.child = h('select', [
              h('option', { attrs: { value: 'one' }}),
              h('option', { attrs: { value: 'two' }}),
              h('option', { attrs: { value: 'three' }})
            ]))
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
          data: { child: null },
          components: {
            comp: {
              data () { return { value: 'hello' } },
              render (h) {
                return h('input', { attrs: { type: 'text' }})
              }
            }
          },
          render (h) {
            return (this.child = h('comp', { ref: 'my' }))
          }
        }).$mount()
        const { my } = vm.$refs
        const single = new SingleElement(vm, vm.child)
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
          data: { child: null },
          render (h) {
            return (this.child = h('input', { attrs: { type: 'text' }}))
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
          data: { child: null },
          render (h) {
            return (this.child = h('input', { attrs: { type: 'checkbox' }}))
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
          data: { child: null },
          render (h) {
            return (this.child = h('select', [
              h('option', { attrs: { value: 'one' }}),
              h('option', { attrs: { value: 'two' }}),
              h('option', { attrs: { value: 'three' }})
            ]))
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
          data: { child: null },
          components: {
            comp: {
              data () { return { value: 'hello' } },
              render (h) {
                return h('input', { attrs: { type: 'text' }})
              }
            }
          },
          render (h) {
            return (this.child = h('comp', { ref: 'my' }))
          }
        }).$mount()
        const { my } = vm.$refs
        const single = new SingleElement(vm, vm.child)
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

  describe('#listenToucheableEvent / #unlistenToucheableEvent', () => {
    it('should be work', done => {
      const handleFocusout = jasmine.createSpy()
      const vm = new Vue({
        data: { child: null },
        methods: { willUpdateTouched: handleFocusout },
        render (h) {
          return (this.child = h('input', { attrs: { type: 'text' }}))
        }
      }).$mount()
      const single = new SingleElement(vm, vm.child)
      single.listenToucheableEvent()
      triggerEvent(vm.$el, 'focusout')
      waitForUpdate(() => {
      }).then(() => {
        assert(handleFocusout.calls.count() === 1)
        single.unlistenToucheableEvent()
        triggerEvent(vm.$el, 'focusout')
      }).then(() => {
        assert(handleFocusout.calls.count() === 1)
      }).then(done)
    })
  })

  describe('#listenInputableEvent / #unlistenInputableEvent', () => {
    describe('input[type="text"]', () => {
      it('should be work', done => {
        const handleInputable = jasmine.createSpy()
        const vm = new Vue({
          data: { child: null },
          methods: { handleInputable },
          render (h) {
            return (this.child = h('input', { attrs: { type: 'text' }}))
          }
        }).$mount()
        const single = new SingleElement(vm, vm.child)
        single.listenInputableEvent()
        vm.$el.value = 'hello'
        triggerEvent(vm.$el, 'input')
        waitForUpdate(() => {
          assert(handleInputable.calls.count() === 1)
          single.unlistenInputableEvent()
          triggerEvent(vm.$el, 'input')
        }).then(() => {
          assert(handleInputable.calls.count() === 1)
        }).then(done)
      })
    })

    describe('input[type="checkbox"]', () => {
      it('should be work', done => {
        const handleInputable = jasmine.createSpy()
        const vm = new Vue({
          data: { child: null },
          methods: { handleInputable },
          render (h) {
            return (this.child = h('input', { attrs: { type: 'checkbox' }}))
          }
        }).$mount()
        const single = new SingleElement(vm, vm.child)
        single.listenInputableEvent()
        vm.$el.checked = true
        triggerEvent(vm.$el, 'change')
        waitForUpdate(() => {
          assert(handleInputable.calls.count() === 1)
          single.unlistenInputableEvent()
          triggerEvent(vm.$el, 'change')
        }).then(() => {
          assert(handleInputable.calls.count() === 1)
        }).then(done)
      })
    })

    describe('select', () => {
      it('should be work', done => {
        const handleInputable = jasmine.createSpy()
        const vm = new Vue({
          data: { child: null },
          methods: { handleInputable },
          render (h) {
            return (this.child = h('select', [
              h('option', { attrs: { value: 'one' }}),
              h('option', { attrs: { value: 'two' }}),
              h('option', { attrs: { value: 'three' }})
            ]))
          }
        }).$mount()
        const single = new SingleElement(vm, vm.child)
        single.listenInputableEvent()
        vm.$el.selectedIndex = 1
        triggerEvent(vm.$el, 'change')
        waitForUpdate(() => {
          assert(handleInputable.calls.count() === 1)
          single.unlistenInputableEvent()
          triggerEvent(vm.$el, 'change')
        }).then(() => {
          assert(handleInputable.calls.count() === 1)
        }).then(done)
      })
    })

    describe('component', () => {
      it('should be work', done => {
        const watchInputable = jasmine.createSpy()
        const vm = new Vue({
          data: { child: null },
          methods: { watchInputable },
          components: {
            comp: {
              data () { return { value: 'hello' } },
              render (h) {
                return h('input', { attrs: { type: 'text' }})
              }
            }
          },
          render (h) {
            return (this.child = h('comp', { ref: 'my' }))
          }
        }).$mount()
        const { my } = vm.$refs
        const single = new SingleElement(vm, vm.child)
        single.listenInputableEvent()
        my.value = 'world'
        waitForUpdate(() => {
          assert(watchInputable.calls.count() === 1)
          single.unlistenInputableEvent()
          my.value = 'hello'
        }).then(() => {
          assert(watchInputable.calls.count() === 1)
        }).then(done)
      })
    })
  })
})
