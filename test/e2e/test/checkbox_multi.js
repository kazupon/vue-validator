module.exports = {
  checkbox_multi: function (browser) {
    browser
      .url('http://localhost:8080/examples/checkbox/multi/')
      // initial loaded
      .waitForElementVisible('#app', 1000)
      .waitForElementNotPresent('.errors .fruits-required', 1000)
      .waitForElementNotPresent('.errors .fruits-minlength', 1000)
      .waitForElementNotPresent('.errors .fruits-maxlength', 1000)
      // maxlength invalid
      .click('#apple') // check
      .click('#orange') // check
      .click('#grape') // check
      .waitForElementNotPresent('.errors .fruits-required', 1000)
      .waitForElementNotPresent('.errors .fruits-minlength', 1000)
      .waitForElementPresent('.errors .fruits-maxlength', 1000)
      .assert.containsText('.errors .fruits-maxlength', 'Please chose at most 2 fruits !!')
      // required / minlength invalid
      .click('#apple') // uncheck
      .click('#orange') // uncheck
      .click('#grape') // uncheck
      .waitForElementPresent('.errors .fruits-required', 1000)
      .waitForElementPresent('.errors .fruits-minlength', 1000)
      .waitForElementNotPresent('.errors .fruits-maxlength', 1000)
      .assert.containsText('.errors .fruits-required', 'Required fruit !!')
      .assert.containsText('.errors .fruits-minlength', 'Please chose at least 1 fruit !!')
      // valid
      .click('#orange') // check
      .click('#banana') // check
      .waitForElementNotPresent('.errors .fruits-required', 1000)
      .waitForElementNotPresent('.errors .fruits-minlength', 1000)
      .waitForElementNotPresent('.errors .fruits-maxlength', 1000)
      .end()
  }
}
