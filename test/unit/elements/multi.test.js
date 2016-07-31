import MultiElement from '../../../src/elements/multi'

describe('MultiElement class', () => {
  describe('#getValue', () => {
    describe('input[type="radio"]', () => {
      it('should be work', () => {
        const vm = new Vue({
          data: {
            child: null
          },
          render (h) {
            const child = this.child = h('fieldset', [
              h('input', { staticAttrs: { type: 'radio', name: 'group', value: 'one' }}),
              h('input', { staticAttrs: { type: 'radio', name: 'group', value: 'two' }}),
              h('input', { staticAttrs: { type: 'radio', name: 'group', value: 'three' }})
            ])
            return child
          }
        }).$mount()
        const multi = new MultiElement(vm)
        assert.deepEqual(multi.getValue(), [])
        const items = vm.$el.querySelectorAll('input[type="radio"]')
        items[1].checked = true
        assert.deepEqual(multi.getValue(), ['two'])
        items[2].checked = true
        assert.deepEqual(multi.getValue(), ['two', 'three'])
        items[0].checked = true
        items[1].checked = false
        assert.deepEqual(multi.getValue(), ['one', 'three'])
      })
    })

    describe('input[type="checkbox"]', () => {
      it('should be work', () => {
        const vm = new Vue({
          data: {
            child: null
          },
          render (h) {
            const child = this.child = h('fieldset', [
              h('input', { staticAttrs: { type: 'checkbox', value: 'one' }}),
              h('input', { staticAttrs: { type: 'checkbox', value: 'two' }}),
              h('input', { staticAttrs: { type: 'checkbox', value: 'three' }})
            ])
            return child
          }
        }).$mount()
        const multi = new MultiElement(vm)
        assert.deepEqual(multi.getValue(), [])
        const items = vm.$el.querySelectorAll('input[type="checkbox"]')
        items[1].checked = true
        assert.deepEqual(multi.getValue(), ['two'])
        items[2].checked = true
        assert.deepEqual(multi.getValue(), ['two', 'three'])
        items[0].checked = true
        items[1].checked = false
        assert.deepEqual(multi.getValue(), ['one', 'three'])
      })
    })
  })

  describe('#checkModified', () => {
    describe('input[type="radio"]', () => {
      it('should be work', () => {
        const vm = new Vue({
          data: {
            child: null
          },
          render (h) {
            const child = this.child = h('fieldset', [
              h('input', { staticAttrs: { type: 'radio', name: 'group', value: 'one' }}),
              h('input', { staticAttrs: { type: 'radio', name: 'group', value: 'two' }}),
              h('input', { staticAttrs: { type: 'radio', name: 'group', value: 'three' }})
            ])
            return child
          }
        }).$mount()
        const multi = new MultiElement(vm)
        assert(multi.checkModified() === false)
        const items = vm.$el.querySelectorAll('input[type="radio"]')
        items[1].checked = true
        assert(multi.checkModified() === true)
        items[2].checked = true
        assert(multi.checkModified() === true)
        items[0].checked = true
        items[1].checked = false
        assert(multi.checkModified() === true)
        items[0].checked = false
        items[1].checked = false
        items[2].checked = false
        assert(multi.checkModified() === false)
      })
    })

    describe('input[type="checkbox"]', () => {
      it('should be work', () => {
        const vm = new Vue({
          data: {
            child: null
          },
          render (h) {
            const child = this.child = h('fieldset', [
              h('input', { staticAttrs: { type: 'checkbox', value: 'one' }}),
              h('input', { staticAttrs: { type: 'checkbox', value: 'two' }}),
              h('input', { staticAttrs: { type: 'checkbox', value: 'three' }})
            ])
            return child
          }
        }).$mount()
        const multi = new MultiElement(vm)
        assert(multi.checkModified() === false)
        const items = vm.$el.querySelectorAll('input[type="checkbox"]')
        items[1].checked = true
        assert(multi.checkModified() === true)
        items[2].checked = true
        assert(multi.checkModified() === true)
        items[0].checked = true
        items[1].checked = false
        assert(multi.checkModified() === true)
        items[0].checked = false
        items[1].checked = false
        items[2].checked = false
        assert(multi.checkModified() === false)
      })
    })
  })
})
