# Usage

```javascript
new Vue({
  el: '#app'
})
```

We can use the `validator` element directive and `v-validate` directive, as follows:

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

The validation results are scoped to the validator element. In above case, the validation results keep to `$validation1` scope (prefixed with `$`), specified by the `name` attribute of the `validator` element.
