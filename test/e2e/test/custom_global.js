module.exports = {
  custom_global: function (browser) {
    browser
      .url('http://localhost:8080/examples/custom/global/')
      // initial loaded
      .waitForElementVisible('#app', 1000)
      .waitForElementNotPresent('.errors .email', 1000)
      .waitForElementNotPresent('input[type="submit"]', 1000)
      // input invalid value
      .enterValue('input', 'foo')
      .waitForElementPresent('.errors .email', 1000)
      .waitForElementNotPresent('input[type="submit"]', 1000)
      // input valid value
      .enterValue('input', 'foo@domain.com')
      .waitForElementNotPresent('.errors .email', 1000)
      .waitForElementPresent('input[type="submit"]', 1000)
      .end()
  }
}
