module.exports = {
  errors_basic: function (browser) {
    browser
      .url('http://localhost:8080/examples/errors/basic/')
      // initial loaded
      .waitForElementVisible('#app', 1000)
      .waitForElementNotPresent('.errors .required', 1000)
      .waitForElementNotPresent('.errors .email', 1000)
      // forcus input field
      .click('input')
      .waitForElementPresent('.errors .required', 1000)
      .waitForElementPresent('.errors .email', 1000)
      .assert.containsText('.errors .required', 'email: required email !!')
      .assert.containsText('.errors .email', 'email: invalid email address !!')
      // input valid value
      .enterValue('input', 'foo@domain.com')
      .waitForElementNotPresent('.errors .required', 1000)
      .waitForElementNotPresent('.errors .email', 1000)
      .end()
  }
}
