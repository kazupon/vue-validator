import assert from 'power-assert'
import Vue from 'vue'


describe('validator element directive', () => {
  let vm, el

  beforeEach(() => {
    el = document.createElement('div')
  })


  describe('normal', () => {
    beforeEach(() => {
      vm = new Vue({
        el: el,
        template: '<validator name="validator1"></validator>'
      })
    })

    it('validator scope should be assigned', () => {
      assert(vm.$validator1 !== undefined)
      assert(vm.$validator1.valid !== undefined)
      assert(vm.$validator1.invalid !== undefined)
      assert(vm.$validator1.touched !== undefined)
      assert(vm.$validator1.untouched !== undefined)
      assert(vm.$validator1.modified !== undefined)
      assert(vm.$validator1.dirty !== undefined)
      assert(vm.$validator1.pristine !== undefined)
    })
  })


  describe('invalid warn', () => {
    context('not specify name attribute', () => {
      it.skip('should be called warn', () => {
        // TODO:
      })
    })
    context.skip('not exist validator map object in vm instance', () => {
      it.skip('should be called warn', () => {
        // TODO:
      })
    })
  })


  describe('groups attribute', () => {
    context('plain string', () => {
      beforeEach(() => {
        vm = new Vue({
          el: el,
          template: '<validator name="validator1" :groups="\'group1\'"></validator>'
        })
      })

      it('validator group scope should be assigned', () => {
        assert(vm.$validator1.group1 !== undefined)
        assert(vm.$validator1.group1.valid !== undefined)
        assert(vm.$validator1.group1.invalid !== undefined)
        assert(vm.$validator1.group1.touched !== undefined)
        assert(vm.$validator1.group1.untouched !== undefined)
        assert(vm.$validator1.group1.modified !== undefined)
        assert(vm.$validator1.group1.dirty !== undefined)
        assert(vm.$validator1.group1.pristine !== undefined)
      })
    })

    context('array', () => {
      beforeEach(() => {
        vm = new Vue({
          el: el,
          data: { group: 'group2' },
          template: '<validator name="validator1" :groups="[\'group1\', group]"></validator>'
        })
      })

      it('validator group scope should be assigned', () => {
        assert(vm.$validator1.group1 !== undefined)
        assert(vm.$validator1.group1.valid !== undefined)
        assert(vm.$validator1.group1.invalid !== undefined)
        assert(vm.$validator1.group1.touched !== undefined)
        assert(vm.$validator1.group1.untouched !== undefined)
        assert(vm.$validator1.group1.modified !== undefined)
        assert(vm.$validator1.group1.dirty !== undefined)
        assert(vm.$validator1.group1.pristine !== undefined)
        assert(vm.$validator1.group2 !== undefined)
        assert(vm.$validator1.group2.valid !== undefined)
        assert(vm.$validator1.group2.invalid !== undefined)
        assert(vm.$validator1.group2.touched !== undefined)
        assert(vm.$validator1.group2.untouched !== undefined)
        assert(vm.$validator1.group2.modified !== undefined)
        assert(vm.$validator1.group2.dirty !== undefined)
        assert(vm.$validator1.group2.pristine !== undefined)
      })
    })
  })


  describe('v-show', () => {
    beforeEach(() => {
      vm = new Vue({
        el: el,
        data: {
          hidden: false
        },
        template: '<validator v-show="hidden" name="validator1"></validator>'
      })
    })

    describe('set true', () => {
      beforeEach((done) => {
        vm.hidden = true
        vm.$nextTick(done)
      })

      it('validator scope should be assigned', () => {
        assert(vm.$validator1 !== undefined)
        assert(vm.$validator1.valid !== undefined)
        assert(vm.$validator1.invalid !== undefined)
        assert(vm.$validator1.touched !== undefined)
        assert(vm.$validator1.untouched !== undefined)
        assert(vm.$validator1.modified !== undefined)
        assert(vm.$validator1.dirty !== undefined)
        assert(vm.$validator1.pristine !== undefined)
      })

      context('set false', () => {
        beforeEach((done) => {
          vm.hidden = false
          vm.$nextTick(done)
        })

        it('validator scope should be assigned', () => {
          assert(vm.$validator1 !== undefined)
          assert(vm.$validator1.valid !== undefined)
          assert(vm.$validator1.invalid !== undefined)
          assert(vm.$validator1.touched !== undefined)
          assert(vm.$validator1.untouched !== undefined)
          assert(vm.$validator1.modified !== undefined)
          assert(vm.$validator1.dirty !== undefined)
          assert(vm.$validator1.pristine !== undefined)
        })

        describe('set true', () => {
          beforeEach((done) => {
            vm.hidden = true
            vm.$nextTick(done)
          })

          it('validator scope should be assigned', () => {
            assert(vm.$validator1 !== undefined)
            assert(vm.$validator1.valid !== undefined)
            assert(vm.$validator1.invalid !== undefined)
            assert(vm.$validator1.touched !== undefined)
            assert(vm.$validator1.untouched !== undefined)
            assert(vm.$validator1.modified !== undefined)
            assert(vm.$validator1.dirty !== undefined)
            assert(vm.$validator1.pristine !== undefined)
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
        template: '<validator v-if="hidden" name="validator1"></validator>'
      })
    })

    describe('set true', () => {
      beforeEach((done) => {
        vm.hidden = true
        vm.$nextTick(done)
      })

      it('validator scope should be assigned', () => {
        assert(vm.$validator1 !== undefined)
        assert(vm.$validator1.valid !== undefined)
        assert(vm.$validator1.invalid !== undefined)
        assert(vm.$validator1.touched !== undefined)
        assert(vm.$validator1.untouched !== undefined)
        assert(vm.$validator1.modified !== undefined)
        assert(vm.$validator1.dirty !== undefined)
        assert(vm.$validator1.pristine !== undefined)
      })

      describe('set false', () => {
        beforeEach((done) => {
          vm.hidden = false
          vm.$nextTick(done)
        })

        it('validator scope should not be assigned', () => {
          assert(vm.$validator1 === null)
        })

        describe('set true', () => {
          beforeEach((done) => {
            vm.hidden = true
            vm.$nextTick(done)
          })

          it('validator scope should be assigned', () => {
            assert(vm.$validator1 !== undefined)
            assert(vm.$validator1.valid !== undefined)
            assert(vm.$validator1.invalid !== undefined)
            assert(vm.$validator1.touched !== undefined)
            assert(vm.$validator1.untouched !== undefined)
            assert(vm.$validator1.modified !== undefined)
            assert(vm.$validator1.dirty !== undefined)
            assert(vm.$validator1.pristine !== undefined)
          })
        })
      })
    })
  })
})
