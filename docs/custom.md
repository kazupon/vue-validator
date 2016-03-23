# Custom validator

## Global registration
You can register your custom validator with using `Vue.validator` method. 

> **NOTE:** `Vue.validator` asset is extended from Vue.js' asset managment system.

Detail of the `Vue.validator` method.

The below the `email` custom validator exmpale:

```javascript
// Register email validator function. 
Vue.validator('email', function (val) {
  return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val)
})

new Vue({
  el: '#app'
  data: {
    email: ''
  }
})
```
```html
<div id="app">
  <validator name="validation1">
    address: <input type="text" v-validate:address="['email']"><br />
    <div>
      <p v-show="$validation1.address.email">Invalid your mail address format.</p>
    </div>
  <validator>
</div>
```

## Local registration
You can register your custom validator to component with using `validators` option.

Cursom validators are registered to Vue constructor `validators` option using a callback function; return true upon passing.

the below the `numeric` or `url`  custom validator exmpale:

```javascript
new Vue({
  el: '#app',
  validators: { // `numeric` and `url` custom validator is local registration
    numeric: function (val/*,rule*/) {
      return /^[-+]?[0-9]+$/.test(val)
    },
    url: function (val) {
      return /^(http\:\/\/|https\:\/\/)(.{4,})$/.test(val)
    }
  },
  data: {
    email: ''
  }
})
```

```html
<div id="app">
  <validator name="validation1">
    username: <input type="text" v-validate:username="['required']"><br />
    email: <input type="text" v-validate:address="['email']"><br />
    age: <input type="text" v-validate:age="['numeric']"><br />
    site: <input type="text" v-validate:site="['url']"><br />
    <div class="errors">
      <p v-if="$validation1.username.required">required username</p>
      <p v-if="$validation1.address.email">invalid email address</p>
      <p v-if="$validation1.age.numeric">invalid age value</p>
      <p v-if="$validation1.site.url">invalid site uril format</p>
    </div>
  <validator>
</div>
```

## Error message

Custom validators may have default error messages attached:

```javascript
// `email` custom validator global registration
Vue.validator('email', {
  message: 'invalid email address', // error message with plain string
  check: function (val) { // define validator
    return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val)
  }
})

// build-in `required` validator customization
Vue.validator('required', {
  message: function (field) { // error message with function
    return 'required "' + field + '" field'
  },
  check: Vue.validator('required') // re-use validator logic
})

new Vue({
  el: '#app',
  validators: {
    numeric: { // `numeric` custom validator local registration
      message: 'invalid numeric value',
      check: function (val) {
        return /^[-+]?[0-9]+$/.test(val)
      }
    },
    url: { // `url` custom validator local registration
      message: function (field) {
        return 'invalid "' + field + '" url format field'
      },
      check: function (val) {
        return /^(http\:\/\/|https\:\/\/)(.{4,})$/.test(val)
      }
    }
  },
  data: {
    email: ''
  }
})
```

```html
<div id="app">
  <validator name="validation1">
    username: <input type="text" v-validate:username="['required']"><br />
    email: <input type="text" v-validate:address="['email']"><br />
    age: <input type="text" v-validate:age="['numeric']"><br />
    site: <input type="text" v-validate:site="['url']"><br />
    <div class="errors">
      <validator-errors :validation="$validation1"></validator-errors>
    </div>
  <validator>
</div>
```
