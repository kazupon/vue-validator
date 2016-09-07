# Async validation

You can use the async validation. This is useful, when you need to use the server-side validation. the below the example:

```html
<template>
  <validator name="validation">
    <form novalidate>
      <h1>user registration</h1>
      <div class="username">
        <label for="username">username:</label>
        <input id="username" type="text" 
          detect-change="off" v-validate:username="{
          required: { rule: true, message: 'required your name !!' },
          exist: { rule: true, initial: 'off' }
        }" />
        <span v-if="checking">checking ...</span>
      </div>
      <div class="errors">
        <validator-errors :validation="$validation"></validator-errors>
      </div>
      <input type="submit" value="register" :disabled="!$validation.valid" />
    </form>
  </validator>
</template>
```

```javascript
function copyOwnFrom (target, source) {
  Object.getOwnPropertyNames(source).forEach(function (propName) {
    Object.defineProperty(target, propName, Object.getOwnPropertyDescriptor(source, propName))
  })
  return target
}

function ValidationError () {
  copyOwnFrom(this, Error.apply(null, arguments))
}
ValidationError.prototype = Object.create(Error.prototype)
ValidationError.prototype.constructor = ValidationError

// exmpale with ES2015
export default {
  data () {
    return { checking: false }
  },
  validators: {
    exist (val) {
      this.vm.checking = true // spinner on
      return fetch('/validations/exist', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: val
        })
      }).then((res) => {
        this.vm.checking = false // spinner off
        return res.json()
      }).then((json) => {
        return Object.keys(json).length > 0 
          ? Promise.reject(new ValidationError(json.message))
          : Promise.resolve()
      }).catch((error) => {
        if (error instanceof ValidationError) {
          return Promise.reject(error.message)
        } else {
          return Promise.reject('unexpected error')
        }
      })
    }
  }
}
```

## Async validation interfaces
In async validation, You can use the two type interfaces:

### 1. function
You need to implement custom validator that return function have `function (resolve, reject)` like promise (future). The following, those argument of the function, you need to use according to validation result.

- validation result
  - successful: `resolve`
  - failed: `reject`

### 2. promise
As mentioned above, You need to implement custom validation that return a promise. you need to `resolve` or `reject` according to validation result.

## Using error message
As mentioned above, when server-side validation error occured, you can use the server-side error message.

> :warning: You must return a **ES6 compatible** promise.

# Validator function context
Validator function context is bind with Validation object. Validation object expose the some properties. These properties is useful when you need to implement specially validation.

## `vm` property
Expose the vue instance of current validation.

the following ES2015 example:
```javascript
new Vue({
  data () { return { checking: false } },
  validators: {
    exist (val) {
      this.vm.checking = true // spinner on
      return fetch('/validations/exist', {
        // ...
      }).then((res) => { // done
        this.vm.checking = false // spinner off
        return res.json()
      }).then((json) => {
        return Promise.resolve()
      }).catch((error) => {
        return Promise.reject(error.message)
      })
    }
  }
})
```

## `el` property
Expose the target DOM element of current validation. In the case, use [International Telephone Input](https://github.com/jackocnr/intl-tel-input) jQuery plugin example:

```javascript
new Vue({
  validators: {
    phone: function (val) {
      return $(this.el).intlTelInput('isValidNumber')
    }
  }
})
```
