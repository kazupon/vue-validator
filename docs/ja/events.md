# イベント

一般的な Vue イベントのバインディングを使うことで、バリデータの中で発生したイベントをバインドさせることができます。

## フィールドバリデーションイベント

`input` タグの中で指定した `v-validate` ディレクティブと同じように、それぞれのフィールドプロパティに対してイベントを実行することができます:

- `valid`: **各フィールド**のバリデーション結果が有効になると発生
- `invalid`: **各フィールド**のバリデーション結果が無効になると発生
- `touched`: **各フィールド**でひとつでも `blur` を検知すると発生
- `dirty`: **各フィールド**の値がひとつでも初期値から変更されたら発生
- `modified`: **各フィールド**の値が初期値から変更されたら発生

```html
<div id="app">
  <validator name="validation1">
    <div class="comment-field">
      <label for="comment">コメント:</label>
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

## トップレベルバリデーションイベント

トップレベルバリデーションプロパティで発生したイベントを発生させることができます:

- `valid`: **トップレベル**のバリデーション結果が有効になると発生
- `invalid`: **トップレベル**のバリデーション結果が無効になると発生
- `touched`: **トップレベル**でひとつでも `blur` を検知すると発生
- `dirty`: **トップレベル**の値がひとつでも初期値から変更されたら発生
- `modified`: **トップレベル**の値が初期値から変更されたら発生

```html
<div id="app">
  <validator name="validation1"
             @valid="onValid"
             @invalid="onInvalid"
             @touched="onTouched"
             @dirty="onDirty"
             @modified="onModified">
    <div class="comment-field">
      <label for="username">ユーザー名:</label>
      <input type="text" 
             v-validate:username="['required']"/>
    </div>
    <div class="password-field">
      <label for="password">パスワード:</label>
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
