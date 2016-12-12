exports.command = function (selector, count) {
  count = count || 1
  for (var i = 0; i < count; i++) {
    this.sendKeys(selector, this.Keys.BACK_SPACE)
  }
  return this
}
