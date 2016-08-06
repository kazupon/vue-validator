# 遅延初期化

`validator` 要素上の `lazy` 属性は `$activateValidator()` が呼ばれるまでバリデータの初期化を遅らせます。これはデータが初回時に非同期的で読み込みされなければいけない場合に便利で、用意完了するまでバリデータから無効データの通知が来るのを防止します。

次の例ではコメントコンテンツが評価される前に読み込みされるまで待ちます。 `lazy` 無しの場合はデータが読み込みされるまでコンポーネントはエラーを表示します。

```html
<!-- comment component -->
<div>
  <h1>Preview</h1>
  <p>{{comment}}</p>
  <validator lazy name="validation1">
    <input type="text" :value="comment" v-validate:comment="{ required: true, maxlength: 256 }"/>
    <span v-if="$validation1.comment.required">コメントは必須です</span>
    <span v-if="$validation1.comment.maxlength">コメントが長すぎです!!</span>
    <button type="button" value="save" @click="onSave" v-if="$validation1.valid">
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

      // バリデータを作動させる
      this.$activateValidator()
      done()

    }.bind(this)).error(function (data, stat, req) {
      // エラー時の対処をする
      done()
    })
  },
  methods: {
    onSave: function () {
      var resource = this.$resource('/comments/:id');
      resource.save({ id: this.id }, { body: this.comment }, function (data, stat, req) {
        // 成功時の対処をする
      }).error(function (data, sta, req) {
        // エラー時を対処をする
      })
    }
  }
})
```
