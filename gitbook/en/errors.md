# Error Messages

Error messages can be stored directly in the validation rules (e.g. `message` of `required` rule):

```html
<div id="app">
  <div class="email">
    <label for="email">email:</label>
    <validity ref="validity" field="email" v-model="result" :validators="{
      required: { message: 'required email !!' }
    }">
    <input type="text" 
           @input="$refs.validity.validate()" 
           @focusin="$refs.validity.validate()">
  </div>
  <p class="error" v-if="result.required">{{result.required}}</p>
</div>
```

```javascript
new Vue({
  data: { result: {} }
}).$mount('#app')
```

If you want to output all error messages for currently invalid rules that have a message defined, you can loop over the errors array with v-for:

```html
<div id="app">
  <div class="email">
    <label for="email">email:</label>
    <validity ref="validity" field="email" v-model="result" :validators="{
      required: { message: 'required email !!' },
      email: { message: 'invalid email address !!' }
    }">
    <input type="text" 
           @input="$refs.validity.validate()" 
           @focusin="$refs.validity.validate()">
  </div>
  <ul class="errors">
    <li v-for="error in result.errors">
      <p :class="error.validator">{{error.field}}: {{error.message}}</p>
    </li>
  </ul>
</div>
```

```javascript
new Vue({
  validators: {
    email: function (val) {
      return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val)
    }
  },
  data: {
    { result: {} }
  }
}).$mount('#app')
```

Data property or computed properties can help reduce clutter, rather than using inline rule sets.
