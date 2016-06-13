import { minlength } from '../../../src/validators'

describe('minlength', () => {
  describe('string', () => {
    describe('boundary', () => {
      describe('length - 1', () => {
        it('should be false', () => {
          assert(minlength('aaa', '4') === false)
        })
      })

      describe('just length', () => {
        it('should be true', () => {
          assert(minlength('aaaa', '4'))
        })
      })

      describe('length + 1', () => {
        it('should be true', () => {
          assert(minlength('aaaaa', '4'))
        })
      })
    })
  })

  describe('array', () => {
    describe('boundary', () => {
      describe('length - 1', () => {
        it('should be false', () => {
          assert(minlength(['a', 'b', 'c'], '4') === false)
        })
      })

      describe('just length', () => {
        it('should be true', () => {
          assert(minlength(['a', 'b', 'c', 1], '4'))
        })
      })

      describe('length + 1', () => {
        it('should be true', () => {
          assert(minlength([1, 2, 3, 4, 5], '4'))
        })
      })
    })
  })

  describe('not support type', () => {
    it('should be false', () => {
      assert(minlength(111, '4') === false)
    })
  })

  describe('not integer argument', () => {
    it('should be false', () => {
      assert(minlength('aaaa', 'hello') === false)
    })
  })

  describe('integer argument', () => {
    it('should be true', () => {
      assert(minlength('aaaa', 4))
    })
  })
})
