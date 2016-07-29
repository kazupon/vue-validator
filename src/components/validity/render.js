/* @flow */

export default function (Vue: GlobalAPI): Object {
  return {
    render (h: Function): VNode {
      return this.child
    }
  }
}
