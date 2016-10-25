<template>
  <form novalidate>
    <h1>user registration</h1>
    <div class="username">
      <label for="username">username:</label>
      <validity ref="validity" field="username" :validators="{
        required: { message: 'required your name !!' },
        exist: true
      }">
        <input id="username" type="text" @focusout="handleValidate">
      </validity>
    </div>
    <div class="errors">
      <p v-for="error in result.errors">{{error.message}}</p>
    </div>
    <p v-if="progresses.exist">username checking ...</p>
    <input type="submit" value="register" :disabled="!result.valid" />
    <div class="result">
      <p>validation result:</p>
      <pre>{{result}}</pre>
    </div>
    <div class="progresses">
      <p>progresses:</p>
      <pre>{{progresses}}</pre>
    </div>
  </form>
</template>

<script>
import { mapValidation } from 'vue-validator'

function copyOwnFrom (target, source) {
  Object.getOwnPropertyNames(source).forEach(function (propName) {
    Object.defineProperty(target, propName, Object.getOwnPropertyDescriptor(source, propName))
  })
  return target
}

function ValidationError () {
  copyOwnFrom(this, Error.apply(null, arguments))
}
ValidationError.prototype = Object.create(Error.prototype)
ValidationError.prototype.constructor = ValidationError

export default {
  data () {
    return {
      result: {},
      progresses: {}
    }
  },

  validators: {
    exist (val) {
      return fetch('/validations/exist', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: val
        })
      }).then((res) => {
        return res.json()
      }).then((json) => {
        return Object.keys(json).length > 0 
          ? Promise.reject(new ValidationError(json.message))
          : Promise.resolve()
      }).catch((error) => {
        if (error instanceof ValidationError) {
          return Promise.reject(error.message)
        } else {
          return Promise.reject('unexpected error')
        }
      })
    }
  },

  mounted () {
    const $validity = this.$refs.validity

    // setup initial states
    this.progresses = $validity.progresses
    this.result = $validity.result

    // watch progresses
    this._progressWatcher = $validity.$watch('progresses', (val, old) => {
      this.progresses = val
    }, { deep: true })
  },

  destroyed () {
    this._progressWatcher()
  },

  methods: {
    handleValidate: function (e) {
      const $validity = this.$refs.validity

      $validity.validate({ validator: 'required' }, () => {
        if ($validity.result.required) { // if required is invalid, not go to next 'exist'
          // set validation result
          this.result = $validity.result
          return
        }

        $validity.validate({ validator: 'exist' }, () => {
          // set validation result
          this.result = $validity.result
        })
      })
    }
  }
}
</script>

<style>
body { font-family: Helvetica, sans-serif; }
.errors { color: red; }
</style>
