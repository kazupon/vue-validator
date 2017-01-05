# Validation With Component

## `validity` Component

In vue-validator v2.x, validation was based on `v-validate` custom directive. In 3.0-alpha and later, wrap the `validity` wrapper component.

v2.x:

```html
<validator name="validation">
  <form novalidate>
    <input type="text" v-validate:comment="{ minlength: 16, maxlength: 128 }">
    <div>
      <span v-show="$validation.comment.minlength">Your comment is too short.</span>
      <span v-show="$validation.comment.maxlength">Your comment is too long.</span>
    </div>
    <input type="submit" value="send" v-if="valid">
  </form>
</validator>
```

v3.0-alpha or later:

```html
<div id="app">
  <!-- 
    wrap the target element with `validity` component.
    required `field` property and `validators` property.
  -->
  <validity field="comment" :validators="{ minlength: 16, maxlength: 128 }">
    <input type="text" @input="handleInput">
  </validity>
  <div>
    <span v-show="result.minlength">Your comment is too short.</span>
    <span v-show="result.maxlength">Your comment is too long.</span>
  </div>
  <input type="submit" value="send" v-if="result.valid">
</div>
```
```javascript
new Vue({
  data: {
    result: {} // for validation results
  },
  methods: {
    handleInput: function (e) {
      var self = this
      // get validity object from target element
      var validity = e.target.$validity
      // validate !!
      validity.validate(function () {
        // ... validate done, get validation results
        // from `result` property of `validity` object.
        self.result = validity.result
      })
    }
  }
}).$mount('#app')
```

`validity` component is a functional component that makes wrapped single element validatable, due to have such a characteristic, `validity` component is not rendered itself. output of the above HMLT template the below:

```html
<div id="app">
  <input type="text" class="untouched pristine">
  <div>
    <span style="display: none;">Your comment is too short.</span>
    <span style="display: none;">Your comment is too long.</span>
  </div>
</div>
```

validation with `validity` component is required the below properties:

- `field`: validation field name, inside of vue-valiator, indispensable to identify wheather which element are validated.
- `validators`: execute validators, specify the some validators, rules and error messages.


### `validators` Property

you can bind with `v-bind` because `validators` property is implemented as component:

```html
<validity field="username" :validators="validators">
  <input type="text" @input="handleValidate">
</validity>
```
```javascript
new Vue({
 data: {
   validators: ['required']
 },
 ...
}).$mount('#app')
```

As well as `class` or `style`, `validators` property can bind array or object with `v-bind`.

#### Array Syntax

The below example bind an array:

```html
<validity field="username" :validators="['required']">
  <input type="text" @input="handleValidate">
</validity>
```
Since `required` validator doesn't need to specify any additional rules, this syntax is preferred.

#### Object Syntax

The below example bind an object:

```html
<validity field="username" :validators="{ required: true, minlength: 8 }">
  <input type="text" @input="handleInput">
</validity>
```

Object syntax allow you to provide rule values. For `required`, as it doesn't need a rule value, you can specify a **dummy** rule instead, as shown.

Alternatively, you can specify a strict object as follows:

```html
<validity field="username" :validators="{
  required: { rule: true, message: 'required !!' },
  minlength: { rule: 8, message: 'too short !!' }
}">
  <input type="text" @input="handleInput">
</validity>
```

In above example, you can specify an error messages other than rules too.

## `validity-group` Component

Like `input[type="radio"]` or `input[type="checkbox"]`, for form element that have multiple elements, you can wrap target elements with `validity-group` wrapper component.

```html
<div id="app">
  <h1>Survey</h1>
  <validity-group field="fruits" :validators="['required']">
    <legend>Which do you like fruit ?</legend>
    <input id="apple" type="radio" name="fruit" value="apple" @change="handleValidate">
    <label for="apple">Apple</label>
    <input id="orange" type="radio" name="fruit" value="orange" @change="handleValidate">
    <label for="orange">Orage</label>
    <input id="grape" type="radio" name="fruit" value="grage" @change="handleValidate">
    <label for="grape">Grape</label>
    <input id="banana" type="radio" name="fruit" value="banana" @change="handleValidate">
    <label for="banana">Banana</label>
    <p v-if="result.required">Please choice a fruit!!</p>
  </validity-group>
</div>
```
```javascript
new Vue({
  data: {
    result: {}
  },
  methods: {
    handleValidate: function (e) {
      var self = this
      var validity = e.target.$validity
      validity.validate(function () {
        self.result = validity.result
      })
    }
  }
}).$mount('#app')
```

Also in the validation with `validity-group` compnent , you can use the `validity` object, validate with `validate` method and get validation results from `result` proprerty. Furthermore exposes the same properties (`filed`, `validators`, etc) as `validity` component.

## Refer `validity` object  with `ref` attribute

So far in example, As how to refer the `validity` object,  refered via `target` (wrapped with target element) of event argument. As a way to refer more feel free to, you can be used with `ref` attribute.

the below example:

```html
<div id="app">
  <label for="username">username:</label>
  <validity ref="validity" field="username" :validators="{ required: true, minlength: 4 }">
    <input type="text" @input="$refs.validity.validate()">
  </validity>
  <div class="errors">
    <p class="required" v-if="result.required">required username!!</p>
    <p class="minlength" v-if="result.minlength">too short username!!</p>
  </div>
</div>
```

In the above example, so use `ref` attribute, call the `validate` method with inline statement in `@input` handler.

## `validation` Component

You can validate with using `validity` or `validity-group` components. However, in 3.0-alpha or later, you need to manage the validation results obtained with these components your-self.

`validation` component aggregate validation results each `validity` or `validity-group` component to `$validation` property of Vue instance, so this is useful.

the below example:

```html
<div id="app">
  <!-- wrap validity components -->
  <validation name="validation1">
    <div class="username">
      <label for="username">username:</label>
      <validity field="username" :validators="['required']">
        <input id="username" type="text" @input="handleValidate">
      </validity>
    </div>

    <div class="password">
      <label for="password">password:</label>
      <validity field="password" :validators="{ minlength: 8, required: true }">
        <input id="password" type="password" @input="handleValidate">
      </validity>
    </div>

    <div class="confirm">
      <label for="confimr">password (confirm):</label>
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

`validation` component is required the `name` property. you can get validation result via `name` property from `$validation` property of Vue instance. In generally, so the key path becomes longer, you should be used the `mapValidation` function helper like in above example.
