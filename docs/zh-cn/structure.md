# 验证结果结构

验证结果保存在如下结构中:

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

全局结果可以直接从验证结果中获取到，字段验证结果保存在以字段名命名的键下。

## 字段验证结果
- `valid`: 字段有效时返回 `true`,否则返回 `false`。
- `invalid`: `valid` 的逆.
- `touched`: 字段获得过焦点时返回 `true`,否则返回 `false`。
- `untouched`: `touched` 的逆.
- `modified`: 字段值与**初始**值不同时返回 `true`,否则返回 `false`。
- `dirty`: 字段值改变过至少**一次**时返回 `true`,否则返回 `false`。
- `pristine`: `dirty` 的逆.
- `errors`: 字段无效时返回存有错误信息的数据，否则返回 `undefined`。

## 全局结果
- `valid`: **所有**字段都有效时返回 `true`,否则返回 `false`。
- `invalid`: 只要存在无效字段就返回 `true`,否则返回 `false`。
- `touched`: 只要存在获得过焦点的字段就返回 `true`,否则返回 `false`。
- `untouched`: `touched` 的逆。
- `modified`: 只要存在与**初始**值不同的字段就返回 `true`,否则返回 `false`。
- `dirty`: 只要存在值改变过至少**一次**的字段就返回 `true`,否则返回 `false`。
- `pristine`: **所有**字段都没有发生过变化时返回 `true`,否则返回 `false`。
- `errors`: 有无效字段时返回所有无效字段的错误信息，否则返回 `undefined`。
