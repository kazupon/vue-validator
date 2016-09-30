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

// TODO: should be defined strict type
export function mapValidation (results: Array<any> | Object): Object {
  const res: Object = {}

  normalizeMap(results).forEach(({ key, val }) => {
    res[key] = function mappedValidation () {
      const validation = this.$validation
      if (!this._isMounted) {
        return null
      }
      const paths = val.split('.')
      const first = paths.shift()
      if (first !== '$validation') {
        warn(`unknown validation result path: ${val}`)
        return null
      }
      let path
      let value = validation
      do {
        path = paths.shift()
        value = value[path]
      } while (paths.length > 0)
      return value
    }
  })

  return res
}

function isObject (obj: Object): boolean {
  return obj !== null && typeof obj === 'object'
}

// TODO: should be defined strict type
function normalizeMap (map: Array<any> | Object): Array<any> {
  return Array.isArray(map)
    ? map.map((key: any) => ({ key, val: key }))
    : Object.keys(map).map((key: any) => ({ key, val: map[key] }))
}
