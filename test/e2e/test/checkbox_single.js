module.exports = {
  checkbox_single: function (browser) {
    browser
      .url('http://localhost:8080/examples/checkbox/single/')
      // initial loaded
      .waitForElementVisible('#app', 1000)
      .waitForElementNotPresent('.errors', 1000)
      // valid
      .click('#term')
      .waitForElementNotPresent('.errors', 1000)
      // invalid
      .click('#term')
      .waitForElementPresent('.errors', 1000)
      .assert.containsText('.errors', 'Required Terms of Service Agreement checking!!')
      .end()
  }
}
