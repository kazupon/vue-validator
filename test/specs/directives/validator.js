import assert from 'power-assert'
import Vue from 'vue'
import { trigger, pull } from '../../../src/util'


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


  describe('name attribute', () => {
    context('kebab-case', () => {
      beforeEach(() => {
        vm = new Vue({
          el: el,
          template: '<validator name="my-validator"></validator>'
        })
      })

      it('should be assigned with caml-case', () => {
        assert(vm.$myValidator !== undefined)
      })
    })

    context('caml-case', () => {
      beforeEach(() => {
        vm = new Vue({
          el: el,
          template: '<validator name="myValidator"></validator>'
        })
      })

      it('should be assigned with caml-case', () => {
        assert(vm.$myValidator !== undefined)
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


  describe('v-for', () => {
    beforeEach((done) => {
      el.innerHTML = '<ul><li v-for="task in tasks">' + 
        '<button :id="del + $index" @click="onDelete(task)">delete</button>' + 
        '<validator :name="\'validator\' + $index">' +
        '<form novalidate>' + 
        '<input type="text" :value="task.name" v-validate:name="{ required: true, minlength: calculate($index) }">' +
        '</form>' +
        '</validator>' +
        '</li></ul>' + 
        '<button id="add" @click="onAdd">add</button>'
      vm = new Vue({
        el: el,
        data: {
          counter: 2,
          tasks: [{
            id: 1, name: 'task1'
          }, {
            id: 2, name: 'task2'
          }]
        },
        methods: {
          calculate (index) {
            return (index + 1) * 4
          },
          add (id, name) {
            this.tasks.push({ id: id, name: name })
          },
          delete (item) {
            pull(this.tasks, item)
          },
          onAdd () {
            let id = this.counter++
            this.add(id, 'task' + id)
          },
          onDelete (item) {
            this.delete(item)
          }
        }
      })
      vm.$nextTick(done)
    })

    describe('initial assignment', () => {
      it('should be assigned', (done) => {
        // default
        assert(vm.$validator0.name.required === false)
        assert(vm.$validator0.name.minlength === false)
        assert(vm.$validator1.name.required === false)
        assert(vm.$validator1.name.minlength === true)

        let name1 = el.getElementsByTagName('input')[0]
        let name2 = el.getElementsByTagName('input')[1]
        name1.value = ''
        name2.value = 'tasktask2'
        trigger(name1, 'input')
        trigger(name2, 'input')
        vm.$nextTick(() => {
          assert(vm.$validator0.name.required === true)
          assert(vm.$validator0.name.minlength === true)
          assert(vm.$validator1.name.required === false)
          assert(vm.$validator1.name.minlength === false)
          done()
        })
      })
    })

    describe('dynamic assignment', () => {
      context('add', () => {
        beforeEach((done) => {
          let add = el.getElementsByTagName('button')[2]
          trigger(add, 'click')
          vm.$nextTick(done)
        })

        it('should be assigned', (done) => {
          assert(vm.$validator2.name.required === false)
          assert(vm.$validator2.name.minlength === true)
          done()
        })
      })

      context('delete', () => {
        beforeEach((done) => {
          let delete1 = el.getElementsByTagName('button')[0]
          let delete2 = el.getElementsByTagName('button')[1]
          trigger(delete1, 'click')
          trigger(delete2, 'click')
          vm.$nextTick(done)
        })

        it('should not be assigned', () => {
          assert(vm.$validator0 === null)
          assert(vm.$validator1 === null)
        })

        context('add', () => {
          beforeEach((done) => {
            let add = el.getElementsByTagName('button')[0]
            trigger(add, 'click')
            trigger(add, 'click')
            vm.$nextTick(done)
          })

          it('should be assigned', (done) => {
            assert(vm.$validator0.name.required === false)
            assert(vm.$validator0.name.minlength === false)
            assert(vm.$validator1.name.required === false)
            assert(vm.$validator1.name.minlength === true)
            done()
          })
        })
      })
    })
  })
})
