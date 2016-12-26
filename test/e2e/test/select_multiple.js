module.exports = {
  select_multiple: function (browser) {
    browser
      .url('http://localhost:8080/examples/select/multiple/')
      // initial loaded
      .waitForElementVisible('#app', 1000)
      .waitForElementNotPresent('.errors .required', 1000)
      .waitForElementNotPresent('.errors .maxlength', 1000)
      // valid
      .click('select option[value=javascript]')
      .waitForElementNotPresent('.errors .required', 1000)
      .waitForElementNotPresent('.errors .maxlength', 1000)
      // invalid required
      .click('select option[value=javascript]') // not select
      .waitForElementPresent('.errors .required', 1000)
      .waitForElementNotPresent('.errors .maxlength', 1000)
      .assert.containsText('.errors .required', 'Required !!')
      // invalid maxlength
      .click('select option[value=javascript]')
      .click('select option[value=go]')
      .click('select option[value=lua]')
      .click('select option[value=ruby]')
      .waitForElementNotPresent('.errors .required', 1000)
      .waitForElementPresent('.errors .maxlength', 1000)
      .assert.containsText('.errors .maxlength', 'Sorry, The maximum is 3 languages !!')
      .end()
  }
}
