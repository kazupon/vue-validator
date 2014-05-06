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

// set plugin
Vue.use(validator, {
    // options ...
})

// create instance
new Vue({
    el: '#form1'
})
```

```html
<form id="form1" name="form">
    E-mail: <input type="email" v-model="user.email" v-validate="onValidateEmail" name="email" /><br />
    <div>
        <span v-show="$validation.email.required">Tell us your email.</span>
        <span v-show="$validation.email.invalid">This is not a valid email.</span>
    </div>
</form>
```


# Testing

```shell
$ make test
```


# TODO


# License

See the `LICENSE`.
