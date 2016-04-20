# Reset validation results

You can reset the validation results with `$resetValidation()` Vue instance meta method that defined with validator dynamically. the below the exmpale:

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
