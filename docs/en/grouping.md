# Grouping

The vue binding syntax can group inputs together:

```html
<validator name="validation1" :groups="['passwordGroup']">
  username: <input type="text" v-validate:username="['required']"><br>
  
  password: <input type="password" group="passwordGroup" v-validate:password="{ minlength: 8, required: true }"/><br>

  confirm password: <input type="password" group="passwordGroup" v-validate:password-confirm="{ minlength: 8, required: true }"/><br>
  
  <span v-if="$validation1.username.invalid">Invalid username!</span><br>

  <span v-if="$validation1.passwordGroup.invalid">Invalid password input!</span>
</validator>
```
