import assert from 'power-assert'
import { required, pattern, minlength, maxlength, min, max } from '../../src/validators'


describe('validators', () => {
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
          assert(pattern("f'oo", "'/f\'oo/'") === false)
        })
      })

      describe('double quote in pattern', () => {
        it('should not be validate', () => {
          assert(pattern('f"oo', '"/f\"oo/"') === false)
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
})
