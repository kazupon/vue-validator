/**
 * Import(s)
 */

var validates = require('../../lib/validates')
var required = validates.required
var pattern = validates.pattern
var minLength = validates.minLength
var maxLength = validates.maxLength
var min = validates.min
var max = validates.max


describe('validates', function () {
  describe('required', function () {
    describe('string', function () {
      describe('not empty', function () {
        it('should be true', function () {
          expect(required('hello')).to.be(true)
        })
      })

      describe('empty', function () {
        it('should be false', function () {
          expect(required('')).to.be(false)
        })
      })
    })

    describe('boolean', function () {
      describe('true', function () {
        it('should be true', function () {
          expect(required(true)).to.be(true)
        })
      })

      describe('false', function () {
        it('should be false', function () {
          expect(required(false)).to.be(false)
        })
      })
    })

    describe('numeric', function () {
      describe('integer', function () {
        it('should be true', function () {
          expect(required(11)).to.be(true)
        })
      })

      describe('float', function () {
        it('should be true', function () {
          expect(required(0.11)).to.be(true)
        })
      })
    })

    describe('object', function () {
      describe('empty', function () {
        it('should be false', function () {
          expect(required({})).to.be(false)
        })
      })

      describe('not empty', function () {
        it('should be true', function () {
          expect(required({ foo: 'bar' })).to.be(true)
        })
      })
    })

    describe('array', function () {
      describe('empty', function () {
        it('should be false', function () {
          expect(required([])).to.be(false)
        })
      })

      describe('not empty', function () {
        it('should be true', function () {
          expect(required([1, 'foo'])).to.be(true)
        })
      })
    })

    describe('function', function () {
      it('should be true', function () {
        expect(required(function () {})).to.be(true)
      })
    })

    describe('undefined', function () {
      it('should be false', function () {
        expect(required(undefined)).to.be(false)
      })
    })

    describe('null', function () {
      it('should be false', function () {
        expect(required(null)).to.be(false)
      })
    })
  })


  describe('pattern', function () {
    describe('basic regex', function () {
      describe('valid', function () {
        it('should be true', function () {
          expect(pattern('foo', '/^[0-9a-zA-Z]+$/')).to.be(true)
        })
      })

      describe('invalid', function () {
        it('should be false', function () {
          expect(pattern('', '/^[0-9a-zA-Z]+$/')).to.be(false)
        })
      })
    })

    describe('flag regex', function () {
      describe('valid', function () {
        it('should be true', function () {
          expect(pattern('HELLO', '/hello/i')).to.be(true)
        })
      })

      describe('invalid', function () {
        it('should be false', function () {
          expect(pattern('foo', '/hello/i')).to.be(false)
        })
      })
    })

    describe('regex pattern argument', function () {
      describe('not quoted', function () {
        it('should be validate', function () {
          expect(pattern('foo', '/^[0-9a-zA-Z]+$/')).to.be(true)
        })
      })

      describe('single quoted', function () {
        it('should not be validate', function () {
          expect(pattern('foo', "'/^[0-9a-zA-Z]+$/'")).to.be(false)
        })
      })

      describe('double quoted', function () {
        it('should not be validate', function () {
          expect(pattern('foo', '"/^[0-9a-zA-Z]+$/"')).to.be(false)
        })
      })

      describe('single quote in pattern', function () {
        it('should not be validate', function () {
          expect(pattern("f'oo", "'/f\'oo/'")).to.be(false)
        })
      })

      describe('double quote in pattern', function () {
        it('should not be validate', function () {
          expect(pattern('f"oo', '"/f\"oo/"')).to.be(false)
        })
      })

      describe('alternation in pattern', function () {
        it('should be validate', function () {
          expect(pattern('foo', '/(foo|bar)/')).to.be(true)
        })
      })

      describe('object type', function () {
        it('should be validate', function () {
          expect(pattern('foo', {})).to.be(false)
        })
      })
    })
  })


  describe('minLength', function () {
    describe('boundary', function () {
      describe('length - 1', function () {
        it('should be false', function () {
          expect(minLength('aaa', '4')).to.be(false)
        })
      })

      describe('just length', function () {
        it('should be true', function () {
          expect(minLength('aaaa', '4')).to.be(true)
        })
      })

      describe('length + 1', function () {
        it('should be true', function () {
          expect(minLength('aaaaa', '4')).to.be(true)
        })
      })
    })

    describe('not string', function () {
      it('should be false', function () {
        expect(minLength(111, '4')).to.be(false)
      })
    })

    describe('not integer argument', function () {
      it('should be false', function () {
        expect(minLength('aaaa', 'hello')).to.be(false)
      })
    })

    describe('integer argument', function () {
      it('should be true', function () {
        expect(minLength('aaaa', 4)).to.be(true)
      })
    })
  })


  describe('maxLength', function () {
    describe('boundary', function () {
      describe('length - 1', function () {
        it('should be true', function () {
          expect(maxLength('aaa', '4')).to.be(true)
        })
      })

      describe('just length', function () {
        it('should be true', function () {
          expect(maxLength('aaaa', '4')).to.be(true)
        })
      })

      describe('length + 1', function () {
        it('should be false', function () {
          expect(maxLength('aaaaa', '4')).to.be(false)
        })
      })
    })

    describe('not string', function () {
      it('should be false', function () {
        expect(maxLength({}, '4')).to.be(false)
      })
    })

    describe('not integer argument', function () {
      it('should be false', function () {
        expect(maxLength('aaaa', 'hello')).to.be(false)
      })
    })

    describe('integer argument', function () {
      it('should be true', function () {
        expect(maxLength('aaaa', 4)).to.be(true)
      })
    })
  })


  describe('min', function () {
    describe('boundary', function () {
      describe('value type: string', function () {
        describe('value - 1', function () {
          it('should be false', function () {
            expect(min('3', '4')).to.be(false)
          })
        })

        describe('just value', function () {
          it('should be true', function () {
            expect(min('4', 4)).to.be(true)
          })
        })

        describe('value + 1', function () {
          it('should be true', function () {
            expect(min('5', '4')).to.be(true)
          })
        })
      })

      describe('value type: integer', function () {
        describe('value - 1', function () {
          it('should be false', function () {
            expect(min(3, '4')).to.be(false)
          })
        })

        describe('just value', function () {
          it('should be true', function () {
            expect(min(4, 4)).to.be(true)
          })
        })

        describe('value + 1', function () {
          it('should be true', function () {
            expect(min(5, '4')).to.be(true)
          })
        })
      })

      describe('value type: float', function () {
        describe('value - 0.1', function () {
          it('should be false', function () {
            expect(min(3.9, '4')).to.be(false)
          })
        })

        describe('just value', function () {
          it('should be true', function () {
            expect(min(4.0, 4)).to.be(true)
          })
        })

        describe('value + 0.1', function () {
          it('should be true', function () {
            expect(min(4.1, '4')).to.be(true)
          })
        })
      })
    })

    describe('not number', function () {
      it('should be false', function () {
        expect(min(function () {}, '4')).to.be(false)
      })
    })

    describe('not integer argument', function () {
      it('should be false', function () {
        expect(min('5', 'hello')).to.be(false)
      })
    })
  })


  describe('max', function () {
    describe('boundary', function () {
      describe('value type: string', function () {
        describe('value - 1', function () {
          it('should be true', function () {
            expect(max('7', '8')).to.be(true)
          })
        })

        describe('just value', function () {
          it('should be true', function () {
            expect(max('8', 8)).to.be(true)
          })
        })

        describe('value + 1', function () {
          it('should be false', function () {
            expect(max('9', '8')).to.be(false)
          })
        })
      })

      describe('value type: integer', function () {
        describe('value - 1', function () {
          it('should be true', function () {
            expect(max(7, '8')).to.be(true)
          })
        })

        describe('just value', function () {
          it('should be true', function () {
            expect(max(8, 8)).to.be(true)
          })
        })

        describe('value + 1', function () {
          it('should be false', function () {
            expect(max(9, '8')).to.be(false)
          })
        })
      })

      describe('value type: float', function () {
        describe('value - 0.1', function () {
          it('should be true', function () {
            expect(max(7.9, '8')).to.be(true)
          })
        })

        describe('just value', function () {
          it('should be true', function () {
            expect(max(8.0, 8)).to.be(true)
          })
        })

        describe('value + 0.1', function () {
          it('should be false', function () {
            expect(max(8.1, '8')).to.be(false)
          })
        })
      })
    })

    describe('not number', function () {
      it('should be false', function () {
        expect(max([1, 2], '4')).to.be(false)
      })
    })

    describe('not integer argument', function () {
      it('should be false', function () {
        expect(max('5', 'hello')).to.be(false)
      })
    })
  })
})
