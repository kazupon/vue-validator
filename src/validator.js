import util, { pull, warn } from './util'


/**
 * Validator class
 */

export default class Validator {

  constructor (name, dir) {
    this.name = name
    this.dir = dir
    this.validations = []
    this.scope = {}
  }

  addValidation (validation) {
    this.validations.push(validation)
  }

  removeValidation (validation) {
    pull(this.validations, validation)
  }

  validate () {
  }
}
