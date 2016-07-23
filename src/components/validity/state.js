/* @flow */

export const props: Object = {
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

export const data = function (): Object {
  return {
    results: [],
    dirty: false,
    touched: false,
    modified: false
  }
}
