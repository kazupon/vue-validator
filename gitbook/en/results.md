# Validation Results

## Structure

### `validity` Or `validity-group` Component

When validate the target element with `validity` or `validity-group` component, validation results can get the `result` property from `validity` object. That validation results will be structured the below.

- `valid`: whether target element is valid; if it's valid, then return `true`, else return `false`.
- `invalid`: reverse of `valid`.
- `touched`: whether target element is touched. if target element was focusout or `touch` method, return `true`, else return `false`.
- `untouched`: reverse of `touched`.
- `modified`: whether target element value is modified; if target element value was changed from **initial** value, return `true`, else return `false`.
- `dirty`: whether target element value was changed at least **once**; if so, return `true`, else return `false`.
- `pristine`: reverse of `dirty`.
- `errors`: if invalid target element exist, return error object wrapped with array; error object include field name, validator name, and error message, 
wrapped with array, else `undefined`.

In addtion other than those above, some validators which you specified to `validators` property with `validity` component keep as validation results. that validation result value, if it's valid, then return `false`, else (invalid) return `true`.

the blow is validation result example via `result` property of `validity` object:

```json
{
  "valid": false,
  "invalid": true,
  "dirty": true,
  "pristine": false,
  "touched": true,
  "untouched": false,
  "modified": false,
  "errors": [ // validation errors 
    {
      "field": "username",
      "validator": "minlength",
      "message": "too short username!!"
    }
  ],
  "required": false, // build-in validator, return `false` or `true`
  "minlength": true, // build-in validator
  "email": false // custom validator, return `false or `true
}
```

### `validation` Component

When use the `validation` component and `group` property of `validity` or `validity-group` component, validation resutls can get the `$validation` property of Vue instance. That validation results will be structured the below.

- `valid`: whether **all** fields is valid. if so, then return `true`, else return `false`.
- `invalid`: if invalid field exist even **one** in validate fields, return `true`, else `false`.
- `touched`: if touched field exist **one** in validate fields, return `true`, else `false`.
- `untouched`: whether **all** fields is untouched, if so, return `true`, else `false`.
- `modified`: if modified field exist even **one** in validate fields, return `true`, else `false`.
- `dirty`: if dirty field exist even **one** in validate fields, return `true`, else `false`.
- `pristine`: whether **all** fields is pristine, if so, return `true`, else `false`.
- `errors`: if invalid even one exist, return all field error message wrapped with array, else `undefined`.

The blow is validation result example via `$validation` property of Vue instance:

```json
{
  "validation1": { // key is `name` property of `validation` component
    "valid": false,     // valid of all fields
    "invalid": true,    // invalid of all fields
    "dirty": true,      // dirty of all fields
    "pristine": false,  // pristine of all fields
    "touched": true,    // touched of all fields
    "untouched": false, // untouched of all fields
    "modified": true,   // modified of all fields
    "errors": [         // errors of all fields
      {
        "field": "username",
        "validator": "required"
      },
      {
        "field": "confirm",
        "validator": "minlength"
      }
    ],
    "user": { // 'user' group
      "valid": false,       // valid of 'user' group
      "invalid": true,      // invalid of 'user' group
      "dirty": true,        // dirty of 'user' group
      "pristine": false,    // pristine of 'user' group
      "touched": true,      // touched of 'user' group
      "untouched": false,   // untouched of 'user' group
      "modified": false,    // modified of 'user' group
      "errors": [           // errors of 'user' group
        {
          "field": "username",
          "validator": "required"
        }
      ],
      "username": { // 'username' field: validity object
        "valid": false,
        "invalid": true,
        "dirty": true,
        "pristine": false,
        "touched": true,
        "untouched": false,
        "modified": false,
        "errors": [
          {
            "field": "username",
            "validator": "required"
          }
        ],
        "required": true
      }
    },
    "password": { // 'password' group
      "valid": false,       // valid of 'password' group
      "invalid": true,      // invalid of 'password' group
      "dirty": true,        // dirty of 'password' group
      "pristine": false,    // pristine of 'password' group
      "touched": true,      // touched of 'password' group
      "untouched": false,   // untouched of 'password' group
      "modified": true,     // modified of 'password' group
      "errors": [           // errors of 'password' group
        {
          "field": "confirm",
          "validator": "minlength"
        }
      ],
      "password": { // 'password' field: validity object
        "valid": true,
        "invalid": false,
        "dirty": true,
        "pristine": false,
        "touched": true,
        "untouched": false,
        "modified": true,
        "minlength": false,
        "required": false
      },
      "confirm": { // 'confirm' field: validity object
        "valid": false,
        "invalid": true,
        "dirty": true,
        "pristine": false,
        "touched": true,
        "untouched": false,
        "modified": true,
        "errors": [
          {
            "field": "confirm",
            "validator": "minlength"
          }
        ],
        "minlength": true,
        "required": false
      }
    }
  }
}
```

## Sync with `v-model`

The validation results can get the `result` property from `validity` object. However, synchronizing the validation results with the `data` of Vue instance is bit hassle. You can resolve with using `v-model`.

```html
<div id="app">
  <label for="username">username:</label>
  <validity field="username" v-model="validation" :validators="{ required: true, minlength: 4 }">
    <input type="text" @input="handleValidate">
  </validity>
  <div class="errors">
    <p class="required" v-if="validation.result.required">required username!!</p>
    <p class="minlength" v-if="validation.result.minlength">too short username!!</p>
  </div>
</div>
```
```javascript
new Vue({
  data: {
    validation: {
      result: {} // initial validation result
    }
  },
  methods: {
    handleValidate: function (e) {
      e.target.$validity.validate()
    }
  }
}).$mount('#app')
```

As the above example, the validation results of `validity` object can be synced `validation` in `data` with `v-model` directive.
