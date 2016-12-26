module.exports = {
  errors_grouping: function (browser) {
    browser
      .url('http://localhost:8080/examples/errors/grouping/')
      // initial loaded
      .waitForElementVisible('#app', 1000)
      .waitForElementNotPresent('.errors .username-required', 1000)
      .waitForElementNotPresent('.errors .password-required', 1000)
      .waitForElementNotPresent('.errors .password-minlength', 1000)
      .waitForElementNotPresent('.errors .confirm-required', 1000)
      .waitForElementNotPresent('.errors .confirm-minlength', 1000)
      // input valid values
      .enterValue('#username', 'test')
      .enterValue('#password', 'testtest')
      .enterValue('#confirm', 'testtest')
      .waitForElementNotPresent('.errors .username-required', 1000)
      .waitForElementNotPresent('.errors .password-required', 1000)
      .waitForElementNotPresent('.errors .password-minlength', 1000)
      .waitForElementNotPresent('.errors .confirm-required', 1000)
      .waitForElementNotPresent('.errors .confirm-minlength', 1000)
      .waitForElementPresent('input[type="submit"]', 1000)
      // input invalid values
      .enterBackSpace('#username', 4)
      .enterBackSpace('#password', 8)
      .enterBackSpace('#confirm', 8)
      .waitForElementPresent('.errors .username-required', 1000)
      .waitForElementPresent('.errors .password-required', 1000)
      .waitForElementPresent('.errors .password-minlength', 1000)
      .waitForElementPresent('.errors .confirm-required', 1000)
      .waitForElementPresent('.errors .confirm-minlength', 1000)
      .assert.containsText('.errors .username-required', 'username: required username !!')
      .assert.containsText('.errors .password-required', 'password: required password !!')
      .assert.containsText('.errors .password-minlength', 'password: too short password !!')
      .assert.containsText('.errors .confirm-required', 'confirm: required confirm !!')
      .assert.containsText('.errors .confirm-minlength', 'confirm: too short confirm !!')
      .end()
  }
}
