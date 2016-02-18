export default function (Vue) {

  /**
   * ValidatorError component
   */

  let error = {
    name: 'validator-error',

    props: {
      field: {
        type: String,
        required: true
      },
      validator: {
        type: String
      },
      message: {
        type: String,
        required: true
      },
      partial: {
        type: String,
        default: 'validator-error-default'
      }
    },

    template: '<div><partial :name="partial"></partial></div>',

    partials: {}
  }

  // only use ValidatorError component
  error.partials['validator-error-default'] = '<p>{{field}}: {{message}}</p>'

  return error
}
