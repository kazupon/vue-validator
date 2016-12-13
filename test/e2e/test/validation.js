module.exports = {
  validation: function (browser) {
    browser
      .url('http://localhost:8080/examples/validation/')
      // initial loaded
      .waitForElementVisible('#app', 1000)
      .waitForElementNotPresent('.errors .username-invalid', 1000)
      .waitForElementNotPresent('.errors .password-invalid', 1000)
      .waitForElementNotPresent('.errors .confirm-invalid', 1000)
      .waitForElementPresent('input[type="submit"]', 1000)
      // input valid username
      .enterValue('#username', 'kazupon')
      .waitForElementNotPresent('.errors .username-invalid', 1000)
      .waitForElementPresent('input[type="submit"]', 1000)
      // input invalid username
      .enterBackSpace('#username', 7)
      .waitForElementPresent('.errors .username-invalid', 1000)
      .waitForElementNotPresent('input[type="submit"]', 1000)

      .enterValue('#username', 'kazupon')
      .waitForElementPresent('input[type="submit"]', 1000)

      // input invalid password
      .enterValue('#password', 'test')
      .waitForElementPresent('.errors .password-invalid', 1000)
      .waitForElementNotPresent('input[type="submit"]', 1000)
      // input valid password
      .enterValue('#password', 'testtest')
      .waitForElementNotPresent('.errors .password-invalid', 1000)
      .waitForElementPresent('input[type="submit"]', 1000)
      // input invalid confirm
      .enterValue('#confirm', 'test')
      .waitForElementPresent('.errors .confirm-invalid', 1000)
      .waitForElementNotPresent('input[type="submit"]', 1000)
      // input valid comfirm
      .enterValue('#confirm', 'testtest')
      .waitForElementNotPresent('.errors .confirm-invalid', 1000)
      .waitForElementPresent('input[type="submit"]', 1000)
      .end()
  }
}
