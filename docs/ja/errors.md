# エラーメッセージ

エラーメッセージはバリデーションルールの中から直接格納することができます:

```html
<validator name="validation1">
  <div class="username">
    <label for="username">名前:</label>
    <input id="username" type="text" v-validate:username="{
      required: { rule: true, message: '名前は必須です!!' }
    }">
    <span v-if="$validation1.username.required">{{ $validation1.username.required }}</span>
  </div>
  <div class="password">
    <label for="password">パスワード:</label>
    <input id="password" type="password" v-validate:password="{
      required: { rule: true, message: 'パスワードは必須です!!' },
      minlength: { rule: 8, message: 'パスワードが短すぎです!!' }
    }"/>
    <span v-if="$validation1.password.required">{{ $validation1.password.required }}</span>
    <span v-if="$validation1.password.minlength">{{ $validation1.password.minlength }}</span>
  </div>
</validator>
```

メッセージ定義され現在無効状態のルールの全てのエラーメッセージを出力したい場合、エラー配列を `v-for` で繰り返すことで表示させることができます:

```html
<validator name="validation1">
  <div class="username">
    <label for="username">名前:</label>
    <input id="username" type="text" v-validate:username="{
      required: { rule: true, message: '名前は必須です!!' }
    }">
  </div>
  <div class="password">
    <label for="password">パスワード:</label>
    <input id="password" type="password" v-validate:password="{
      required: { rule: true, message: 'パスワードは必須です!!' },
      minlength: { rule: 8, message: 'パスワードが短すぎです!!' }
    }"/>
  </div>
  <div class="errors">
    <ul>
      <li v-for="error in $validation1.errors">
        <p>{{error.field}}: {{error.message}}</p>
      </li>
    </ul>
  </div>
</validator>
```

インラインでルールを指定するよりも、データプロパティ又は算出プロパティを使用することで煩雑な状態を減らすことができます。

## エラーメッセージ列挙コンポーネント

上の例で私達は `v-for` ディレクティブを使いバリデータの `errors` を列挙しました。しかし、私達はそれに邪魔されることは出来ません。 なので、 vue-validator は便利なエラー情報を列挙する `validator-errors` コンポーネントを提供します。 例は次の通りです:

```html
<validator name="validation1">
  <div class="username">
    <label for="username">名前:</label>
    <input id="username" type="text" v-validate:username="{
      required: { rule: true, message: '名前は必須です!!' }
    }">
  </div>
  <div class="password">
    <label for="password">パスワード:</label>
    <input id="password" type="password" v-validate:password="{
      required: { rule: true, message: 'パスワードは必須です!!' },
      minlength: { rule: 8, message: 'パスワードが短すぎです!!' }
    }"/>
  </div>
  <div class="errors">
    <validator-errors :validation="$validation1"></validator-errors>
  </div>
</validator>
```

上の例は次の通りにレンダリングされます:

```html
<div class="username">
  <label for="username">名前:</label>
  <input id="username" type="text">
</div>
<div class="password">
  <label for="password">パスワード:</label>
  <input id="password" type="password">
</div>
<div class="errors">
  <div>
    <p>password: パスワードが短すぎです !!</p>
  </div>
  <div>
    <p>password: パスワードは必須です !!</p>
  </div>
  <div>
    <p>username: 名前は必須です !!</p>
  </div>
</div>
```

## カスタムエラーメッセージテンプレート

もし標準の`validator-errors` エラーメッセージ書式が好みでは無い場合は、あなたのコンポーネントや部分テンプレートにカスタムエラーメッセージテンプレートを指定することができます。

### コンポーネントテンプレート

下記はコンポーネントの例です:

```html
<div id="app">
  <validator name="validation1">
    <div class="username">
      <label for="username">名前:</label>
      <input id="username" type="text" v-validate:username="{
        required: { rule: true, message: '名前は必須です!!' }
      }">
    </div>
    <div class="password">
      <label for="password">パスワード:</label>
      <input id="password" type="password" v-validate:password="{
        required: { rule: true, message: 'パスワードは必須です!!' },
        minlength: { rule: 8, message: 'パスワードが短すぎです!!' }
      }"/>
    </div>
    <div class="errors">
      <validator-errors :component="'custom-error'" :validation="$validation1">
      </validator-errors>
    </div>
  </validator>
</div>
```

```javascript
// コンポーネントを Vue.component で登録する
Vue.component('custom-error', {
  props: ['field', 'validator', 'message'],
  template: '<p class="error-{{field}}-{{validator}}">{{message}}</p>'
})

new Vue({ el: '#app' })
```
  
### パーシャルテンプレート

下記はパーシャル(partial)テンプレートの例です:

```html
<div id="app">
  <validator name="validation1">
    <div class="username">
      <label for="username">名前:</label>
      <input id="username" type="text" v-validate:username="{
        required: { rule: true, message: '名前は必須です!!' }
      }">
    </div>
    <div class="password">
      <label for="password">パスワード:</label>
      <input id="password" type="password" v-validate:password="{
        required: { rule: true, message: 'パスワードは必須です!!' },
        minlength: { rule: 8, message: 'パスワードが短すぎです!!' }
      }"/>
    </div>
    <div class="errors">
      <validator-errors partial="myErrorTemplate" :validation="$validation1">
      </validator-errors>
    </div>
  </validator>
</div>
```

