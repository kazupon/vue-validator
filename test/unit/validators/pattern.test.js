import { pattern } from '../../../src/validators'

describe('pattern', () => {
  describe('basic regex', () => {
    describe('valid', () => {
      it('should be true', () => {
        assert(pattern('foo', '/^[0-9a-zA-Z]+$/'))
      })
    })

    describe('invalid', () => {
      it('should be false', () => {
        assert(pattern('', '/^[0-9a-zA-Z]+$/') === false)
      })
    })
  })

  describe('flag regex', () => {
    describe('valid', () => {
      it('should be true', () => {
        assert(pattern('HELLO', '/hello/i'))
      })
    })

    describe('invalid', () => {
      it('should be false', () => {
        assert(pattern('foo', '/hello/i') === false)
      })
    })
  })

  describe('regex pattern argument', () => {
    describe('not quoted', () => {
      it('should be validate', () => {
        assert(pattern('foo', '/^[0-9a-zA-Z]+$/'))
      })
    })

    describe('single quoted', () => {
      it('should not be validate', () => {
        assert(pattern('foo', "'/^[0-9a-zA-Z]+$/'") === false)
      })
    })

    describe('double quoted', () => {
      it('should not be validate', () => {
        assert(pattern('foo', '"/^[0-9a-zA-Z]+$/"') === false)
      })
    })

    describe('single quote in pattern', () => {
      it('should not be validate', () => {
        assert(pattern("f'oo", `'/f'oo/'`) === false)
      })
    })

    describe('double quote in pattern', () => {
      it('should not be validate', () => {
        assert(pattern('f"oo', `"/f"oo/"`) === false)
      })
    })

    describe('alternation in pattern', () => {
      it('should be validate', () => {
        assert(pattern('foo', '/(foo|bar)/'))
      })
    })

    describe('object type', () => {
      it('should be validate', () => {
        assert(pattern('foo', {}) === false)
      })
    })
  })
})
