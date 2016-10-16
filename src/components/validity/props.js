export default {
  field: {
    type: String,
    required: true
  },
  validators: {
    type: [String, Array, Object],
    required: true
  },
  group: {
    type: String
  },
  multiple: {
    type: Boolean
  },
  classes: {
    type: Object,
    default: () => {
      return {
        valid: 'valid',
        invalid: 'invalid',
        touched: 'touched',
        untouched: 'untouched',
        pristine: 'pristine',
        dirty: 'dirty',
        modified: 'modified'
      }
    }
  }
}
