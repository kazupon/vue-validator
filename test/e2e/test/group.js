module.exports = {
  group: function (browser) {
    browser
      .url('http://localhost:8080/examples/group/')
      // initial loaded
      .waitForElementVisible('#app', 1000)
      .waitForElementNotPresent('.errors .error-username', 1000)
      .waitForElementNotPresent('.errors .error-password', 1000)
      // input valid username
      .enterValue('#username', 'kazupon')
      .waitForElementNotPresent('.errors .error-username', 1000)
      .waitForElementPresent('input[type="submit"]', 1000)
      // input invalid username
      .enterBackSpace('#username', 7)
      .waitForElementPresent('.errors .error-username', 1000)
      .waitForElementNotPresent('input[type="submit"]', 1000)

      .enterValue('#username', 'kazupon')
      .waitForElementPresent('input[type="submit"]', 1000)

      // input invalid password
      .enterValue('#password', 'test')
      .waitForElementPresent('.errors .error-password', 1000)
      .waitForElementNotPresent('input[type="submit"]', 1000)
      // input valid password
      .enterValue('#password', 'testtest')
      .waitForElementNotPresent('.errors .error-password', 1000)
      .waitForElementPresent('input[type="submit"]', 1000)
      // input invalid confirm
      .enterValue('#confirm', 'test')
      .waitForElementNotPresent('input[type="submit"]', 1000)
      // input valid comfirm
      .enterValue('#confirm', 'testtest')
      .waitForElementPresent('input[type="submit"]', 1000)
      .end()
  }
}
