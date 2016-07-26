/* @flow */

export default function (Vue: GlobalAPI): Object {
  return {
    created () {
      if (typeof this.validators === 'string') {
        this._validators = [this.validators]
      } else if (Array.isArray(this.validators)) {
        this._validators = this.validators
      } else {
        this._validators = Object.keys(this.validators)
      }

      this._modified = false
    }
  }
}
