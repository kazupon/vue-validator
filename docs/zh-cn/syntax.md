# 验证器语法
`v-validate` 指令用法如下:

    v-validate[:field]="array literal | object literal | binding"

## 字段
2.0-alpha以前的版本中，验证器是依赖于 `v-model` 的。从2.0-alpha版本开始，`v-model` 是可选的。

~v1.4.4:
```html
<form novalidate>
  <input type="text" v-model="comment" v-validate="minLength: 16, maxLength: 128">
  <div>
    <span v-show="validation.comment.minLength">Your comment is too short.</span>
    <span v-show="validation.comment.maxLength">Your comment is too long.</span>
  </div>
  <input type="submit" value="send" v-if="valid">
</form>
```

v2.0-alpha后:
```html
<validator name="validation">
  <form novalidate>
    <input type="text" v-validate:comment="{ minlength: 16, maxlength: 128 }">
    <div>
      <span v-show="$validation.comment.minlength">Your comment is too short.</span>
      <span v-show="$validation.comment.maxlength">Your comment is too long.</span>
    </div>
    <input type="submit" value="send" v-if="valid">
  </form>
</validator>
```

### Caml-case 属性
同 [Vue.js](http://vuejs.org.cn/guide/components.html#camelCase-vs-kebab-case)一样, `v-validate` 指令中的字段名可以使用 kebab-case:

```html
<validator name="validation">
  <form novalidate>
    <input type="text" v-validate:user-name="{ minlength: 16 }">
    <div>
      <span v-if="$validation.userName.minlength">Your user name is too short.</span>
    </div>
  </form>
</validator>
```

### 属性
可以通过 `field` 属性来指定字段名。这在动态定义包含验证功能的表单时有用：

> 注意: 当使用 `field` 属性指定字段名时不需要在 `v-validate` 指令中再次指定。

```html
<div id="app">
  <validator name="validation">
    <form novalidate>
      <p class="validate-field" v-for="field in fields">
      <label :for="field.id">{{field.label}}</label>
      <input type="text" :id="field.id" :placeholder="field.placeholder" field="{{field.name}}" v-validate="field.validate">
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


## 字面量

### 数组
下例中使用了数组型字面量：

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

因为 `required` 验证器不要额外的参数，这样写更简洁。


### 对象
下例中使用了对象型字面量：

```html
<validator name="validation">
  <form novalidate>
    ID: <input type="text" v-validate:id="{ required: true, minlength: 3, maxlength: 16 }"><br />
    <div>
      <span v-if="$validation.id.required">ID is required</span>
      <span v-if="$validation.id.minlength">Your ID is too short.</span>
      <span v-if="$validation.id.maxlength">Your ID is too long.</span>
    </div>
  </form>
</validator>
```

使用对象型字面量允许你为验证器指定额外的参数。对于 `required`，因为它不需要参数，如上例中随便指定一个值即可。

或者可以像下例一样使用严苛模式对象：

```html
<validator name="validation">
  <form novalidate>
    ID: <input type="text" v-validate:id="{ minlength: { rule: 3 }, maxlength: { rule: 16 } }"><br />
    <div>
      <span v-if="$validation.id.minlength">Your ID is too short.</span>
      <span v-if="$validation.id.maxlength">Your ID is too long.</span>
    </div>
  </form>
```

## 绑定
下例中展现了动态绑定：

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
        <span v-if="$validation.id.minlength">Your ID is too short.</span>
        <span v-if="$validation.id.maxlength">Your ID is too long.</span>
      </div>
    </form>
  </validator>
</div>
```

除数据属性外，也可以使用计算属性或事例方法来指定验证规则。

## Terminal 指令问题
请注意，当你想要使用如 `v-if` 和 `v-for` 这些 terminal 指令时，应把可验证的目标元素包裹在 `<template>` 之类的不可见标签内。因为 `v-validate` 指令不能与这些 terminal 指令使用在同一元素上。

下例中使用了 `<div>` 标签：

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
