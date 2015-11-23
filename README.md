# vue-validator

[![Build Status](https://travis-ci.org/vuejs/vue-validator.svg?branch=dev)](https://travis-ci.org/vuejs/vue-validator)
[![Coverage Status](https://coveralls.io/repos/vuejs/vue-validator/badge.svg?branch=dev&service=github)](https://coveralls.io/github/vuejs/vue-validator?branch=dev)
[![Sauce Test Status](https://saucelabs.com/buildstatus/vuejs-validator)](https://saucelabs.com/u/vuejs-validator)


Validator component for Vue.js


# Requirements
- Vue.js `1.0.8`+

## NOTE
vue-validator is still alpha verison. Maybe, There are some breaking change. 
If you have some feedback, we are welcome in [Vue.js Discussion](http://forum.vuejs.org) :smiley_cat:


# Installation

## npm
```shell
$ npm install vue-validator
```

## CDN

```html
<script src="http://cdn.jsdelivr.net/vue.validator/2.0.0-alpha.3/vue-validator.min.js"></script>
```


# Usage

```javascript
var Vue = require('vue')
var validator = require('vue-validator')

Vue.use(validator)
```

Install the plugin with `Vue.use`, we can use `validator` element directive and `v-validate` directive. The following is an example:

```html
<validator name="validation1">
  <form novalidate>
    <input type="text" v-validate:username.required>
    <input type="text" v-validate:comment.maxlength="256">
    <div>
      <span v-show="$validation1.username.required">Rquired your name.</span>
      <span v-show="$validation1.comment.maxlength">Your comment is too long.</span>
    </div>
    <input type="submit" value="send" v-if="$validation1.valid">
  </form>
</validator>
```

The validation results keep to validation scope as defined with vue-validator. In above case, the validation results keep to `$validation1` scope (prefixed with `$`) which was specified with `name` attribute of `validator` element directive.


# Validation result structure
The structure of validation results that was kept to validation scope is the below:

```
  $validation.valid
             .invalid
             .touched
             .untouched
             .dirty
             .pristine
             .modified
             .field1.validator1
                    ...
                    .validatorX
                    .valid
                    .invalid
                    .touched
                    .untouched
                    .dirty
                    .pristine
                    .modified
             ...
             .fieldX.validator1
                    ...
                    .validatorX
                    .valid
                    .invalid
                    .touched
                    .untouched
                    .dirty
                    .pristine
                    .modified
```

The various top-level properties has been defined in the validation scope, and the each field validation result has been defined as field namespace.

## Field validation properties
- `valid`: whether field is valid. if it's valid, then return `true`, else return `false`.
- `invalid`: reverse of `valid`.
- `touched`: whether field is touched. if field was focused, return `true`, else return `false`.
- `untouched`: reverse of `touched`.
- `modified`: whether field value is modified. if field value was changed from **initial** value, return `true`, else return `false`.
- `dirty`: whether field value was changed at least **once**. if so, return `true`, else return `false`.
- `pristine`: reverse of `dirty`.
- `errors`: WIP

## Top level validation properties
- `valid`: whether **all** fields is valid. if so, then return `true`, else return `false`.
- `invalid`: if invalid field exist even **one** in validate fields, return `true`, else `false`.
- `touched`: whether **all** fields is touched, if so, return `true`, else `false`.
- `untouched`: if untouched field exist even **one** in validate fields, return `true`, else `false`.
- `modified`: if modified field exist even **one** in validate fields, return `true`, else `false`.
- `dirty`: if dirty field exist even **one** in validate fields, return `true`, else `false`.
- `pristine`: whether **all** fields is pristine, if so, return `true`, else `false`.
- `errors`: WIP


# Validator syntax
`v-validate` directive syntax the below:

```
    v-validate:field.[validator]+[="primitive literal | object literal | binding"]
```

## Literal

### Primitive
The below is example that using literal of string value:

```html
<validator name="validation">
  <form novalidate>
    Zip: <input type="text" v-validate:zip.pattern="'/^[0-9]{3}-[0-9]{4}$/'"><br />
    <div>
      <span v-if="$validation.zip.pattern">Invalid format of your zip code.</span>
    </div>
  </form>
</validator>
```

### Object
The below is example that using object literal:

```html
<validator name="validation">
  <form novalidate>
    ID: <input type="text" v-validate:id.minlength.maxlength="{ minlength: 3, maxlength: 16 }"><br />
    <div>
      <span v-if="$validation.id.minlength">Your ID is too short.</span>
      <span v-if="$validation.id.maxlength">Your ID is too long.</span>
    </div>
  </form>
</validator>
```

## Binding
The below is example that using binding:

```javascript
new Vue({
  el: '#app',
  data: {
    rules: {
      minlength: 3,
      manlength: 16
    }
  }
})
```
```html
<div id="app">
  <validator name="validation">
    <form novalidate>
      ID: <input type="text" v-validate:id.minlength.maxlength="rules"><br />
      <div>
        <span v-if="$validation.id.minlength">Your ID is too short.</span>
        <span v-if="$validation.id.maxlength">Your ID is too long.</span>
      </div>
    </form>
  </validator>
</div>
```

In addition to the above data scope example, you can specify also the computed property or methods.


# Grouping
You can grouping validation results. the below example:

```html
<validator name="validation1" :groups="['user', 'password']">
  username: <input type="text" group="user" v-validate:username.required><br />
  password: <input type="text" group="password" v-validate:password1.required.minlength="{ minlength: 8 }"/><br />
  password (confirm): <input type="text" group="password" v-validate:password2.required.minlength="{ minlength: 8 }"/>
  <div class="user">
    <span v-if="$validation1.username.required">Required your name.</span>
  </div>
  <div class="password">
    <span v-if="$validation1.password.invalid">Invalid password input !!</span>
  </div>
</validator>
```


# Event
You can handle the `valid` event and `invalid` event. the below example:

```javascript
new Vue({
  el: '#app',
  methods: {
    onValid: function () {
      console.log('occured valid event')
    },
    onInvalid: function () {
      console.log('occured invalid event')
    }
  }
})
```
```html
<div id="app">
  <validator name="validation1">
    comment: <input type="text" @valid="onValid" @invalid="onInvalid" v-validate:comment.required/>
  </validator>
</div>
```


# Custom validator with Assets
You can register your custom validator with using `Vue.validator`. the below the exmpale:

```javascript
// register custom validator
Vue.validate('email', function (val) {
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
    address: <input type="text" v-validate:address.email><br />
    <div>
      <span v-if="$validation1.address.email">invalid your email address format.</span>
    </div>
  <validator>
</div>
```

> **MEMO:** `Vue.validate` asset is extended by vue-validator.


# TODO
- async validation
- errors properties
- validate timing customize with options
- local asset registration (`compontents` asset-like)
- server-side validation error applying
- more tests !!
- [and other issues...](https://github.com/vuejs/vue-validator/labels/2.0)
- some chores (babel6, switch circle ci ...)


# Contributing
- Fork it !
- Create your top branch from `dev`: `git branch my-new-topic origin/dev`
- Commit your changes: `git commit -am 'Add some topic'`
- Push to the branch: `git push origin my-new-topic`
- Submit a pull request to `dev` branch of `vuejs/vue-validator` repository !


# Testing

```shell
$ npm test
```


# License

[MIT](http://opensource.org/licenses/MIT)
