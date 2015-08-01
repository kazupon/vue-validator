# vue-validator

[![Build Status](https://travis-ci.org/vuejs/vue-validator.svg?branch=master)](https://travis-ci.org/vuejs/vue-validator)
[![Coverage Status](https://img.shields.io/coveralls/vuejs/vue-validator.svg)](https://coveralls.io/r/vuejs/vue-validator)
[![Sauce Test Status](https://saucelabs.com/buildstatus/vuejs-validator)](https://saucelabs.com/u/vuejs-validator)


Validator component for Vue.js


# Requirements
- Vue.js ^`0.12.0`


# Installation

## Standalone

### CDN

```html
<script src="http://cdn.jsdelivr.net/vue.validator/1.4.1/vue-validator.min.js"></script>
```

### Package Manager

## npm
```shell
$ npm install vue-validator
```

## bower

```shell
$ bower install vue-validator
```

## duo

```javascript
var validator = require('vuejs/vue-validator')
```


# Usage

```javascript
var Vue = require('vue')
var validator = require('vue-validator')

Vue.use(validator)
```

Install the plugin with `Vue.use`, we can use `v-validate` directive.

The following is an example.


```html
<form id="blog-form">
  <input type="text" v-model="comment" v-validate="minLength: 16, maxLength: 128">
  <div>
    <span v-show="validation.comment.minLength">Your comment is too short.</span>
    <span v-show="validation.comment.maxLength">Your comment is too long.</span>
  </div>
  <input type="submit" value="send" v-if="valid">
</form>
```



# Properties

## validation
The `validation` keep the validation result of validator per each `v-model`.

The following format 

```
    validation.model.validator
```


For example, if you use `required` validator on the password `v-model`, as follows

```html
<form id="user-form">
  Password: <input type="password" v-model="password" v-validate="required"><br />
  <div>
    <span v-if="validation.password.required">required your password.</span>
  </div>
</form>
```

## valid
The `valid` keep the validation result of validator.

- type: Boolean
    - true: success
    - false: failed

The `valid` keep two types validation result.

### all models validation
For example, you can use `valid` as follows

```html
<form id="user-form">
  ID: <input type="text" v-model="id" v-validate="required, minLength: 3, maxLength: 16"><br />
  Password: <input type="password" v-model="password" v-validate="required, minLength: 8, maxLength: 16"><br />
  <input type="submit" value="send" v-if="valid">
  <div>
    <span v-if="validation.id.required">Your ID is required.</span>
    <span v-if="validation.id.minLength && id">Your ID is too short.</span>
    <span v-if="validation.id.maxLength">Your ID is too long.</span>
    <span v-if="validation.password.required">Password is required.</span>
    <span v-if="validation.password.minLength && password">Your password is too short.</span>
    <span v-if="validation.password.maxLength">Your password is too long.</span>
  </div>
</form>
```

In the above example, the `valid` keep the validation result of all validator.

### each model validation
For example, you can use `valid` as follows

```html
<form id="user-form">
  <div v-class="error: validation.id.valid">
    ID: <input type="text" v-model="id" v-validate="required, minLength: 3, maxLength: 16"><br />
    <span v-if="validation.id.required">required your ID.</span>
    <span v-if="validation.id.minLength">too short your ID.</span>
    <span v-if="validation.id.maxLength">too long your ID.</span>
  </div>
  <div v-class="error: validation.password.valid">
    Password: <input type="password" v-model="password" v-validate="required, minLength: 8 maxLength: 16"><br />
    <span v-if="validation.password.required">required your password.</span>
    <span v-if="validation.password.minLength">too short your password.</span>
    <span v-if="validation.password.maxLength">too long your password.</span>
  </div>
  <input type="submit" value="send" v-if="valid">
</form>
```

## invalid
The `invalid` (reverse of `valid`) keep the validation result of validator. 

- type: Boolean
    - true: failed
    - false: success

The `invalid` keep two types validation result.

### all models validation
The `invalid` keep the validation result of all validator (See the example of `valid`).

### each model validation
The `invalid` keep the validation result of each validator (See the example of `valid`).


## dirty
The `dirty` keep whether there was a change since initial value of `v-model`.

- type: Boolean
    - true: changed from the initial data
    - false: not changed from the initial data

The `dirty` keep two types.

### each model
For example, you can use `dirty` as follows

```html
<form id="blog-form">
  <input type="text" value="hello" v-model="comment" v-validate="maxLength: 128">
  <div>
    <span v-if="validation.comment.valid && validation.comment.dirty">your comment OK !!</span>
  </div>
</form>
```

In the above example, the `dirty` keep the per each `v-model`.

### all models
The `dirty` keep the result of all moedls.

If you has some model properties, when any one property is dirty, it return `true`.

For example, you can use `dirty` as follows

```html
<form id="user-form">
  ID: <input type="text" v-model="id" v-validate="required, minLength: 3, maxLength: 16"><br />
  Password: <input type="password" v-model="password" v-validate="required, minLength: 8 maxLength: 16"><br />
  <input type="submit" value="send" v-if="valid && dirty">
</form>
```

In the above example, the `dirty` keep the all `v-model`.


# Directives

## v-validate
- This directive must be used together with `v-model`.
- This directive accepts a property of viewmodel.
- Directive params: wait-for

Validate the value of `v-model`. 
You can specify the build-in validator or custom validator to be described later.

### Reactivity
You can specify the property of viewmodel as validator reactive argument to expression of directive.

For Example:

```html
<form id="config-form">
  <input type="text" v-model="threshold" v-validate="min: minValue, max: maxValue">
</form>
```

```javascript
new Vue({
  data: {
    threshold: 50,
    minValue: 0, // for `min` validator
    maxValue: 100 // for `max` validator
  },
  ready: function () {
    // change validator argument
    this.$set('min', -50)
    this.$set('max', 100)
  }
}).$mount('#config-form')
```

> **NOTE:**
In current version, not support {{ mustache }} expressions.

Of course, you can specify computed properties and method that was defined `methods` in Vue instance.

The following is an example that using a custom validator:

```html
<style>.error { border: solid #ff0000; }</style>
<form id="demo">
  <label for="response">How do you want to respond ?</label>
  <input id="response_approve" 
         checked="checked" 
         name="response" 
         type="radio" 
         value="approve" 
         v-model="response">
  <label for="response_approve">approve</label>
  <input id="response_decline" 
         name="response" 
         type="radio" 
         value="decline" 
         v-model="response">
  <label for="response_decline">decline</label>
  
  <div v-show="conditionalField(response, 'approve')" 
       v-class="error: validation.message.approve.invalid">
    <label for="approved_message">Approved message</label>
    <input type="text" 
           id="approved_message" 
           name="approved_message" 
           v-model="message.approve" 
           v-validate="requiredIf: conditionalField(response, 'approve'), maxLength: 100">
  </div>
  
  <div v-show="conditionalField(response, 'decline')" 
       v-class="error: validation.message.decline.invalid">
    <label for="declined_message">Declined message</label>
    <input type="text" 
           id="declined_message" 
           name="declined_message" 
           v-model="message.decline" 
           v-validate="requiredIf: conditionalField(response, 'decline'), maxLength: 100">
  </div>
      
  <div><input type="submit" v-if="validFiled"></div>
</form>
```

```javascript
new Vue({
  data: {
    response: '',
    message: {
      approve: '',
      decline: ''
    }
  },
  computed: {
    validFiled: function () {
      return this.validation.message.approve.valid ||
             this.validation.message.decline.valid
    }
  },
  validator: {
    validates: {
      requiredIf: function (val, condition){
        return val && condition
      }
    }
  },
  methods: {
    conditionalField: function (response, type) {
      return response === type
    }
  }
}).$mount('#demo')
```

### Lazy initialization
when you will use `wait-for` attribute, you allows initialization of validation to wait for asynchronous data to be loaded.
You can specify an event name that is occured by `$emit` at `created`, `compiled` or `ready` hook.

For example:

```html
<form id="user-profile">
  name: <input type="text" v-model="name" wait-for="name-loaded" v-validate="required"><br />
  email: <input type="text" v-model="email" wait-for="email-loaded" v-validate="email"><br />
  <input type="submit" value="send" v-if="valid && dirty">
</form>
```

```javascript
new Vue({
  data: {
    name: '',
    email: ''
  },
  ready: function () {
    var self = this
    
    // ...

    // load user profile data with ajax (example: vue-resource)
    var resource = this.$resource('/users/:id')
    resource.get({ id: 1 }, function (data, status, request) {
      // ...

      // emit the event that was specified 'wait-for' attribute
      self.$emit('name-loaded', data.name)
      self.$emit('email-loaded', data.email)

      // ...
    }).error(function (data, status, request) {
      // handle error
      // ...
    })
  }
}).$mount('#user-profile')
```

`$emit` of interface conventions are as follows:

```javascript
    vm.$emit( eventName, propVal ) 
```

- **eventName**: the event name that was specified with 'wait-for' attribute
- **propVal**: the property value that is initialized of validation


# Validators

## build-in validator

### required
For example, you can use `required` validator as follows.

```html
<form id="user-form">
  Password: <input type="password" v-model="password" v-validate="required"><br />
  <div>
    <span v-if="validation.password.required">required your password.</span>
  </div>
</form>
```

### pattern
For example, you can use `pattern` validator as follows.

> **NOTE:**
v1.1.0 later, the usage of some existing `pattern` will have to be enclosed in single quotes.

```html
<form id="user-form">
  Zip: <input type="text" v-model="zip" v-validate="pattern: '/^[0-9]{3}-[0-9]{4}$/'"><br />
  <div>
    <span v-if="validation.zip.pattern">Invalid format of your zip code.</span>
  </div>
</form>
```

### minLength
For example, you can use `minLength` validator as follows.

```html
<form id="blog-form">
  <input type="text" v-model="comment" v-validate="minLength: 16">
  <div>
    <span v-if="validation.comment.minLength">too short your comment.</span>
  </div>
</form>
```

### maxLength
For example, you can use `maxLength` validator as follows.

```html
<form id="blog-form">
  <input type="text" v-model="comment" v-validate="maxLength: 128">
  <div>
    <span v-if="validation.comment.maxLength">too long your comment.</span>
  </div>
</form>
```

### min
For example, you can use `min` validator as follows.

```html
<form id="config-form">
  <input type="text" v-model="threshold" v-validate="min: 0">
  <div>
    <span v-if="validation.threshold.min">too small threshold.</span>
  </div>
</form>
```

### max
For example, you can use `max` validator as follows.

```html
<form id="config-form">
  <input type="text" v-model="threshold" v-validate="max: 100">
  <div>
    <span v-if="validation.threshold.max">too big threshold.</span>
  </div>
</form>
```


## User custom validator

Additionally, you can use custom validator.

The following custom validator

```javascript
var MyComponent = Vue.extend({
  data: {
    name: '',
    address: ''
  },
  validator: {
    validates: {
      email: function (val) {
        return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val)
      }
    }
  }
})

new MyComponent().$mount('#user-form')
```

```html
<form id="user-form">
  name: <input type="text" v-model="name" v-validate="required"><br />
  address: <input type="text" v-model="address" v-validate="email"><br />
  <input type="submit" value="send" v-if="valid && dirty">
  <div>
    <span v-if="validation.name.required">required your name.</span>
    <span v-if="validation.address.email">invalid your email address format.</span>
  </div>
</form>
```

You need to specify custom validator function to `validates` of `validator` installation option.
If so, you can use validation result of custom validator.

> NOTE:
Your custom validator function should return the boolean value (valid -> `true`, invalid -> `false`).

## Async validation

You can implement async validation.

Example:

```html
<form id="user-registration">
  username: <input type="text" v-model="username" v-validate="exist"><br />
  <input type="submit" value="send" v-if="valid && dirty">
  <div>
    <span v-if="validation.username.exist">already exist username.</span>
  </div>
</form>
```

```javascript
new Vue({
  data: { username: '' },
  validator: {
    validates: {
      exist: function (val) {
        return function (resolve, reject) {
          // server-side validation with ajax (e.g. using `fetch` case)
          fetch('/validators/exist', {
            method: 'post',
            headers: {
              'content-type': 'application/json',
              'x-token': 'xxxxxxxx'
            },
            body: JSON.stringify({ username: val })
          }).then(function (res) {
            if (res.status === 200) {
              resolve()
            } else if (res.status === 400) {
              // something todo ...
            }
          }).catch(function (err) {
            // something todo ...
            reject()
          })
        }
      }
    }
  }
}).$mount('#user-registration')
```

You need to implement custom validator that return function have `function (resolve, reject)` like promise (future).
The following, those argument of the function, you need to use according to validation result.

- validation result
    - successful: `resolve`
    - failed: `reject`


# Options

## Installation Options

### namespace
You can specify installation options such as the following example.

```javascript
var MyComponent = Vue.extend({
  ...
  validator: {
    namespace: {
      validation: 'myValidation', 
      valid: 'myValid', 
      invalid: 'myInvalid', 
      dirty: 'myDirty'
    }
  }
  ...
})
```

#### validation
Specify `validation` data scope name.

If you specified the `myValidation` to namespace option, you can access validation result name as `myValidation`.

If you did not specify, you can access validation result name as `valiadtion` (default).

#### valid
Specify `valid` data scope name.

If you specified the `myValid` to namespace option, you can access validation result name as `myValid`.

If you did not specify, you can access validation result name as `valid` (default).

#### invalid
Specify `invalid` data scope name

If you specified the `myInvalid` to namespace option, you can access validation result name as `myInvalid`.

If you did not specify, you can access validation result name as `invalid` (default).

#### dirty
Specify `dirty` data scope name

If you specified the `myDirty` to namespace option, you can access validation result name as `myDirty`.

If you did not specify, you can access validation result name as `dirty` (default).


## Plugin Options
You can specify options such as the following example.

```javascript
Vue.use(plugin, {
  component: '$myvalidator',
  directive: 'myvalidate'
})
```

### component
Specify vue-validator instance name.

If you specified the `$myvalidator` to plugin option, you can access vue-validator instance name as `$myvalidation` on the viewmodel instance.

If you did not specify, you can access validation result name as `$validator` (default).

### directive
Specify validate directive name.

If you specified the `myvalidate` to plugin option, you can use validation directive name as `v-myvalidate`.

If you did not specify, you can use validation directive name as `v-validate` (default).


# Contributing
- Fork it !
- Create your top branch from `dev`: `git branch my-new-topic origin/dev`
- Commit your changes: `git commit -am 'Add some topic'`
- Push to the branch: `git push origin my-new-topic`
- Submit a pull request to `dev` branch of `vuejs/vue-validator` repository !


# Testing

```shell
$ make test
```


# License

[MIT](http://opensource.org/licenses/MIT)
