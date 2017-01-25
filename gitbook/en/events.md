# Events

Using regular vue event bindings, you can be bound the event that has occured with validator.

You can be handled the event to each field properties for elements that wrapped with `validity`(or `validity-group`) component.

- `valid`: occure when validation result of **each field** became valid
- `invalid`: occure when validation result of **each field** became invalid
- `touched`: occure when **each field** detected `blur` at least once
- `dirty`: occure when the value of **each field** changed from initial value at least once
- `modified`: occure when the value of **each field** changed from initial value

```html
<div id="app">
  <label for="username">username:</label>
  <validity field="username" 
            ref="validity"
            v-model="validation"
            :validators="{ required: true, minlength: 4 }"
            @valid="handleValid" 
            @invalid="handleInvalid" 
            @touched="handleTouched" 
            @dirty="handleDirty" 
            @modified="handleModified">
    <input type="text" @input="$refs.validity.validate()">
  </validity>
  <p>validation errors:</p>
  <div class="errors">
    <p v-if="validation.result.required">required username!!</p>
    <p v-if="validation.result.minlength">too short username!!</p>
  </div>
  <p>validation events:</p>
  <div class="events">
    <p :style="style" :data-event="event.type" v-for="event in events">{{event.timestamp}}: {{event.type}}</p>
  </div>
</div>
```

```javascript
var vm = new Vue({
  data: {
    style: { margin: 0, padding: 0 },
    validation: { result: {} },
    events: []
  },
  methods: {
    handleValid: function () {
      this.handleValidationEvent('valid')
    },
    handleInvalid: function () {
      this.handleValidationEvent('invalid')
    },
    handleTouched: function () {
      this.handleValidationEvent('touched')
    },
    handleDirty: function () {
      this.handleValidationEvent('dirty')
    },
    handleModified: function (e) {
      this.handleValidationEvent('modified')
    },
    handleValidationEvent: function (event) {
      this.events.push({
        timestamp: new Date().getTime(),
        type: event
      })
      this.events.sort(function (a, b) {
        return a.timestamp > b.timestamp ? -1 : 1
      })
    }
  }
}).$mount('#app')
```
