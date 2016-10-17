/* @flow */

export default function (Vue: GlobalAPI): Object {
  return {
    render (h: Function): VNode {
      this._interceptEvents(this.child, this.multiple)
      return this.child
    }
  }
}
