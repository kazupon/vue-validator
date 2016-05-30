# はじめに

```javascript
new Vue({
  el: '#app'
})
```

次の通り、私達は `validator` エレメントディレクティブ と `v-validate` ディレクティブを使用することができます。:

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
        <p v-if="$validation1.username.required">Required your name.</p>
        <p v-if="$validation1.comment.maxlength">Your comment is too long.</p>
      </div>
      <input type="submit" value="send" v-if="$validation1.valid">
    </form>
  </validator>
```

バリデーション結果はバリデータエレメントにスコープされます。先ほどの例では、バリデーション結果は `validator` 要素の `name` 属性で指定された `$validation1` スコープ ( 接頭辞 `$` で始まる ) に保持されます。

> :warning: もし `$event` のように vue.js で既に使用されたバリデータ名を指定すると、動作しないかもしれません。 
