# Lazy initialization

The `lazy` attribute on the `validator` element will delay initialization of the validator until `$activateValidator()` is called. This is useful for data that must first be loaded in asynchronously, preventing the validator from reporting invalid data until ready.

The following example waits for the comment contents to be loaded before evaluating; without `lazy`, the component would show errors until the data loads in.

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
