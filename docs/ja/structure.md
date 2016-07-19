# バリデーション結果の構造

バリデーション結果はの下記のような構造でアクセスできます:

```
{
  // トップレベルバリデーションプロパティ
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

  // field1 バリデーション
  field1: {
    required: false, // ビルトインバリデータ、 `false` 又は `true` 返します
    email: true, // カスタムバリデータ
    url: 'invalid url format', // カスタムバリデータ、 もしバリデーションルールの中でエラーメッセージを指定したい場合は設定してください
    ...
    customValidator1: false, // カスタムバリデータ
    // フィールドバリデーションプロパティ
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

  // fieldX バリデーション
  fieldX: {
    min: false, // バリデータ
    ...
    customValidator: true,

    // fieldX バリデーションプロパティ
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
- `valid`: フィールドが有効化どうか。もし有効なら、`true` を返し、そうでなければ `false` を返します。
- `invalid`: `valid` の逆です。
- `touched`: フィールドにタッチされたかどうか。もしフィールドにフォーカスが当てられたら、 `true` を返し、そうでなければ `false` を返します。
- `untouched`: `touched`の逆です。
- `modified`: フィールド値が変更されたかどうか。もし**初期値**から変更されたら、`true` を返し、そうでなければ `false` を返します。
- `dirty`: **一度**でもフィールド値が変更されたかどうか。もしそうなら、`true` を返し、そうでなければ `false` を返します。
- `pristine`: `dirty` の逆です。
- `errors`: もし無効なフィールドが存在する場合は、配列でラップされたエラーメッセージを返し、そうでなければ `undefined` を返します。

## トップレベルバリデーションプロパティ
- `valid`: **全て**のフィールドが有効化どうか。もしそうなら、 `true` を返し、そうでなければ `false` を返します。
- `invalid`: もし無効なフィールドが **ひとつ** でもバリデードフィールドに存在していたら、 `true` を返し、そうでなければ `false` を返します。
- `touched`: もしタッチされたフィールドが **ひとつ** でもバリデードフィールドに存在していたら、 `true` を返し、そうでなければ `false` を返します。
- `untouched`: **全て**のフィールドがタッチされていなければ、 `true` を返し、そうでなければ `false` を返します。
- `modified`: もし変更されたフィールドが **ひとつ** でもバリデードフィールドに存在していたら、 `true` を返し、そうでなければ `false` を返します。
- `dirty`: もし一度でも変更されたフィールドが **ひとつ** でもバリデートフィールドに存在していたら、 `true` を返し、そうでなければ `false` を返します。
- `pristine`: **全て**のフィールドで一度も変更されていなければ、 `true` を返し、そうでなければ `false` を返します。
- `errors`: もし無効なフィールドがひとつでも存在する場合は、配列でラップされたエラーメッセージを返し、そうでなければ `undefined` を返します。
