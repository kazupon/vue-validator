# インストール

## 直接ダウンロード

[dist フォルダ](https://github.com/vuejs/vue-validator/tree/dev/dist)を参照してください。dist フォルダにあるファイルは常に最新の安定版であることに注意してください。 - `dev` ブランチのソースは最新ではありません。

## CDN

### jsdelivr

```html
<script src="https://cdn.jsdelivr.net/vue.validator/2.1.7/vue-validator.min.js"></script>
```

## NPM

### 安定版

    $ npm install vue-validator

### 開発版

    $ git clone https://github.com/vuejs/vue-validator.git node_modules/vue-validator
    $ cd node_modules/vue-validator
    $ npm install
    $ npm run build

CommonJS で使用されるとき、明示的に `Vue.use()` 経由でバリデーターをインストールしなければなりません:

> :warning: もし `vue-router` を使用している場合は、 インスタンスメソッド (`router#map`, `router#start`, ...等) の前に `Vue.use()` でインストールしなければなりません。

```javascript
var Vue = require('vue')
var VueValidator = require('vue-validator')

Vue.use(VueValidator)
```

スタンドアロンビルドを使用しているときは、それ自身自動的にインストールされるため、これを実行する必要はありません。
