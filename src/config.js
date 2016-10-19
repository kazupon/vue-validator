/* @flow */

// validator configrations
let validator: ValidatorConfig = {
  classes: {}
}

export default function (Vue: GlobalAPI): void {
  // define Vue.config.validator configration
  // $FlowFixMe: https://github.com/facebook/flow/issues/285
  Object.defineProperty(Vue.config, 'validator', {
    enumerable: true,
    configurable: true,
    get: (): ValidatorConfig => { return validator },
    set: (val: ValidatorConfig) => { validator = val }
  })
}
