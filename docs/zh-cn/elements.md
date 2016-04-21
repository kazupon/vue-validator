# 可验证的表单元素

## 复选框

支持复选框验证:

```html
<div id="app">
  <validator name="validation1">
    <form novalidate>
      <h1>Survey</h1>
      <fieldset>
        <legend>Which do you like fruit ?</legend>
        <input id="apple" type="checkbox" value="apple" v-validate:fruits="{
          required: { rule: true, message: requiredErrorMsg },
          minlength: { rule: 1, message: minlengthErrorMsg },
          maxlength: { rule: 2, message: maxlengthErrorMsg }
        }">
        <label for="apple">Apple</label>
        <input id="orange" type="checkbox" value="orange" v-validate:fruits>
        <label for="orange">Orage</label>
        <input id="grape" type="checkbox" value="grape" v-validate:fruits>
        <label for="grape">Grape</label>
        <input id="banana" type="checkbox" value="banana" v-validate:fruits>
        <label for="banana">Banana</label>
        <ul class="errors">
          <li v-for="msg in $validation1.fruits.errors">
            <p>{{msg}}</p>
          </li>
        </ul>
      </fieldset>
    </form>
  </validator>
</div>
```

```javascript
new Vue({
  el: '#app',
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
  }
})
```

## 单选按钮

支持单选按钮验证:

```html
<div id="app">
  <validator name="validation1">
    <form novalidate>
      <h1>Survey</h1>
      <fieldset>
        <legend>Which do you like fruit ?</legend>
        <input id="apple" type="radio" name="fruit" value="apple" v-validate:fruits="{
          required: { rule: true, message: requiredErrorMsg }
        }">
        <label for="apple">Apple</label>
        <input id="orange" type="radio" name="fruit" value="orange" v-validate:fruits>
        <label for="orange">Orage</label>
        <input id="grape" type="radio" name="fruit" value="grape" v-validate:fruits>
        <label for="grape">Grape</label>
        <input id="banana" type="radio" name="fruit" value="banana" v-validate:fruits>
        <label for="banana">Banana</label>
        <ul class="errors">
          <li v-for="msg in $validation1.fruits.errors">
            <p>{{msg}}</p>
          </li>
        </ul>
      </fieldset>
    </form>
  </validator>
</div>
```

```javascript
new Vue({
  el: '#app',
  computed: {
    requiredErrorMsg: function () {
      return 'Required fruit !!'
    }
  }
})
```


## 下拉列表

支持下拉列表验证:

```html
<div id="app">
  <validator name="validation1">
    <form novalidate>
      <select v-validate:lang="{ required: true }">
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
      <div class="errors">
        <p v-if="$validation1.lang.required">Required !!</p>
      </div>
    </form>
  </validator>
</div>
```

```javascript
new Vue({ el: '#app' })
```
