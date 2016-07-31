/* @flow */

export default function (Vue: GlobalAPI): Object {
  return {
    created () {
      this._keysCached = memoize(results => {
        return Object.keys(results)
      })

      // for event control flags
      this._modified = false

      // watch validation raw results
      this._unwatch = this.$watch('results', this.watchValidationRawResults, { deep: true })
    },
    destroyed () {
      this._unwatch()
    }
  }
}

function memoize (fn: Function): Function {
  const cache = Object.create(null)
  return function memoizeFn (id: string, ...args): any {
    const hit = cache[id]
    return hit || (cache[id] = fn(...args))
  }
}
