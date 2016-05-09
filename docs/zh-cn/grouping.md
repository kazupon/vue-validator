# 分组

支持把验证字段分组：

```html
<validator name="validation1" :groups="['user', 'password']">
  username: <input type="text" group="user" v-validate:username="['required']"><br />
  password: <input type="password" group="password" v-validate:password1="{ minlength: 8, required: true }"/><br />
  password (confirm): <input type="password" group="password" v-validate:password2="{ minlength: 8, required: true }"/>
  <div class="user">
    <span v-if="$validation1.user.invalid">Invalid yourname !!</span>
  </div>
  <div class="password">
    <span v-if="$validation1.password.invalid">Invalid password input !!</span>
  </div>
</validator>
```
