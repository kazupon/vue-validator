/* @flow */

export function warn (msg: string, err?: Error) {
  if (window.console) {
    console.warn('[vue-validator] ' + msg)
    if (err) {
      console.warn(err.stack)
    }
  }
}

export function looseEqual (a: any, b: any): boolean {
  return a === b || (
    isObject(a) && isObject(b)
      ? JSON.stringify(a) === JSON.stringify(b)
      : false
  )
}

function isObject (obj: Object): boolean {
  return obj !== null && typeof obj === 'object'
}

