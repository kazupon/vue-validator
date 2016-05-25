# バリデーションタイミング設定

vue-validator は `validator` エレメントディレクティブと `v-validate` ディレクティブで自動的にバリデートを実行します。しかしながら時々、自動バリデーションを無効化し手動でバリデートを実行したい時があります。

## `initial`
vue-validator は初回コンパイルを終えると、それぞれの `v-validate` ディレクティブは自動的に対象エレメントのバリデートを実行します。もしこの挙動を望まない場合、要素の全てのルールを停止するには `initial` 属性を使用することができます。もし要素個別のルールを停止するには、 `v-validate` を使用することができます:

```html
<div id="app">
  <validator name="validation1">
    <form novalidate>
      <div class="username-field">
        <label for="username">username:</label>
        <!-- 'inital' 属性は対象エレメントの全てのバリデーターに対して適用されます (例えば required, exist) -->
        <input id="username" type="text" initial="off" v-validate:username="['required', 'exist']">
      </div>
      <div class="password-field">
        <label for="password">password:</label>
        <!-- 任意の 'initial' は `v-validate` バリデーターに適用されます。(例えば required のみ) -->
        <input id="password" type="password" v-validate:passowrd="{ required: { rule: true, initial: 'off' }, minlength: 8 }">
      </div>
      <input type="submit" value="send" v-if="$validation1.valid">
    </form>
  </validator>
</div>
```

これはサーバサイドバリデーションのように非同期にバリデーションする必要がある場合は便利です。

## `detect-blur` と `detect-change`
vue-validator はフォーム要素(input, checkbox, select, 等)のDOMイベント (`input`, `blur`, `change`)を検知したら自動的にバリデートを実行します。このような場合は、`detect-change`, `detect-blur` 属性を使ってください:

```html
<div id="app">
  <validator name="validation">
    <form novalidate @submit="onSubmit">
      <h1>user registration</h1>
      <div class="username">
        <label for="username">username:</label>
        <input id="username" type="text" 
          detect-change="off" detect-blur="off" v-validate:username="{
          required: { rule: true, message: '名前は必須です!!' }
        }" />
      </div>
      <div class="password">
        <label for="password">password:</label>
        <input id="password" type="password" v-model="password" 
          detect-change="off" detect-blur="off" v-validate:password="{
          required: { rule: true, message: '新しいパスワードは必須です!!' },
          minlength: { rule: 8, message: '新しいパスワードが短すぎです!!' }
        }" />
      </div>
      <div class="confirm">
        <label for="confirm">confirm password:</label>
        <input id="confirm" type="password" 
          detect-change="off" detect-blur="off" v-validate:confirm="{
          required: { rule: true, message: '確認用パスワードは必須です!!' },
          confirm: { rule: password, message: '確認用パスワードが正しくありません!!' }
        }" />
      </div>
      <div class="errors" v-if="$validation.touched">
        <validator-errors :validation="$validation"></validator-errors>
      </div>
      <input type="submit" value="register" />
    </form>
  </validator>
</div>
```

```javascript
new Vue({
  el: '#app',
  data: {
    password: ''
  },
  validators: {
    confirm: function (val, target) {
      return val === target
    }
  },
  methods: {
    onSubmit: function (e) {
      // validate manually
      this.$validate(true)

      if (this.$validation.invalid) {
        e.preventDefault()
      }
    }
  }
})
```
