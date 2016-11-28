/* @flow */

export default function (Vue: GlobalAPI): Object {
  const { isPlainObject } = Vue.util

  function invalid (): boolean {
    return !this.valid
  }

  function pristine (): boolean {
    return !this.dirty
  }

  function untouched (): boolean {
    return !this.touched
  }

  function _setError (
    result: ValidationResult,
    field: string,
    validator: string,
    message: ?string,
    prop: ?string
  ): void {
    const error: ValidationError = { field, validator }
    if (message) {
      error.message = message
    }
    if (prop) {
      error.prop = prop
    }
    result.errors = result.errors || []
    result.errors.push(error)
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

    const keys = this._keysCached(this._uid.toString(), this.results)
    keys.forEach((validator: string) => {
      const result = this.results[validator]
      if (typeof result === 'boolean') {
        if (result) {
          ret[validator] = false
        } else {
          _setError(ret, this.field, validator)
          ret[validator] = !result
        }
      } else if (typeof result === 'string') {
        _setError(ret, this.field, validator, result)
        ret[validator] = result
      } else if (isPlainObject(result)) { // object
        const props: Array<string> = Object.keys(result)
        props.forEach((prop: string) => {
          const propRet: boolean | string | void = result[prop]
          ret[prop] = ret[prop] || {}
          if (typeof propRet === 'boolean') {
            if (propRet) {
              ret[prop][validator] = false
            } else {
              _setError(ret, this.field, validator, undefined, prop)
              ret[prop][validator] = !propRet
            }
          } else if (typeof propRet === 'string') {
            _setError(ret, this.field, validator, propRet, prop)
            ret[prop][validator] = propRet
          } else {
            ret[prop][validator] = false
          }
        })
      } else {
        ret[validator] = false
      }
    })

    return ret
  }

  return {
    invalid,
    pristine,
    untouched,
    result
  }
}
