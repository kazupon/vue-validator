/* @flow */

export default function (Vue: GlobalAPI): Object {
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

    const keys = this._keysCached(this._uid.toString(), this.results)
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
    invalid,
    pristine,
    untouched,
    result
  }
}

function getValidatorResult (
  validator: string,
  result: $ValidationRawResult
): boolean | string {
  if (typeof result === 'boolean' && !result) {
    return true
  }

  if (typeof result === 'string' && result) {
    return result
  }

  return false
}
