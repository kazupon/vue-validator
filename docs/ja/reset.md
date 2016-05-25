# バリデーション結果の初期化

バリデーション結果はバリデーターの Vue インスタンスのメソッドに動的に定義された `$resetValidation()` で初期化できます。下記に例を示します:

```html
<div id="app">
  <validator name="validation1">
    <form novalidate>
      <div class="username-field">
        <label for="username">username:</label>
        <input id="username" type="text" v-validate:username="['required']">
      </div>
      <div class="comment-field">
        <label for="comment">comment:</label>
        <input id="comment" type="text" v-validate:comment="{ maxlength: 256 }">
      </div>
      <div class="errors">
        <p v-if="$validation1.username.required">名前は必須です。</p>
        <p v-if="$validation1.comment.maxlength">コメントは長すぎです。</p>
      </div>
      <input type="submit" value="send" v-if="$validation1.valid">
      <button type="button" @click="onReset">Reset Validation</button>
    </form>
    <pre>{{ $validation1 | json }}</pre>
  </validator>
</div>
```

```javascript
new Vue({
  el: '#app',
  methods: {
    onReset: function () {
      this.$resetValidation()
    }
  }
})
```
