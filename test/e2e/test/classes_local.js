module.exports = {
  classes_local: function (browser) {
    browser
      .url('http://localhost:8080/examples/classes/local/')
      // initial loaded
      .waitForElementVisible('#app', 1000)
      .assert.cssClassPresent('#username', 'untouched')
      .assert.cssClassNotPresent('#username', 'touched-local')
      .assert.cssClassPresent('#username', 'pristine')
      .assert.cssClassNotPresent('#username', 'dirty-local')
      .assert.cssClassNotPresent('#username', 'valid')
      .assert.cssClassNotPresent('#username', 'invalid')
      .assert.cssClassNotPresent('#username', 'modified')
      // focusin
      .click('#username')
      .assert.cssClassPresent('#username', 'untouched')
      .assert.cssClassNotPresent('#username', 'touched-local')
      .assert.cssClassPresent('#username', 'pristine')
      .assert.cssClassNotPresent('#username', 'dirty-local')
      .assert.cssClassNotPresent('#username', 'valid')
      .assert.cssClassPresent('#username', 'invalid')
      .assert.cssClassNotPresent('#username', 'modified')
      // input
      .enterValue('#username', 'foofoo')
      .enterBackSpace('#username', 3)
      .assert.cssClassPresent('#username', 'untouched')
      .assert.cssClassNotPresent('#username', 'touched-local')
      .assert.cssClassNotPresent('#username', 'pristine')
      .assert.cssClassPresent('#username', 'dirty-local')
      .assert.cssClassPresent('#username', 'valid')
      .assert.cssClassNotPresent('#username', 'invalid')
      .assert.cssClassPresent('#username', 'modified')
      // focusout
      .click('p')
      .click('#username')
      .assert.cssClassNotPresent('#username', 'untouched')
      .assert.cssClassPresent('#username', 'touched-local')
      .assert.cssClassNotPresent('#username', 'pristine')
      .assert.cssClassPresent('#username', 'dirty-local')
      .assert.cssClassPresent('#username', 'valid')
      .assert.cssClassNotPresent('#username', 'invalid')
      .assert.cssClassPresent('#username', 'modified')
      .end()
  }
}
