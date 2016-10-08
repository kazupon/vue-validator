/* @flow */

// validator configrations
let validator = {
  classes: {}
}

export default function (Vue: GlobalAPI): void {
  // define Vue.config.validator configration
  Object.defineProperty(Vue.config, 'validator', {
    enumerable: true,
    configurable: true,
    get: () => { return validator },
    set: val => { validator = val }
  })
}
