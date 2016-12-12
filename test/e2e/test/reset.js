module.exports = {
  reset: function (browser) {
    browser
      .url('http://localhost:8080/examples/reset/')
      // initial loaded
      .waitForElementVisible('#app', 1000)
      .waitForElementNotPresent('.errors .required', 1000)
      .waitForElementNotPresent('.errors .minlength', 1000)
      // inputing
      .enterValue('input', 'test')
      .enterBackSpace('input', 4)
      .waitForElementPresent('.errors .required', 1000)
      .waitForElementPresent('.errors .minlength', 1000)
      // reset
      .click('button[type="button"]')
      .waitForElementNotPresent('.errors .required', 1000)
      .waitForElementNotPresent('.errors .minlength', 1000)
      .end()
  }
}
