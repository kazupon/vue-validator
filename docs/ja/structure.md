# バリデーション結果構造

バリデーション結果はこの構造でアクセスできます:

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

様々なトップレベルプロパティはバリデーションスコープの中に、そして各フィールドのバリデーション結果は自身それぞれのスコープの中にあります。

## フィールドバリデーションプロパティ
- `valid`: フィールドが有効化どうか ; もし有効なら、`true` を返し、そうでなければ `false` を返します。
- `invalid`: `valid` の逆です。
- `touched`: フィールドにタッチされたかどうか。もしフィールドにフォーカスが当てられたら、 `true` を返し、そうでなければ `false` を返します。
- `untouched`: `touched`の逆です。
- `modified`: フィールド値が変更されたかどうか; もし**初期値**から変更されたら、`true` を返し、そうでなければ `false` を返します。
- `dirty`: **一度**でもフィールド値が変更されたかどうか; もしそうなら、`true` を返し、そうでなければ `false` を返します。
- `pristine`: `dirty` の逆です。
- `errors`: もし無効なフィールドが存在する場合は、配列でラップされたエラメッセージを返し、そうでなければ `undefined` を返します。

## トップレベルバリデーションプロパティ
- `valid`: **全て**のフィールドが有効化どうか ; もしそうなら、 `true` を返し、そうでなければ `false` を返します。
- `invalid`: もし無効なフィールドが **ひとつ** でもバリデードフィールドに存在していたら、 `true` を返し、そうでなければ `false` を返します。
- `touched`: もしタッチされたフィールドが **ひとつ** でもバリデードフィールドに存在していたら、 `true` を返し、そうでなければ `false` を返します。
- `untouched`: **全て**のフィールドがタッチされていなければ、 `true` を返し、そうでなければ `false` を返します。
- `modified`: もし変更されたフィールドが **ひとつ** でもバリデードフィールドに存在していたら、 `true` を返し、そうでなければ `false` を返します。
- `dirty`: もし一度でも変更されたフィールドが **ひとつ** でもバリデートフィールドに存在していたら、 `true` を返し、そうでなければ `false` を返します。
- `pristine`: **全て**のフィールドで一度も変更されていなければ、 `true` を返し、そうでなければ `false` を返します。
- `errors`: もし無効なフィールドがひとつでも存在する場合は、配列でラップされたエラメッセージを返し、そうでなければ `undefined` を返します。
