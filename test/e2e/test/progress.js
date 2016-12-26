module.exports = {
  progress: function (browser) {
    browser
      .url('http://localhost:8080/examples/progress/')
      // initial loaded
      .waitForElementVisible('#app', 1000)
      .waitForElementNotPresent('.exist1', 1000)
      .waitForElementNotPresent('.exist2', 1000)
      .waitForElementPresent('button[type="button"]', 1000)
      // start validation
      .enterValue('input', 'test')
      .waitForElementPresent('.exist1', 1000)
      .waitForElementPresent('.exist2', 1000)
      .waitForElementNotPresent('button[type="button"]', 1000)
      // exist1 validator done
      .waitFor(2000)
      .waitForElementNotPresent('.exist1', 1000)
      .waitForElementPresent('.exist2', 1000)
      .waitForElementNotPresent('button[type="button"]', 1000)
      // exist2 validator done
      .waitFor(4000)
      .waitForElementNotPresent('.exist1', 1000)
      .waitForElementNotPresent('.exist2', 1000)
      .waitForElementPresent('button[type="button"]', 1000)
      .end()
  }
}
