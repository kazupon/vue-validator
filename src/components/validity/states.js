/* @flow */

export default function (Vue: GlobalAPI): Object {
  const props: Object = {
    field: {
      type: String,
      required: true
    },
    child: {
      type: Object,
      required: true
    },
    validators: {
      type: [String, Array, Object],
      required: true
    }
  }

  const data = function (): Object {
    return {
      results: [],
      dirty: false,
      touched: false,
      modified: false
    }
  }

  return {
    props,
    data
  }
}
