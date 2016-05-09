# 验证结果类

> 2.1+

有时，我们需要为不同验证结果显示不同的样式以达到更好的交互效果。vue-validator 在验证完表单元素后会自动插入相应的类来指示验证结果，如下例所示：

```html
<input id="username" type="text" v-validate:username="{
  required: { rule: true, message: 'required you name !!' }
}">
```

上例会输出如下 HTML：

```html
<input id="username" type="text" class="invalid untouched pristine">
```

## 验证结果类列表
| 验证类型 | 类名 (默认) | 描述 |
|:---:|---|---|
| `valid` | `valid` | 当目标元素变为 **valid** 时 |
| `invalid` | `invalid` | 当目标元素变为 **invalid** 时 |
| `touched` | `touched` | 当 **touched** 目标元素时 |
| `undefined` | `untouched` | 当目标元素还未被 **touched** 时 |
| `pristine` | `pristine` | 当目标元素还未 **dirty** 时 |
| `dirty` | `dirty` | 当目标元素 **dirty** 时 |
| `modified` | `modified` | 当目标元素 **modified** 时 |

## 使用自定义验证结果类
当默认的验证结果类名不方便使用时，你可以使用 `classes` 属性自定义相应的类名，如下所示：

```html
<validator name="validation1" 
           :classes="{ touched: 'touched-validator', dirty: 'dirty-validator' }">
  <label for="username">username:</label>
  <input id="username" 
         type="text" 
         :classes="{ valid: 'valid-username', invalid: 'invalid-username' }" 
         v-validate:username="{ required: { rule: true, message: 'required you name !!' } }">
</validator>
```

`classes` 属性需要使用在 `v-validate` 或 `validator` 指令上，值必须为对象。

## 在非目标元素上使用验证结果类

通常情况下验证结果类会插入到定义 `v-validate` 指令的元素上。然而有时候我们需要把这些类插入到其他元素上。这时我们可以使用 `v-validate-class` 来实现，如下所示：

```html
<validator name="validation1" 
           :classes="{ touched: 'touched-validator', dirty: 'dirty-validator' }">
  <div v-validate-class class="username">
    <label for="username">username:</label>
    <input id="username" 
           type="text" 
           :classes="{ valid: 'valid-username', invalid: 'invalid-username' }" 
           v-validate:username="{ required: { rule: true, message: 'required you name !!' }
    }">
  </div>
</validator>
```

上例会输出如下 HTML：

```html
<div class="username invalid-username untouched pristine">
  <label for="username">username:</label>
  <input id="username" type="text">
</div>
```
