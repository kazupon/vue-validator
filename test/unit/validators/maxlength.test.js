import { maxlength } from '../../../src/validators'

describe('maxlength', () => {
  describe('string', () => {
    describe('boundary', () => {
      describe('length - 1', () => {
        it('should be true', () => {
          assert(maxlength('aaa', '4'))
        })
      })

      describe('just length', () => {
        it('should be true', () => {
          assert(maxlength('aaaa', '4'))
        })
      })

      describe('length + 1', () => {
        it('should be false', () => {
          assert(maxlength('aaaaa', '4') === false)
        })
      })
    })
  })

  describe('array', () => {
    describe('boundary', () => {
      describe('length - 1', () => {
        it('should be true', () => {
          assert(maxlength(['a', 'b', 'c'], '4'))
        })
      })

      describe('just length', () => {
        it('should be true', () => {
          assert(maxlength(['a', 'b', 'c', 1], '4'))
        })
      })

      describe('length + 1', () => {
        it('should be false', () => {
          assert(maxlength([1, 2, 3, 4, 5], '4') === false)
        })
      })
    })
  })

  describe('not support type', () => {
    it('should be false', () => {
      assert(maxlength({}, '4') === false)
    })
  })

  describe('not integer argument', () => {
    it('should be false', () => {
      assert(maxlength('aaaa', 'hello') === false)
    })
  })

  describe('integer argument', () => {
    it('should be true', () => {
      assert(maxlength('aaaa', 4))
    })
  })
})
