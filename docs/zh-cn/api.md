# API 手册

## 全局 API

### Vue.validator( id, [definition] )

- **参数:**
    - `{String} id`
    - `{Function | Object} [definition]`
- **返回:**
    - validator definition function or object

- **用法:**

  注册或获取全局验证器。

  ```javascript
  /*
   * Register custom validator 
   *
   * Arguments:
   *   - first argument: field value
   *   - second argument: rule value (optional). this argument is being passed from specified validator rule with v-validate
   * Return:
   *   `true` if valid, else return `false`
   */
  Vue.validator('zip', function (val, rule) {
    return /^\d{3}-\d{4}$/.test(val)
  })

  /*
   * Register custom validator for async
   * 
   * You can use the `Promise` or promise like `function (resolve, reject)`
   */
  Vue.validator('exist', function (val) {
    return fetch('/validations/exist', {
      method: 'post',
      // ...
    }).then(function (json) {
      return Promise.resolve() // valid
    }).catch(function (error) {
      return Promise.reject(error.message) // invalid
    })
  })

  /*
   * Register validator definition object
   *
   * You need to specify the `check` custom validator function.
   * If you need to error message, you can specify the `message` string or function together.
   */
  Vue.validator('email', {
    message: 'invalid email address', // error message
    check: function (val) { // custome validator
      return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val)
    }
  })
  ```

- **另见:**
  - [自定义验证器](custom.html)

## 构造器选项

### validators

- **类型:** `Object`

- **详细:**

  一个只对当前 Vue 实例可见的验证器定义对象。

- **另见:**
  - [Vue.validator()](#vuevalidator-id-definition-)

## 实例元方法

### $activateValidator()

- **参数:**
  无

- **用法:**

  激活使用 `validator` 元素的 `lazy` 属性延迟初始化的验证器

- **示例:**

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
  
        // activate validator
        this.$activateValidator()
        done()
  
      }.bind(this)).error(function (data, stat, req) {
        // handle error ...
        done()
      })
    },
    methods: {
      onSave: function () {
        var resource = this.$resource('/comments/:id');
        resource.save({ id: this.id }, { body: this.comment }, function (data, stat, req) {
          // handle success
        }).error(function (data, sta, req) {
          // handle error
        })
      }
    }
  })
  ```
  
- **另见:**
  - [延迟初始化](lazy.html)

### $resetValidation( [cb] )

- **参数:**
  - `{Function} [cb]`

- **用法:**

  重置验证结果。

- **示例:**

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

- **另见:**
  - [重置验证结果](reset.html)

### $setValidationErrors( errors )

- **参数:**
  - `Array<Object>` errors
    - `{String}` field
    - `{String}` message
    - `{String}` validator [optional]

- **参数: field**

  指定错误字段名。

- **参数: message**

  指定错误消息。

- **参数: validator**

  指定错误所在的验证器。

- **用法:**

  用来设置验证错误结果。这在手动设置服务器端验证产生的错误时有用。

- **示例:**

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

- **另见:**
  - [错误消息](errors.html)

### $validate( [field], [touched], [cb] )

- **参数:**
  - `{String} [field]`
  - `{Boolean} [touched]`
  - `{Function} [cb]`

- **用法:**

  Validate the target formalable element fields. 
  验证目标表单元素。

  - 如果未设置 `field` 参数，验证所有字段；

  - 如果 `touched` 参数为 `true`，那么验证结果的 `touched` 值会被设置为 `true`；

- **示例:**

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
        // validate the all fields manually with touched
        this.$validate(true, function () {
          console.log('validate done !!')
        })
  
        if (this.$validation.invalid) {
          e.preventDefault()
        }
      }
    }
  })
  ```

- **另见:**
  - [自定义验证时机](timing.html)

## 指令

### v-validate

- **类型:** `Array | Object`

- **Param Attributes:**
  - `group`
  - `field`
  - `detect-blur`
  - `detect-change`
  - `initial`

- **用法:**

  自定需要验证的表单元素。可参见下面的示例。

- **示例:**

  ```html
  <!-- array syntax -->
  <input type="text" v-validate:username="['required']">

  <!-- object syntax -->
  <input type="text" v-validate:zip="{ required: true, pattern: { rule: '/^\d{3}-\d{4}$/', message: 'invalid zip pattern' }}">

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
  ```

- **另见:**
  - [验证器语法](syntax.html)
  - [分组](grouping.html)
  - [事件](events.html)
  - [结合 v-model](model.html)
  - [自定义验证时机](timing.html)

## Special Elements

### validator

- **属性:**
  - `name` (required)
  - `groups`
  - `lazy`
 
- **用法:**

  `<validator>` 元素用来在表单元素(input, select, textarea等)上引入验证器。`<validator>` 元素本身会被替换。

  验证结果会关联到验证器元素上，字段名是由 `validator` 元素的 `name` 属性值加 `$` 前缀组成。
  
> :小心: 验证器名称不要与 Vue.js 中的自带属性重复，如 `$event` 等。

- **示例:**

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
    <p v-if="$validation.user.invalid">Invalid yourname !!</p>
    <p v-if="$validation.password.invalid">Invalid password input !!</p>
  </validator>

  <!-- lazy initialization -->
  <validator lazy name="validation">
    <input type="text" :value="comment" v-validate:comment="{ required: true, maxlength: 256 }"/>
    <span v-if="$validation.comment.required">Required your comment</span>
    <span v-if="$validation.comment.maxlength">Too long comment !!</span>
    <button type="button" value="save" @click="onSave" v-if="valid">
  </validator>
  ```

- **另见:**
  - [验证结果结构](structure.html)
  - [分组](grouping.html)
  - [延迟初始化](lazy.html)
  - [自定义验证时机](timing.html)
  - [异步验证](async.html)

### validator-errors

- **属性:**
  - `validation` (required with v-bind)
  - `component`
  - `partial`
  - `group`
  - `field`

- **用法:**

  `<validator-errors>` 可以作为错误消息的出口。`<validator-errors>` 元素会被替换成默认的错误消息模板。可以通过 `component` 和 `partial` 属性来自定义错误消息的显示方式。

- **示例:**

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
      required: { rule: true, message: 'required you name !!' }
    }">
    ...
    <input id="old" type="password" group="password" v-validate:old="{
      required: { rule: true, message: 'required you old password !!' },
      minlength: { rule: 8, message: 'your old password short too !!' }
    }"/>
    ...
    <div class="errors">
      <validator-errors group="profile" :validation="$validation1">
      </validator-errors>
    </div>
  </validator>
  ```

- **另见:**
  - [错误](errors.html)
