exports.command = function (selector, event, cb) {
  return this.execute(function (selector, event, cb) {
    var e = document.createEvent('HTMLEvents')
    e.initEvent(event, true, true)
    var el = document.querySelector(selector)
    el.dispatchEvent(e)
  }, [selector, event, cb])
}
