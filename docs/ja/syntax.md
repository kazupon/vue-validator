# バリデータシンタックス
`v-validate` ディレクティブのシンタックスは以下です:

    v-validate[:field]="array literal | object literal | binding"

## フィールド
vue-validator の 2.0-alpha 以前のバージョンでは、バリデーションは `v-model` に依存していました。 2.0-alpha 以降では `v-validate` ディレクティブを代わりに使います。

~v1.4.4:
```html
<form novalidate>
  <input type="text" v-model="comment" v-validate="minLength: 16, maxLength: 128">
  <div>
    <span v-show="validation.comment.minLength">あなたのコメントは短すぎです。</span>
    <span v-show="validation.comment.maxLength">あなたのコメントは長すぎです。</span>
  </div>
  <input type="submit" value="send" v-if="valid">
</form>
```

v2.0-alpha以降:
```html
<validator name="validation">
  <form novalidate>
    <input type="text" v-validate:comment="{ minlength: 16, maxlength: 128 }">
    <div>
      <span v-show="$validation.comment.minlength">あなたのコメントは短すぎです。</span>
      <span v-show="$validation.comment.maxlength">あなたのコメントは長すぎです。</span>
    </div>
    <input type="submit" value="send" v-if="valid">
  </form>
</validator>
```

### キャメルケースプロパティ
[Vue.js](https://jp.vuejs.org/guide/components.html#キャメルケース-対-ケバブケース) と同様に、ケバブケース( kebab-case : ハイフンで句切られた)を `v-validate` モデルに使用できます:

```html
<validator name="validation">
  <form novalidate>
    <input type="text" v-validate:user-name="{ minlength: 16 }">
    <div>
      <span v-if="$validation.userName.minlength">あなたのユーザー名は短すぎです。</span>
    </div>
  </form>
</validator>
```

### 属性
あなたはフィールド名を `field` パラメーター属性で指定することができます。 これはあなたがバリデーション可能なフォーム要素を動的に定義する際に便利です:

> 注: `field` パラメーター属性を利用する場合は、フィールド部分の `v-validate` は任意です。

```html
<div id="app">
  <validator name="validation">
    <form novalidate>
      <p class="validate-field" v-for="field in fields">
      <label :for="field.id">{{field.label}}</label>
      <input type="text" :id="field.id" :placeholder="field.placeholder" :field="field.name" v-validate="field.validate">
      </p>
      <pre>{{ $validation | json }}</pre>
    </form>
  </validator>
</div>
```

```javascript
new Vue({
  el: '#app',
  data: {
    fields: [{
      id: 'username',
      label: 'username',
      name: 'username',
      placeholder: 'input your username',
      validate: { required: true, maxlength: 16 }
    }, {
      id: 'message',
      label: 'message',
      name: 'message',
      placeholder: 'input your message',
      validate: { required: true, minlength: 8 }
    }]
  }
})
```


## リテラル

### 配列
下記の例では配列リテラルを使用しています:

```html
<validator name="validation">
  <form novalidate>
    Zip: <input type="text" v-validate:zip="['required']"><br />
    <div>
      <span v-if="$validation.zip.required">Zip code is required.</span>
    </div>
  </form>
</validator>
```

`required` で追加のルールを指定する必要が無いので、このシンタックスは望ましいです。


### オブジェクト
下記の例ではオブジェクトリテラルを使用しています:

```html
<validator name="validation">
  <form novalidate>
    ID: <input type="text" v-validate:id="{ required: true, minlength: 3, maxlength: 16 }"><br />
    <div>
      <span v-if="$validation.id.required">IDは必須です。</span>
      <span v-if="$validation.id.minlength">あなたのIDは短すぎです。</span>
      <span v-if="$validation.id.maxlength">あなたのIDは長すぎです。</span>
    </div>
  </form>
</validator>
```

オブジェクトリテラルはルールを与えることができます。上記で示すように、 `required` にはルールが必要なく、 **ダミールール**を代わりに指定することができます。

あるいは、次の通り厳格なオブジェクトを指定することができます:

```html
<validator name="validation">
  <form novalidate>
    ID: <input type="text" v-validate:id="{ minlength: { rule: 3 }, maxlength: { rule: 16 } }"><br />
    <div>
      <span v-if="$validation.id.minlength">あなたのIDは短すぎです。</span>
      <span v-if="$validation.id.maxlength">あなたのIDは長すぎです。</span>
    </div>
  </form>
```

## バインディング
下記の例はライブバインディングを使用しています:

```javascript
new Vue({
  el: '#app',
  data: {
    rules: {
      minlength: 3,
      maxlength: 16
    }
  }
})
```

```html
<div id="app">
  <validator name="validation">
    <form novalidate>
      ID: <input type="text" v-validate:id="rules"><br />
      <div>
        <span v-if="$validation.id.minlength">あなたのIDは短すぎです。</span>
        <span v-if="$validation.id.maxlength">あなたのIDは長すぎです。</span>
      </div>
    </form>
  </validator>
</div>
```

data プロパティの代わりに算出プロパティやメソッドもルールセットを取得するために使用することができます。

## ターミナルディレクティブを使用する際の注意事項
`v-if` と `v-for` のようなターミナルディレクティブを使う必要がある場合は、 `<template>` のような不可視タグでバリデートする対象要素でラップする必要がありますので注意してください。なぜならこれらのターミナルディレクティブを一緒に使うと、 `v-validate` ディレクティブが動作しません。

下記の例は `<div>` タグを使用しています:

```javascript
new Vue({
  el: '#app',
  data: {
    enable: true
  }
})
```

```html
<div id="app">
  <validator name="validation">
    <form novalidate>
      <div class="username">
        <label for="username">username:</label>
        <input id="username" type="text" 
               @valid="this.enable = true" 
               @invalid="this.enable = false" 
               v-validate:username="['required']">
      </div>
      <div v-if="enable" class="password">
        <label for="password">password:</label>
        <input id="password" type="password" v-validate:password="{
          required: { rule: true }, minlength: { rule: 8 }
        }"/>
      <div>
    </form>
  </validator>
</div>
```
