# API Reference

## Global API

### Vue.validator( id, [definition] )

- **Arguments:**
    - `{String} id`
    - `{Function | Object} [definition]`
- **Return:**
    - validator definition function or object

- **Usage:**

  Register or retrieve a global validator.

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

- **See also:**
  - [Custom validator](custom.html)

## Constructor Options

### validators

- **Type:** `Object`

- **Details:**

  A validator definition object to be made available to the Vue instance only.

- **See also:**
  - [Vue.validator()](#vuevalidator-id-definition-)

## Instance Meta Methods

### $activateValidator()

- **Arguments:**
  Nothing

- **Usage:**

  Activate a validator that was delaying initialization with `lazy` attribute of `validator` element.

- **Example:**

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
  
- **See also:**
  - [Lazy initialization](lazy.html)

### $resetValidation( [cb] )

- **Arguments:**
  - `{Function} [cb]`

- **Usage:**

  Reset the validation results.

- **Example:**

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

- **See also:**
  - [Reset validation results](reset.html)

### $setValidationErrors( errors )

- **Arguments:**
  - `Array<Object>` errors
    - `{String}` field
    - `{String}` message
    - `{String}` validator [optional]

- **Argument: field**

  To detect as validation field error, you need to pass in `field` argument.

- **Argument: message**

  To output as validation error messsage, you need to pass in `message` argument.

- **Argument: validator**

  In order to detect where the validator error occurred, you pass in `validator` argument.

- **Usage:**

  Set the `errors` to validation result errors. This is useful when you want to set manually some errors of server-side validation.

- **Example:**

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

- **See also:**
  - [Error messages](errors.html)

### $validate( [field], [touched], [cb] )

- **Arguments:**
  - `{String} [field]`
  - `{Boolean} [touched]`
  - `{Function} [cb]`

- **Usage:**

  Validate the target formalable element fields. 

  - If no `field` argument, validate the all fields;

  - If `touched` argument pass to `true`, `trouched` of validation result set `true`;

- **Example:**

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

- **See also:**
  - [Validation timing customization](timing.html)

## Directives

### v-validate

- **Expects:** `Array | Object`

- **Param Attributes:**
  - `group`
  - `field`
  - `detect-blur`
  - `detect-change`
  - `initial`

- **Usage:**

  Validate form element. For detailed usage, the following the above examples.

- **Example:**

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

- **See also:**
  - [Validator syntax](syntax.html)
  - [Grouping](grouping.html)
  - [Events](events.html)
  - [v-model integration](model.html)
  - [Validation timing customization](timing.html)

## Special Elements

### validator

- **Attributes:**
  - `name` (required)
  - `groups`
  - `lazy`
 
- **Usage:**

  `<validator>` elements serve as validation in formable (input, select and textarea) elements. The `<validator>` element itself will be replaced.

  The validation results keep to scope name prefixed with `$`, specified by the `name` attribute of the `<validator>` element.
  
> NOTE: :warning: Like `$event`, If you specified the validator name that are used with vue.js, it may not work.

- **Example:**

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

- **See also:**
  - [Validation result structure](structure.html)
  - [Grouping](grouping.html)
  - [Lazy initialization](lazy.html)
  - [Validation timing customization](timing.html)
  - [Async validation](async.html)

### validator-errors

- **Attributes:**
  - `validation` (required with v-bind)
  - `component`
  - `partial`
  - `group`
  - `field`

- **Usage:**

  `<validator-errors>` elements serve as outlets for validation error message template. The `<validator-errors>`element itself will be replaced with validator internal default template. If you are specified with `component` attribute or `partial` attribute, validation error message rendered it.

- **Example:**

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

- **See also:**
  - [Error messages](errors.html)
