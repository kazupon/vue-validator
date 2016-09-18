# Validation result structure

Validation results can be accessed in this structure:

```
{
  // top-level validation properties
  valid: true,
  invalid: false,
  touched: false,
  undefined: true,
  dirty: false,
  pristine: true,
  modified: false,
  errors: [{
    field: 'field1', validator: 'required', message: 'required field1'
  }, ... {
    field: 'fieldX', validator: 'customValidator', message: 'invalid fieldX'
  }],

  // field1 validation
  field1: {
    required: false, // build-in validator, return `false` or `true`
    email: true, // custom validator
    url: 'invalid url format', // custom validator, if specify the error message in validation rule, set it
    ...
    customValidator1: false, // custom validator
    // field validation properties
    valid: false,
    invalid: true,
    touched: false,
    undefined: true,
    dirty: false,
    pristine: true,
    modified: false,
    errors: [{
      validator: 'required', message: 'required field1'
    }]
  },

  ...

  // fieldX validation
  fieldX: {
    min: false, // validator
    ...
    customValidator: true,

    // fieldX validation properties
    valid: false,
    invalid: true,
    touched: true,
    undefined: false,
    dirty: true,
    pristine: false,
    modified: true,
    errors: [{
      validator: 'customValidator', message: 'invalid fieldX'
    }]
  },
}
```

The various top-level properties are in the validation scope, and each field validation result in its own respective scopes.

## Field validation properties
- `valid`: `true` if the field is valid, `false` otherwise.
- `invalid`: Reverse of `valid`.
- `touched`: `true` if the field has been touched, `false` otherwise.
- `untouched`: Reverse of `touched`.
- `modified`: `true` if the field value has been modified from its **initial** value, `false` otherwise.
- `dirty`: `true` if the field value was changed at least **once**, `false` otherwise.
- `pristine`: Reverse of `dirty`.
- `errors`: An array of validation errors for the field, `undefined` if there were none.

## Top level validation properties
- `valid`: `true` if **all** fields are valid, `false` otherwise.
- `invalid`: `true` if **any** fields are invalid, `false` otherwise.
- `touched`: `true` if **any** fields have been touched, `false` otherwise.
- `untouched`: `true` if **all** fields are untouched, `false` otherwise.
- `modified`: `true` if **any** fields have been modified, `false` otherwise.
- `dirty`: `true` if **any** fields are dirty, `false` otherwise.
- `pristine`: `true` if **all** fields are pristine, `false` otherwise.
- `errors`: An array of invalid fields, `undefined` if no fields were invalid.
