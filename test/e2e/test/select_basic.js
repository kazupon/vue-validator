module.exports = {
  select_basic: function (browser) {
    browser
      .url('http://localhost:8080/examples/select/basic/')
      // initial loaded
      .waitForElementVisible('#app', 1000)
      .waitForElementNotPresent('.errors p', 1000)
      // valid
      .click('select option[value=javascript]')
      .waitForElementNotPresent('.errors p', 1000)
      // invalid
      .click('select option[value=""]')
      .waitForElementPresent('.errors p', 1000)
      .assert.containsText('.errors p', 'Required !!')
      .end()
  }
}
