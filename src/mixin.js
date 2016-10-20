/* @flow */

import ValidationClass from './validation'

export default function (Vue: GlobalAPI): Object {
  const Validation: Validation = ValidationClass(Vue)

  return {
    beforeCreate (): void {
      this._validation = new Validation({ host: this })
    }
  }
}
