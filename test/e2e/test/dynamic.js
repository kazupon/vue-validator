module.exports = {
  dynamic: function (browser) {
    browser
      .url('http://localhost:8080/examples/dynamic/')
      // initial loaded
      .waitForElementVisible('#app', 1000)
      .waitForElementNotPresent('.errors .username-required', 1000)
      .waitForElementNotPresent('.errors .message-required', 1000)
      .waitForElementNotPresent('.errors .message-minlength', 1000)
      // username
      .enterValue('#username', 'foo')
      .waitForElementNotPresent('.errors .username-required', 1000)
      .enterBackSpace('#username', 3)
      .waitForElementPresent('.errors .username-required', 1000)
      .assert.containsText('.errors .username-required', 'username:required')
      // message
      .enterValue('#message', 'testtest')
      .waitForElementNotPresent('.errors .message-required', 1000)
      .waitForElementNotPresent('.errors .message-minlength', 1000)
      .enterBackSpace('#message', 8)
      .waitForElementPresent('.errors .message-required', 1000)
      .waitForElementPresent('.errors .message-minlength', 1000)
      .assert.containsText('.errors .message-required', 'message:required')
      .assert.containsText('.errors .message-minlength', 'message:minlength')
      .end()
  }
}
