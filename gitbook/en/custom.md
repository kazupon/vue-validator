## Global registration
You can register your custom validator with using `Vue.validator` method. 

> **NOTE:** `Vue.validator` asset is extended from Vue.js' asset managment system.

Detail of the `Vue.validator` method.

The below the `email` custom validator exmpale:

```javascript
// Register `email` validator function
Vue.validator('email', {
  check: function (val) {
    return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val)
  }
})

new Vue({
  data: {
    validation: {
      result: {} 
    }
  }
}).$mount('#app')
```

```html
<div id="app">
  <form novalidate>
    <label>Email:</label> 
    <validity ref="validity" field="email" v-model="validation" :validators="['email']">
      <input type="text" @input="$refs.validity.validate()">
    </validity>
    <div class="errors">
      <p class="email" v-if="validation.result.email">Invalid your mail address format.</p>
    </div>
    <input type="submit" value="send" v-if="validation.result.valid">
  </form>
</div>
```

## Local registration
You can register your custom validator to component with using `validators` option.

Custom validators are registered to Vue constructor `validators` option using a callback function; return true upon passing.

the below the `numeric` or `url`  custom validator exmpale:

```javascript
new Vue({
  validators: { // `numeric` and `url` custom validator is local registration
    numeric: function (val) {
      return /^[-+]?[0-9]+$/.test(val)
    },
    url: function (val) {
      return /^(http\:\/\/|https\:\/\/)(.{4,})$/.test(val)
    }
  },
  data: {
    results: {
      username: {},
      age: {},
      site: {}
    }
  },
  computed: {
    valid: function () {
      var results = this.results
      var fields = Object.keys(results)
      var ret = true
      for (var i = 0; i < fields.length; i++) {
        var field = fields[i]
        if (results[field].invalid) {
          ret = false
          break
        }
      }
      return ret
    }
  },
  methods: {
    handleUsername: function (e) {
      this.handleValidate(e.target.$validity, 'username')
    },
    handleAge: function (e) {
      this.handleValidate(e.target.$validity, 'age')
    },
    handleSite: function (e) {
      this.handleValidate(e.target.$validity, 'site')
    },
    handleValidate: function ($validity, field) {
      var self = this
      $validity.validate(function () {
        var result = $validity.result
        self.results[field] = result
      })
    }
  }
}).$mount('#app')
```

```html
<div id="app">
  <form novalidate>
    <div class="username">
      <label>username:</label>
      <validity field="username" :validators="['required']">
        <input type="text" name="username" @input="handleUsername">
      </validity>
    </div>
    <div class="age">
      <label>age:</label>
      <validity field="age" :validators="['numeric']">
        <input type="text" name="age" @input="handleAge">
      </validity>
    </div>
    <div class="site">
      <label>site:</label>
      <validity field="site" :validators="['url']">
        <input type="text" name="site" @input="handleSite">
      </validity>
    </div>
    <div class="errors">
      <p class="username" v-if="results.username.required">required username!!</p>
      <p class="age" v-if="results.age.numeric">invalid age numeric value!!</p>
      <p class="site" v-if="results.site.url">invlid url!!</p>
    </div>
    <input type="submit" value="send" v-if="valid">
  </form>
</div>
```

## Error message

Custom validators may have default error messages attached:

```javascript
// `email` custom validator is global registration
Vue.validator('email', {
  check: function (val) {
    return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val)
  },
  message: 'Invalid your mail address format.' // error message with plain string
})

// build-in `required` validator customization
Vue.validator('required', {
  message: function (field) { // error message with function
    return 'required "' + field + '" field'
  },
  check: Vue.validator('required') // re-use validator logic
})

new Vue({
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
    validation: {
      result: {} 
    }
  }
}).$mount('#app')
```

```html
<div id="app">
  <form novalidate>
    <label>username:</label> 
    <validity ref="validity" field="username" v-model="validation" :validators="['required']">
      <input type="text" @input="$refs.validity.validate()">
    </validity>
    <label>email:</label> 
    <validity ref="validity" field="email" v-model="validation" :validators="['email']">
      <input type="text" @input="$refs.validity.validate()">
    </validity>
    <div class="age">
      <label>age:</label>
      <validity field="age" :validators="['numeric']">
        <input type="text" name="age" @input="handleAge">
      </validity>
    </div>
    <div class="site">
      <label>site:</label>
      <validity field="site" :validators="['url']">
        <input type="text" name="site" @input="handleSite">
      </validity>
    </div>
    <ul class="errors">
      <li v-for="error in validation">
        <p :class="error.validator">{{error.field}}: {{error.message}}</p>
      </li>
    </ul>
    <input type="submit" value="send" v-if="validation.result.valid">
  </form>
</div>
```
