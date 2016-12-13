/* @flow */
import baseProps from './props'

export default function (Vue: GlobalAPI): Object {
  const { extend, isPlainObject } = Vue.util

  function initialStates (states: any, validators: Array<string> | Object, init = undefined): void {
    if (Array.isArray(validators)) {
      validators.forEach((validator: string) => {
        states[validator] = init
      })
    } else {
      Object.keys(validators).forEach((validator: string) => {
        const props: ?Object = (validators[validator] &&
          validators[validator]['props'] &&
          isPlainObject(validators[validator]['props']))
            ? validators[validator]['props']
            : null
        if (props) {
          Object.keys(props).forEach((prop: string) => {
            states[validator] = {}
            states[validator][prop] = init
          })
        } else {
          states[validator] = init
        }
      })
    }
  }

  function getInitialResults (validators: Array<string> | Object): $ValidationRawResult {
    const results: $ValidationRawResult = {}
    initialStates(results, validators, undefined)
    return results
  }

  function getInitialProgresses (validators: Array<string> | Object): ValidatorProgresses {
    const progresses: ValidatorProgresses = {}
    initialStates(progresses, validators, '')
    return progresses
  }

  const props: Object = extend({
    child: {
      type: Object,
      required: true
    },
    value: {
      type: Object
    }
  }, baseProps)

  function data (): Object {
    const validators = nomalizeValidators(this.validators)
    return {
      results: getInitialResults(validators),
      valid: true,
      dirty: false,
      touched: false,
      modified: false,
      progresses: getInitialProgresses(validators)
    }
  }

  return {
    props,
    data
  }
}

function nomalizeValidators (target: string | Object | Array<string>): Array<string> | Object {
  return typeof target === 'string' ? [target] : target
}
