# vue-validator

[![CircleCI Status](https://circleci.com/gh/vuejs/vue-validator/tree/dev.svg?style=shield&circle-token=36fad1862fbb44da91a28217df8fba769d6d1ce7)](https://circleci.com/gh/vuejs/vue-validator/tree/dev)
[![Coverage Status](https://coveralls.io/repos/vuejs/vue-validator/badge.svg?branch=dev&service=github)](https://coveralls.io/github/vuejs/vue-validator?branch=dev)
[![Sauce Test Status](https://saucelabs.com/buildstatus/vuejs-validator)](https://saucelabs.com/u/vuejs-validator)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)


Validator component for Vue.js


# Requirements
- Vue.js `1.0.14`+

## NOTE
vue-validator is still in its alpha verison. There may be some breaking changes. 
If you have some feedback, you're welcome in [Vue.js Discussion](http://forum.vuejs.org) :smiley_cat:


# Installation

## npm

### stable version

    $ npm install vue-validator

### development version

    $ git clone https://github.com/vuejs/vue-validator.git node_modules/vue-validator
    $ cd node_modules/vue-validator
    $ npm install
    $ npm run build

When used in CommonJS, you must explicitly install the router via `Vue.use()`:
```javascript
var Vue = require('vue')
var VueValidator = require('vue-validator')

Vue.use(VueValidator)
```

You don't need to do this when using the standalone build, as it installs itself automatically.

## CDN
jsdelivr
```html
<script src="https://cdn.jsdelivr.net/vue.validator/2.0.0-alpha.20/vue-validator.min.js"></script>
```


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


# Validation result structure

Validation results can be accessed in this structure:

```
{
  // top-level validation properties
  valid: true,
  invalid: false,
  touched: false,
  undefined: true,
  dirty: false,
  pristine: true,
  modified: false,
  errors: [{
    field: 'field1', validator: 'required', message: 'required field1'
  }, ... {
    field: 'fieldX', validator: 'customValidator', message: 'invalid fieldX'
  }],

  // field1 validation
  field1: {
    required: false, // validator
    email: true, // custom validator
    url: 'invalid url format', // if specify the error message, set it
    ...
    customValidator1: false,

    // field validation properties
    valid: false,
    invalid: true,
    touched: false,
    undefined: true,
    dirty: false,
    pristine: true,
    modified: false,
    errors: [{
      validator: 'required', message: 'required field1'
    }]
  },

  ...

  // fieldX validation
  fieldX: {
    min: false, // validator
    ...
    customValidator: true,

    // fieldX validation properties
    valid: false,
    invalid: true,
    touched: true,
    undefined: false,
    dirty: true,
    pristine: false,
    modified: true,
    errors: [{
      validator: 'customValidator', message: 'invalid fieldX'
    }]
  },
}
```

The various top-level properties are in the validation scope, and each field validation result in its own respective scopes.

## Field validation properties
- `valid`: whether field is valid; if it's valid, then return `true`, else return `false`.
- `invalid`: reverse of `valid`.
- `touched`: whether field is touched. if field was focused, return `true`, else return `false`.
- `untouched`: reverse of `touched`.
- `modified`: whether field value is modified; if field value was changed from **initial** value, return `true`, else return `false`.
- `dirty`: whether field value was changed at least **once**; if so, return `true`, else return `false`.
- `pristine`: reverse of `dirty`.
- `errors`: if invalid field exist, return error message wrapped with array, else `undefined`.

## Top level validation properties
- `valid`: whether **all** fields is valid. if so, then return `true`, else return `false`.
- `invalid`: if invalid field exist even **one** in validate fields, return `true`, else `false`.
- `touched`: whether **all** fields is touched, if so, return `true`, else `false`.
- `untouched`: if untouched field exist even **one** in validate fields, return `true`, else `false`.
- `modified`: if modified field exist even **one** in validate fields, return `true`, else `false`.
- `dirty`: if dirty field exist even **one** in validate fields, return `true`, else `false`.
- `pristine`: whether **all** fields is pristine, if so, return `true`, else `false`.
- `errors`: if invalid even one exist, return all field error message wrapped with array, else `undefined`.


# Validator syntax
`v-validate` directive syntax the below:

    v-validate[:field]="array literal | object literal | binding"

## Field
In vue-validator version 2.0-alpha or earlier, validation relied on `v-model`. In 2.0-alpha and later, use the `v-validate` directive instead.

~v1.4.4:
```html
<form novalidate>
  <input type="text" v-model="comment" v-validate="minLength: 16, maxLength: 128">
  <div>
    <span v-show="validation.comment.minLength">Your comment is too short.</span>
    <span v-show="validation.comment.maxLength">Your comment is too long.</span>
  </div>
  <input type="submit" value="send" v-if="valid">
</form>
```

v2.0-alpha later:
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

### Caml-case property
As well as [Vue.js](http://vuejs.org/guide/components.html#camelCase_vs-_kebab-case), you can use the kebab-case for `v-validate` models:

```html
<validator name="validation">
  <form novalidate>
    <input type="text" v-validate:user-name="{ minlength: 16 }">
    <div>
      <span v-if="$validation.userName.minlength">Your user name is too short.</span>
    </div>
  </form>
</validator>
```

### Attribute
You can specify the field name to `field` params attribute. This is useful when you need to define the validatable form elements dynamically:

> NOTE: the field part of `v-validate` is optional, when you use `field` params attribute

```html
<div id="app">
  <validator name="validation">
    <form novalidate>
      <p class="validate-field" v-for="field in fields">
      <label :for="field.id">{{field.label}}</label>
      <input type="text" :id="field.id" :placeholder="field.placeholder" field="{{field.name}}" v-validate="field.validate">
      </p>
      <pre>{{ $validation | json }}</pre>
    </form>
  </validator>
</div>
```

```javascript
new Vue({
  el: '#app',
  data: {
    fields: [{
      id: 'username',
      label: 'username',
      name: 'username',
      placeholder: 'input your username',
      validate: { required: true, maxlength: 16 }
    }, {
      id: 'message',
      label: 'message',
      name: 'message',
      placeholder: 'input your message',
      validate: { required: true, minlength: 8 }
    }]
  }
})
```


## Literal

### Array
The below example uses an array literal:

```html
<validator name="validation">
  <form novalidate>
    Zip: <input type="text" v-validate:zip="['required']"><br />
    <div>
      <span v-if="$validation.zip.required">Zip code is required.</span>
    </div>
  </form>
</validator>
```

Since `required` doesn't need to specify any additional rules, this syntax is preferred.


### Object
The below example uses an object literal:

```html
<validator name="validation">
  <form novalidate>
    ID: <input type="text" v-validate:id="{ required: true, minlength: 3, maxlength: 16 }"><br />
    <div>
      <span v-if="$validation.id.required">ID is required</span>
      <span v-if="$validation.id.minlength">Your ID is too short.</span>
      <span v-if="$validation.id.maxlength">Your ID is too long.</span>
    </div>
  </form>
</validator>
```

Object literals allow you to provide rule values. For `required`, as it doesn't need a rule value, you can specily a **dummy rule** instead, as shown.

Alternatively, you can specify a strict object as follows:

```html
<validator name="validation">
  <form novalidate>
    ID: <input type="text" v-validate:id="{ minlength: { rule: 3 }, maxlength: { rule: 16 } }"><br />
    <div>
      <span v-if="$validation.id.minlength">Your ID is too short.</span>
      <span v-if="$validation.id.maxlength">Your ID is too long.</span>
    </div>
  </form>
```

## Binding
The below example uses live binding:

```javascript
new Vue({
  el: '#app',
  data: {
    rules: {
      minlength: 3,
      maxlength: 16
    }
  }
})
```
```html
<div id="app">
  <validator name="validation">
    <form novalidate>
      ID: <input type="text" v-validate:id="rules"><br />
      <div>
        <span v-if="$validation.id.minlength">Your ID is too short.</span>
        <span v-if="$validation.id.maxlength">Your ID is too long.</span>
      </div>
    </form>
  </validator>
</div>
```

You can also use computed properties or methods to retrieve rule sets, instead of a set data property.


# v-model 
You can validate the field that updated with v-model:

```html
<div id="app">
  <validator name="validation1">
    <form novalidate>
      message: <input type="text" v-model="msg" v-validate:message="{ required: true, minlength: 8 }"><br />
      <div>
        <p v-if="$validation1.message.required">Required your message.</p>
        <p v-if="$validation1.message.minlength">Too short message.</p>
      </div>
    </form>
  </validator>
</div>
```

```javascript
var vm = new Vue({
  el: '#app',
  data: {
    msg: ''
  }
})

setTimeout(function () {
  vm.msg = 'hello world!!'
}, 2000)
```


# Reset validation results

You can reset the validation results with `$validatorReset()` Vue instance meta method that defined with validator dynamically. the below the exmpale:

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
      <button type="button" @click="onReset">Validation Reset</button>
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
      this.$validatorReset()
    }
  }
})
```


# Checkbox

Checkbox validation supports lengths:

```html
<div id="app">
  <validator name="validation1">
    <form novalidate>
      <h1>Survey</h1>
      <fieldset>
        <legend>Which do you like fruit ?</legend>
        <input id="apple" type="checkbox" value="apple" v-validate:fruits="{
          required: { rule: true, message: requiredErrorMsg },
          minlength: { rule: 1, message: minlengthErrorMsg },
          maxlength: { rule: 2, message: maxlengthErrorMsg }
        }">
        <label for="apple">Apple</label>
        <input id="orange" type="checkbox" value="orange" v-validate:fruits>
        <label for="orange">Orage</label>
        <input id="grape" type="checkbox" value="grage" v-validate:fruits>
        <label for="grape">Grape</label>
        <input id="banana" type="checkbox" value="banana" v-validate:fruits>
        <label for="banana">Banana</label>
        <ul class="errors">
          <li v-for="msg in $validation1.fruits.errors">
            <p>{{msg}}</p>
          </li>
        </ul>
      </fieldset>
    </form>
  </validator>
</div>
```

```javascript
new Vue({
  el: '#app',
  computed: {
    requiredErrorMsg: function () {
      return 'Required fruit !!'
    },
    minlengthErrorMsg: function () {
      return 'Please chose at least 1 fruit !!'
    },
    maxlengthErrorMsg: function () {
      return 'Please chose at most 2 fruits !!'
    }
  }
})
```


# Radio button

```html
<div id="app">
  <validator name="validation1">
    <form novalidate>
      <h1>Survey</h1>
      <fieldset>
        <legend>Which do you like fruit ?</legend>
        <input id="apple" type="radio" name="fruit" value="apple" v-validate:fruits="{
          required: { rule: true, message: requiredErrorMsg }
        }">
        <label for="apple">Apple</label>
        <input id="orange" type="radio" name="fruit" value="orange" v-validate:fruits>
        <label for="orange">Orage</label>
        <input id="grape" type="radio" name="fruit" value="grage" v-validate:fruits>
        <label for="grape">Grape</label>
        <input id="banana" type="radio" name="fruit" value="banana" v-validate:fruits>
        <label for="banana">Banana</label>
        <ul class="errors">
          <li v-for="msg in $validation1.fruits.errors">
            <p>{{msg}}</p>
          </li>
        </ul>
      </fieldset>
    </form>
  </validator>
</div>
```

```javascript
new Vue({
  el: '#app',
  computed: {
    requiredErrorMsg: function () {
      return 'Required fruit !!'
    }
  }
})
```


# Selectbox

```html
<div id="app">
  <validator name="validation1">
    <form novalidate>
      <select v-validate:lang="{ required: true }">
        <option value="">----- select your favorite programming language -----</option>
        <option value="javascript">JavaScript</option>
        <option value="ruby">Ruby</option>
        <option value="python">Python</option>
        <option value="perl">Perl</option>
        <option value="lua">Lua</option>
        <option value="go">Go</option>
        <option value="rust">Rust</option>
        <option value="elixir">Elixir</option>
        <option value="c">C</option>
        <option value="none">Not a nothing here</option>
      </select>
      <div class="errors">
        <p v-if="$validation1.lang.required">Required !!</p>
      </div>
    </form>
  </validator>
</div>
```

```javascript
new Vue({ el: '#app' })
```


# Grouping

The vue binding syntax can group inputs together:

```html
<validator name="validation1" :groups="['user', 'password']">
  username: <input type="text" group="user" v-validate:username="['required']"><br />
  password: <input type="text" group="password" v-validate:password1="{ minlength: 8, required: true }"/><br />
  password (confirm): <input type="text" group="password" v-validate:password2="{ minlength: 8, required: true }"/>
  <div class="user">
    <span v-if="$validation1.user.invalid">Invalid yourname !!</span>
  </div>
  <div class="password">
    <span v-if="$validation1.password.invalid">Invalid password input !!</span>
  </div>
</validator>
```


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
    <input id="password" type="text" v-validate:password="{
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
    <input id="password" type="text" v-validate:password="{
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
    <input id="password" type="text" v-validate:password="{
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
  <input id="password" type="text">
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
      <input id="password" type="text" v-validate:password="{
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
      <input id="password" type="text" v-validate:password="{
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
      <input id="old" type="text" group="password" v-validate:old="{
        required: { rule: true, message: 'required you old password !!' },
        minlength: { rule: 8, message: 'your old password short too !!' }
      }"/>
    </div>
    <div class="new">
      <label for="new">new password:</label>
      <input id="new" type="text" group="password" v-validate:new="{
        required: { rule: true, message: 'required you new password !!' },
        minlength: { rule: 8, message: 'your new password short too !!' }
      }"/>
    </div>
    <div class="confirm">
      <label for="confirm">confirm password:</label>
      <input id="confirm" type="text" group="password" v-validate:confirm="{
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


# Event

Using regular vue event bindings, you can be bound the event that has occured with validator.

## Field validation event

You can be handled the event to each field properties, like `v-validate` directive  specified to `input` tag:

- `valid`: occure when validation result of **each field** became valid
- `invalid`: occure when validation result of **each field** became invalid
- `touched`: occure when **each field** detected `blur` at least once
- `dirty`: occure when the value of **each field** changed from initial value at least once
- `modified`: occure when the value of **each field** changed from initial value

```html
<div id="app">
  <validator name="validation1">
    <div class="comment-field">
      <label for="comment">comment:</label>
      <input type="text" 
             @valid="onValid" 
             @invalid="onInvalid" 
             @touched="onTouched" 
             @dirty="onDirty" 
             @modified="onModified"
             v-validate:comment="['required']"/>
    </div>
    <div>
      <p>{{occuredValid}}</p>
      <p>{{occuredInvalid}}</p>
      <p>{{occuredTouched}}</p>
      <p>{{occuredDirty}}</p>
      <p>{{occuredModified}}</p>
    </div>
  </validator>
</div>
```

```javascript
new Vue({
  el: '#app',
  data: {
    occuredValid: '',
    occuredInvalid: '',
    occuredTouched: '',
    occuredDirty: '',
    occuredModified: ''
  },
  methods: {
    onValid: function () {
      this.occuredValid = 'occured valid event'
      this.occuredInvalid = ''
    },
    onInvalid: function () {
      this.occuredInvalid = 'occured invalid event'
      this.occuredValid = ''
    },
    onTouched: function () {
      this.occuredTouched = 'occured touched event'
    },
    onDirty: function () {
      this.occuredDirty = 'occured dirty event'
    },
    onModified: function (e) {
      this.occuredModified = 'occured modified event: ' + e.modified
    }
  }
})
```

## Top level validation event

You can be handled the event that has occured in the various top-level validation properties:

- `valid`: occure when validation result of **top-level** became valid
- `invalid`: occure when validation result of **top-level** became invalid
- `touched`: occure when **top-level** detected `blur` at least once
- `dirty`: occure when the value of **top-level** changed from initial value at least once
- `modified`: occure when the value of **top-level** changed from initial value

```html
<div id="app">
  <validator name="validation1"
             @valid="onValid"
             @invalid="onInvalid"
             @touched="onTouched"
             @dirty="onDirty"
             @modified="onModified">
    <div class="comment-field">
      <label for="username">username:</label>
      <input type="text" 
             v-validate:username="['required']"/>
    </div>
    <div class="password-field">
      <label for="password">password:</label>
      <input type="password" 
             v-validate:password="{ required: true, minlength: 8 }"/>
    </div>
    <div>
      <p>{{occuredValid}}</p>
      <p>{{occuredInvalid}}</p>
      <p>{{occuredTouched}}</p>
      <p>{{occuredDirty}}</p>
      <p>{{occuredModified}}</p>
    </div>
  </validator>
</div>
```

```javascript
new Vue({
  el: '#app',
  data: {
    occuredValid: '',
    occuredInvalid: '',
    occuredTouched: '',
    occuredDirty: '',
    occuredModified: ''
  },
  methods: {
    onValid: function () {
      this.occuredValid = 'occured valid event'
      this.occuredInvalid = ''
    },
    onInvalid: function () {
      this.occuredInvalid = 'occured invalid event'
      this.occuredValid = ''
    },
    onTouched: function () {
      this.occuredTouched = 'occured touched event'
    },
    onDirty: function () {
      this.occuredDirty = 'occured dirty event'
    },
    onModified: function (modified) {
      this.occuredModified = 'occured modified event: ' + modified
    }
  }
})
```


# Lazy initialization

The `lazy` attribute on the `validator` element will delay initialization of the validator until `$activateValidator()` is called. This is useful for data that must first be loaded in asynchronously, preventing the validator from reporting invalid data until ready.

The following example waits for the comment contents to be loaded before evaluating; without `lazy`, the component would show errors until the data loads in.

```html
<!-- comment component -->
<div>
  <h1>Preview</h1>
  <p>{{comment}}</p>
  <validator lazy name="validation1">
    <input type="text" :value="comment" v-validate:comment="{ required: true, maxlength: 256 }"/>
    <span v-if="$validation1.comment.required">Required your comment</span>
    <span v-if="$validation1.comment.maxlength">Too long comment !!</span>
    <button type="button" value="save" @click="onSave" v-if="valid">
  </validator>
</div>
```

```javascript
Vue.component('comment', {
  props: {
    id: Number,
  },
  data: function () {
    return { comment: '' }
  },
  activate: function (done) {
    var resource = this.$resource('/comments/:id');
    resource.get({ id: this.id }, function (comment, stat, req) {
      this.commont =  comment.body

      // activate validator
      this.$activateValidator()
      done()

    }.bind(this)).error(function (data, stat, req) {
      // handle error ...
      done()
    })
  },
  methods: {
    onSave: function () {
      var resource = this.$resource('/comments/:id');
      resource.save({ id: this.id }, { body: this.comment }, function (data, stat, req) {
        // handle success
      }).error(function (data, sta, req) {
        // handle error
      })
    }
  }
})
```

# Custom validator

## Global registration
You can register your custom validator with using `Vue.validator` method. 

> **NOTE:** `Vue.validator` asset is extended from Vue.js' asset managment system.

Detail of the `Vue.validator` method is following:

### Vue.validator(id, [definition])
- **Arguments:**
    - `{String} id`
    - `{Function | Object} [definition]`
- **Return:**
    - validator definition function or object

In validator definition function or `check` of validator definition object, you need to return `true` if valid, else return `false`.

the below the `email` custom validator exmpale:

```javascript
// Register custom validator function. 
// - first argument: field value
// - second argument: rule value (optional). this argument is being passed from specified validator rule with v-validate
Vue.validator('email', function (val/*,rule*/) {
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


# TODO
- async validation
- validate timing customize with options
- server-side validation error applying
- more tests !!
- [and other issues...](https://github.com/vuejs/vue-validator/labels/2.0)


# Contributing
- Fork it !
- Create your top branch from `dev`: `git branch my-new-topic origin/dev`
- Commit your changes: `git commit -am 'Add some topic'`
- Push to the branch: `git push origin my-new-topic`
- Submit a pull request to `dev` branch of `vuejs/vue-validator` repository !


# Testing

    $ npm test


# License

[MIT](http://opensource.org/licenses/MIT)
