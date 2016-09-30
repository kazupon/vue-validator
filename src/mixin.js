/* @flow */

import ValidationClass from './validation'

export default function (Vue: GlobalAPI): Object {
  const Validation = ValidationClass(Vue)

  return {
    beforeCreate (): void {
      this._validation = new Validation({ host: this })
    }
  }
}
