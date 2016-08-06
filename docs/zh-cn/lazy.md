# 延迟初始化

如果在 `validator` 元素上设置了 `lazy` 属性，那么验证器直到 `$activateValidator()` 被调用时才会进行初始化。这在待验证的数据需要异步加载时有用，避免了在得到数据前出现错误提示。

下例中在得到评论内容后验证器才开始工作；如果不设置 `lazy` 属性，在得到评论内容前会显示错误提示。

```html
<!-- comment component -->
<div>
  <h1>Preview</h1>
  <p>{{comment}}</p>
  <validator lazy name="validation1">
    <input type="text" :value="comment" v-validate:comment="{ required: true, maxlength: 256 }"/>
    <span v-if="$validation1.comment.required">Required your comment</span>
    <span v-if="$validation1.comment.maxlength">Too long comment !!</span>
    <button type="button" value="save" @click="onSave" v-if="valid">
  </validator>
</div>
```

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
      this.comment =  comment.body

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
