/* @flow */

/**
 * Forgiving check for a promise
 */
function isPromise (p: Object): boolean {
  return p && typeof p.then === 'function'
}

export default function (Vue: GlobalAPI): Object {
  const { isPlainObject, resolveAsset } = Vue.util

  function _resolveValidator (name: string): ?ValidatorAsset {
    const options = (this.child && this.child.context)
      ? this.child.context.$options
      : this.$options
    return resolveAsset(options, 'validators', name)
  }

  function _getValidateDescriptor (
    validator: string,
    field: string,
    value: any
  ): $ValidateDescriptor | null {
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

    let props = null
    const validators = this.validators
    if (isPlainObject(validators)) {
      if (isPlainObject(validators[validator])) {
        if (validators[validator].props && isPlainObject(validators[validator].props)) {
          props = validators[validator].props
        } else {
          if (validators[validator].rule) {
            rule = validators[validator].rule
          }
          if (validators[validator].message) {
            msg = validators[validator].message
          }
        }
      } else {
        rule = validators[validator]
      }
    }

    const descriptor: $ValidateDescriptor = { fn, value, field }
    if (rule) {
      descriptor.rule = rule
    }
    if (msg) {
      descriptor.msg = msg
    }
    if (props) {
      descriptor.props = props
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
    { fn, field, rule, msg }: ValidateDescriptor | $ValidateDescriptor,
    value: any,
    cb: Function
  ): void {
    const future: any = fn.call(this.child.context, value, rule)
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

  // TODO:should be refactor!!
  function _validate (validator: string, value: any, cb: Function): boolean {
    const descriptor = this._getValidateDescriptor(validator, this.field, value)
    if (descriptor && !descriptor.props) {
      if (this.progresses[validator]) { return false }
      this.progresses[validator] = 'running'
      this.$nextTick(() => {
        this._invokeValidator(descriptor, descriptor.value, (ret: boolean, msg: ?string) => {
          this.progresses[validator] = ''
          this.results[validator] = msg || ret
          if (cb) {
            this.$nextTick(() => {
              cb.call(this, null, ret, msg)
            })
          } else {
            const e: Object = { result: ret }
            if (msg) {
              e['msg'] = msg
            }
            this._fireEvent('validate', validator, e)
          }
        })
      })
    } else if (descriptor && descriptor.props) {
      const propsKeys = Object.keys(descriptor.props)
      propsKeys.forEach((prop: string) => {
        if (this.progresses[validator][prop]) { return }
        this.progresses[validator][prop] = 'running'
        const propDescriptor = {
          fn: descriptor.fn,
          value: descriptor.value,
          filed: descriptor.filed
        }
        if (descriptor.props[prop].rule) {
          propDescriptor.rule = descriptor.props[prop].rule
        }
        if (descriptor.props[prop].message) {
          propDescriptor.msg = descriptor.props[prop].message
        }
        this.$nextTick(() => {
          this._invokeValidator(propDescriptor, propDescriptor.value, (result: boolean, msg: ?string) => {
            this.progresses[validator][prop] = ''
            this.results[validator][prop] = msg || result
            const e: Object = { prop, result }
            if (msg) {
              e['msg'] = msg
            }
            this._fireEvent('validate', validator, e)
          })
        })
      })
    } else {
      // TODO:
      const err = new Error()
      cb ? cb.call(this, err) : this._fireEvent('validate', validator, err)
    }
    return true
  }

  // TODO: should be re-design of API
  function validate (...args: Array<any>): boolean {
    let validators: Array<string>
    let value: any
    let cb: ?Function
    let ret: boolean = true

    if (args.length === 3) {
      validators = [args[0]]
      value = args[1]
      cb = args[2]
    } else if (args.length === 2) {
      if (isPlainObject(args[0])) {
        validators = [args[0].validator]
        value = args[0].value || this.getValue()
        cb = args[1]
      } else {
        validators = this._keysCached(this._uid.toString(), this.results)
        value = args[0]
        cb = args[1]
      }
    } else if (args.length === 1) {
      validators = this._keysCached(this._uid.toString(), this.results)
      value = this.getValue()
      cb = args[0]
    } else {
      validators = this._keysCached(this._uid.toString(), this.results)
      value = this.getValue()
      cb = null
    }

    if (args.length === 3 || (args.length === 2 && isPlainObject(args[0]))) {
      ret = this._validate(validators[0], value, cb)
    } else {
      validators.forEach((validator: string) => {
        ret = this._validate(validator, value, cb)
      })
    }

    return ret
  }

  return {
    _resolveValidator,
    _getValidateDescriptor,
    _resolveMessage,
    _invokeValidator,
    _validate,
    validate
  }
}
