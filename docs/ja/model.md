# v-model インテグレーション
あなたは v-model で更新されたフィールドのバリデートができます:


```html
<div id="app">
  <validator name="validation1">
    <form novalidate>
      message: <input type="text" v-model="msg" v-validate:message="{ required: true, minlength: 8 }"><br />
      <div>
        <p v-if="$validation1.message.required">メッセージは必須です。</p>
        <p v-if="$validation1.message.minlength">メッセージは短すぎです。</p>
      </div>
    </form>
  </validator>
</div>
```

```javascript
var vm = new Vue({
  el: '#app',
  data: {
    msg: ''
  }
})

setTimeout(function () {
  vm.msg = 'hello world!!'
}, 2000)
```
