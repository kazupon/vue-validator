# 错误消息

错误消息可以直接在验证规则中指定，同时可以在 `v-show` 和 `v-if` 中使用错误消息：
```html
<validator name="validation1">
  <div class="username">
    <label for="username">username:</label>
    <input id="username" type="text" v-validate:username="{
      required: { rule: true, message: 'required you name !!' }
    }">
    <span v-if="$validation1.username.required">{{ $validation1.username.required }}</span>
  </div>
  <div class="password">
    <label for="password">password:</label>
    <input id="password" type="password" v-validate:password="{
      required: { rule: true, message: 'required you password !!' },
      minlength: { rule: 8, message: 'your password short too !!' }
    }"/>
    <span v-if="$validation1.password.required">{{ $validation1.password.required }}</span>
    <span v-if="$validation1.password.minlength">{{ $validation1.password.minlength }}</span>
  </div>
</validator>
```

也可以在 `v-for` 指令中使用错误消息：

```html
<validator name="validation1">
  <div class="username">
    <label for="username">username:</label>
    <input id="username" type="text" v-validate:username="{
      required: { rule: true, message: 'required you name !!' }
    }">
  </div>
  <div class="password">
    <label for="password">password:</label>
    <input id="password" type="password" v-validate:password="{
      required: { rule: true, message: 'required you password !!' },
      minlength: { rule: 8, message: 'your password short too !!' }
    }"/>
  </div>
  <div class="errors">
    <ul>
      <li v-for="error in $validation1.errors">
        <p>{{error.field}}: {{error.message}}</p>
      </li>
    </ul>
  </div>
</validator>
```

使用数据属性或计算属性来指定验证规则比使用内联验证规则更简洁。

## 错误消息枚举组件

在上例中，我们使用 `v-for` 指令来枚举验证器的 `errors`。但是，我们可以让它更简单。本验证器提供了非常易用的 `validator-errors` 组件来枚举错误消息，如下例所示：

```html
<validator name="validation1">
  <div class="username">
    <label for="username">username:</label>
    <input id="username" type="text" v-validate:username="{
      required: { rule: true, message: 'required you name !!' }
    }">
  </div>
  <div class="password">
    <label for="password">password:</label>
    <input id="password" type="password" v-validate:password="{
      required: { rule: true, message: 'required you password !!' },
      minlength: { rule: 8, message: 'your password short too !!' }
    }"/>
  </div>
  <div class="errors">
    <validator-errors :validation="$validation1"></validator-errors>
  </div>
</validator>
```

上例的代码渲染出的界面如下：

```html
<div class="username">
  <label for="username">username:</label>
  <input id="username" type="text">
</div>
<div class="password">
  <label for="password">password:</label>
  <input id="password" type="password">
</div>
<div class="errors">
  <div>
    <p>password: your password short too !!</p>
  </div>
  <div>
    <p>password: required you password !!</p>
  </div>
  <div>
    <p>username: required you name !!</p>
  </div>
</div>
```

## 自定义错误消息模版

如果你不喜欢 `validator-errors` 默认的错误消息格式，可以指定自定义的组件或 partial 作为消息模版。

### 组件模版

下例中展示了使用组件作为模版：

```html
<div id="app">
  <validator name="validation1">
    <div class="username">
      <label for="username">username:</label>
      <input id="username" type="text" v-validate:username="{
        required: { rule: true, message: 'required you name !!' }
      }">
    </div>
    <div class="password">
      <label for="password">password:</label>
      <input id="password" type="password" v-validate:password="{
        required: { rule: true, message: 'required you password !!' },
        minlength: { rule: 8, message: 'your password short too !!' }
      }"/>
    </div>
    <div class="errors">
      <validator-errors :component="'custom-error'" :validation="$validation1">
      </validator-errors>
    </div>
  </validator>
</div>
```

```javascript
// register the your component with Vue.component
Vue.component('custom-error', {
  props: ['field', 'validator', 'message'],
  template: '<p class="error-{{field}}-{{validator}}">{{message}}</p>'
})

new Vue({ el: '#app' })
```
  
### Partial 模版

下例中展示了使用 partial 作为模版：

