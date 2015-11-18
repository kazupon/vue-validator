import assert from 'power-assert'
import Vue from 'vue'


describe('validate directive', () => {
  let vm, el

  beforeEach(() => {
    el = document.createElement('div')
  })


  describe('normal', () => {
    beforeEach((done) => {
      vm = new Vue({
        el: el,
        template: '<validator name="validator1">' +
          '<form novalidate>' +
          '<input type="text" v-validate:field1.required>' +
          '</form>' +
          '</validator>'
      })
      vm.$nextTick(done)
    })

    it('field scope should be assigned', () => {
      assert(vm.$validator1.field1 !== undefined)
      assert(vm.$validator1.field1.required !== undefined)
      assert(vm.$validator1.field1.valid !== undefined)
      assert(vm.$validator1.field1.invalid !== undefined)
      assert(vm.$validator1.field1.touched !== undefined)
      assert(vm.$validator1.field1.untouched !== undefined)
      assert(vm.$validator1.field1.modified !== undefined)
      assert(vm.$validator1.field1.dirty !== undefined)
      assert(vm.$validator1.field1.pristine !== undefined)
    })
  })


  describe('v-show', () => {
    beforeEach(() => {
      vm = new Vue({
        el: el,
        data: {
          hidden: false
        },
        template: '<validator name="validator1">' +
          '<form novalidate>' +
          '<input type="text" v-show="hidden" v-validate:field1.min.max="{ min: 0, max: 10 }">' +
          '</form>' +
          '</validator>'
      })
    })

    describe('set true', () => {
      beforeEach((done) => {
        vm.hidden = true
        vm.$nextTick(done)
      })

      it('field scope should be assigned', () => {
        assert(vm.$validator1.field1 !== undefined)
        assert(vm.$validator1.field1.min !== undefined)
        assert(vm.$validator1.field1.max !== undefined)
        assert(vm.$validator1.field1.valid !== undefined)
        assert(vm.$validator1.field1.invalid !== undefined)
        assert(vm.$validator1.field1.touched !== undefined)
        assert(vm.$validator1.field1.untouched !== undefined)
        assert(vm.$validator1.field1.modified !== undefined)
        assert(vm.$validator1.field1.dirty !== undefined)
        assert(vm.$validator1.field1.pristine !== undefined)
      })

      context('set false', () => {
        beforeEach((done) => {
          vm.hidden = false
          vm.$nextTick(done)
        })

        it('validator scope should be assigned', () => {
          assert(vm.$validator1.field1 !== undefined)
          assert(vm.$validator1.field1.min !== undefined)
          assert(vm.$validator1.field1.max !== undefined)
          assert(vm.$validator1.field1.valid !== undefined)
          assert(vm.$validator1.field1.invalid !== undefined)
          assert(vm.$validator1.field1.touched !== undefined)
          assert(vm.$validator1.field1.untouched !== undefined)
          assert(vm.$validator1.field1.modified !== undefined)
          assert(vm.$validator1.field1.dirty !== undefined)
          assert(vm.$validator1.field1.pristine !== undefined)
        })

        describe('set true', () => {
          beforeEach((done) => {
            vm.hidden = true
            vm.$nextTick(done)
          })

          it('validator scope should be assigned', () => {
            assert(vm.$validator1.field1 !== undefined)
            assert(vm.$validator1.field1.min !== undefined)
            assert(vm.$validator1.field1.max !== undefined)
            assert(vm.$validator1.field1.valid !== undefined)
            assert(vm.$validator1.field1.invalid !== undefined)
            assert(vm.$validator1.field1.touched !== undefined)
            assert(vm.$validator1.field1.untouched !== undefined)
            assert(vm.$validator1.field1.modified !== undefined)
            assert(vm.$validator1.field1.dirty !== undefined)
            assert(vm.$validator1.field1.pristine !== undefined)
          })
        })
      })
    })
  })


  describe('v-if', () => {
    beforeEach(() => {
      vm = new Vue({
        el: el,
        data: {
          hidden: false
        },
        template: '<validator name="validator1">' +
          '<form novalidate>' +
          '<input type="text" v-if="hidden" v-validate:field1.minlength.maxlength="{ minlength: 0, maxlength: 10 }">' +
          '</form>' +
          '</validator>'
      })
    })

    describe('set true', () => {
      beforeEach((done) => {
        vm.hidden = true
        vm.$nextTick(done)
      })

      it('field scope should be assigned', () => {
        assert(vm.$validator1.field1 !== undefined)
        assert(vm.$validator1.field1.minlength !== undefined)
        assert(vm.$validator1.field1.maxlength !== undefined)
        assert(vm.$validator1.field1.valid !== undefined)
        assert(vm.$validator1.field1.invalid !== undefined)
        assert(vm.$validator1.field1.touched !== undefined)
        assert(vm.$validator1.field1.untouched !== undefined)
        assert(vm.$validator1.field1.modified !== undefined)
        assert(vm.$validator1.field1.dirty !== undefined)
        assert(vm.$validator1.field1.pristine !== undefined)
      })

      describe('set false', () => {
        beforeEach((done) => {
          vm.hidden = false
          vm.$nextTick(done)
        })

        it('field scope should not be assigned', () => {
          assert(vm.$validator1.field1 === undefined)
        })

        describe('set true', () => {
          beforeEach((done) => {
            vm.hidden = true
            vm.$nextTick(done)
          })

          it('field scope should be assigned', () => {
            assert(vm.$validator1.field1 !== undefined)
            assert(vm.$validator1.field1.minlength !== undefined)
            assert(vm.$validator1.field1.maxlength !== undefined)
            assert(vm.$validator1.field1.valid !== undefined)
            assert(vm.$validator1.field1.invalid !== undefined)
            assert(vm.$validator1.field1.touched !== undefined)
            assert(vm.$validator1.field1.untouched !== undefined)
            assert(vm.$validator1.field1.modified !== undefined)
            assert(vm.$validator1.field1.dirty !== undefined)
            assert(vm.$validator1.field1.pristine !== undefined)
          })
        })
      })
    })
  })
})
