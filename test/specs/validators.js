/**
 * Import(s)
 */

var assert = require('power-assert')
var validators = require('../../lib/validators')
var required = validators.required
var pattern = validators.pattern
var minLength = validators.minLength
var maxLength = validators.maxLength
var min = validators.min
var max = validators.max


describe('validators', function () {
  describe('required', function () {
    describe('string', function () {
      describe('not empty', function () {
        it('should be true', function () {
          assert(required('hello'))
        })
      })

      describe('empty', function () {
        it('should be false', function () {
          assert(required('') === false)
        })
      })
    })

    describe('boolean', function () {
      describe('true', function () {
        it('should be true', function () {
          assert(required(true))
        })
      })

      describe('false', function () {
        it('should be false', function () {
          assert(required(false) === false)
        })
      })
    })

    describe('numeric', function () {
      describe('integer', function () {
        it('should be true', function () {
          assert(required(11))
        })
      })

      describe('float', function () {
        it('should be true', function () {
          assert(required(0.11))
        })
      })

      describe('0', function () {
        it('should be true', function () {
          assert(required(0))
        })
      })
    })

    describe('object', function () {
      describe('empty', function () {
        it('should be false', function () {
          assert(required({}) === false)
        })
      })

      describe('not empty', function () {
        it('should be true', function () {
          assert(required({ foo: 'bar' }))
        })
      })
    })

    describe('array', function () {
      describe('empty', function () {
        it('should be false', function () {
          assert(required([]) === false)
        })
      })

      describe('not empty', function () {
        it('should be true', function () {
          assert(required([1, 'foo']))
        })
      })
    })

    describe('function', function () {
      it('should be true', function () {
        assert(required(function () {}))
      })
    })

    describe('undefined', function () {
      it('should be false', function () {
        assert(required(undefined) === false)
      })
    })

    describe('null', function () {
      it('should be false', function () {
        assert(required(null) === false)
      })
    })
  })


  describe('pattern', function () {
    describe('basic regex', function () {
      describe('valid', function () {
        it('should be true', function () {
          assert(pattern('foo', '/^[0-9a-zA-Z]+$/'))
        })
      })

      describe('invalid', function () {
        it('should be false', function () {
          assert(pattern('', '/^[0-9a-zA-Z]+$/') === false)
        })
      })
    })

    describe('flag regex', function () {
      describe('valid', function () {
        it('should be true', function () {
          assert(pattern('HELLO', '/hello/i'))
        })
      })

      describe('invalid', function () {
        it('should be false', function () {
          assert(pattern('foo', '/hello/i') === false)
        })
      })
    })

    describe('regex pattern argument', function () {
      describe('not quoted', function () {
        it('should be validate', function () {
          assert(pattern('foo', '/^[0-9a-zA-Z]+$/'))
        })
      })

      describe('single quoted', function () {
        it('should not be validate', function () {
          assert(pattern('foo', "'/^[0-9a-zA-Z]+$/'") === false)
        })
      })

      describe('double quoted', function () {
        it('should not be validate', function () {
          assert(pattern('foo', '"/^[0-9a-zA-Z]+$/"') === false)
        })
      })

      describe('single quote in pattern', function () {
        it('should not be validate', function () {
          assert(pattern("f'oo", "'/f\'oo/'") === false)
        })
      })

      describe('double quote in pattern', function () {
        it('should not be validate', function () {
          assert(pattern('f"oo', '"/f\"oo/"') === false)
        })
      })

      describe('alternation in pattern', function () {
        it('should be validate', function () {
          assert(pattern('foo', '/(foo|bar)/'))
        })
      })

      describe('object type', function () {
        it('should be validate', function () {
          assert(pattern('foo', {}) === false)
        })
      })
    })
  })


  describe('minLength', function () {
    describe('boundary', function () {
      describe('length - 1', function () {
        it('should be false', function () {
          assert(minLength('aaa', '4') === false)
        })
      })

      describe('just length', function () {
        it('should be true', function () {
          assert(minLength('aaaa', '4'))
        })
      })

      describe('length + 1', function () {
        it('should be true', function () {
          assert(minLength('aaaaa', '4'))
        })
      })
    })

    describe('not string', function () {
      it('should be false', function () {
        assert(minLength(111, '4') === false)
      })
    })

    describe('not integer argument', function () {
      it('should be false', function () {
        assert(minLength('aaaa', 'hello') === false)
      })
    })

    describe('integer argument', function () {
      it('should be true', function () {
        assert(minLength('aaaa', 4))
      })
    })
  })


  describe('maxLength', function () {
    describe('boundary', function () {
      describe('length - 1', function () {
        it('should be true', function () {
          assert(maxLength('aaa', '4'))
        })
      })

      describe('just length', function () {
        it('should be true', function () {
          assert(maxLength('aaaa', '4'))
        })
      })

      describe('length + 1', function () {
        it('should be false', function () {
          assert(maxLength('aaaaa', '4') === false)
        })
      })
    })

    describe('not string', function () {
      it('should be false', function () {
        assert(maxLength({}, '4') === false)
      })
    })

    describe('not integer argument', function () {
      it('should be false', function () {
        assert(maxLength('aaaa', 'hello') === false)
      })
    })

    describe('integer argument', function () {
      it('should be true', function () {
        assert(maxLength('aaaa', 4))
      })
    })
  })


  describe('min', function () {
    describe('boundary', function () {
      describe('value type: string', function () {
        describe('value - 1', function () {
          it('should be false', function () {
            assert(min('3', '4') === false)
          })
        })

        describe('just value', function () {
          it('should be true', function () {
            assert(min('4', 4))
          })
        })

        describe('value + 1', function () {
          it('should be true', function () {
            assert(min('5', '4'))
          })
        })
      })

      describe('value type: integer', function () {
        describe('value - 1', function () {
          it('should be false', function () {
            assert(min(3, '4') === false)
          })
        })

        describe('just value', function () {
          it('should be true', function () {
            assert(min(4, 4))
          })
        })

        describe('value + 1', function () {
          it('should be true', function () {
            assert(min(5, '4'))
          })
        })
      })

      describe('value type: float', function () {
        describe('value - 0.1', function () {
          it('should be false', function () {
            assert(min(3.9, '4') === false)
          })
        })

        describe('just value', function () {
          it('should be true', function () {
            assert(min(4.0, 4))
          })
        })

        describe('value + 0.1', function () {
          it('should be true', function () {
            assert(min(4.1, '4'))
          })
        })
      })
    })

    describe('not number', function () {
      it('should be false', function () {
        assert(min(function () {}, '4') === false)
      })
    })

    describe('not integer argument', function () {
      it('should be false', function () {
        assert(min('5', 'hello') === false)
      })
    })
  })


  describe('max', function () {
    describe('boundary', function () {
      describe('value type: string', function () {
        describe('value - 1', function () {
          it('should be true', function () {
            assert(max('7', '8'))
          })
        })

        describe('just value', function () {
          it('should be true', function () {
            assert(max('8', 8))
          })
        })

        describe('value + 1', function () {
          it('should be false', function () {
            assert(max('9', '8') === false)
          })
        })
      })

      describe('value type: integer', function () {
        describe('value - 1', function () {
          it('should be true', function () {
            assert(max(7, '8'))
          })
        })

        describe('just value', function () {
          it('should be true', function () {
            assert(max(8, 8))
          })
        })

        describe('value + 1', function () {
          it('should be false', function () {
            assert(max(9, '8') === false)
          })
        })
      })

      describe('value type: float', function () {
        describe('value - 0.1', function () {
          it('should be true', function () {
            assert(max(7.9, '8'))
          })
        })

        describe('just value', function () {
          it('should be true', function () {
            assert(max(8.0, 8))
          })
        })

        describe('value + 0.1', function () {
          it('should be false', function () {
            assert(max(8.1, '8') === false)
          })
        })
      })
    })

    describe('not number', function () {
      it('should be false', function () {
        assert(max([1, 2], '4') === false)
      })
    })

    describe('not integer argument', function () {
      it('should be false', function () {
        assert(max('5', 'hello') === false)
      })
    })
  })
})
