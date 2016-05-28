# 非同期バリデーション

非同期のバリデーションを使用することができます。これはサーバーサイドバリデーションのように使用するときに便利です。下記は例です:

```html
<template>
  <validator name="validation">
    <form novalidate>
      <h1>user registration</h1>
      <div class="username">
        <label for="username">username:</label>
        <input id="username" type="text" 
          detect-change="off" v-validate:username="{
          required: { rule: true, message: '名前は必須です!!' },
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

// ES2015 での例
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

## 非同期バリデーションインターフェース
非同期バリデーションでは、2種類のインターフェースを使用することができます:

### 1. function
promise のように `function (resolve, reject)` を持つ関数を返すカスタムバリデーターを実装する必要があります。関数の引数では、次の通りのバリデーション結果に従って使う必要があります。

- バリデーション結果
  - 成功: `resolve`
  - 失敗: `reject`

### 2. promise
上記で指摘した通り、 promise を返すカスタムバリデーションを実装する必要があります。バリデーション結果に従って `resolve` 又は `reject` する必要があります。

## エラーメッセージの使い方
上記で指摘したとおり、サーバーサイドバリデーションのエラーを発生させた場合は、サーバーサイドのエラーメッセージを使用することができます。

> :warning: **ES6 互換** promise を返さなくてはいけません。

# バリデーター関数コンテキスト
バリデーター関数のコンテキストはバリデーションオブジェクトにバインドされます。バリデーションオブジェクトはいくつかのプロパティを公開します。これらのプロパティは特別なバリデーションを実装する必要がある場合に便利です。

## `vm` プロパティ
現在のバリデーションの vue インスタンスを公開してください。

ES2015 の例は次の通りです:
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

## `el` プロパティ
現在のバリデーションの対象 DOM エレメントを公開してください。この場合では jQuery プラグインの [International Telephone Input](https://github.com/jackocnr/intl-tel-input)を例に使用します:

```javascript
new Vue({
  validators: {
    phone: function (val) {
      return $(this.el).intlTelInput('isValidNumber')
    }
  }
})
```
