import ValidatorError from './error'


export default function (Vue) {

  const _ = Vue.util
  const error = ValidatorError(Vue) // import ValidatorError component

  /**
   * ValidatorErrors component
   */

  let errors = {
    name: 'validator-errors',

    props: {
      validation: {
        type: Object,
        required: true
      },
      group: {
        type: String,
        default: null
      },
      field: {
        type: String,
        default: null
      },
      component: {
        type: String,
        default: 'validator-error'
      }
    },

    computed: {
      errors () {
        if (this.group !== null) {
          return this.validation[this.group].errors
        } else if (this.field !== null) {
          var target = this.validation[this.field]
          return target.errors.map((error) => {
            let err = { field: this.field }
            if (_.isPlainObject(error)) {
              if (error.validator) {
                err.validator = error.validator
              }
              err.message = error.message
            } else if (typeof error === 'string') {
              err.message = error
            }
            return err
          })
        } else {
          return this.validation.errors
        }
      }
    },

    template: '<template v-for="error in errors">' + 
      '<component :is="component" :partial="partial" :field="error.field" :validator="error.validator" :message="error.message"></component>' +
      '</template>',

    components: {}
  }

  // define 'partial' prop
  errors.props['partial'] = error.props['partial']

  // only use ValidatorErrors component
  errors.components[error.name] = error

  // install ValidatorErrors component
  Vue.component(errors.name, errors)

  return errors
}
