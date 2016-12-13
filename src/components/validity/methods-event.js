/* @flow */

export default function (Vue: GlobalAPI): Object {
  function _fireEvent (type: string, ...args: Array<any>): void {
    this.$emit(type, ...args)
  }

  return {
    _fireEvent
  }
}
