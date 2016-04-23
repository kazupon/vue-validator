# Error messages

Error messages can be stored directly in the validation rules, and can be use error message on `v-show` or `v-if`:

```html
<validator name="validation1">
  <div class="username">
    <label for="username">username:</label>
    <input id="username" type="text" v-validate:username="{
      required: { rule: true, message: 'required you name !!' }
    }">
    <span v-if="$validation1.username.required">{{ $validation1.username.required }}</span>
  </div>
  <div class="password">
    <label for="password">password:</label>
    <input id="password" type="password" v-validate:password="{
      required: { rule: true, message: 'required you password !!' },
      minlength: { rule: 8, message: 'your password short too !!' }
    }"/>
    <span v-if="$validation1.password.required">{{ $validation1.password.required }}</span>
    <span v-if="$validation1.password.minlength">{{ $validation1.password.minlength }}</span>
  </div>
</validator>
```

Also, Error message can be used with `v-for`:

```html
<validator name="validation1">
  <div class="username">
    <label for="username">username:</label>
    <input id="username" type="text" v-validate:username="{
      required: { rule: true, message: 'required you name !!' }
    }">
  </div>
  <div class="password">
    <label for="password">password:</label>
    <input id="password" type="password" v-validate:password="{
      required: { rule: true, message: 'required you password !!' },
      minlength: { rule: 8, message: 'your password short too !!' }
    }"/>
  </div>
  <div class="errors">
    <ul>
      <li v-for="error in $validation1.errors">
        <p>{{error.field}}: {{error.mesage}}</p>
      </li>
    </ul>
  </div>
</validator>
```

Data property or computed properties can help reduce clutter, rather than using inline rule sets.

## Error message enumeration component

In the above example, we used `v-for` directive to enumerate `errors` of validator. But, we can't be bothered to do it. So, vue-validator provide the convenient `validator-errors` component to enumerate error info. the following the example:

```html
<validator name="validation1">
  <div class="username">
    <label for="username">username:</label>
    <input id="username" type="text" v-validate:username="{
      required: { rule: true, message: 'required you name !!' }
    }">
  </div>
  <div class="password">
    <label for="password">password:</label>
    <input id="password" type="password" v-validate:password="{
      required: { rule: true, message: 'required you password !!' },
      minlength: { rule: 8, message: 'your password short too !!' }
    }"/>
  </div>
  <div class="errors">
    <validator-errors :validation="$validation1"></validator-errors>
  </div>
</validator>
```

In the above example, it's rendered the following:

```html
<div class="username">
  <label for="username">username:</label>
  <input id="username" type="text">
</div>
<div class="password">
  <label for="password">password:</label>
  <input id="password" type="password">
</div>
<div class="errors">
  <div>
    <p>password: your password short too !!</p>
  </div>
  <div>
    <p>password: required you password !!</p>
  </div>
  <div>
    <p>username: required you name !!</p>
  </div>
</div>
```

## Custom error message templating

If you don't like the default error message format of `validator-errors`, you can specify the custom error message template with your component or your partial template.

### Component template

the below component example:

```html
<div id="app">
  <validator name="validation1">
    <div class="username">
      <label for="username">username:</label>
      <input id="username" type="text" v-validate:username="{
        required: { rule: true, message: 'required you name !!' }
      }">
    </div>
    <div class="password">
      <label for="password">password:</label>
      <input id="password" type="password" v-validate:password="{
        required: { rule: true, message: 'required you password !!' },
        minlength: { rule: 8, message: 'your password short too !!' }
      }"/>
    </div>
    <div class="errors">
      <validator-errors :component="'custom-error'" :validation="$validation1">
      </validator-errors>
    </div>
  </validator>
</div>
```

```javascript
// register the your component with Vue.component
Vue.component('custom-error', {
  props: ['field', 'validator', 'message'],
  template: '<p class="error-{{field}}-{{validator}}">{{message}}</p>'
})

new Vue({ el: '#app' })
```
  
### Partial template

the below partial template example:

```html
<div id="app">
  <validator name="validation1">
    <div class="username">
      <label for="username">username:</label>
      <input id="username" type="text" v-validate:username="{
        required: { rule: true, message: 'required you name !!' }
      }">
    </div>
    <div class="password">
      <label for="password">password:</label>
      <input id="password" type="password" v-validate:password="{
        required: { rule: true, message: 'required you password !!' },
        minlength: { rule: 8, message: 'your password short too !!' }
      }"/>
    </div>
    <div class="errors">
      <validator-errors partial="myErrorTemplate" :validation="$validation1">
      </validator-errors>
    </div>
  </validator>
</div>
```

