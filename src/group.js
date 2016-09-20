/* @flow */

export default function (Vue: GlobalAPI): Object {
  const { extend } = Vue.util

  return {
    data () {
      return {
        valid: true,
        dirty: false,
        touched: false,
        modified: false,
        results: {}
      }
    },
    computed: {
      invalid () { return !this.valid },
      pristine () { return !this.dirty },
      untouched () { return !this.touched },
      result () {
        const ret = {
          valid: this.valid,
          invalid: this.invalid,
          dirty: this.dirty,
          pristine: this.pristine,
          touched: this.touched,
          untouched: this.untouched,
          modified: this.modified
        }
        const results = this.results
        this._validityKeys.forEach(key => {
          ret[key] = results[key]
        })
        return ret
      }
    },
    created () {
      this._validities = Object.create(null)
      this._validityWatchers = Object.create(null)
      this._committing = false
      this.watchResults()
    },
    destroyed () {
      this.unwatchResults()
      this._validityKeys.forEach(key => {
        delete this._validityWatchers[key]
        delete this._validities[key]
      })
      delete this['_validityWatchers']
      delete this['_validities']
      delete this['_validityKeys']
    },
    methods: {
      register (name, validity) {
        this._validities[name] = validity
        this._validityKeys = Object.keys(this._validities)
        this.setResults(name, {})
        this.withCommit(() => {
          this._validityWatchers[name] = validity.$watch('result', (val, old) => {
            this.setResults(name, val)
          }, { deep: true, immediate: true })
        })
      },
      unregister (name) {
        this._validityWatchers[name]()
        delete this._validityWatchers[name]
        delete this._validities[name]
        this._validityKeys = Object.keys(this._validities)
        this.withCommit(() => {
          this.resetResults(name)
        })
      },
      checkResults (keys, results, prop, checking) {
        let ret = checking
        for (let i = 0; i < keys.length; i++) {
          const result = results[keys[i]]
          if (result[prop] !== checking) {
            ret = !checking
            break
          }
        }
        return ret
      },
      watchResults () {
        this._unwatch = this.$watch('results', (val, old) => {
          const keys = this._validityKeys
          const results = this.results
          this.valid = this.checkResults(keys, results, 'valid', true)
          this.dirty = this.checkResults(keys, results, 'dirty', false)
          this.touched = this.checkResults(keys, results, 'touched', false)
          this.modified = this.checkResults(keys, results, 'modified', false)
        }, { deep: true })
      },
      unwatchResults () {
        this._unwatch()
        delete this['_unwatch']
      },
      setResults (name, val) {
        const newVal = {}
        this._validityKeys.forEach(key => {
          newVal[key] = extend({}, this.results[key])
        })
        newVal[name] = extend({}, val)
        this.results = newVal
      },
      resetResults (ignore) {
        const newVal = {}
        this._validityKeys.forEach(key => {
          if (ignore && ignore !== key) {
            newVal[key] = extend({}, this.results[key])
          }
        })
        this.results = newVal
      },
      withCommit (fn) {
        const committing = this._committing
        this._committing = true
        fn()
        this._committing = committing
      }
    }
  }
}
