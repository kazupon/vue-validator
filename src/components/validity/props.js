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
  }
}
