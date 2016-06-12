# API Reference

## ビルドインバリデータ

### required

- **要素:**
    - `input[type="text"]`
    - `input[type="radio"]`
    - `input[type="checkbox"]`
    - `input[type="number"]`
    - `input[type="password"]`
    - `input[type="email"]`
    - `input[type="tel"]`
    - `input[type="url"]`
    - `select`
    - `textarea`

- **使用方法:**

    値が指定されているかどうかチェックします。

- **例:**

    ```html
    <!-- array syntax -->
    <input type="text" v-validate:zip="['required']">

    <!-- object syntax -->
    <!-- NOTE: 'rule' need the dummy value -->
    <input type="text" v-validate:zip="{ required: { rule: true } }">

    <!-- radio -->
    <fieldset>
      <legend>Which do you like fruit ?</legend>
      <input id="apple" type="radio" name="fruit" value="apple" v-validate:fruits="{ required: { rule: true } }">
      <label for="apple">Apple</label>
      <input id="orange" type="radio" name="fruit" value="orange" v-validate:fruits>
      <label for="orange">Orage</label>
      <input id="grape" type="radio" name="fruit" value="grage" v-validate:fruits>
      <label for="grape">Grape</label>
      <input id="banana" type="radio" name="fruit" value="banana" v-validate:fruits>
      <label for="banana">Banana</label>
    </fieldset>

    <!-- checkbox -->
    <fieldset>
      <legend>Which do you like fruit ?</legend>
      <input id="apple" type="checkbox" value="apple" v-validate:fruits="{ required: { rule: true } }">
      <label for="apple">Apple</label>
      <input id="orange" type="checkbox" value="orange" v-validate:fruits>
      <label for="orange">Orage</label>
      <input id="grape" type="checkbox" value="grage" v-validate:fruits>
      <label for="grape">Grape</label>
      <input id="banana" type="checkbox" value="banana" v-validate:fruits>
      <label for="banana">Banana</label>
    </fieldset>

    <!-- select -->
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
    ```

### pattern

- **要素:**
    - `input[type="text"]`
    - `input[type="number"]`
    - `input[type="password"]`
    - `input[type="email"]`
    - `input[type="tel"]`
    - `input[type="url"]`
    - `textarea`

- **使用方法:**

    指定された値が正規表現かどうかチェックします。

- **例:**

    ```html
    <input type="text" v-validate:zip="{ pattern: '/^\d{3}-\d{4}$/' }">
    ```

### minlength

- **要素:**
    - `input[type="text"]`
    - `input[type="checkbox"]`
    - `input[type="number"]`
    - `input[type="password"]`
    - `input[type="email"]`
    - `input[type="tel"]`
    - `input[type="url"]`
    - `select`
    - `textarea`

- **使用方法:**

    指定された値の長さが最初以下の長さかどうかチェックします。

- **例:**

    ```html
    <input type="password" v-validate:password="{ minlength: 8 }"/>

    <!-- checkbox (multiple) -->
    <fieldset>
      <legend>Which do you like fruit ?</legend>
      <input id="apple" type="checkbox" value="apple" v-validate:fruits="{ minlength: 1 }">
      <label for="apple">Apple</label>
      <input id="orange" type="checkbox" value="orange" v-validate:fruits>
      <label for="orange">Orage</label>
      <input id="grape" type="checkbox" value="grage" v-validate:fruits>
      <label for="grape">Grape</label>
      <input id="banana" type="checkbox" value="banana" v-validate:fruits>
      <label for="banana">Banana</label>
    </fieldset>

    <!-- select (multiple) -->
    <select multiple size="10" v-validate:lang="{ minlength: 3 }">
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
    ```

### maxlength

- **要素:**
    - `input[type="text"]`
    - `input[type="checkbox"]`
    - `input[type="number"]`
    - `input[type="password"]`
    - `input[type="email"]`
    - `input[type="tel"]`
    - `input[type="url"]`
    - `select`
    - `textarea`

- **使用方法:**

    指定された値の長さが最大以上の長さかどうかチェックします。

