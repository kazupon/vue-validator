# バリデーション可能なフォーム要素

## チェックボックス

チェックボックスのバリデーションに対応:

```html
<div id="app">
  <validator name="validation1">
    <form novalidate>
      <h1>調査</h1>
      <fieldset>
        <legend>どのフルーツが好きですか?</legend>
        <input id="apple" type="checkbox" value="apple" v-validate:fruits="{
          required: { rule: true, message: requiredErrorMsg },
          minlength: { rule: 1, message: minlengthErrorMsg },
          maxlength: { rule: 2, message: maxlengthErrorMsg }
        }">
        <label for="apple">りんご</label>
        <input id="orange" type="checkbox" value="orange" v-validate:fruits>
        <label for="orange">オレンジ</label>
        <input id="grape" type="checkbox" value="grape" v-validate:fruits>
        <label for="grape">ぶどう</label>
        <input id="banana" type="checkbox" value="banana" v-validate:fruits>
        <label for="banana">バナナ</label>
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
      return 'フルーツは必須です!!'
    },
    minlengthErrorMsg: function () {
      return 'フルーツは最低でも1つは選択してください!!'
    },
    maxlengthErrorMsg: function () {
      return 'フルーツは最大で2つ選択してください!!'
    }
  }
})
```

## ラジオボタン

ラジオボタンのバリデーションに対応:

```html
<div id="app">
  <validator name="validation1">
    <form novalidate>
      <h1>調査</h1>
      <fieldset>
        <legend>どのフルーツが好きですか?</legend>
        <input id="apple" type="radio" name="fruit" value="apple" v-validate:fruits="{
          required: { rule: true, message: requiredErrorMsg }
        }">
        <label for="apple">りんご</label>
        <input id="orange" type="radio" name="fruit" value="orange" v-validate:fruits>
        <label for="orange">オレンジ</label>
        <input id="grape" type="radio" name="fruit" value="grape" v-validate:fruits>
        <label for="grape">ぶどう</label>
        <input id="banana" type="radio" name="fruit" value="banana" v-validate:fruits>
        <label for="banana">バナナ</label>
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
      return 'フルーツは必須です!!'
    }
  }
})
```


## セレクトボックス

セレクトボックスのバリデーションに対応:

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
