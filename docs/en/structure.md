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
- `valid`: whether field is valid; if it's valid, then return `true`, else return `false`.
- `invalid`: reverse of `valid`.
- `touched`: whether field is touched. if field was focused, return `true`, else return `false`.
- `untouched`: reverse of `touched`.
- `modified`: whether field value is modified; if field value was changed from **initial** value, return `true`, else return `false`.
- `dirty`: whether field value was changed at least **once**; if so, return `true`, else return `false`.
- `pristine`: reverse of `dirty`.
- `errors`: if invalid field exist, return error message wrapped with array, else `undefined`.

## Top level validation properties
- `valid`: whether **all** fields is valid. if so, then return `true`, else return `false`.
- `invalid`: if invalid field exist even **one** in validate fields, return `true`, else `false`.
- `touched`: if touched field exist **one** in validate fields, return `true`, else `false`.
- `untouched`: whether **all** fields is untouched, if so, return `true`, else `false`.
- `modified`: if modified field exist even **one** in validate fields, return `true`, else `false`.
- `dirty`: if dirty field exist even **one** in validate fields, return `true`, else `false`.
- `pristine`: whether **all** fields is pristine, if so, return `true`, else `false`.
- `errors`: if invalid even one exist, return all field error message wrapped with array, else `undefined`.
