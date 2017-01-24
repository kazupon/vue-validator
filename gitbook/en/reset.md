# Reset validation results

You can reset the validation results with `reset()` of `validity` object method. the below the example:

```html
<div id="app">
  <label for="username">username:</label>
  <validity ref="validity" field="username" v-model="validation" :validators="{ required: true, minlength: 4 }">
    <input type="text" @input="$refs.validity.validate()">
  </validity>
  <div class="errors">
    <p class="required" v-if="validation.result.required">required username!!</p>
    <p class="minlength" v-if="validation.result.minlength">too short username!!</p>
  </div>
  <button type="button" @click="$refs.validity.reset()">reset validation</button>
  <div class="result">
    <p>validation result:</p>
    <pre>{{validation}}</pre>
  </div>
</div>
```

```javascript
new Vue({
  data: {
    validation: { result: {} }
  }
}).$mount('#app')
```
