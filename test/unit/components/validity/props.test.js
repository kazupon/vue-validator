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
                done()
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
