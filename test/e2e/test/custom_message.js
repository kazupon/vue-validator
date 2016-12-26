module.exports = {
  custom_message: function (browser) {
    browser
      .url('http://localhost:8080/examples/custom/message/')
      // initial loaded
      .waitForElementVisible('#app', 1000)
      .waitForElementNotPresent('.errors .username', 1000)
      .waitForElementNotPresent('.errors .address', 1000)
      .waitForElementNotPresent('.errors .age', 1000)
      .waitForElementNotPresent('.errors .site', 1000)
      // username
      .enterValue('input[name="username"]', 'foo')
      .waitForElementNotPresent('.errors .username', 1000)
      .enterBackSpace('input[name="username"]', 3)
      .waitForElementPresent('.errors .username', 1000)
      .assert.containsText('.errors .username', 'required "username" field')
      // address
      .enterValue('input[name="address"]', 'foo@domain.com')
      .waitForElementNotPresent('.errors .address', 1000)
      .enterValue('input[name="address"]', 'foo')
      .waitForElementPresent('.errors .address', 1000)
      .assert.containsText('.errors .address', 'invalid email address')
      // age
      .enterValue('input[name="age"]', '12')
      .waitForElementNotPresent('.errors .age', 1000)
      .enterValue('input[name="age"]', 'foo')
      .waitForElementPresent('.errors .age', 1000)
      .assert.containsText('.errors .age', 'invalid numeric value')
      // site
      .enterValue('input[name="site"]', 'http://google.com')
      .waitForElementNotPresent('.errors .site', 1000)
      .enterValue('input[name="site"]', 'foo')
      .waitForElementPresent('.errors .site', 1000)
      .assert.containsText('.errors .site', 'invalid "site" url format field')
      .end()
  }
}
