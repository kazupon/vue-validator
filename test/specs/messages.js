import assert from 'power-assert'
import Vue from 'vue'
import { each, empty, trigger } from '../../src/util'


describe('messages', () => {
  let el, vm

  let testMatches = (target, validatorErrors) => {
    let matchCount = 0
    each(target, (error, index) => {
      each(validatorErrors, (err, index) => {
        if (error.field === err.field && 
            error.validator === err.validator && 
            error.message === err.message) {
          matchCount++
        }
      })
    })
    return matchCount
  }


  beforeEach((done) => {
    el = document.createElement('div')
    el.innerHTML = 
      '<validator :groups="[\'group1\', \'group2\']" name="validation">' +
      '<input type="text" group="group1" v-validate:field1="field1">' +
      '<input type="text" group="group1" v-validate:field2="field2">' +
      '<input type="text" group="group2" v-validate:field3="field3">' +
      '<input type="text" group="group2" v-validate:field4="field4">' +
      '<input type="text" group="group1" value="0" v-validate:field5="{ min: { rule :1, message: message1 } }">' +
      '<input type="text" group="group2" value="foo" v-validate:field6="{ minlength: { rule: 4, message: onMessage2 } }">' +
      '<ul><li v-for="error in $validation.errors">' +
      '<p>{{error.field}}:{{error.message}}</p></div>' +
      '</li></ul>' +
      '</validator>'
    vm = new Vue({
      el: el,
      data: {
        field1: { pattern: { rule: '/foo/', message: 'field1 pattern error' } },
        field2: { required: { rule: true, message: 'field2 required' } },
        field3: { max: { rule: 3, message: 'field3 big too' } },
        field4: { maxlength: { rule: 3, message: 'field4 long too' } }
      },
      computed: {
        message1 () {
          return 'field5 small too'
        }
      },
      methods: {
        onMessage2 (field) {
          return 'field6 short too ' + field
        }
      }
    })
    vm.$nextTick(done)
  })

  context('invalid', () => {
    beforeEach((done) => {
      let field3 = el.getElementsByTagName('input')[2]
      field3.value = '4'
      trigger(field3, 'input')
      trigger(field3, 'blur')
      vm.$nextTick(() => {
        let field4 = el.getElementsByTagName('input')[3]
        field4.value = 'hello'
        trigger(field4, 'input')
        trigger(field4, 'blur')
        done()
      })
    })

    describe('fields', () => {
      it('should be kept messages', () => {
        assert(vm.$validation.field1.errors[0].validator === 'pattern')
        assert(vm.$validation.field1.errors[0].message === vm.field1.pattern.message)
        assert(vm.$validation.field2.errors[0].validator === 'required')
        assert(vm.$validation.field2.errors[0].message === vm.field2.required.message)
        assert(vm.$validation.field3.errors[0].validator === 'max')
        assert(vm.$validation.field3.errors[0].message === vm.field3.max.message)
        assert(vm.$validation.field4.errors[0].validator === 'maxlength')
        assert(vm.$validation.field4.errors[0].message === vm.field4.maxlength.message)
        assert(vm.$validation.field5.errors[0].validator === 'min')
        assert(vm.$validation.field5.errors[0].message === vm.message1)
        assert(vm.$validation.field6.errors[0].validator === 'minlength')
        assert(vm.$validation.field6.errors[0].message === vm.onMessage2('field6'))
      })
    })

    describe('top', () => {
      it('should be kept messages', () => {
        let targets = [
          { field: 'field1', validator: 'pattern', message: vm.field1.pattern.message },
          { field: 'field2', validator: 'required', message: vm.field2.required.message },
          { field: 'field3', validator: 'max', message: vm.field3.max.message },
          { field: 'field4', validator: 'maxlength', message: vm.field4.maxlength.message },
          { field: 'field5', validator: 'min', message: vm.message1 },
          { field: 'field6', validator: 'minlength', message: vm.onMessage2('field6') }
        ]
        assert(testMatches(targets, vm.$validation.errors) === 6)
      })
    })

    describe('group', () => {
      it('should be kept messages', () => {
        let group1Targets = [
          { field: 'field1', validator: 'pattern', message: vm.field1.pattern.message },
          { field: 'field2', validator: 'required', message: vm.field2.required.message },
          { field: 'field5', validator: 'min', message: vm.message1 }
        ]
        let group2Targets = [
          { field: 'field3', validator: 'max', message: vm.field3.max.message },
          { field: 'field4', validator: 'maxlength', message: vm.field4.maxlength.message },
          { field: 'field6', validator: 'minlength', message: vm.onMessage2('field6') }
        ]

        assert(testMatches(group1Targets, vm.$validation.group1.errors) === 3)
        assert(testMatches(group2Targets, vm.$validation.group2.errors) === 3)
      })
    })
  })


  context('valid', () => {
    beforeEach((done) => {
      let field1 = el.getElementsByTagName('input')[0]
      field1.value = 'foo'
      trigger(field1, 'input')
      trigger(field1, 'blur')
      vm.$nextTick(() => {
        let field2 = el.getElementsByTagName('input')[1]
        field2.value = 'hello'
        trigger(field2, 'input')
        trigger(field2, 'blur')
        vm.$nextTick(() => {
          let field3 = el.getElementsByTagName('input')[2]
          field3.value = '1'
          trigger(field3, 'input')
          trigger(field3, 'blur')
          vm.$nextTick(() => {
            let field4 = el.getElementsByTagName('input')[3]
            field4.value = 'hi'
            trigger(field4, 'input')
            trigger(field4, 'blur')
            vm.$nextTick(() => {
              let field5 = el.getElementsByTagName('input')[4]
              field5.value = '10'
              trigger(field5, 'input')
              trigger(field5, 'blur')
              vm.$nextTick(() => {
                let field6 = el.getElementsByTagName('input')[5]
                field6.value = 'hello'
                trigger(field6, 'input')
                trigger(field6, 'blur')
                done()
              })
            })
          })
        })
      })
    })

    describe('fields', () => {
      it('should not be kept', () => {
        assert(empty(vm.$validation.field1.errors))
        assert(empty(vm.$validation.field2.errors))
        assert(empty(vm.$validation.field3.errors))
        assert(empty(vm.$validation.field4.errors))
        assert(empty(vm.$validation.field5.errors))
        assert(empty(vm.$validation.field6.errors))
      })
    })

    describe('top', () => {
      it('should not be kept', () => {
        assert(empty(vm.$validation.errors))
      })
    })

    describe('group', () => {
      it('should not be kept', () => {
        assert(empty(vm.$validation.group1.errors))
        assert(empty(vm.$validation.group2.errors))
      })
    })
  })
})
