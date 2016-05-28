# カスタムバリデーター

## グローバル登録
`Vue.validator` メソッドを使うことでカスタムバリデータを登録することができます。

> **注意:** `Vue.validator` アセットは Vue.js のアセット管理システムからの拡張です。

`Vue.validator` メソッドを詳しく述べます。

下記は `email` カスタムバリデーターの例です:

```javascript
// メールアドレスのバリデーター関数を登録する
Vue.validator('email', function (val) {
  return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val)
})

new Vue({
  el: '#app'
  data: {
    email: ''
  }
})
```
```html
<div id="app">
  <validator name="validation1">
    address: <input type="text" v-validate:address="['email']"><br />
    <div>
      <p v-show="$validation1.address.email">メールアドレスの書式が無効です</p>
    </div>
  </validator>
</div>
```

## ローカル登録
`validators` オプションを使うことでカスタムバリデーターをコンポーネントに登録することができます。

カスタムバリデーターは判別して true を返すコールバック関数を使うことで、 Vue コンストラクターの `validators` オプションに登録されます。

下記は `numeric` 又は `url` カスタムバリデーターの例です:

```javascript
new Vue({
  el: '#app',
  validators: { // `numeric` と `url` のカスタムバリデーターはローカル登録です。
    numeric: function (val/*,rule*/) {
      return /^[-+]?[0-9]+$/.test(val)
    },
    url: function (val) {
      return /^(http\:\/\/|https\:\/\/)(.{4,})$/.test(val)
    }
  },
  data: {
    email: ''
  }
})
```

```html
<div id="app">
  <validator name="validation1">
    username: <input type="text" v-validate:username="['required']"><br />
    email: <input type="text" v-validate:address="['email']"><br />
    age: <input type="text" v-validate:age="['numeric']"><br />
    site: <input type="text" v-validate:site="['url']"><br />
    <div class="errors">
      <p v-if="$validation1.username.required">ユーザー名は必須です</p>
      <p v-if="$validation1.address.email">メールアドレスが無効です</p>
      <p v-if="$validation1.age.numeric">年齢が無効です</p>
      <p v-if="$validation1.site.url">サイトURLが無効です</p>
    </div>
  </validator>
</div>
```

## エラーメッセージ

カスタムバリデーターはデフォルトのエラーメッセージを持っているかもしれません:

```javascript
// グローバル登録の `email` カスタムバリデーター
Vue.validator('email', {
  message: 'invalid email address', // 文字列によるエラーメッセージ
  check: function (val) { // define validator
    return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val)
  }
})

// ビルトイン `required` カスタムバリデーター
Vue.validator('required', {
  message: function (field) { // 関数によるエラーメッセージ
    return 'required "' + field + '" field'
  },
  check: Vue.validator('required') // バリデーターロジックの再利用
})

new Vue({
  el: '#app',
  validators: {
    numeric: { // ローカル登録 `numeric` カスタムバリデーター
      message: '無効な数値です',
      check: function (val) {
        return /^[-+]?[0-9]+$/.test(val)
      }
    },
    url: { // ローカル登録 `url` カスタムバリデーター
      message: function (field) {
        return 'invalid "' + field + '" url format field'
      },
      check: function (val) {
        return /^(http\:\/\/|https\:\/\/)(.{4,})$/.test(val)
      }
    }
  },
  data: {
    email: ''
  }
})
```

```html
<div id="app">
  <validator name="validation1">
    username: <input type="text" v-validate:username="['required']"><br />
    email: <input type="text" v-validate:address="['email']"><br />
    age: <input type="text" v-validate:age="['numeric']"><br />
    site: <input type="text" v-validate:site="['url']"><br />
    <div class="errors">
      <validator-errors :validation="$validation1"></validator-errors>
    </div>
  </validator>
</div>
```
