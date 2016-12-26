module.exports = {
  radio: function (browser) {
    browser
      .url('http://localhost:8080/examples/radio/')
      // initial loaded
      .waitForElementVisible('#app', 1000)
      .waitForElementNotPresent('.errors .fruits-required', 1000)
      // invalid
      .simulateEvent('#apple', 'focusin')
      .waitForElementPresent('.errors .fruits-required', 1000)
      .assert.containsText('.errors .fruits-required', 'Required fruit !!')
      // valid
      .click('#orange')
      .waitForElementNotPresent('.errors .fruits-required', 1000)
      .end()
  }
}
