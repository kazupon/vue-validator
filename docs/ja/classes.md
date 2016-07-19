# バリデーションクラス

> バージョン 2.1 以上必須

時々、私達はユーザーインタラクションを表示するためバリデーション結果それぞれにスタイルを当てる必要があります。 vue-validator は フォーム要素のバリデーションが実行された時に、便利なクラス名自動挿入を提供します。例として下記のようなバリデーションです:

```html
<input id="username" type="text" v-validate:username="{
  required: { rule: true, message: '名前は必須です!!' }
}">
```

下記のようなHTMLを出力します:

```html
<input id="username" type="text" class="invalid untouched pristine">
```

## バリデーションクラス一覧
| バリデーション種別 | クラス名 (default) | 説明|
|:---:|---|---|
| `valid` | `valid` | 対象要素が**有効**になった時 |
| `invalid` | `invalid` | 対象要素が**無効**になった時 |
| `touched` | `touched` | 対象要素が**タッチされた**時 |
| `undefined` | `untouched` | 対象要素が**一度もタッチされていない**時 |
| `pristine` | `pristine` | 対象要素のフィールドが**一度も変更されていない**時 |
| `dirty` | `dirty` | 対象要素のフィールドが**一度でも変更された**時 |
| `modified` | `modified` | 対象要素のフィールドが **変更された**時 |

## バリデーションのカスタムクラス名の適用 
もし上に示すデフォルトのクラス名が不便な場合は、クラス名を設定することができます。 カスタムクラス名を設定するためには `classes` 属性を使用する必要があります。例:

```html
<validator name="validation1" 
           :classes="{ touched: 'touched-validator', dirty: 'dirty-validator' }">
  <label for="username">username:</label>
  <input id="username" 
         type="text" 
         :classes="{ valid: 'valid-username', invalid: 'invalid-username' }" 
         v-validate:username="{ required: { rule: true, message: '名前は必須です!!' } }">
</validator>
```

`classes` 属性は `v-validate` 又は `validator` エレメントディレクティブで指定された対象要素で使用する必要があり、オブジェクト値を指定する必要があります。 

## 別要素へのバリデーションクラスの適用

普通は、 `v-validate` ディレクティブ でバリデートされた要素にバリデーションクラスが挿入されます。しかしながら、時々私達はラップされた要素に挿入する必要があります。そのような場合は、 `v-validate-class` をラップされた要素に指定することで実現できます。下記が例です:


```html
<validator name="validation1" 
           :classes="{ touched: 'touched-validator', dirty: 'dirty-validator' }">
  <div v-validate-class class="username">
    <label for="username">username:</label>
    <input id="username" 
           type="text" 
           :classes="{ valid: 'valid-username', invalid: 'invalid-username' }" 
           v-validate:username="{ required: { rule: true, message: '名前は必須です!!' }
    }">
  </div>
</validator>
```

下記のようなHTMLを出力します:

```html
<div class="username invalid-username untouched pristine">
  <label for="username">username:</label>
  <input id="username" type="text">
</div>
```

