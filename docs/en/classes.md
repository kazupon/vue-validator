# Validation classes

> 2.1+

Sometimes, we need to be styling for each validation result to indicate the user interaction. vue-validator provide useful the auto classes insertion when was run the validation of formable elements. for example the below like the validation:

```html
<input id="username" type="text" v-validate:username="{
  required: { rule: true, message: 'required you name !!' }
}">
```

output the below below like the HTML:

```html
<input id="username" type="text" class="invalid untouched pristine">
```

## List of validation classes
| validation type | class name (default) | description |
|:---:|---|---|
| `valid` | `valid` | when target element became **valid** |
| `invalid` | `invalid` | when target element became **invalid** |
| `touched` | `touched` | when **touched** target element |
| `undefined` | `untouched` | when still  **not be touching** target element |
| `pristine` | `pristine` | when still **not be dirty** field of target element |
| `dirty` | `dirty` | when **be dirty** field of target element |
| `modified` | `modified` | when **be modified** field of target element |

## Applying validation custom classes
You can configure the class name if default classs name is inconvenient as the above with the class name. You need to use the `classes` attributes in order to configure custom class names. e.g:

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

The `classes` attribute need to use at the target element which specified with `v-validate` or `validator` element directive, and need to specify the object value.

## Applying validation classes to another element

Normally, validation classes is insert to the element that was validated with `v-validate` directive. However, sometimes, we need to insert the wrapped element rather than the elements. In that case , we can realize by indicating the `v-validate-class` to that element. the below example:

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

output the below below like the HTML:

```html
<div class="username invalid-username untouched pristine">
  <label for="username">username:</label>
  <input id="username" type="text">
</div>
```

