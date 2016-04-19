# v-model integration
You can validate the field that updated with v-model:

```html
<div id="app">
  <validator name="validation1">
    <form novalidate>
      message: <input type="text" v-model="msg" v-validate:message="{ required: true, minlength: 8 }"><br />
      <div>
        <p v-if="$validation1.message.required">Required your message.</p>
        <p v-if="$validation1.message.minlength">Too short message.</p>
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
