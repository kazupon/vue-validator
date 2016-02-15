import ValidatorError from './error'


export default function (Vue) {

  // import ValidatorError component
  const error = ValidatorError(Vue)
  

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
        let ret = []

        if (this.group !== null) {
          for (let field in this.validation[this.group].errors) {
            for (let validator in this.validation[this.group].errors[field]) {
              let message = this.validation[this.group].errors[field][validator]
              ret.push({ field: field, validator: validator, message: message })
            }
          }
        } else if (this.field !== null) {
          for (let validator in this.validation.errors[this.field]) {
            let message = this.validation.errors[this.field][validator]
            ret.push({ field: this.field, validator: validator, message: message })
          }
        } else {
          for (let field in this.validation.errors) {
            for (let validator in this.validation.errors[field]) {
              let message = this.validation.errors[field][validator]
              ret.push({ field: field, validator: validator, message: message })
            }
          }
        }

        return ret 
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
