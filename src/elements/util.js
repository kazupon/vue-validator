/* @flow */
/*
 * TODO: should be refactor
 */

function isObject (obj: Object): boolean {
  return obj !== null && typeof obj === 'object'
}

export function looseEqual (a: any, b: any): boolean {
  return a === b || (
    isObject(a) && isObject(b)
      ? JSON.stringify(a) === JSON.stringify(b)
      : false
  )
}