```javascript
// カスタムエラーテンプレートを登録
Vue.partial('myErrorTemplate', '<p>{{field}}: {{validator}}: {{message}}</p>')
new Vue({ el: '#app' })
```

### エラーメッセージのフォーカス

時々、エラーメッセージの一部分だけを出力したい時があります。 `group` 又は `field` 属性を使うと、バリデーション結果の一部分のみに焦点を当てることができます。

- `group`: バリデーション結果内のエラーメッセージのグループ (例: $validation.group1.errors)
- `field`: バリデーション結果のエラーメッセージのフィールド (例: $validation.field1.errors)

 `group` 属例の例は下記です:

```html
<div id="app">
  <validator :groups="['profile', 'password']" name="validation1">
    <div class="username">
      <label for="username">名前:</label>
      <input id="username" type="text" group="profile" v-validate:username="{
        required: { rule: true, message: '名前は必須です!!' }
      }">
    </div>
    <div class="url">
      <label for="url">url:</label>
      <input id="url" type="text" group="profile" v-validate:url="{
        required: { rule: true, message: '名前は必須です!!' },
        url: { rule: true, message: 'URLの書式が不正です' }
      }">
    </div>
     <div class="old">
     <label for="old">古いパスワード:</label>
      <input id="old" type="password" group="password" v-validate:old="{
        required: { rule: true, message: '古いパスワードは必須です !!' },
        minlength: { rule: 8, message: '古いパスワードが短すぎです !!' }
      }"/>
    </div>
    <div class="new">
      <label for="new">新しいパスワード:</label>
      <input id="new" type="password" group="password" v-validate:new="{
        required: { rule: true, message: '新しいパスワードは必須です!!' },
        minlength: { rule: 8, message: '新しいパスワードが短すぎです!!' }
      }"/>
    </div>
    <div class="confirm">
      <label for="confirm">確認用パスワード:</label>
      <input id="confirm" type="password" group="password" v-validate:confirm="{
        required: { rule: true, message: '確認用パスワードは必須です!!' },
        minlength: { rule: 8, message: '確認用パスワードが短すぎです!!' }
      }"/>
    </div>
    <div class="errors">
      <validator-errors group="profile" :validation="$validation1">
      </validator-errors>
    </div>
  </validator>
</div>
```

```javascript
Vue.validator('url', function (val) {
  return /^(http\:\/\/|https\:\/\/)(.{4,})$/.test(val)
})
new Vue({ el: '#app' })
```

## 手動によるエラーメッセージの設定

時々、サーバーサイドのバリデーションエラーのようなエラーメッセージを手動で設定したい場合があります。そのような場合は、 `$setValidationErrors` メタメソッドを使うことでバリデーション結果にエラーメッセージを与えることができます。以下は例です:

```html
<div id="app">
  <validator name="validation">
    <div class="username">
      <label for="username">名前:</label>
      <input id="username" type="text" v-model="username" v-validate:username="{
        required: { rule: true, message: '名前は必須です!!' }
      }">
    </div>
    <div class="old">
      <label for="old">古いパスワード:</label>
      <input id="old" type="password" v-model="passowrd.old" v-validate:old="{
        required: { rule: true, message: '古いパスワードは必須です!!' }
      }"/>
    </div>
    <div class="new">
      <label for="new">新しいパスワード:</label>
      <input id="new" type="password" v-model="password.new" v-validate:new="{
        required: { rule: true, message: '新しいパスワードは必須です!!' },
        minlength: { rule: 8, message: '新しいパスワードが短すぎです!!' }
      }"/>
    </div>
    <div class="confirm">
      <label for="confirm">確認用パスワード:</label>
      <input id="confirm" type="password" v-validate:confirm="{
        required: { rule: true, message: '確認用パスワードは必須です!!' },
        confirm: { rule: passowd.new, message: '確認用パスワードが無効です!!' }
      }"/>
    </div>
    <div class="errors">
      <validator-errors :validation="$validation"></validator-errors>
    </div>
    <button type="button" v-if="$validation.valid" @click.prevent="onSubmit">update</button>
  </validator>
</div>
```
```javascript
new Vue({
  el: '#app',
  data: {
    id: 1,
    username: '',
    password: {
      old: '',
      new: ''
    }
  },
  validators: {
    confirm: function (val, target) {
      return val === target
    }
  },
  methods: {
    onSubmit: function () {
      var self = this
      var resource = this.$resource('/user/:id')
      resource.save({ id: this.id }, {
        username: this.username,
        password: this.new
      }, function (data, stat, req) {
        // 何か成功したときの処理...
        // ...
      }).error(function (data, stat, req) {
        // サーバエラーの処理
        self.$setValidationErrors([
          { field: data.field, message: data.message }
        ])
      })
    }
  }
})
```
