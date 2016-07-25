# 安装

## 直接下载

查看 [dist 目录](https://github.com/vuejs/vue-validator/tree/dev/dist)。 注意，dist 目录下的文件是最新稳定版，不会同步更新到 `dev` 分支上的最新代码。

## CDN

### jsdelivr

```html
<script src="https://cdn.jsdelivr.net/vue.validator/2.1.5/vue-validator.min.js"></script>
```

## NPM

### 稳定版

    $ npm install vue-validator

### 开发版

    $ git clone https://github.com/vuejs/vue-validator.git node_modules/vue-validator
    $ cd node_modules/vue-validator
    $ npm install
    $ npm run build

如果使用 CommonJS 模块规范, 需要显式的使用 `Vue.use()` 安装验证器组件：

> :提醒: 如果与 `vue-router` 同时使用，必须在调用 `router#map`, `router#start` 等实例方法前安装验证器。

```javascript
var Vue = require('vue')
var VueValidator = require('vue-validator')

Vue.use(VueValidator)
```

使用独立编译文件时不需要这样做，因为验证器组件会自动安装。
