# Events

Using regular vue event bindings, you can be bound the event that has occured with validator.

## Field validation event

You can be handled the event to each field properties, like `v-validate` directive  specified to `input` tag:

- `valid`: occure when validation result of **each field** became valid
- `invalid`: occure when validation result of **each field** became invalid
- `touched`: occure when **each field** detected `blur` at least once
- `dirty`: occure when the value of **each field** changed from initial value at least once
- `modified`: occure when the value of **each field** changed from initial value

```html
<div id="app">
  <validator name="validation1">
    <div class="comment-field">
      <label for="comment">comment:</label>
      <input type="text" 
             @valid="onValid" 
             @invalid="onInvalid" 
             @touched="onTouched" 
             @dirty="onDirty" 
             @modified="onModified"
             v-validate:comment="['required']"/>
    </div>
    <div>
      <p>{{occuredValid}}</p>
      <p>{{occuredInvalid}}</p>
      <p>{{occuredTouched}}</p>
      <p>{{occuredDirty}}</p>
      <p>{{occuredModified}}</p>
    </div>
  </validator>
</div>
```

```javascript
new Vue({
  el: '#app',
  data: {
    occuredValid: '',
    occuredInvalid: '',
    occuredTouched: '',
    occuredDirty: '',
    occuredModified: ''
  },
  methods: {
    onValid: function () {
      this.occuredValid = 'occured valid event'
      this.occuredInvalid = ''
    },
    onInvalid: function () {
      this.occuredInvalid = 'occured invalid event'
      this.occuredValid = ''
    },
    onTouched: function () {
      this.occuredTouched = 'occured touched event'
    },
    onDirty: function () {
      this.occuredDirty = 'occured dirty event'
    },
    onModified: function (e) {
      this.occuredModified = 'occured modified event: ' + e.modified
    }
  }
})
```

## Top level validation event

You can be handled the event that has occured in the various top-level validation properties:

- `valid`: occure when validation result of **top-level** became valid
- `invalid`: occure when validation result of **top-level** became invalid
- `touched`: occure when **top-level** detected `blur` at least once
- `dirty`: occure when the value of **top-level** changed from initial value at least once
- `modified`: occure when the value of **top-level** changed from initial value

```html
<div id="app">
  <validator name="validation1"
             @valid="onValid"
             @invalid="onInvalid"
             @touched="onTouched"
             @dirty="onDirty"
             @modified="onModified">
    <div class="comment-field">
      <label for="username">username:</label>
      <input type="text" 
             v-validate:username="['required']"/>
    </div>
    <div class="password-field">
      <label for="password">password:</label>
      <input type="password" 
             v-validate:password="{ required: true, minlength: 8 }"/>
    </div>
    <div>
      <p>{{occuredValid}}</p>
      <p>{{occuredInvalid}}</p>
      <p>{{occuredTouched}}</p>
      <p>{{occuredDirty}}</p>
      <p>{{occuredModified}}</p>
    </div>
  </validator>
</div>
```

```javascript
new Vue({
  el: '#app',
  data: {
    occuredValid: '',
    occuredInvalid: '',
    occuredTouched: '',
    occuredDirty: '',
    occuredModified: ''
  },
  methods: {
    onValid: function () {
      this.occuredValid = 'occured valid event'
      this.occuredInvalid = ''
    },
    onInvalid: function () {
      this.occuredInvalid = 'occured invalid event'
      this.occuredValid = ''
    },
    onTouched: function () {
      this.occuredTouched = 'occured touched event'
    },
    onDirty: function () {
      this.occuredDirty = 'occured dirty event'
    },
    onModified: function (modified) {
      this.occuredModified = 'occured modified event: ' + modified
    }
  }
})
```
