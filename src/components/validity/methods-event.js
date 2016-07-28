/* @flow */

export default function (Vue: GlobalAPI): Object {
  function fireEvent (type: string, ...args: Array<any>): void {
    this.$nextTick(() => {
      this.$emit(type, ...args)
    })
  }

  return {
    fireEvent
  }
}
