import States from '../../../../src/components/validity/states'
import Computed from '../../../../src/components/validity/computed'
import Lifecycles from '../../../../src/components/validity/lifecycles'
import Methods from '../../../../src/components/validity/methods'

const { props, data } = States(Vue)
const computed = Computed(Vue)
const { created } = Lifecycles(Vue)
const methods = Methods(Vue)

describe('validity component: props', () => {
  const baseOptions = {
    props,
    data,
    computed,
    created,
    methods
  }

  describe('validators', () => {
    describe('object', () => {
      it('should be work', done => {
        baseOptions.propsData = {
          field: 'field1',
          child: {}, // dummy
          validators: {
            required: true,
            maxlength: {
              rule: 8,
              message: 'too long!!'
            },
            max: {
              props: {
                prop1: {
                  rule: 256,
                  message: 'too big!!'
                }
              }
            }
          }
        }
        const vm = new Vue(baseOptions)
        // invalid
        vm.validate('required', '', (err, ret, msg) => {
          assert(err === null)
          assert(ret === false)
          assert(msg === undefined)
          vm.validate('maxlength', '123456789', (err, ret, msg) => {
            assert(err === null)
            assert(ret === false)
            assert.equal(msg, 'too long!!')
            // valid
            vm.validate('required', 'value', (err, ret, msg) => {
              assert(err === null)
              assert(ret === true)
              assert(msg === undefined)
              vm.validate('maxlength', 'value', (err, ret, msg) => {
                assert(err === null)
                assert(ret === true)
                assert(msg === undefined)
                const handler = jasmine.createSpy()
                vm.$on('validate', handler)
                waitForUpdate(() => {
                  vm.validate('max', { prop1: 512 }, () => {})
                }).thenWaitFor(6).then(() => {
                  const calls = handler.calls
                  assert(calls.count() === 1)
                  assert.equal(calls.argsFor(0)[0], 'max')
                  assert.equal(calls.argsFor(0)[1].prop, 'prop1')
                  assert.equal(calls.argsFor(0)[1].result, false)
                  assert.equal(calls.argsFor(0)[1].msg, 'too big!!')
                }).then(done)
              })
            })
          })
        })
      })
    })

    describe('array', () => {
      it('should be work', done => {
        baseOptions.propsData = {
          field: 'field1',
          child: {}, // dummy
          validators: ['required']
        }
        const vm = new Vue(baseOptions)
        // invalid
        vm.validate('required', '', (err, ret, msg) => {
          assert(err === null)
          assert(ret === false)
          assert(msg === undefined)
          // valid
          vm.validate('required', 'value', (err, ret, msg) => {
            assert(err === null)
            assert(ret === true)
            assert(msg === undefined)
            done()
          })
        })
      })
    })
  })
})
