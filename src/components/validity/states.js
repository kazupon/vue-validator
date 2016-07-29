/* @flow */
import type { ValidationRawResult } from './type'

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

  const data = function (): Object {
    let validators: Array<string>
    if (typeof this.validators === 'string') {
      validators = [this.validators]
    } else if (Array.isArray(this.validators)) {
      validators = this.validators
    } else {
      validators = Object.keys(this.validators)
    }

    const results: ValidationRawResult = {}
    validators.forEach((validator: string) => {
      results[validator] = undefined
    })

    return {
      results,
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
