# vue-validator


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

Specify `v-validate` directive, extend as follow:

- `$validation`available in the ViewModel instance
- Validate filters available in `v-model`
- Validation result can reference property of `$validation`

*NOTE:
you need to specify `v-validate` at `form` or `div`, containerable tag.*


# Validate filters

## required

For example, you can use `resuired` validation filter as follow.

```html
<form id="user-form" v-validate>
    Password: <input type="password" v-model="password | required" /><br />
    <div>
        <span v-show="$validation.password.required">required your password.</span>
    </div>
</form>
```

## pattern

For example, you can use `pattern` validation filter as follow.

```html
<form id="user-form" v-validate>
    E-mail: <input type="email" v-model="address | pattern '/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/'" /><br />
    <div>
        <span v-show="$validation.address.pattern">Invalid format of your email address.</span>
    </div>
</form>
```

## length

For example, you can use `length` validation filter as follow.

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

For example, you can use `numeric` validation filter as follow.

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

## custom validator

For example, you can use `validator` validation filter as follow.

```html
<form id="blog-form" v-validate>
    <input type="text" v-model="comment | validator validateCustom" />
    <div>
        <span v-show="$validation.comment.validator.max">too long your comment.</span>
        <span v-show="$validation.comment.validator.min">too short your comment.</span>
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
            // validate min string length
            this.$validation.comment.validator.min = (val.length < 16);

            // validate max string length
            this.$validation.comment.validator.max = (val.length > 128);
            
            // other validate logic here ...

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


# License

See the `LICENSE`.
