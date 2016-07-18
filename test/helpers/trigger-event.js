window.triggerEvent = function triggerEvent (target, event, process) {
  const e = document.createEvent('HTMLEvents')
  e.initEvent(event, true, true)
  process && process(e)
  target.dispatchEvent(e)
}
