# Getting Started

## Basic Usage

As the basic usage of validation, you can use the target element with `validity` wrap component, as follows:

### HTML

```html
<div id="app">
  <label for="username">username:</label>
  <validity field="username" :validators="{ required: true, minlength: 4 }">
    <input type="text" @input="handleValidate" @focusout="handleValidate">
  </validity>
  <div class="errors">
    <p class="required" v-if="result.required">required username!!</p>
    <p class="minlength" v-if="result.minlength">too short username!!</p>
  </div>
</div>
```

### JavaScript

```javascript
new Vue({
  data: {
    result: {}
  },
  methods: {
    handleValidate: function (e) {
      var self = this
      // refer validity instance from target element
      var $validity = e.target.$validity 
      $validity.validate(function () {
        self.result = $validity.result
      })
    }
  }
}).$mount('#app')
```

The validation results can get the `result` property from `validity` object. In above case, the `validity` object refer from `target` element of event, and run the validation with  call `validate` method of `validity` object, then validity result  refer from `result` property of `validity` object. This is a little similar the validation how to HTML5 form validation (Constraint validation API).

> :pencil: NOTE: You can also refer `validity` object with using `ref` special attribute on `validity` wrap component.

## More Convenience Usage

As the more convenience usage of validation, you can wrap the `validity` wrap component with `validation` wrap component, as follows:

### HTML

```html
<div id="app">
  <!-- wrap validity component -->
  <validation name="validation1">
    <div class="username">
      <label for="username">username:</label>
      <!-- validity component wrapped with it -->
      <validity field="username" :validators="['required']">
        <input id="username" type="text" @input="handleValidate">
      </validity>
    </div>

    <div class="password">
      <label for="password">password:</label>
      <!-- validity component wrapped with it -->
      <validity field="password" :validators="{ minlength: 8, required: true }">
        <input id="password" type="password" @input="handleValidate">
      </validity>
    </div>

    <div class="confirm">
      <label for="confimr">password (confirm):</label>
      <!-- validity component wrapped with it -->
      <validity field="confirm" :validators="{ minlength: 8, required: true }">
        <input id="confirm" type="password" @input="handleValidate">
      </validity>
    </div>

    <input type="submit" value="send" v-if="valid">

    <div class="errors">
      <p class="username-invalid" v-if="usernameInvalid">Invalid yourname inputting !!</p>
      <p class="password-invalid" v-if="passwordInvalid">Invalid password inputting !!</p>
      <p class="confirm-invalid" v-if="confirmInvalid">Invalid confirm password inputting !!</p>
    </div>
  </validation>
</div>
```

### JavaScript

```javascript
new Vue({
  computed: VueValidator.mapValidation({
    valid: '$validation.validation1.valid',
    usernameInvalid: '$validation.validation1.username.invalid',
    passwordInvalid: '$validation.validation1.password.invalid',
    confirmInvalid: '$validation.validation1.confirm.invalid'
  }),
  methods: {
    handleValidate: function (e) {
      e.target.$validity.validate()
    }
  }
}).$mount('#app')
```

By the wrapping `validation` wrap component, validation results for each `validity` wrap component is stored to `$validation` property of Vue instance.

These validation results can refer with specified the key to `name` property of `validation` wrap component. However, In above case, since the key path becomes longer, we provide the helper called `mapValidation` function. This is a similar the validation how to previous `2.x` version.