```html
<div id="app">
  <validator name="validation1">
    <div class="username">
      <label for="username">username:</label>
      <input id="username" type="text" v-validate:username="{
        required: { rule: true, message: 'required you name !!' }
      }">
    </div>
    <div class="password">
      <label for="password">password:</label>
      <input id="password" type="password" v-validate:password="{
        required: { rule: true, message: 'required you password !!' },
        minlength: { rule: 8, message: 'your password short too !!' }
      }"/>
    </div>
    <div class="errors">
      <validator-errors partial="myErrorTemplate" :validation="$validation1">
      </validator-errors>
    </div>
  </validator>
</div>
```

```javascript
// register custom error template
Vue.partial('myErrorTemplate', '<p>{{field}}: {{validator}}: {{message}}</p>')
new Vue({ el: '#app' })
```

### 指定错误消息

有时候你只需要输出部分错误消息，此时你可以通过 `group` 或 `field` 属性来指定这部分验证结果。

- `group`: 指定组的错误消息 (例如 $validation.group1.errors)
- `field`: 指定字段的错误消息 (例如 $validation.field1.errors)

下例中展示了 `group` 属性的使用：

```html
<div id="app">
  <validator :groups="['profile', 'password']" name="validation1">
    <div class="username">
      <label for="username">username:</label>
      <input id="username" type="text" group="profile" v-validate:username="{
        required: { rule: true, message: 'required you name !!' }
      }">
    </div>
    <div class="url">
      <label for="url">url:</label>
      <input id="url" type="text" group="profile" v-validate:url="{
        required: { rule: true, message: 'required you name !!' },
        url: { rule: true, message: 'invalid url format' }
      }">
    </div>
     <div class="old">
     <label for="old">old password:</label>
      <input id="old" type="password" group="password" v-validate:old="{
        required: { rule: true, message: 'required you old password !!' },
        minlength: { rule: 8, message: 'your old password short too !!' }
      }"/>
    </div>
    <div class="new">
      <label for="new">new password:</label>
      <input id="new" type="password" group="password" v-validate:new="{
        required: { rule: true, message: 'required you new password !!' },
        minlength: { rule: 8, message: 'your new password short too !!' }
      }"/>
    </div>
    <div class="confirm">
      <label for="confirm">confirm password:</label>
      <input id="confirm" type="password" group="password" v-validate:confirm="{
        required: { rule: true, message: 'required you confirm password !!' },
        minlength: { rule: 8, message: 'your confirm password short too !!' }
      }"/>
    </div>
    <div class="errors">
      <validator-errors group="profile" :validation="$validation1">
      </validator-errors>
    </div>
  </validator>
</div>
```

```javascript
Vue.validator('url', function (val) {
  return /^(http\:\/\/|https\:\/\/)(.{4,})$/.test(val)
})
new Vue({ el: '#app' })
```

## 手动设置错误消息

有时候你需要手动设置验证错误的消息，如从服务器端得到的验证错误消息。这时你可以通过 `$setValidationErrors` 方法设置错误消息，如下例：

```html
<div id="app">
  <validator name="validation">
    <div class="username">
      <label for="username">username:</label>
      <input id="username" type="text" v-model="username" v-validate:username="{
        required: { rule: true, message: 'required you name !!' }
      }">
    </div>
    <div class="old">
      <label for="old">old password:</label>
      <input id="old" type="password" v-model="passowrd.old" v-validate:old="{
        required: { rule: true, message: 'required you old password !!' }
      }"/>
    </div>
    <div class="new">
      <label for="new">new password:</label>
      <input id="new" type="password" v-model="password.new" v-validate:new="{
        required: { rule: true, message: 'required you new password !!' },
        minlength: { rule: 8, message: 'your new password short too !!' }
      }"/>
    </div>
    <div class="confirm">
      <label for="confirm">confirm password:</label>
      <input id="confirm" type="password" v-validate:confirm="{
        required: { rule: true, message: 'required you confirm password !!' },
        confirm: { rule: passowd.new, message: 'your confirm password incorrect !!' }
      }"/>
    </div>
    <div class="errors">
      <validator-errors :validation="$validation"></validator-errors>
    </div>
    <button type="button" v-if="$validation.valid" @click.prevent="onSubmit">update</button>
  </validator>
</div>
```
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
        passowrd: this.new
      }, function (data, stat, req) {
        // something handle success ...
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
