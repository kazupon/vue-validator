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
<form id="blog_form" v-validate>
    <input type="text" v-model="comment | length min=16 max=128" />
    <div>
        <span v-show="$validation.comment.length.max">too long your comment.</span>
        <span v-show="$validation.comment.length.min">too short your comment.</span>
    </div>
</form>
```

Specify `v-validate` directive, the below:

- `$validation` in the ViewModel instance become available.
- validate filters become available in `v-model`.

*NOTE:
you need to specify `v-validate` at `form` or `div`, containerable tag.*


# Validate filters

## required

```html
<form id="user_form" v-validate>
    Password: <input type="password" v-model="password | required" /><br />
    <div>
        <span v-show="!$validation.password.required">required your password.</span>
    </div>
</form>
```

## pattern

```html
<form id="user_form" v-validate>
    E-mail: <input type="email" v-model="address | pattern ^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$" /><br />
    <div>
        <span v-show="!$validation.address.pattern">Invalid format of your email address.</span>
    </div>
</form>
```

## length

```html
<form id="blog_form" v-validate>
    <input type="text" v-model="comment | length min=16 max=128" />
    <div>
        <span v-show="!$validation.comment.max">too long your comment.</span>
        <span v-show="!$validation.comment.min">too short your comment.</span>
    </div>
</form>
```

## numeric

```html
<form id="config_form" v-validate>
    <input type="text" v-model="threshold | numeric min=0 max=100" />
    <div>
        <span v-show="!$validation.threshold.numeric.min">too long your comment.</span>
        <span v-show="!$validation.threshold.numeric.min">too short your comment.</span>
    </div>
</form>
```

## custom validator

```html
<form id="blog_form" v-validate>
    <input type="text" v-model="comment | validator validateCustom" />
    <div>
        <span v-show="!$validation.comment.validator.max">too long your comment.</span>
        <span v-show="!$validation.comment.validator.min">too short your comment.</span>
    </div>
</form>
```

```js
new Vue({
    el: '#blog_form',
    data: {
        comment: ''
    },
    methods: {
        // Specify custom validate function
        validateCustom: function (val) {
            if (val.length < 16) {
                this.$validation.comment.validator.min = false;
            }
            if (val.length > 128) {
                this.$validation.comment.validator.max = false;
            }
            
            // other validate logic here ...

            return val;
        }
    }
})
```


# Testing

```shell
$ make test
```


# TODO


# License

See the `LICENSE`.
