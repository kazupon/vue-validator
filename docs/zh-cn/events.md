# 事件

可以使用 vue 中的事件绑定方法绑定验证器产生的事件。

## 字段验证事件

对于每一个字段，你都可以监听如下事件：

- `valid`: 当字段验证结果变为有效时触发
- `invalid`: 当字段验证结果变为无效时触发
- `touched`: 当字段失去焦点时触发
- `dirty`: 当字段值首次变化时触发
- `modified`: 当字段值与初始值不同时或变回初始值时触发

```html
<div id="app">
  <validator name="validation1">
    <div class="comment-field">
      <label for="comment">comment:</label>
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

## 顶级验证事件

可以监听如下顶级验证结果的变化事件：

- `valid`: 当全局验证结果变为有效时触发
- `invalid`: 当全局验证结果变为无效时触发
- `touched`: 当任意验证字段失去焦点时触发
- `dirty`: 当任意字段首次改变时触发
- `modified`: 当任意字段首次改变时或所有字段恢复初始值时触发

```html
<div id="app">
  <validator name="validation1"
             @valid="onValid"
             @invalid="onInvalid"
             @touched="onTouched"
             @dirty="onDirty"
             @modified="onModified">
    <div class="comment-field">
      <label for="username">username:</label>
      <input type="text" 
             v-validate:username="['required']"/>
    </div>
    <div class="password-field">
      <label for="password">password:</label>
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
