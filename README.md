# vue-validator

[![Build Status](https://travis-ci.org/kazupon/vue-validator.svg?branch=master)](https://travis-ci.org/kazupon/vue-validator) [![Coverage Status](https://img.shields.io/coveralls/kazupon/vue-validator.svg)](https://coveralls.io/r/kazupon/vue-validator)


Validator component for Vue.js


# Installing

```shell
$ component install kazupon/vue-validator
```


# Usage

```js
var Vue = require('vue'),
    validator = require('vue-validator')

Vue.use(validator)
```

```html
<form id="blog-form" v-validate>
    <input type="text" v-model="comment | length min:16 max:128" />
    <div>
        <span v-show="$validation.comment.length.max">too long your comment.</span>
        <span v-show="$validation.comment.length.min">too short your comment.</span>
    </div>
</form>
```

Specify `v-validate` directive, extend as follows:

- `$validation` available in the ViewModel instance
- `$valid` available in the ViewModel instance
- Validate filters available in `v-model`
- Validation result can reference property of `$validation`

*NOTE:
you need to specify `v-validate` at `form` or `div`, containerable tag.*


# $validation
The `$validation` keep the validate result of validation filter per each `v-model`.

```
    $validation.model.filter[.filter_param]
```


For example, if you use `required` validation filter on the comment `v-model`, as follows

```html
<form id="user-form" v-validate>
    Password: <input type="password" v-model="password | required" /><br />
    <div>
        <span v-show="$validation.password.required">required your password.</span>
    </div>
</form>
```


## $valid
The `$valid` keep the validate result of validation in the `v-validate` directive.

For example, you can use `$valid` as follows

```html
<form id="user-form" v-validate>
    ID: <input type="text" v-model="id | required | length min:3 max:16" /><br />
    Password: <input type="password" v-model="password | required | length min:8 max:16" /><br />
    <input type="submit" value="send" v-if="$valid">
    <div>
        <span v-show="$validation.id.required">required your ID.</span>
        <span v-show="$validation.id.length.min">too short your ID.</span>
        <span v-show="$validation.id.length.max">too long your ID.</span>
        <span v-show="$validation.password.required">required your password.</span>
        <span v-show="$validation.password.length.min">too short your password.</span>
        <span v-show="$validation.password.length.max">too long your password.</span>
    </div>
</form>
```


# Validate filters

## required

For example, you can use `resuired` validation filter as follows.

```html
<form id="user-form" v-validate>
    Password: <input type="password" v-model="password | required" /><br />
    <div>
        <span v-show="$validation.password.required">required your password.</span>
    </div>
</form>
```

## pattern

For example, you can use `pattern` validation filter as follows.

```html
<form id="user-form" v-validate>
    Zip: <input type="text" v-model="zip | pattern /^[0-9]{3}-[0-9]{4}$/" /><br />
    <div>
        <span v-show="$validation.zip.pattern">Invalid format of your zip code.</span>
    </div>
</form>
```

## length

For example, you can use `length` validation filter as follows.

```html
<form id="blog-form" v-validate>
    <input type="text" v-model="comment | length min:16 max:128" />
    <div>
        <span v-show="$validation.comment.max">too long your comment.</span>
        <span v-show="$validation.comment.min">too short your comment.</span>
    </div>
</form>
```

## numeric

For example, you can use `numeric` validation filter as follows.

```html
<form id="config-form" v-validate>
    <input type="text" v-model="threshold | numeric min:0 max:100" />
    <div>
        <span v-show="$validation.threshold.numeric.min">too small threshold.</span>
        <span v-show="$validation.threshold.numeric.min">too big threshold.</span>
        <span v-show="$validation.threshold.numeric.value">Invalid threshold value.</span>
    </div>
</form>
```

## validator

For example, you can use `validator` validation filter as follows.

```html
<form id="blog-form" v-validate>
    <input type="text" v-model="comment | validator validateCustom" />
    <div>
        <span v-show="$validation.comment.validator.validateCustom">invalid custom</span>
    </div>
</form>
```

```js
new Vue({
    el: '#blog-form',
    data: {
        comment: ''
    },
    methods: {
        // Specify custom validate function
        validateCustom: function (val) {
            // write custom validation here as follows
            this.$validation['comment.validator.validateCustom'] = !(0 < val.length & val.length < 3)

            return val;
        }
    }
})
```


# Testing

```shell
$ git clone git@github.com:kazupon/vue-validator.git
$ npm install
$ make test
```


# TODO
- Filter name chaging option (Ex: length -> mylength)
- Validation property name chaging option (Ex: $validation -> $my\_validation)


# License

## MIT

See the `LICENSE`.
