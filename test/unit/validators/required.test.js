import { required } from '../../../src/validators'

describe('required', () => {
  describe('string', () => {
    describe('not empty', () => {
      it('should be true', () => {
        assert(required('hello') === true)
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
        assert(required(true) === true)
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
        assert(required(11) === true)
      })
    })

    describe('float', () => {
      it('should be true', () => {
        assert(required(0.11) === true)
      })
    })

    describe('0', () => {
      it('should be true', () => {
        assert(required(0) === true)
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
        assert(required({ foo: 'bar' }) === true)
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
        assert(required([1, 'foo']) === true)
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
      assert(required(() => {}) === true)
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

  describe('toggle', () => {
    describe('string', () => {
      describe('not empty', () => {
        it('should be false', () => {
          assert(required('hello', false) === false)
        })
      })

      describe('empty', () => {
        it('should be true', () => {
          assert(required('', false) === true)
        })
      })
    })

    describe('boolean', () => {
      describe('true', () => {
        it('should be false', () => {
          assert(required(true, false) === false)
        })
      })

      describe('false', () => {
        it('should be true', () => {
          assert(required(false, false) === true)
        })
      })
    })

    describe('numeric', () => {
      describe('integer', () => {
        it('should be false', () => {
          assert(required(11, false) === false)
        })
      })

      describe('float', () => {
        it('should be false', () => {
          assert(required(0.11, false) === false)
        })
      })

      describe('0', () => {
        it('should be false', () => {
          assert(required(0, false) === false)
        })
      })
    })

    describe('object', () => {
      describe('empty', () => {
        it('should be true', () => {
          assert(required({}, false) === true)
        })
      })

      describe('not empty', () => {
        it('should be false', () => {
          assert(required({ foo: 'bar' }, false) === false)
        })
      })
    })

    describe('array', () => {
      describe('empty', () => {
        it('should be true', () => {
          assert(required([], false) === true)
        })
      })

      describe('not empty', () => {
        it('should be false', () => {
          assert(required([1, 'foo'], false) === false)
        })
      })

      describe('include empty string', () => {
        it('should be true', () => {
          assert(required([1, ''], false) === true)
        })
      })

      describe('include null', () => {
        it('should be true', () => {
          assert(required([1, null], false) === true)
        })
      })

      describe('include undefined', () => {
        it('should be true', () => {
          assert(required([1, '2', undefined], false) === true)
        })
      })
    })

    describe('function', () => {
      it('should be false', () => {
        assert(required(() => {}, false) === false)
      })
    })

    describe('undefined', () => {
      it('should be true', () => {
        assert(required(undefined, false) === true)
      })
    })

    describe('null', () => {
      it('should be true', () => {
        assert(required(null, false) === true)
      })
    })
  })
})
