module.exports = {
  event: function (browser) {
    browser
      .url('http://localhost:8080/examples/event/')
      // initial loaded
      .waitForElementVisible('#app', 1000)
      // invalid inputing
      .enterValue('input', 't')
      .assert.attributeContains('.events p:nth-child(3)', 'data-event', 'invalid')
      .assert.attributeContains('.events p:nth-child(2)', 'data-event', 'dirty')
      .assert.attributeContains('.events p:nth-child(1)', 'data-event', 'modified')
      // valid inputing
      .enterValue('input', 'testtest')
      .assert.attributeContains('.events p:nth-child(1)', 'data-event', 'valid')
      // re-invalid inputing
      .enterBackSpace('input', 8)
      .assert.attributeContains('.events p:nth-child(1)', 'data-event', 'modified')
      .assert.attributeContains('.events p:nth-child(2)', 'data-event', 'invalid')
      // focueout
      .click('.errors')
      .assert.attributeContains('.events p:nth-child(1)', 'data-event', 'touched')
      .end()
  }
}
