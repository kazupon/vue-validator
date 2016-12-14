/* @flow */

const inBrowser =
  typeof window !== 'undefined' &&
  Object.prototype.toString.call(window) !== '[object Object]'
const UA = inBrowser && window.navigator.userAgent.toLowerCase()
const isIE9 = UA && UA.indexOf('msie 9.0') > 0

export function getClass (el: any): string {
  let classname: string | Object = el.className
  if (typeof classname === 'object') {
    classname = classname.baseVal || ''
  }
  return classname
}

export function setClass (el: any, cls: string): void {
  if (isIE9 && !/svg$/.test(el.namespaceURI)) {
    el.className = cls
  } else {
    el.setAttribute('class', cls)
  }
}

export function addClass (el: any, cls: string): void {
  if (el.classList) {
    el.classList.add(cls)
  } else {
    const cur = ' ' + getClass(el) + ' '
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      setClass(el, (cur + cls).trim())
    }
  }
}

export function removeClass (el: any, cls: string): void {
  if (el.classList) {
    el.classList.remove(cls)
  } else {
    let cur = ' ' + getClass(el) + ' '
    const tar = ' ' + cls + ' '
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ')
    }
    setClass(el, cur.trim())
  }
  if (!el.className) {
    el.removeAttribute('class')
  }
}

export function toggleClasses (el: any, key: string, fn: Function): void {
  if (!el) { return }

  key = key.trim()
  if (key.indexOf(' ') === -1) {
    fn(el, key)
    return
  }

  const keys = key.split(/\s+/)
  for (let i = 0, l = keys.length; i < l; i++) {
    fn(el, keys[i])
  }
}

export function memoize (fn: Function): Function {
  const cache = Object.create(null)
  return function memoizeFn (id: string, ...args): any {
    const hit = cache[id]
    return hit || (cache[id] = fn(...args))
  }
}