- **例:**

    ```html
    <input type="text" v-validate:comment="{ maxlength: 256 }"/>

    <!-- checkbox (multiple) -->
    <fieldset>
      <legend>Which do you like fruit ?</legend>
      <input id="apple" type="checkbox" value="apple" v-validate:fruits="{ maxlength: 3 }">
      <label for="apple">Apple</label>
      <input id="orange" type="checkbox" value="orange" v-validate:fruits>
      <label for="orange">Orage</label>
      <input id="grape" type="checkbox" value="grage" v-validate:fruits>
      <label for="grape">Grape</label>
      <input id="banana" type="checkbox" value="banana" v-validate:fruits>
      <label for="banana">Banana</label>
    </fieldset>

    <!-- you can use the `select` -->
    <select multiple size="10" v-validate:lang="{ maxlength: 3 }">
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
    ```

### min

- **要素:**
    - `input[type="text"]`
    - `input[type="number"]`
    - `textarea`

- **使用方法:**

    指定された数値が最小以下かどうかチェックします。

- **例:**

    ```html
    <input type="text" v-validate:age="{ min: 18 }"/>
    ```

### max

- **要素:**
    - `input[type="text"]`
    - `input[type="number"]`
    - `textarea`

- **使用方法:**

    指定された数値が最大以下かどうかチェックします。

- **例:**

    ```html
    <input type="text" v-validate:limit="{ max: 100 }"/>
    ```

## グローバルAPI

### Vue.validator( id, [definition] )

- **引数:**
    - `{String} id`
    - `{Function | Object} [definition]`
- **戻り値:**
    - バリデータ定義関数又はオブジェクト

- **使用方法:**

  グローバルバリデータの登録又は取得します。

  ```javascript
  /*
   * カスタムバリデータを登録する
   *
   * 引数:
   *   - 第一引数: フィールド値
   *   - 第二引数: ルール値 (任意). この引数は v-validate 用の特別なバリデーションルールを指定できます。
   * 戻り値:
   *   有効の場合は `true` を、そうでない場合は `false` を返します。
   */
  Vue.validator('zip', function (val, rule) {
    return /^\d{3}-\d{4}$/.test(val)
  })

  /*
   * 非同期のカスタムバリデータを登録する
   * 
   * `Promise` 又は promise の `function (resolve, reject)` のように使用することができます。
   */
  Vue.validator('exist', function (val) {
    return fetch('/validations/exist', {
      method: 'post',
      // ...
    }).then(function (json) {
      return Promise.resolve() // 有効
    }).catch(function (error) {
      return Promise.reject(error.message) // 無効
    })
  })

  /*
   * バリデータ定義オブジェクトを登録する
   *
   * `check` カスタムバリデータ関数を指定する必要があります。
   * もしエラーメッセージが必要な場合は、 `message` 文字列又は関数を一緒に指定することができます。
   */
  Vue.validator('email', {
    message: 'invalid email address', // エラーメッセージ
    check: function (val) { // カスタムバリデータ
      return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val)
    }
  })
  ```

- **参照:**
  - [カスタムバリデータ](custom.html)

## コンストラクタオプション

### validators

- **型:** `Object`

- **概要:**

  Vue インスタンスのみで利用可能なバリデータ定義オブジェクト。

