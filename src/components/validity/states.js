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

function nomalizeValidators (target: string | Object | Array<string>): Array<string> {
  let validators: Array<string>
  if (typeof target === 'string') {
    validators = [target]
  } else if (Array.isArray(target)) {
    validators = target
  } else {
    validators = Object.keys(target)
  }
  return validators
}

function getInitialResults (validators: Array<string>): $ValidationRawResult {
  const results: $ValidationRawResult = {}
  validators.forEach((validator: string) => {
    results[validator] = undefined
  })
  return results
}

function getInitialProgresses (validators: Array<string>): ValidatorProgresses {
  const progresses: ValidatorProgresses = {}
  validators.forEach((validator: string) => {
    progresses[validator] = ''
  })
  return progresses
}
