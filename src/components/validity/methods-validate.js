/* @flow */

/**
 * Forgiving check for a promise
 */
function isPromise (p: Object): boolean {
  return p && typeof p.then === 'function'
}

export default function (Vue: GlobalAPI): Object {
  function _resolveValidator (name: string): ValidatorAsset | void {
    const { resolveAsset } = this.constructor.util
    return resolveAsset(this.$options, 'validators', name)
  }

  function _getValidateDescriptor (
    validator: string,
    field: string,
    value: any
  ): $ValidateDescriptor | null {
    const { isPlainObject } = this.constructor.util

    const asset: ValidatorAsset = this._resolveValidator(validator)
    if (!asset) {
      // TODO: should be warned
      return null
    }

    let fn = null
    let rule = null
    let msg = null
    if (isPlainObject(asset)) {
      if (asset.check && typeof asset.check === 'function') {
        fn = asset.check
      }
      if (asset.message) {
        msg = asset.message
      }
    } else if (typeof asset === 'function') {
      fn = asset
    } else {
      // TODO: should be warned
      return null
    }

    if (!fn) {
      // TODO: should be warned
      return null
    }

    if (isPlainObject(this.validators)) {
      if (isPlainObject(this.validators[validator])) {
        if (this.validators[validator].rule) {
          rule = this.validators[validator].rule
        }
        if (this.validators[validator].message) {
          msg = this.validators[validator].message
        }
      } else {
        rule = this.validators[validator]
      }
    }

    const descriptor: $ValidateDescriptor = { fn, value, field }
    if (rule) {
      descriptor.rule = rule
    }
    if (msg) {
      descriptor.msg = msg
    }

    return descriptor
  }

  function _resolveMessage (
    field: string,
    msg: string | Function,
    override?: string
  ): string | void {
    if (override) { return override }
    return msg
      ? typeof msg === 'function'
        ? msg(field)
        : msg
      : undefined
  }

  function _invokeValidator (
    { fn, value, field, rule, msg }: $ValidateDescriptor,
    cb: Function
  ): void {
    const future: any = fn.call(this, value, rule)
    if (typeof future === 'function') { // function
      future(() => { // resolve
        cb(true)
      }, (err: string) => { // reject
        cb(false, this._resolveMessage(field, msg, err))
      })
    } else if (isPromise(future)) { // promise
      future.then(() => { // resolve
        cb(true)
      }, (err: string) => { // reject
        cb(false, this._resolveMessage(field, msg, err))
      }).catch((err: Error) => {
        cb(false, this._resolveMessage(field, msg, err.message))
      })
    } else { // sync
      cb(future, future === false ? this._resolveMessage(field, msg) : undefined)
    }
  }

  function validate (validator: string, value: any, cb: Function): void {
    const descriptor = this._getValidateDescriptor(validator, this.field, value)
    if (descriptor) {
      this._invokeValidator(descriptor, (ret: boolean, msg: ?string) => {
        cb(null, ret, msg)
      })
    } else {
      // TODO:
      cb(new Error())
    }
  }

  return {
    _resolveValidator,
    _getValidateDescriptor,
    _resolveMessage,
    _invokeValidator,
    validate
  }
}
