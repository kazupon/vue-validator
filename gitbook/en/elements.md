# Form Validatable Elements

## Checkbox

Checkboxes are supported:

### single

```html
<div id="app">
  <validity field="term" 
            ref="validity" 
            v-model="validation" 
            :validators="{ required: { message: requiredErrorMsg } }"
  >
    <input id="term" type="checkbox" @change="$refs.validity.validate()">
  </validity>
  <label for="term">I Accept xxx's Terms of Service Agreement.</label>
  <p class="errors" v-if="validation.result.required">{{validation.result.required}}</p>
</div>
```

```javascript
new Vue({
  data: {
    validation: { result: {} }
  },
  computed: {
    requiredErrorMsg: function () {
      return 'Required Terms of Service Agreement checking!!'
    }
  }
}).$mount('#app')
```

### multiple

```html
<div id="app">
  <h1>Survey</h1>
  <validity-group field="fruits" v-model="validation" :validators="{
    required: { message: requiredErrorMsg },
    minlength: { rule: 1, message: minlengthErrorMsg },
    maxlength: { rule: 2, message: maxlengthErrorMsg }
  }">
    <legend>Which do you like fruit ?</legend>
    <input id="apple" type="checkbox" value="apple" @change="handleValidate" @focusin="handleValidate">
    <label for="apple">Apple</label>
    <input id="orange" type="checkbox" value="orange" @change="handleValidate" @focusin="handleValidate">
    <label for="orange">Orage</label>
    <input id="grape" type="checkbox" value="grage" @change="handleValidate" @focusin="handleValidate">
    <label for="grape">Grape</label>
    <input id="banana" type="checkbox" value="banana" @change="handleValidate" @focusin="handleValidate">
    <label for="banana">Banana</label>
    <ul class="errors">
      <li v-for="error in validation.result.errors">
        <p :class="error.field + '-' + error.validator">{{error.message}}</p>
      </li>
    </ul>
  </validity-group>
</div>
```

```javascript
new Vue({
  data: {
    validation: {
      result: {}
    }
  },
  computed: {
    requiredErrorMsg: function () {
      return 'Required fruit !!'
    },
    minlengthErrorMsg: function () {
      return 'Please chose at least 1 fruit !!'
    },
    maxlengthErrorMsg: function () {
      return 'Please chose at most 2 fruits !!'
    }
  },
  methods: {
    handleValidate: function (e) {
      var $validity = e.target.$validity
      $validity.validate()
    }
  }
}).$mount('#app')
```

## Radio

Radio supported:

```html
<div id="app">
  <h1>Survey</h1>
  <validity-group field="fruits" v-model="validation" :validators="{
    required: { message: requiredErrorMsg }
  }">
    <legend>Which do you like fruit ?</legend>
    <input id="apple" type="radio" name="fruit" value="apple" @change="handleValidate" @focusin="handleValidate">
    <label for="apple">Apple</label>
    <input id="orange" type="radio" name="fruit" value="orange" @change="handleValidate" @focusin="handleValidate">
    <label for="orange">Orage</label>
    <input id="grape" type="radio" name="fruit" value="grage" @change="handleValidate" @focusin="handleValidate">
    <label for="grape">Grape</label>
    <input id="banana" type="radio" name="fruit" value="banana" @change="handleValidate" @focusin="handleValidate">
    <label for="banana">Banana</label>
    <ul class="errors">
      <li v-for="error in validation.result.errors">
        <p :class="error.field + '-' + error.validator">{{error.message}}</p>
      </li>
    </ul>
  </validity-group>
</div>
```

```javascript
new Vue({
  data: {
    validation: {
      result: {}
    }
  },
  computed: {
    requiredErrorMsg: function () {
      return 'Required fruit !!'
    }
  },
  methods: {
    handleValidate: function (e) {
      var $validity = e.target.$validity 
      $validity.validate()
    }
  }
}).$mount('#app')
```


## Select

Select are supported:

### basic

```html
<div id="app">
  <validity ref="validity" field="lang" v-model="validation" :validators="{ required: true }">
    <select @change="$refs.validity.validate()">
      <option value="">----- select your favorite programming language -----</option>
      <option value="javascript">JavaScript</option>
      <option value="ruby">Ruby</option>
      <option value="python">Python</option>
      <option value="perl">Perl</option>
      <option value="lua">Lua</option>
      <option value="go">Go</option>
      <option value="rust">Rust</option>
      <option value="elixir">Elixir</option>
      <option value="c">C</option>
      <option value="none">Not a nothing here</option>
    </select>
  </validity>
  <div class="errors">
    <p v-if="validation.result.required">Required !!</p>
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

### multiple

```html
<div id="app">
  <label for="language">select your favorite programming languages</label><br />
  <validity ref="validity" field="lang" v-model="validation" :validators="{ required: true, maxlength: 3 }">
    <select multiple size="10" @change="$refs.validity.validate()">
      <option value="javascript">JavaScript</option>
      <option value="ruby">Ruby</option>
      <option value="python">Python</option>
      <option value="perl">Perl</option>
      <option value="lua">Lua</option>
      <option value="go">Go</option>
      <option value="rust">Rust</option>
      <option value="elixir">Elixir</option>
      <option value="c">C</option>
      <option value="none">Not a nothing here</option>
    </select>
  </validity>
  <div class="errors">
    <p class="required" v-if="validation.result.required">Required !!</p>
    <p class="maxlength" v-if="validation.result.maxlength">Sorry, The maximum is 3 languages !!</p>
  </div>
</div>
```

```javascript
new Vue({
  data: {
    validation: {
      result: {}
    }
  }
}).$mount('#app')
```
