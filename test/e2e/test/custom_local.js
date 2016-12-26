module.exports = {
  custom_local: function (browser) {
    browser
      .url('http://localhost:8080/examples/custom/local/')
      // initial loaded
      .waitForElementVisible('#app', 1000)
      .waitForElementNotPresent('.errors .username', 1000)
      .waitForElementNotPresent('.errors .age', 1000)
      .waitForElementNotPresent('.errors .site', 1000)
      // username
      .enterValue('input[name="username"]', 'foo')
      .waitForElementNotPresent('.errors .username', 1000)
      .enterBackSpace('input[name="username"]', 3)
      .waitForElementPresent('.errors .username', 1000)
      // age
      .enterValue('input[name="age"]', '12')
      .waitForElementNotPresent('.errors .age', 1000)
      .enterValue('input[name="age"]', 'foo')
      .waitForElementPresent('.errors .age', 1000)
      // site
      .enterValue('input[name="site"]', 'http://google.com')
      .waitForElementNotPresent('.errors .site', 1000)
      .enterValue('input[name="site"]', 'foo')
      .waitForElementPresent('.errors .site', 1000)
      .end()
  }
}
