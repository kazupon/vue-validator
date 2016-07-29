/* @flow */

export default function (Vue: GlobalAPI): Object {
  return {
    created () {
      this._modified = false
    }
  }
}
