<template>
  <validator name="validation">
    <form novalidate>
      <h1>user registration</h1>
      <div class="username">
        <label for="username">username:</label>
        <input id="username" type="text" 
          detect-change="off" v-validate:username="{
          required: { rule: true, message: 'required your name !!' },
          exist: { rule: true, initial: 'off' }
        }" />
        <span v-if="checking">checking ...</span>
      </div>
      <div class="errors">
        <validator-errors :validation="$validation"></validator-errors>
      </div>
      <input type="submit" value="register" :disabled="!$validation.valid" />
    </form>
  </validator>
</template>

<script>
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
    return { checking: false }
  },
  validators: {
    exist (val) {
      this.vm.checking = true // spinner on
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
        this.vm.checking = false // spinner off
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
  }
}
</script>

<style>
body { font-family: Helvetica, sans-serif; }
.errors { color: red; }
</style>
