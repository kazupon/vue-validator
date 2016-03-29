# Validator syntax
`v-validate` directive syntax the below:

    v-validate[:field]="array literal | object literal | binding"

## Field
In vue-validator version 2.0-alpha or earlier, validation relied on `v-model`. In 2.0-alpha and later, use the `v-validate` directive instead.

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
    <input type="text" v-validate:comment="{ minlength: 16, maxlength: 128 }">
    <div>
      <span v-show="$validation.comment.minlength">Your comment is too short.</span>
      <span v-show="$validation.comment.maxlength">Your comment is too long.</span>
    </div>
    <input type="submit" value="send" v-if="valid">
  </form>
</validator>
```

### Caml-case property
As well as [Vue.js](http://vuejs.org/guide/components.html#camelCase_vs-_kebab-case), you can use the kebab-case for `v-validate` models:

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

### Attribute
You can specify the field name to `field` params attribute. This is useful when you need to define the validatable form elements dynamically:

> NOTE: the field part of `v-validate` is optional, when you use `field` params attribute

```html
<div id="app">
  <validator name="validation">
    <form novalidate>
      <p class="validate-field" v-for="field in fields">
      <label :for="field.id">{{field.label}}</label>
      <input type="text" :id="field.id" :placeholder="field.placeholder" field="{{field.name}}" v-validate="field.validate">
      </p>
      <pre>{{ $validation | json }}</pre>
    </form>
  </validator>
</div>
```

```javascript
new Vue({
  el: '#app',
  data: {
    fields: [{
      id: 'username',
      label: 'username',
      name: 'username',
      placeholder: 'input your username',
      validate: { required: true, maxlength: 16 }
    }, {
      id: 'message',
      label: 'message',
      name: 'message',
      placeholder: 'input your message',
      validate: { required: true, minlength: 8 }
    }]
  }
})
```


## Literal

### Array
The below example uses an array literal:

```html
<validator name="validation">
  <form novalidate>
    Zip: <input type="text" v-validate:zip="['required']"><br />
    <div>
      <span v-if="$validation.zip.required">Zip code is required.</span>
    </div>
  </form>
</validator>
```

Since `required` doesn't need to specify any additional rules, this syntax is preferred.


### Object
The below example uses an object literal:

```html
<validator name="validation">
  <form novalidate>
    ID: <input type="text" v-validate:id="{ required: true, minlength: 3, maxlength: 16 }"><br />
    <div>
      <span v-if="$validation.id.required">ID is required</span>
      <span v-if="$validation.id.minlength">Your ID is too short.</span>
      <span v-if="$validation.id.maxlength">Your ID is too long.</span>
    </div>
  </form>
</validator>
```

Object literals allow you to provide rule values. For `required`, as it doesn't need a rule value, you can specily a **dummy rule** instead, as shown.

Alternatively, you can specify a strict object as follows:

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
The below example uses live binding:

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

You can also use computed properties or methods to retrieve rule sets, instead of a set data property.

## Using Terminal Directive Caveats
Note that if you need to use terminal directive like `v-if` and `v-for`, you should be wrapped the validatable target element with the non-visiblity tag like `<template>` tag, because when used together with these terminal directive, `v-validate` directive does not work.

The below example using `<div>` tag:

```javascript
new Vue({
  el: '#app',
  data: {
    enable: true
  }
})
```

```html
<div id="app">
  <validator name="validation">
    <form novalidate>
      <div class="username">
        <label for="username">username:</label>
        <input id="username" type="text" 
               @valid="this.enable = true" 
               @invalid="this.enable = false" 
               v-validate:username="['required']">
      </div>
      <div v-if="enable" class="password">
        <label for="password">password:</label>
        <input id="password" type="password" v-validate:password="{
          required: { rule: true }, minlength: { rule: 8 }
        }"/>
      <div>
    </form>
  </validator>
</div>
```
