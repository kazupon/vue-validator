# vue-validator

[![Build Status](https://travis-ci.org/vuejs/vue-validator.svg?branch=dev)](https://travis-ci.org/vuejs/vue-validator)
[![CircleCI Status](https://circleci.com/gh/vuejs/vue-validator/tree/dev.svg?style=shield&circle-token=36fad1862fbb44da91a28217df8fba769d6d1ce7)](https://circleci.com/gh/vuejs/vue-validator/tree/dev)
[![Coverage Status](https://coveralls.io/repos/vuejs/vue-validator/badge.svg?branch=dev&service=github)](https://coveralls.io/github/vuejs/vue-validator?branch=dev)
[![Sauce Test Status](https://saucelabs.com/buildstatus/vuejs-validator)](https://saucelabs.com/u/vuejs-validator)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)


Validator component for Vue.js


# Requirements
- Vue.js `1.0.10`+

## NOTE
vue-validator is still alpha verison. Maybe, There are some breaking change. 
If you have some feedback, we are welcome in [Vue.js Discussion](http://forum.vuejs.org) :smiley_cat:


# Installation

## npm

### stable version
```shell
$ npm install vue-validator
```

### development version
```shell
git clone https://github.com/vuejs/vue-validator.git node_modules/vue-validator
cd node_modules/vue-validator
npm install
npm run build
```

When used in CommonJS, you must explicitly install the router via `Vue.use()`:
```javascript
var Vue = require('vue')
var VueValidator = require('vue-validator')

Vue.use(VueValidator)
```

You don't need to do this when using the standalone build because it installs itself automatically.

## CDN
jsdelivr
```html
<script src="https://cdn.jsdelivr.net/vue.validator/2.0.0-alpha.8/vue-validator.min.js"></script>
```


# Usage

```javascript
new Vue({
  el: '#app'
})
```

We can use `validator` element directive and `v-validate` directive. The following is an example:

```html
<div id="app">
  <validator name="validation1">
    <form novalidate>
      <input type="text" v-validate:username="['required']">
      <input type="text" v-validate:comment="{ maxlength: 256 }">
      <div>
        <span v-show="$validation1.username.required">Required your name.</span>
        <span v-show="$validation1.comment.maxlength">Your comment is too long.</span>
      </div>
      <input type="submit" value="send" v-if="$validation1.valid">
    </form>
  </validator>
</div>
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
             .messages.field1.validator1
                             ...
                             .validatorX
                      .field2.validator1
                             ...
                             .validatorX
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
                    .messages.validator1
                             ...
                             .validatorX
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
                    .messages.validator1
                             ...
                             .validatorX
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
- `messages`: if invalid field exist, return error message wrapped with object, else `undefined`.

## Top level validation properties
- `valid`: whether **all** fields is valid. if so, then return `true`, else return `false`.
- `invalid`: if invalid field exist even **one** in validate fields, return `true`, else `false`.
- `touched`: whether **all** fields is touched, if so, return `true`, else `false`.
- `untouched`: if untouched field exist even **one** in validate fields, return `true`, else `false`.
- `modified`: if modified field exist even **one** in validate fields, return `true`, else `false`.
- `dirty`: if dirty field exist even **one** in validate fields, return `true`, else `false`.
- `pristine`: whether **all** fields is pristine, if so, return `true`, else `false`.
- `messages`: if invalid even one exist, return all field error message wrapped with object, else `undefined`.


# Validator syntax
`v-validate` directive syntax the below:

```
    v-validate:field="array literal | object literal | binding"
```

## Field
The vue-validator version 2.0-alpha or earlier, validation result had been kept per `v-model`. In 2.0-alpha later, use the argument of `v-validate` directive instead of `v-model`.

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
    <input type="text" v-validate:comment="{ minlength: 16, maxLlngth: 128 }">
    <div>
      <span v-show="$validation.comment.minlength">Your comment is too short.</span>
      <span v-show="$validation.comment.maxlength">Your comment is too long.</span>
    </div>
    <input type="submit" value="send" v-if="valid">
  </form>
</validator>
```

### caml-case property
As well as [Vue.js](http://vuejs.org/guide/components.html#camelCase_vs-_kebab-case), you can use the kebab-case at the argument of `v-validate`.

below the example:

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

## Literal

### Array
The below is example that using array literal:

```html
<validator name="validation">
  <form novalidate>
    Zip: <input type="text" v-validate:zip="['required']"><br />
    <div>
      <span v-if="$validation.zip.required">Required zip code.</span>
    </div>
  </form>
</validator>
```

Like the `required`, if you don't need to specify the rule, you should use it.


### Object
The below is example that using object literal:

```html
<validator name="validation">
  <form novalidate>
    ID: <input type="text" v-validate:id="{ required: true, minlength: 3, maxlength: 16 }"><br />
    <div>
      <span v-if="$validation.id.required">Required Your ID.</span>
      <span v-if="$validation.id.minlength">Your ID is too short.</span>
      <span v-if="$validation.id.maxlength">Your ID is too long.</span>
    </div>
  </form>
</validator>
```

You can specify the rule value on the object literal. Like the `required`, you can specify the **dummy rule** value on the literal object.

And also, you can specify strict object as the below:

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
The below is example that using binding:

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

In addition to the above data scope example, you can specify also the computed property or methods.


# Grouping
You can grouping validation results. the below example:

```html
<validator name="validation1" :groups="['user', 'password']">
  username: <input type="text" group="user" v-validate:username="['required']"><br />
  password: <input type="text" group="password" v-validate:password1="{ minlength: 8, required: true }"/><br />
  password (confirm): <input type="text" group="password" v-validate:password2="{ minlength: 8, required: true }"/>
  <div class="user">
    <span v-if="$validation1.username.required">Required your name.</span>
  </div>
  <div class="password">
    <span v-if="$validation1.password.invalid">Invalid password input !!</span>
  </div>
</validator>
```


# Messages
You can specify error message that can get the validation scope.

```html
<validator name="validation1">
  username: <input type="text" v-validate:username="{
    required: { rule: true, message: 'required you name !!' }
  }"><br />
  password: <input type="text" v-validate:password="{
    required: { rule: true, message: 'required you password !!' },
    minlength: { rule: 8, messsage: 'your password short too !!' }
  }"/><br />
  <div class="errors">
    <ul>
      <li v-for="obj in $validation1.messages">
        <div class="{{$key}}" v-for="msg in obj">
          <p>{{$key}}: {{msg}}</p>
        </div>
      </li>
    </ul>
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
    comment: <input type="text" @valid="onValid" @invalid="onInvalid" v-validate:comment="[required]"/>
  </validator>
</div>
```


# Lazy initialization
When you will use `lazy` attribute on `validator` element directive, you allows initialization (compilation) of `validator` element directive to wait for asynchronous data to be loaded.

The below component example:

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
  activate: function () {
    var resource = this.$resource('/comments/:id');
    resource.get({ id: this.id }, function (comment, stat, req) {
      this.commont =  comment.body

      // activate validator
      this.$activateValidator()

    }.bind(this)).error(function (data, stat, req) {
      // handle error ...
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

As above example, When asynchronous data loading finished, you need to call `$activateValidator` meta method.


# Custom validator
You can register your custom validator with using `Vue.validator`. the below the exmpale:

```javascript
// register custom validator
Vue.validator('email', function (val) {
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
    address: <input type="text" v-validate:address=['email']><br />
    <div>
      <span v-if="$validation1.address.email">invalid your email address format.</span>
    </div>
  <validator>
</div>
```

> **MEMO:** `Vue.validator` asset has been extend from asset managment system of Vue.js.


# TODO
- async validation
- validate timing customize with options
- local asset registration (`compontents` asset-like)
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

```shell
$ npm test
```


# License

[MIT](http://opensource.org/licenses/MIT)
