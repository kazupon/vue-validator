# Validation timing customization

vue-validator validate automatically with `validator` element directive and `v-validate` directive. However, sometimes, we are disabling automatically validation, and there are times we want to validate manually.

## `initial`
When vue-validator completed initial compilation, each `v-validate` directive automatically validate target element. If you don't want that behavior, you can use the `initial` attribute to turn it off for all rules on an element. If you want to turn it off for a specific rule on an element, you can use the `v-validate` syntax:

```html
<div id="app">
  <validator name="validation1">
    <form novalidate>
      <div class="username-field">
        <label for="username">username:</label>
        <!-- 'inital' attribute is applied the all validators of target element (e.g. required, exist) -->
        <input id="username" type="text" initial="off" v-validate:username="['required', 'exist']">
      </div>
      <div class="password-field">
        <label for="password">password:</label>
        <!-- 'initial' optional is applied with `v-validate` validator (e.g. required only) -->
        <input id="password" type="password" v-validate:passowrd="{ required: { rule: true, initial: 'off' }, minlength: 8 }">
      </div>
      <input type="submit" value="send" v-if="$validation1.valid">
    </form>
  </validator>
</div>
```

This is useful, when you need to suppress the validation (like the server-side validation) with async validation feature (explain later).

## `detect-blur` and `detect-change`
vue-validator validate automatically when detect DOM event (`input`, `blur`, `change`) in formalable elements (input, checkbox, select, etc).  In the case, use the `detect-change`, `detect-blur` attributes:

```html
<div id="app">
  <validator name="validation">
    <form novalidate @submit="onSubmit">
      <h1>user registration</h1>
      <div class="username">
        <label for="username">username:</label>
        <input id="username" type="text" 
          detect-change="off" detect-blur="off" v-validate:username="{
          required: { rule: true, message: 'required you name !!' }
        }" />
      </div>
      <div class="password">
        <label for="password">password:</label>
        <input id="password" type="password" v-model="password" 
          detect-change="off" detect-blur="off" v-validate:password="{
          required: { rule: true, message: 'required you new password !!' },
          minlength: { rule: 8, message: 'your new password short too !!' }
        }" />
      </div>
      <div class="confirm">
        <label for="confirm">confirm password:</label>
        <input id="confirm" type="password" 
          detect-change="off" detect-blur="off" v-validate:confirm="{
          required: { rule: true, message: 'required you confirm password !!' },
          confirm: { rule: password, message: 'your confirm password incorrect !!' }
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
      var self = this
      this.$validate(true, function () {
        if (self.$validation.invalid) {
          e.preventDefault()
        }
      })
    }
  }
})
```
