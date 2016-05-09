# 异步验证

当在需要进行服务器端验证，可以使用异步验证，如下例：

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
  validators: {
    data () {
      return { checking: false }
    },
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

## 异步验证接口

在异步验证时，可以使用如下两类接口：

### 1. 函数

需要实现一个返回签名为 `function (resolve, reject)` 如同 `promise` 一样的函数的自定义验证器。函数参数解释如下：

- 验证结果
  - 成功时: `resolve`
  - 失败时: `reject`

### 2. promise
需要实现一个返回 `promise` 的自定义验证器。根据验证结果来 `resolve` 或 `reject`。

## 使用错误消息
如上例所示，在服务器端验证错误发生时，可以使用服务器端返回的错误消息。


# 验证器函数 context
验证器函数 context 是绑定到 Validation 对象上的。Validation 对象提供了一些属性，这些属性在实现特定的验证器时有用。

## `vm` 属性
暴露了当前验证所在的 vue 实例。

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

## `el` 属性
暴露了当前验证器的目标 DOM 元素。下面展示了结合 [International Telephone Input](https://github.com/jackocnr/intl-tel-input) jQuery 插件使用的例子：

```javascript
new Vue({
  validators: {
    phone: function (val) {
      return $(this.el).intlTelInput('isValidNumber')
    }
  }
})
```
