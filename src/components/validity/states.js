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
    return {
      results: getInitialResults(this.validators),
      valid: true,
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

function getInitialResults (prop: string | Object | Array<string>): $ValidationRawResult {
  let validators: Array<string>
  if (typeof prop === 'string') {
    validators = [prop]
  } else if (Array.isArray(prop)) {
    validators = prop
  } else {
    validators = Object.keys(prop)
  }

  const results: $ValidationRawResult = {}
  validators.forEach((validator: string) => {
    results[validator] = undefined
  })

  return results
}