- **参照:**
  - [Vue.validator()](#vuevalidator-id-definition-)

## インスタンスメタ関数

### $activateValidator()

- **引数:**
  無し

- **使用方法:**

  `validator` エレメントの `lazy` 属性で遅延初期化されたバリデータを作動させます。

- **例:**

  ```javascript
  Vue.component('comment', {
    props: {
      id: Number,
    },
    data: function () {
      return { comment: '' }
    },
    activate: function (done) {
      var resource = this.$resource('/comments/:id');
      resource.get({ id: this.id }, function (comment, stat, req) {
        this.commont =  comment.body
  
        // バリデータを作動させる
        this.$activateValidator()
        done()
  
      }.bind(this)).error(function (data, stat, req) {
        // エラー処理
        done()
      })
    },
    methods: {
      onSave: function () {
        var resource = this.$resource('/comments/:id');
        resource.save({ id: this.id }, { body: this.comment }, function (data, stat, req) {
          // 成功処理
        }).error(function (data, sta, req) {
          // エラー処理
        })
      }
    }
  })
  ```
  
- **参照:**
  - [遅延初期化](lazy.html)

### $resetValidation( [cb] )

- **引数:**
  - `{Function} [cb]`

- **使用方法:**

  バリデーション結果をリセットします。

- **例:**

  ```javascript
  new Vue({
    el: '#app',
    methods: {
      onClickReset: function () {
        this.$resetValidation(function () {
          console.log('reset done')
        })
      }
    }
  })
  ```

- **参照:**
  - [バリデーション結果の初期化](reset.html)

### $setValidationErrors( errors )

- **引数:**
  - `Array<Object>` errors
    - `{String}` field
    - `{String}` message
    - `{String}` validator [任意]

- **引数: field**

  バリデーションフィールドエラーを検知するため、引数 `field` を渡す必要があります。 

- **引数: message**

  バリデーションエラーメッセージを出力するため、引数 `message` を渡す必要があります。

- **引数: validator**

  バリデータエラーがどこで発生したのかを検知させるために、引数 `validator` を渡します。

- **使用方法:**

  `errors` にバリデーション結果のエラーを設定してください。これは手動でサーバーサイドバリデーションを設定したい場合に便利です。

- **例:**

  ```javascript
  new Vue({
    el: '#app',
    data: {
      id: 1,
      username: '',
      password: {
        old: '',
        new: ''
      }
    },
    validators: {
      confirm: function (val, target) {
        return val === target
      }
    },
    methods: {
      onSubmit: function () {
        var self = this
        var resource = this.$resource('/user/:id')
        resource.save({ id: this.id }, {
          username: this.username,
          password: this.password.new
        }, function (data, stat, req) {
          // 何かの処理...
          // ...
        }).error(function (data, stat, req) {
          // handle server error
          self.$setValidationErrors([
            { field: data.field, message: data.message }
          ])
        })
      }
    }
  })
  ```

- **参照:**
  - [エラーメッセージ](errors.html)

### $validate( [field], [touched], [cb] )

- **引数:**
  - `{String} [field]`
  - `{Boolean} [touched]`
  - `{Function} [cb]`

- **使用方法:**

  対象のエレメントフィールドをバリデートします。

  - もし引数 `field` がない場合は、全てのフィールドをバリデートします。

  - もし引数 `touched` に `true` が渡された場合は、`touched` のバリデーション結果に `true` を設定します。

- **例:**

  ```javascript
  new Vue({
    el: '#app',
    data: { password: '' },
    validators: {
      confirm: function (val, target) {
        return val === target
      }
    },
    methods: {
      onSubmit: function (e) {
        // 全てのフィールドを手動的にタッチされたものとしてバリデート
        // validate the all fields manually with touched
        var self = this
        this.$validate(true, function () {
          console.log('validate done !!')
          if (self.$validation.invalid) {
            e.preventDefault()
          }
        })
      }
    }
  })
  ```

- **参照:**
  - [バリデーションタイミング変更](timing.html)

## ディレクティブ

### v-validate

- **要求事項:** `Array | Object`

- **パラメーター属性:**
  - `group`
  - `field`
  - `detect-blur`
  - `detect-change`
  - `initial`
  - `classes` (v-bind, object の場合は必須)

- **使用方法:**

  フォーム要素をバリデートします。より詳細な使い方は次の例を参照してください。

- **例:**

  ```html
  <!-- array syntax -->
  <input type="text" v-validate:username="['required']">

  <!-- object syntax -->
  <input type="text" v-validate:zip="{ required: true, pattern: { rule: '/^\d{3}-\d{4}$/', message: '無効な郵便番号です' }}">

  <!-- binding -->
  <input type="text" v-validate:zip="zipRule">

  <!-- grouping -->
  <input type="text" group="profile" v-validate:user="['required']">

  <!-- field -->
  <input type="text" filed="field1" v-validate="['required']">

  <!-- disable validation with DOM event -->
  <input type="password" detect-blur="off" detect-change="off" v-validate:password="['required']">

  <!-- disable initial auto-validation -->
  <input type="text" initial="off" v-validate:message="['required']">

  <!-- validation custom class -->
  <input type="text" :name="{ valid: 'valid-custom-class' }" v-validate:username="['required']">
  ```

- **参照:**
  - [バリデーション文法](syntax.html)
  - [グループ化](grouping.html)
  - [イベント](events.html)
  - [v-model インテグレーション](model.html)
  - [バリデーションタイミング変更](timing.html)
  - [バリデーションクラス](classes.html)

### v-validate-class

> 2.1+

- **式を受け付けません**

- **制約:** `v-validate` 時に一緒に使用するディレクティブを要求します。

- **使用方法:**

  バリデーション時で自動挿入されるクラスを示します。

- **例:**

  ```html
  <fieldset v-validate-class>
    <label for="username">username:</label>
    <input id="username" type="text" v-validate:username="['required']">
  </fieldset>
  ```

## 特殊要素

### validator

- **属性:**
  - `name` (必須)
  - `groups`
  - `lazy`
  - `classes` (v-bind, object の場合は必須)
 
- **使用方法:**

  `<validator>` 要素はバリデーションするフォーム要素(input, select and textarea)として役に立ちます。 `<validator>` はそれ自身が置き換わります。

  バリデーション結果は `$` で始まる名前のスコープに保持され、`<validator>` 要素の`name` 属性で指定されています。
  
> :warning: `$event`のように vue.js で既に使用されたバリデーション名を指定すると、動作しません。

- **例:**

  ```html
  <!-- basic -->
  <validator name="validation">
    <input type="text" v-validate:username="['required']">
    <p v-if="$validation.invalid">invalid !!<p>
  </validator>

  <!-- validation grouping -->
  <validator name="validation" :groups="['user', 'password']">
    <label for="username">username:</label>
    <input type="text" group="user" v-validate:username="['required']">
    <label for="password">password:</label>
    <input type="password" group="password" v-validate:password1="{ minlength: 8, required: true }"/>
    <label for="confirm">password (confirm):</label>
    <input type="password" group="password" v-validate:password2="{ minlength: 8, required: true }"/>
    <p v-if="$validation.user.invalid">無効なユーザー名です!!</p>
    <p v-if="$validation.password.invalid">無効なパスワード入力です!!</p>
  </validator>

  <!-- lazy initialization -->
  <validator lazy name="validation">
    <input type="text" :value="comment" v-validate:comment="{ required: true, maxlength: 256 }"/>
    <span v-if="$validation.comment.required">コメントは必須です</span>
    <span v-if="$validation.comment.maxlength">コメントが長すぎです!!</span>
    <button type="button" value="save" @click="onSave" v-if="valid">
  </validator>

  <!-- validation custom class -->
  <validator :classes="{ valid: 'valid-custom-class' }" name="validation">
    <input type="text" v-validate:username="['required']">
    <p v-if="$validation.invalid">無効です!!<p>
  </validator>
  ```

- **参照:**
  - [バリデーション結果構造](structure.html)
  - [グループ化](grouping.html)
  - [遅延初期化](lazy.html)
  - [バリデーションタイミング変更](timing.html)
  - [非同期バリデーション](async.html)
  - [バリデーションクラス](classes.html)

### validator-errors

- **属性:**
  - `validation` (v-bind の場合は必須)
  - `component`
  - `partial`
  - `group`
  - `field`

- **使用方法:**

  `<validator-errors>` 要素はバリデーションエラーメッセージのテンプレートでアウトレットとして役に立ちます。  `<validator-errors>` 要素それ自身はバリデータの内部の標準テンプレートに置き換わります。もし `component` 属性又は `partial` 属性を指定した場合は、バリデーションエラーメッセージをレンダリングします。

- **例:**

  ```html
  <!-- basic -->
  <validator name="validation">
    ...
    <div class="errors">
      <validator-errors :validation="$validation"></validator-errors>
    </div>
  </validator>

  <!-- render validation error message with component -->
  <validator name="validation">
    ...
    <div class="errors">
      <validator-errors :component="'custom-error'" :validation="$validation">
      </validator-errors>
    </div>
  </validator>

  <!-- render validation error message with partial -->
  <validator name="validation">
    ...
    <div class="errors">
      <validator-errors partial="myErrorTemplate" :validation="$validation">
      </validator-errors>
    </div>
  </validator>

  <!-- error message filter with group -->  
  <validator :groups="['profile', 'password']" name="validation1">
    ...
    <input id="username" type="text" group="profile" v-validate:username="{
      required: { rule: true, message: '名前は必須です!!' }
    }">
    ...
    <input id="old" type="password" group="password" v-validate:old="{
      required: { rule: true, message: '古いパスワードは必須です!!' },
      minlength: { rule: 8, message: '古いパスワードが短すぎです!!' }
    }"/>
    ...
    <div class="errors">
      <validator-errors group="profile" :validation="$validation1">
      </validator-errors>
    </div>
  </validator>
  ```

- **参照:**
  - [エラーメッセージ](errors.html)
