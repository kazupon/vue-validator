import assert from 'power-assert'
import Nightmare from 'nightmare'
const url = 'http://localhost:' + (process.env.PORT || 8080)


describe('registration', () => {

  let expectOK = (ret) => {
    assert(ret)
  }
  let expectTextError = (text) => {
    assert(text === '(error)')
  }
  let expectTextSuccess = (text) => {
    assert(text === '(success)')
  }
  let getUsernameStatus = () => {
    return document.querySelector('#inputUsernameStatus').innerText
  }
  let getEmailStatus = () => {
    return document.querySelector('#inputEmailStatus').innerText
  }
  let getConfirmEmailStatus = () => {
    return document.querySelector('#inputConfirmEmailStatus').innerText
  }
  let getPasswordStatus = () => {
    return document.querySelector('#inputPasswordStatus').innerText
  }

  describe('first loaded page', function () {
    this.timeout(20000)

    it('should be invalid', (done) => {
      new Nightmare()
        .goto(url)
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

    it('should be valid', (done) => {
      new Nightmare()
        .goto(url)
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

    it('should be valid', (done) => {
      new Nightmare()
        .goto(url)
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

    it('should be valid', (done) => {
      new Nightmare()
        .goto(url)
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

    it('should be valid', (done) => {
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

    it('join button should be enabled', (done) => {
      new Nightmare()
        .goto(url)
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
