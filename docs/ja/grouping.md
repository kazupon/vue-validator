# グルーピング

vue バインディング文法は input をグループ化することができます:

```html
<validator name="validation1" :groups="['passwordGroup']">
  ユーザー名: <input type="text" v-validate:username="['required']"><br>

  パスワード: <input type="password" group="passwordGroup" v-validate:password="{ minlength: 8, required: true }"/><br>

  確認用パスワード: <input type="password" group="passwordGroup" v-validate:password-confirm="{ minlength: 8, required: true }"/><br>

  <span v-if="$validation1.username.invalid">無効なユーザー名です!</span><br>

  <span v-if="$validation1.passwordGroup.invalid">無効なパスワード入力です!</span>
</validator>
```