```javascript
// register custom error template
Vue.partial('myErrorTemplate', '<p>{{field}}: {{validator}}: {{message}}</p>')
new Vue({ el: '#app' })
```

### Error messages focusing

Sometimes, you need to output the part of error messages. You can focus the part of validation results when you use the `group` or `field` attributes.

- `group`: error messages of the group in validation results (e.g. $validation.group1.errors)
- `field`: error messages of the field in validation results (e.g. $validation.field1.errors)

the below `group` attribute example:

```html
<div id="app">
  <validator :groups="['profile', 'password']" name="validation1">
    <div class="username">
      <label for="username">username:</label>
      <input id="username" type="text" group="profile" v-validate:username="{
        required: { rule: true, message: 'required you name !!' }
      }">
    </div>
    <div class="url">
      <label for="url">url:</label>
      <input id="url" type="text" group="profile" v-validate:url="{
        required: { rule: true, message: 'required you name !!' },
        url: { rule: true, message: 'invalid url format' }
      }">
    </div>
     <div class="old">
     <label for="old">old password:</label>
      <input id="old" type="password" group="password" v-validate:old="{
        required: { rule: true, message: 'required you old password !!' },
        minlength: { rule: 8, message: 'your old password short too !!' }
      }"/>
    </div>
    <div class="new">
      <label for="new">new password:</label>
      <input id="new" type="password" group="password" v-validate:new="{
        required: { rule: true, message: 'required you new password !!' },
        minlength: { rule: 8, message: 'your new password short too !!' }
      }"/>
    </div>
    <div class="confirm">
      <label for="confirm">confirm password:</label>
      <input id="confirm" type="password" group="password" v-validate:confirm="{
        required: { rule: true, message: 'required you confirm password !!' },
        minlength: { rule: 8, message: 'your confirm password short too !!' }
      }"/>
    </div>
    <div class="errors">
      <validator-errors group="profile" :validation="$validation1">
      </validator-errors>
    </div>
  </validator>
</div>
```

```javascript
Vue.validator('url', function (val) {
  return /^(http\:\/\/|https\:\/\/)(.{4,})$/.test(val)
})
new Vue({ el: '#app' })
```

## Manually error message settings

Sometimes, you need to manually set the validation error message such as server-side validation error. At that time, you can apply some error messages to validation results with using `$setValidationErrors` meta method. example:

```html
<div id="app">
  <validator name="validation">
    <div class="username">
      <label for="username">username:</label>
      <input id="username" type="text" v-model="username" v-validate:username="{
        required: { rule: true, message: 'required you name !!' }
      }">
    </div>
    <div class="old">
      <label for="old">old password:</label>
      <input id="old" type="password" v-model="passowrd.old" v-validate:old="{
        required: { rule: true, message: 'required you old password !!' }
      }"/>
    </div>
    <div class="new">
      <label for="new">new password:</label>
      <input id="new" type="password" v-model="password.new" v-validate:new="{
        required: { rule: true, message: 'required you new password !!' },
        minlength: { rule: 8, message: 'your new password short too !!' }
      }"/>
    </div>
    <div class="confirm">
      <label for="confirm">confirm password:</label>
      <input id="confirm" type="password" v-validate:confirm="{
        required: { rule: true, message: 'required you confirm password !!' },
        confirm: { rule: passowd.new, message: 'your confirm password incorrect !!' }
      }"/>
    </div>
    <div class="errors">
      <validator-errors :validation="$validation"></validator-errors>
    </div>
    <button type="button" v-if="$validation.valid" @click.prevent="onSubmit">update</button>
  </validator>
</div>
```
```javascript
new Vue({
  el: '#app',
  data: {
    id: 1,
    username: '',
    password: {
      old: '',
      new: ''
    }
  },
  validators: {
    confirm: function (val, target) {
      return val === target
    }
  },
  methods: {
    onSubmit: function () {
      var self = this
      var resource = this.$resource('/user/:id')
      resource.save({ id: this.id }, {
        username: this.username,
        password: this.new
      }, function (data, stat, req) {
        // something handle success ...
        // ...
      }).error(function (data, stat, req) {
        // handle server error
        self.$setValidationErrors([
          { field: data.field, message: data.message }
        ])
      })
    }
  }
})
```
