module.exports = {
  component: function (browser) {
    browser
      .url('http://localhost:8080/examples/component/')
      // initial loaded
      .waitForElementVisible('#app', 1000)
      .waitForElementPresent('.errors', 1000)
      .assert.containsText('.errors', 'not selected item!!')
      // valid
      .click('.select2-selection__rendered')
      .click('.select2-results__option:nth-child(2)')
      .waitForElementNotPresent('.errors', 1000)
      // invalid
      .click('.select2-selection__rendered')
      .click('.select2-results__option:nth-child(1)')
      .waitForElementPresent('.errors', 1000)
      .assert.containsText('.errors', 'not selected item!!')
      .end()
  }
}
