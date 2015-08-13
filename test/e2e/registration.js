/**
 * Import(s)
 */

var Nightmare = require('nightmare')
var assert = require('power-assert')
var resolve = require('./helper').resolve


/**
 * Test(s)
 */

describe('registration', function () {

  var expectOK = function (ret) {
    assert(ret)
  }
  var expectTextError = function (text) {
    assert(text === '(error)')
  }
  var expectTextSuccess = function (text) {
    assert(text === '(success)')
  }
  var getUsernameStatus = function () {
    return document.querySelector('#inputUsernameStatus').innerText
  }
  var getEmailStatus = function () {
    return document.querySelector('#inputEmailStatus').innerText
  }
  var getConfirmEmailStatus = function () {
    return document.querySelector('#inputConfirmEmailStatus').innerText
  }
  var getPasswordStatus = function () {
    return document.querySelector('#inputPasswordStatus').innerText
  }

  describe('first loaded page', function () {
    this.timeout(20000)

    it('should be invalid', function (done) {
      new Nightmare()
        .goto(resolve('./registration.html'))
        .exists('#username .has-error', expectOK)
        .exists('#inputUsernameIcon .glyphicon-remove', expectOK)
        .evaluate(getUsernameStatus, expectTextError)
        .exists('#email .has-error', expectOK)
        .exists('#inputEmailIcon .glyphicon-remove', expectOK)
        .evaluate(getEmailStatus, expectTextError)
        .exists('#confirmEmail .has-error', expectOK)
        .exists('#inputConfirmEmailIcon .glyphicon-remove', expectOK)
        .evaluate(getConfirmEmailStatus, expectTextError)
        .exists('#password .has-error', expectOK)
        .exists('#inputPassword .glyphicon-remove', expectOK)
        .evaluate(getPasswordStatus, expectTextError)
        .exists('button[type="submit"] .disabled', expectOK)
        .run(done)
    })
  })


  describe('input valid username', function () {
    this.timeout(20000)

    it('should be valid', function (done) {
      new Nightmare()
        .goto(resolve('./registration.html'))
        .type('#inputUsername', 'kazupon')
        .wait('#inputUsername')
        .exists('#username .has-success', expectOK) // success
        .exists('#inputUsernameIcon .glyphicon-ok', expectOK) // ok
        .evaluate(getUsernameStatus, expectTextSuccess) // success
        .exists('#email .has-error', expectOK)
        .exists('#inputEmailIcon .glyphicon-remove', expectOK)
        .evaluate(getEmailStatus, expectTextError)
        .exists('#confirmEmail .has-error', expectOK)
        .exists('#inputConfirmEmailIcon .glyphicon-remove', expectOK)
        .evaluate(getConfirmEmailStatus, expectTextError)
        .exists('#password .has-error', expectOK)
        .exists('#inputPassword .glyphicon-remove', expectOK)
        .evaluate(getPasswordStatus, expectTextError)
        .exists('button[type="submit"] .disabled', expectOK)
        .run(done)
    })
  })


  describe('input valid email', function () {
    this.timeout(20000)

    it('should be valid', function (done) {
      new Nightmare()
        .goto(resolve('./registration.html'))
        .type('#inputEmail', 'foo@domain.com')
        .wait('#inputEmail')
        .exists('#username .has-error', expectOK)
        .exists('#inputUsernameIcon .glyphicon-remove', expectOK)
        .evaluate(getUsernameStatus, expectTextError)
        .exists('#email .has-success', expectOK) // success
        .exists('#inputEmailIcon .glyphicon-ok', expectOK) // ok
        .evaluate(getEmailStatus, expectTextSuccess) // success
        .exists('#confirmEmail .has-error', expectOK)
        .exists('#inputConfirmEmailIcon .glyphicon-remove', expectOK)
        .evaluate(getConfirmEmailStatus, expectTextError)
        .exists('#password .has-error', expectOK)
        .exists('#inputPassword .glyphicon-remove', expectOK)
        .evaluate(getPasswordStatus, expectTextError)
        .exists('button[type="submit"] .disabled', expectOK)
        .run(done)
    })
  })


  describe('input valid confirm email', function () {
    this.timeout(20000)

    it('should be valid', function (done) {
      new Nightmare()
        .goto(resolve('./registration.html'))
        .type('#inputEmail', 'foo@domain.com')
        .wait('#inputEmail')
        .type('#inputConfirmEmail', 'foo@domain.com')
        .wait('#inputConfirmEmail')
        .exists('#username .has-error', expectOK)
        .exists('#inputUsernameIcon .glyphicon-remove', expectOK)
        .evaluate(getUsernameStatus, expectTextError)
        .exists('#email .has-success', expectOK) // success
        .exists('#inputEmailIcon .glyphicon-ok', expectOK) // ok
        .evaluate(getEmailStatus, expectTextSuccess) // success
        .exists('#confirmEmail .has-success', expectOK) // success
        .exists('#inputConfirmEmailIcon .glyphicon-ok', expectOK) // ok
        .evaluate(getConfirmEmailStatus, expectTextSuccess) // success
        .exists('#password .has-error', expectOK)
        .exists('#inputPassword .glyphicon-remove', expectOK)
        .evaluate(getPasswordStatus, expectTextError)
        .exists('button[type="submit"] .disabled', expectOK)
        .run(done)
    })
  })


  describe('input valid password', function () {
    this.timeout(20000)

    it('should be valid', function (done) {
      new Nightmare()
        .goto(resolve('./registration.html'))
        .type('#inputPassword', 'xxxxxxxxx')
        .wait('#inputPassword')
        .exists('#username .has-error', expectOK)
        .exists('#inputUsernameIcon .glyphicon-remove', expectOK)
        .evaluate(getUsernameStatus, expectTextError)
        .exists('#email .has-error', expectOK)
        .exists('#inputEmailIcon .glyphicon-remove', expectOK)
        .evaluate(getEmailStatus, expectTextError)
        .exists('#confirmEmail .has-error', expectOK)
        .exists('#inputConfirmEmailIcon .glyphicon-remove', expectOK)
        .evaluate(getConfirmEmailStatus, expectTextError)
        .exists('#password .has-success', expectOK) // success
        .exists('#inputPassword .glyphicon-ok', expectOK) // ok
        .evaluate(getPasswordStatus, expectTextSuccess) // success
        .exists('button[type="submit"] .disabled', expectOK)
        .run(done)
    })
  })


  describe('input valid fileds', function () {
    this.timeout(20000)

    it('join button should be enabled', function (done) {
      new Nightmare()
        .goto(resolve('./registration.html'))
        .type('#inputUsername', 'kazupon')
        .wait('#inputUsername')
        .type('#inputEmail', 'foo@domain.com')
        .wait('#inputEmail')
        .type('#inputConfirmEmail', 'foo@domain.com')
        .wait('#inputConfirmEmail')
        .type('#inputPassword', 'xxxxxxxxx')
        .wait('#inputPassword')
        .exists('#username .has-success', expectOK)
        .exists('#inputUsernameIcon .glyphicon-ok', expectOK)
        .evaluate(getUsernameStatus, expectTextSuccess)
        .exists('#email .has-success', expectOK)
        .exists('#inputEmailIcon .glyphicon-ok', expectOK)
        .evaluate(getEmailStatus, expectTextSuccess)
        .exists('#confirmEmail .has-success', expectOK)
        .exists('#inputConfirmEmailIcon .glyphicon-ok', expectOK)
        .evaluate(getConfirmEmailStatus, expectTextSuccess)
        .exists('#password .has-success', expectOK)
        .exists('#inputPassword .glyphicon-ok', expectOK)
        .evaluate(getPasswordStatus, expectTextSuccess)
        .exists('button[type="submit"]', expectOK) // enabled
        .run(done)
    })
  })
})
