# 入门

```javascript
new Vue({
  el: '#app'
})
```

我们可以像下面这样使用 `validator` 元素指令和 `v-validate` 指令:

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

验证结果会关联到验证器元素上。在上例中，验证结果保存在 `$validation1` 下，`$validation1` 是由 `validator` 元素的 `name` 属性值加 `$` 前缀组成。

> :提醒: 验证器名称不要与 Vue.js 中的自带属性重复，如 `$event` 等。