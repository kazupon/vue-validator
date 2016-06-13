import { min } from '../../../src/validators'

describe('min', () => {
  describe('boundary', () => {
    describe('value type: string', () => {
      describe('value - 1', () => {
        it('should be false', () => {
          assert(min('3', '4') === false)
        })
      })

      describe('just value', () => {
        it('should be true', () => {
          assert(min('4', 4))
        })
      })

      describe('value + 1', () => {
        it('should be true', () => {
          assert(min('5', '4'))
        })
      })
    })

    describe('value type: integer', () => {
      describe('value - 1', () => {
        it('should be false', () => {
          assert(min(3, '4') === false)
        })
      })

      describe('just value', () => {
        it('should be true', () => {
          assert(min(4, 4))
        })
      })

      describe('value + 1', () => {
        it('should be true', () => {
          assert(min(5, '4'))
        })
      })
    })

    describe('value type: float', () => {
      describe('value - 0.1', () => {
        it('should be false', () => {
          assert(min(3.9, '4') === false)
        })
      })

      describe('just value', () => {
        it('should be true', () => {
          assert(min(4.0, 4))
        })
      })

      describe('value + 0.1', () => {
        it('should be true', () => {
          assert(min(4.1, '4'))
        })
      })
    })
  })

  describe('not number', () => {
    it('should be false', () => {
      assert(min(() => {}, '4') === false)
    })
  })

  describe('not integer argument', () => {
    it('should be false', () => {
      assert(min('5', 'hello') === false)
    })
  })
})
