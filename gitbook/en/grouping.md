# Grouping

You can grouping with `group` prop of `validity` (or `validity-group`)  component. 

The below is an example of grouping username (`user`) and password (`password`) validatoin results:

```html
<div id="app">
  <validation name="validation1">
    <div class="username">
      <label for="username">username:</label>
      <!-- use the group prop -->
      <validity ref="username" field="username" group="user" :validators="['required']">
        <input id="username" type="text" @input="$refs.username.validate()">
      </validity>
    </div>
    <div class="password">
      <label for="password">password:</label>
      <!-- use the group prop -->
      <validity ref="password" field="password" group="password" :validators="{ minlength: 8, required: true }">
        <input id="password" type="password" @input="$refs.password.validate()">
      </validity>
    </div>
    <div class="confirm">
      <label for="confimr">password (confirm):</label>
      <!-- use the group prop -->
      <validity ref="confirm" field="confirm" group="password" :validators="{ minlength: 8, required: true }">
        <input id="confirm" type="password" @input="$refs.confirm.validate()">
      </validity>
    </div>
    <input type="submit" value="send" v-if="valid">
    <div class="errors">
      <p class="error-username" v-if="usernameInvalid">Invalid yourname !!</p>
      <p class="error-password" v-if="passwordInvalid">Invalid password input !!</p>
    </div>
    <div class="debug">
      <p>validation result info</p>
      <pre>{{$validation}}</pre>
    </div>
  </validation>
</div>
```

```javascript
var vm = new Vue({
  // you can access the keypath of group name including
  computed: VueValidator.mapValidation({
    valid: '$validation.validation1.valid',
    usernameInvalid: '$validation.validation1.user.username.invalid',
    passwordInvalid: '$validation.validation1.password.invalid'
  })
}).$mount('#app')
```
