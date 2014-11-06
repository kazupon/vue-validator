# vue-validator

[![Build Status](https://travis-ci.org/kazupon/vue-validator.svg?branch=master)](https://travis-ci.org/kazupon/vue-validator)
[![Coverage Status](https://img.shields.io/coveralls/kazupon/vue-validator.svg)](https://coveralls.io/r/kazupon/vue-validator)


Validator component for Vue.js


# Resuqirements
- Vue.js ^`0.11.rc3`


# Installation

## component

```shell
$ component install kazupon/vue-validator
```

## bower

```shell
$ bower install vue-validator
```

## browserify

```shell
$ npm install vue-validator
```


# Usage

```js
var Vue = require('vue')
var validator = require('vue-validator')

Vue.use(validator)
```

Install the plugin with `Vue.use`, `vue-validator` component enable to use, and then we can use `v-validate` directive.

The following is an example.


```html
<form id="blog-form" v-component="vue-validator">
    <input type="text" v-model="comment" v-validate="minlength: 16, maxlength: 128">
    <div>
        <span v-show="validation.comment.minlength">too long your comment.</span>
        <span v-show="validation.comment.maxlength">too short your comment.</span>
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


For example, if you use `required` validator on the comment `v-model`, as follows

```html
<form id="user-form" v-component="vue-validator">
    Password: <input type="password" v-model="password" v-validate="required"><br />
    <div>
        <span v-if="validation.password.required">required your password.</span>
    </div>
</form>
```

## valid
The `valid` keep the validation result of validator in the `vue-validator` component.

The `valid` keep two types validation result.

### all validator
For example, you can use `valid` as follows

```html
<form id="user-form" v-component="vue-validator">
    ID: <input type="text" v-model="id" v-validate="required, minlength: 3, maxlength: 16"><br />
    Password: <input type="password" v-model="password" v-validate="required, minlength: 8 maxlength: 16"><br />
    <input type="submit" value="send" v-if="valid">
    <div>
        <span v-if="validation.id.required">required your ID.</span>
        <span v-if="validation.id.minlength">too short your ID.</span>
        <span v-if="validation.id.minlength">too long your ID.</span>
        <span v-if="validation.password.required">required your password.</span>
        <span v-if="validation.password.minlength">too short your password.</span>
        <span v-if="validation.password.maxlength">too long your password.</span>
    </div>
</form>
```

### each validator
For example, you can use `valid` as follows

```html
<form id="user-form" v-component="vue-validator">
    <div v-class="error: validation.id.valid">
        ID: <input type="text" v-model="id" v-validate="required, minlength: 3, maxlength: 16"><br />
        <span v-if="validation.id.required">required your ID.</span>
        <span v-if="validation.id.minlength">too short your ID.</span>
        <span v-if="validation.id.minlength">too long your ID.</span>
    </div>
    <div v-class="error: validation.password.valid">
        Password: <input type="password" v-model="password" v-validate="required, minlength: 8 maxlength: 16"><br />
        <span v-if="validation.password.required">required your password.</span>
        <span v-if="validation.password.minlength">too short your password.</span>
        <span v-if="validation.password.maxlength">too long your password.</span>
    </div>
    <input type="submit" value="send" v-if="valid">
</form>
```

## dirty
The `dirty` keep whether there was a change since initial value of `v-model` in the `vue-validator` component.

The `valid` keep two types.

### all model
For example, you can use `dirty` as follows

```html
<form id="blog-form" v-component="vue-validator">
    <input type="text" value="" v-model="name" v-validate="required">
    <input type="text" value="hello" v-model="comment" v-validate="maxlength: 128">
    <input type="submit" value="send" v-if="valid && dirty">
    <div>
        <span v-if="validation.name.required">required your name.</span>
        <span v-if="validation.comment.maxlength">too long your comment.</span>
    </div>
</form>
```

### each model
For example, you can use `dirty` as follows

```html
<form id="blog-form" v-component="vue-validator">
    <input type="text" value="hello" v-model="comment" v-validate="maxlength: 128">
    <div>
        <span v-if="validation.comment.valid && validation.comment.dirty">your comment OK !!</span>
    </div>
</form>
```


# Directives

## v-validate
- This directive must be used together with `v-model`.
- This directive need to use in `vue-validator` component.


# Validators

## build-in validator

### required
For example, you can use `required` validator as follows.

```html
<form id="user-form" v-component="vue-validator">
    Password: <input type="password" v-model="password" v-validate="required"><br />
    <div>
        <span v-if="validation.password.required">required your password.</span>
    </div>
</form>
```

### pattern
For example, you can use `pattern` validator as follows.

```html
<form id="user-form" v-component="vue-validator">
    Zip: <input type="text" v-model="zip" v-validate="pattern: /^[0-9]{3}-[0-9]{4}$/"><br />
    <div>
        <span v-if="validation.zip.pattern">Invalid format of your zip code.</span>
    </div>
</form>
```

### minlength
For example, you can use `minlength` validator as follows.

```html
<form id="blog-form" v-component="vue-validator">
    <input type="text" v-model="comment" v-validate="minlength: 16">
    <div>
        <span v-if="validation.comment.minlength"">too short your comment.</span>
    </div>
</form>
```

### maxlength
For example, you can use `maxlength` validator as follows.

```html
<form id="blog-form" v-component="vue-validator">
    <input type="text" v-model="comment" v-validate="maxlength: 128">
    <div>
        <span v-if="validation.comment.maxlength">too long your comment.</span>
    </div>
</form>
```

### min
For example, you can use `min` validator as follows.

```html
<form id="config-form" v-component="vue-validator">
    <input type="text" v-model="threshold" v-validate="min: 0">
    <div>
        <span v-if="validation.threshold.min">too small threshold.</span>
    </div>
</form>
```

### max
For example, you can use `max` validator as follows.

```html
<form id="config-form" v-component="vue-validator">
    <input type="text" v-model="threshold" v-validate="max: 100">
    <div>
        <span v-if="validation.threshold.max">too big threshold.</span>
    </div>
</form>
```


## User custome validator

In addition to build-in validator, you can use custom validator.

The following custom validator

```html
<form id="user-form" v-component="vue-validator">
    name: <input type="text" v-model="name" v-validate="required"><br />
    address: <input type="text" v-model="address" v-validate="email"><br />
    <input type="submit" value="send" v-if="valid && dirty">
    <div>
        <span v-if="validation.name.required">required your name.</span>
        <span v-if="validation.address.email">invalid your email address format.</span>
    </div>
</form>
```

```js
new Vue({
  data: {
    name: '',
    address: ''
  },
  validator: {
    email: function (val) {
      return (/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(val)"])"])))
    }
  }
}).$mount('#user-form')
```


# Plugin options
You can specify options such as the following example.

```js
Vue.use(plugin, {
  // component
  component: {
    id: 'my-validator', // specify id of Vue.component
    name: 'MyValidator' // specify Vue component name
  },

  // namespace of data scope
  namespace: {
    validation: 'myvalidation', // specify `validation` data scope name
    valid: 'myvalid', // specify `valid` data scope name
    dirty: 'mydirty' // specify `dirty` data scope name
  }
})
```

## default value

```js
{
  component: {
    id: 'vue-validator',
    name: 'VueValidator'
  },
  namespace: {
    validation: 'validation',
    valid: 'valid',
    dirty: 'dirty'
  }
}
```


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
