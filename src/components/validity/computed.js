/* @flow */
import type { ValidationRawResult } from './type'

export default function (Vue: GlobalAPI): Object {
  const keysCached = memoize(results => {
    return Object.keys(results)
  })

  function valid (): boolean {
    const keys = keysCached(this._uid.toString(), this.results)
    for (let i = 0; i < keys.length; i++) {
      const result: ValidationRawResult = this.results[keys[i]]
      if (typeof result === 'boolean' && !result) {
        return false
      }
      if (typeof result === 'string' && result) {
        return false
      }
    }
    return true
  }

  function invalid (): boolean {
    return !this.valid
  }

  function pristine (): boolean {
    return !this.dirty
  }

  function untouched (): boolean {
    return !this.touched
  }

  function result (): ValidationResult {
    const ret: ValidationResult = {
      valid: this.valid,
      invalid: this.invalid,
      dirty: this.dirty,
      pristine: this.pristine,
      touched: this.touched,
      untouched: this.untouched,
      modified: this.modified
    }

    const keys = keysCached(this._uid.toString(), this.results)
    keys.forEach((validator: string) => {
      const result: boolean | string = getValidatorResult(validator, this.results[validator])
      if (result === false) { // success
        ret[validator] = false
      } else { // failed
        const error: ValidationError = { field: this.field, validator }
        if (typeof result === 'string') {
          error.message = result
        }
        if (!ret.errors) {
          ret.errors = []
        }
        if (Array.isArray(ret.errors)) {
          ret.errors.push(error)
        }
        ret[validator] = result
      }
    })

    return ret
  }

  return {
    valid,
    invalid,
    pristine,
    untouched,
    result
  }
}

function memoize (fn: Function): Function {
  const cache = Object.create(null)
  return function memoizeFn (id: string, ...args): any {
    const hit = cache[id]
    return hit || (cache[id] = fn(...args))
  }
}

function getValidatorResult (
  validator: string,
  result: ValidationRawResult
): boolean | string {
  if (typeof result === 'boolean' && !result) {
    return true
  }

  if (typeof result === 'string' && result) {
    return result
  }

  return false
}
