import { max } from '../../../src/validators'

describe('max', () => {
  describe('boundary', () => {
    describe('value type: string', () => {
      describe('value - 1', () => {
        it('should be true', () => {
          assert(max('7', '8'))
        })
      })

      describe('just value', () => {
        it('should be true', () => {
          assert(max('8', 8))
        })
      })

      describe('value + 1', () => {
        it('should be false', () => {
          assert(max('9', '8') === false)
        })
      })
    })

    describe('value type: integer', () => {
      describe('value - 1', () => {
        it('should be true', () => {
          assert(max(7, '8'))
        })
      })

      describe('just value', () => {
        it('should be true', () => {
          assert(max(8, 8))
        })
      })

      describe('value + 1', () => {
        it('should be false', () => {
          assert(max(9, '8') === false)
        })
      })
    })

    describe('value type: float', () => {
      describe('value - 0.1', () => {
        it('should be true', () => {
          assert(max(7.9, '8'))
        })
      })

      describe('just value', () => {
        it('should be true', () => {
          assert(max(8.0, 8))
        })
      })

      describe('value + 0.1', () => {
        it('should be false', () => {
          assert(max(8.1, '8') === false)
        })
      })
    })
  })

  describe('not number', () => {
    it('should be false', () => {
      assert(max([1, 2], '4') === false)
    })
  })

  describe('not integer argument', () => {
    it('should be false', () => {
      assert(max('5', 'hello') === false)
    })
  })
})
