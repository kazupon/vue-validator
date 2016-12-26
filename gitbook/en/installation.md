# Installation

## Direct Download

See [dist folder](https://github.com/vuejs/vue-validator/tree/dev/dist). Note the dist files are always the latest stable - it's not update-to-date with the dev branch source.

## CDN

### jsdelivr

uppkg
```html
<script src="https://unpkg.com/vue-validator@3.0.0-alpha.2/dist/vue-validator.min.js"></script>
```

## NPM

### stable version

    $ npm install vue-validator

### development version

    $ git clone https://github.com/vuejs/vue-validator.git node_modules/vue-validator
    $ cd node_modules/vue-validator
    $ npm install
    $ npm run build

When used in CommonJS, you must explicitly install the validator via `Vue.use()`:

> :warning: if you are using `vue-router`, you must install with `Vue.use()` in advance of instance methods (`router#map`, `router#start`, ...etc).

```javascript
var Vue = require('vue')
var VueValidator = require('vue-validator')

Vue.use(VueValidator)
```

You don't need to do this when using the standalone build, as it installs itself automatically.
