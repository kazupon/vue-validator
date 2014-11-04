# vue-validator

[![Build Status](https://travis-ci.org/kazupon/vue-validator.svg?branch=master)](https://travis-ci.org/kazupon/vue-validator)
[![Coverage Status](https://img.shields.io/coveralls/kazupon/vue-validator.svg)](https://coveralls.io/r/kazupon/vue-validator)


Validator component for Vue.js


# Support Vue.js version

`0.11.rc3` later.


# Installing

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
    <input type="text" v-model="comment" v-validate="minLength: 16, maxLength: 128">
    <div>
        <span v-show="validation.comment.minLength">too long your comment.</span>
        <span v-show="validation.comment.maxLength">too short your comment.</span>
    </div>
    <input type="submit" value="send" v-if="valid">
</form>
```


# Directives

## v-validate

- This directive must be used together with `v-model`.
- This directive need to use in `vue-validator` component.


# Validators

## Pre-defined validator

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

### minLength
For example, you can use `minLength` validator as follows.

```html
<form id="blog-form" v-component="vue-validator">
    <input type="text" v-model="comment" v-validate="minLength: 16">
    <div>
        <span v-if="validation.comment.minLength"">too short your comment.</span>
    </div>
</form>
```

### maxLength
For example, you can use `maxLength` validator as follows.

```html
<form id="blog-form" v-component="vue-validator">
    <input type="text" v-model="comment" v-validate="maxLength: 128">
    <div>
        <span v-if="validation.comment.maxLength">too long your comment.</span>
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


# Data scope

## validation
The `validation` keep the validate result of validator per each `v-model`.

```
    validation.model.filter
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
The `valid` keep the validate result of validator in the `vue-validator` component.

For example, you can use `valid` as follows

```html
<form id="user-form" v-component="vue-validator">
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

## dirty


# Plugin options
You can specify options such as the following example.

```js
Vue.use(plugin, {
  component: {
    id: 'my-validator',
    name: 'MyValidator'
  },

  namespace: {
    validation: 'myvalidation',
    valid: 'myvalid',
    dirty: 'mydirty'
  },

  validator: {
    digit: function (val) {
      return /^[\d() \.\:\-\+#]+$/.test(value);
    }
  }
})
```

## default value

```js
{
  component: {
    id: "vue-validator",
    name: "VueValidator"'
  },
  namespace: {
    validation: "validation",
    valid: "valid",
    dirty: "dirty"
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
