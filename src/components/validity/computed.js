/* @flow */

function getValidatorResult (validator: string, results: Array): boolean|string {
  if (results.length === 0) { return false }

  let ret: boolean = false
  for (let i = 0; i < results.length; i++) {
    const result: Object = results[i]
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
    const result: Object = this.results[i]
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

function result (): Object {
  const ret: Object = {
    valid: this.valid,
    invalid: this.invalid,
    dirty: this.dirty,
    pristine: this.pristine,
    touched: this.touched,
    untouched: this.untouched,
    modified: this.modified
  }

  this._validators.forEach(validator => {
    const result: boolean|string = getValidatorResult(validator, this.results)
    if (result === false) { // success
      ret[validator] = false
    } else { // failed
      const error: Object = { field: this.field, validator }
      if (typeof result === 'string') {
        error.message = result
      }
      if (!ret.errors) {
        ret.errors = []
      }
      ret.errors.push(error)
      ret[validator] = result
    }
  })

  return ret
}

export default {
  valid,
  invalid,
  pristine,
  untouched,
  result
}
