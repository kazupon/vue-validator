/**
 * Import(s)
 */

var assert = require('power-assert')
var validators = require('../../lib/validators')
var VueValidator = require('../../index')


describe('assets', function () {
  describe('build-in', function () {
    Object.keys(validators).forEach(function (validator) {
      context(validator, function () {
        it('should be registered', function () {
          assert(VueValidator.assets(validator), validators[validator])
        })
      })
    })
  })

  describe('custom', function () {
    it('should be registered validator', function () {
      var validator = function () {}
      VueValidator.assets('validator1', validator)
      assert(VueValidator.assets('validator1') === validator)
    })
  })
})
