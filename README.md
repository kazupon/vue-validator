# vue-validator

[![Build Status](https://travis-ci.org/kazupon/vue-validator.svg?branch=master)](https://travis-ci.org/kazupon/vue-validator)
[![Coverage Status](https://img.shields.io/coveralls/kazupon/vue-validator.svg)](https://coveralls.io/r/kazupon/vue-validator)


Validator component for Vue.js


# Resuqirements
- Vue.js ^`0.11.2`


# Installation

## browserify (npm)
```shell
$ npm install kazupon/vue-validator
```

## bower

```shell
$ bower install vue-validator
```

## component

```shell
$ component install kazupon/vue-validator
```

## duo

```javascript
var validator = require('kazupon/vue-validator')
```


# Usage

```js
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
        <span v-show="validation.comment.minLength">too long your comment.</span>
        <span v-show="validation.comment.maxLength">too short your comment.</span>
    </div>
    <input type="submit" value="send" v-if="valid">
</form>
```



# Data scopes

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

The `valid` keep two types validation result.

### all validator
For example, you can use `valid` as follows

```html
<form id="user-form">
    ID: <input type="text" v-model="id" v-validate="required, minLength: 3, maxLength: 16"><br />
    Password: <input type="password" v-model="password" v-validate="required, minLength: 8 maxLength: 16"><br />
    <input type="submit" value="send" v-if="valid">
    <div>
        <span v-if="validation.id.required">required your ID.</span>
        <span v-if="validation.id.minLength">too short your ID.</span>
        <span v-if="validation.id.minLength">too long your ID.</span>
        <span v-if="validation.password.required">required your password.</span>
        <span v-if="validation.password.minLength">too short your password.</span>
        <span v-if="validation.password.maxLength">too long your password.</span>
    </div>
</form>
```

In the above example, the `valid` keep the validation result of all validator.

### each validator
For example, you can use `valid` as follows

```html
<form id="user-form">
    <div v-class="error: validation.id.valid">
        ID: <input type="text" v-model="id" v-validate="required, minLength: 3, maxLength: 16"><br />
        <span v-if="validation.id.required">required your ID.</span>
        <span v-if="validation.id.minLength">too short your ID.</span>
        <span v-if="validation.id.minLength">too long your ID.</span>
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

In the above example, the `valid` keep the validation result of each validator.

## dirty
The `dirty` keep whether there was a change since initial value of `v-model`.

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


# Directives

## v-validate
- This directive must be used together with `v-model`.

Validate the value of `v-model`. 
You can specify the build-in validator or custom validator to be described later.


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

```html
<form id="user-form">
    Zip: <input type="text" v-model="zip" v-validate="pattern: /^[0-9]{3}-[0-9]{4}$/"><br />
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
        <span v-if="validation.comment.minLength"">too short your comment.</span>
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

```js
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

new MyValidator().$mount('#user-form')
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

*NOTE:
Your custom validator function should return the boolean value (valid -> `true`, invalid -> `false`).*


# Options

## Installation Options

### namespace
You can specify installation options such as the following example.

```js
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

If you did not specify, you can access validation result name as 'valiadtion' (default).

#### valid
Specify `valid` data scope name.

If you specified the `myValid` to namespace option, you can access validation result name as `myValid`.

If you did not specify, you can access validation result name as 'valid' (default).

#### invalid
Specify `invalid` data scope name

If you specified the `myInvalid` to namespace option, you can access validation result name as `myInvalid`.

If you did not specify, you can access validation result name as 'invalid' (default).

#### dirty
Specify `dirty` data scope name

If you specified the `myDirty` to namespace option, you can access validation result name as `myDirty`.

If you did not specify, you can access validation result name as 'dirty' (default).


## Plugin Options
You can specify options such as the following example.

```js
Vue.use(plugin, {
  component: '$myvalidator',
  directive: 'myvalidate'
})
```

### component
Specify vue-validator instance name.

If you specified the `$myvalidator` to plugin option, you can access vue-validator instance name as `$myvalidation` on the viewmodel instance.

If you did not specify, you can access validation result name as '$validator' (default).

### directive
Specify validate directive name.

If you specified the `myvalidate` to plugin option, you can use validation directive name as `v-myvalidate`.

If you did not specify, you can use validation directive name as 'v-validate' (default).


# Testing

```shell
$ git clone git@github.com:kazupon/vue-validator.git
$ npm install
$ make test
```


# TODO
See the `TODO.md`


# License

## MIT

See the `LICENSE`.
