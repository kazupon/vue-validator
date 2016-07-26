/* @flow */

declare type ValidationRawResult = {
  name: string, // validator name
  value: boolean|string // validation result 
}

export default function (Vue: GlobalAPI): Object {
  function getValidatorResult (
    validator: string,
    results: Array<ValidationRawResult>
  ): boolean|string {
    if (results.length === 0) { return false }

    let ret: boolean|string = false
    for (let i = 0; i < results.length; i++) {
      const result: ValidationRawResult = results[i]
      if (result.name !== validator) {
        continue
      } else {
        if (typeof result.value === 'boolean' && !result.value) {
          ret = true
          break
        }
        if (typeof result.value === 'string' && result.value) {
          ret = result.value
          break
        }
      }
    }

    return ret
  }

  function valid (): boolean {
    if (this.results.length === 0) { return true }

    let ret: boolean = true
    for (let i = 0; i < this.results.length; i++) {
      const result: ValidationRawResult = this.results[i]
      if (typeof result.value === 'boolean' && !result.value) {
        ret = false
        break
      }
      if (typeof result.value === 'string' && result.value) {
        ret = false
        break
      }
    }

    return ret
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

    this._validators.forEach((validator: string) => {
      const result: boolean|string = getValidatorResult(validator, this.results)
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
