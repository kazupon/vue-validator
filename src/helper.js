/* @flow */
import warn from './warn'

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
      } while (paths.length > 0 && value !== undefined)
      return value
    }
  })

  return res
}

// TODO: should be defined strict type
function normalizeMap (map: Array<any> | Object): Array<any> {
  return Array.isArray(map)
    ? map.map((key: any) => ({ key, val: key }))
    : Object.keys(map).map((key: any) => ({ key, val: map[key] }))
}
