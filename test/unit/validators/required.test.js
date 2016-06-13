import { required } from '../../../src/validators'

describe('required', () => {
  describe('string', () => {
    describe('not empty', () => {
      it('should be true', () => {
        assert(required('hello'))
      })
    })

    describe('empty', () => {
      it('should be false', () => {
        assert(required('') === false)
      })
    })
  })

  describe('boolean', () => {
    describe('true', () => {
      it('should be true', () => {
        assert(required(true))
      })
    })

    describe('false', () => {
      it('should be false', () => {
        assert(required(false) === false)
      })
    })
  })

  describe('numeric', () => {
    describe('integer', () => {
      it('should be true', () => {
        assert(required(11))
      })
    })

    describe('float', () => {
      it('should be true', () => {
        assert(required(0.11))
      })
    })

    describe('0', () => {
      it('should be true', () => {
        assert(required(0))
      })
    })
  })

  describe('object', () => {
    describe('empty', () => {
      it('should be false', () => {
        assert(required({}) === false)
      })
    })

    describe('not empty', () => {
      it('should be true', () => {
        assert(required({ foo: 'bar' }))
      })
    })
  })

  describe('array', () => {
    describe('empty', () => {
      it('should be false', () => {
        assert(required([]) === false)
      })
    })

    describe('not empty', () => {
      it('should be true', () => {
        assert(required([1, 'foo']))
      })
    })

    describe('include empty string', () => {
      it('should be false', () => {
        assert(required([1, '']) === false)
      })
    })

    describe('include null', () => {
      it('should be false', () => {
        assert(required([1, null]) === false)
      })
    })

    describe('include undefined', () => {
      it('should be false', () => {
        assert(required([1, '2', undefined]) === false)
      })
    })
  })

  describe('function', () => {
    it('should be true', () => {
      assert(required(() => {}))
    })
  })

  describe('undefined', () => {
    it('should be false', () => {
      assert(required(undefined) === false)
    })
  })

  describe('null', () => {
    it('should be false', () => {
      assert(required(null) === false)
    })
  })
})
