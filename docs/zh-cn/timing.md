# 自定义验证时机

默认情况下，`vue-validator` 会根据 `validator` 和 `v-validate` 指令自动进行验证。然而有时候我们需要关闭自动验证，在有需要时手动触发验证。

## `initial`
当 `vue-validator` 完成初始编译后，会根据每一条 `v-validate` 指令自动进行验证。如果你不需要自动验证，可以通过 `initial` 属性或 `v-validate` 验证规则来关闭自动验证，如下所示：

```html
<div id="app">
  <validator name="validation1">
    <form novalidate>
      <div class="username-field">
        <label for="username">username:</label>
        <!-- 'inital' attribute is applied the all validators of target element (e.g. required, exist) -->
        <input id="username" type="text" initial="off" v-validate:username="['required', 'exist']">
      </div>
      <div class="password-field">
        <label for="password">password:</label>
        <!-- 'initial' optional is applied with `v-validate` validator (e.g. required only) -->
        <input id="password" type="password" v-validate:passowrd="{ required: { rule: true, initial: 'off' }, minlength: 8 }">
      </div>
      <input type="submit" value="send" v-if="$validation1.valid">
    </form>
  </validator>
</div>
```

这在使用服务器端验证等异步验证方式时有用，具体可见后文例子。

## `detect-blur` and `detect-change`
`vue-validator` 会在检测到表单元素(input, checkbox, select 等)上的 DOM 事件(`input`, `blur`, `change`)时自动验证。此时，可以使用 `detect-change` 和 `detect-blur` 属性：

```html
<div id="app">
  <validator name="validation">
    <form novalidate @submit="onSubmit">
      <h1>user registration</h1>
      <div class="username">
        <label for="username">username:</label>
        <input id="username" type="text" 
          detect-change="off" detect-blur="off" v-validate:username="{
          required: { rule: true, message: 'required you name !!' }
        }" />
      </div>
      <div class="password">
        <label for="password">password:</label>
        <input id="password" type="password" v-model="password" 
          detect-change="off" detect-blur="off" v-validate:password="{
          required: { rule: true, message: 'required you new password !!' },
          minlength: { rule: 8, message: 'your new password short too !!' }
        }" />
      </div>
      <div class="confirm">
        <label for="confirm">confirm password:</label>
        <input id="confirm" type="password" 
          detect-change="off" detect-blur="off" v-validate:confirm="{
          required: { rule: true, message: 'required you confirm password !!' },
          confirm: { rule: password, message: 'your confirm password incorrect !!' }
        }" />
      </div>
      <div class="errors" v-if="$validation.touched">
        <validator-errors :validation="$validation"></validator-errors>
      </div>
      <input type="submit" value="register" />
    </form>
  </validator>
</div>
```

```javascript
new Vue({
  el: '#app',
  data: {
    password: ''
  },
  validators: {
    confirm: function (val, target) {
      return val === target
    }
  },
  methods: {
    onSubmit: function (e) {
      // validate manually
      this.$validate(true)

      if (this.$validation.invalid) {
        e.preventDefault()
      }
    }
  }
})
```
