/* @flow */

export default function (Vue: GlobalAPI): Object {
  const { extend } = Vue.util

  return {
    data (): $ValidityGroupData {
      return {
        valid: true,
        dirty: false,
        touched: false,
        modified: false,
        results: {}
      }
    },
    computed: {
      invalid (): boolean { return !this.valid },
      pristine (): boolean { return !this.dirty },
      untouched (): boolean { return !this.touched },
      result (): $ValidationGroupResult {
        const ret: $ValidationGroupResult = {
          valid: this.valid,
          invalid: this.invalid,
          dirty: this.dirty,
          pristine: this.pristine,
          touched: this.touched,
          untouched: this.untouched,
          modified: this.modified
        }
        const results = this.results
        this._validityKeys.forEach((key: string) => {
          ret[key] = results[key]
          if (ret[key].errors) {
            const errors: any = ret.errors || []
            ret[key].errors.forEach(error => {
              errors.push(error)
            })
            ret.errors = errors
          }
        })
        return ret
      }
    },
    watch: {
      results (val, old): void {
        const keys = this._validityKeys
        const results = this.results
        this.valid = this.checkResults(keys, results, 'valid', true)
        this.dirty = this.checkResults(keys, results, 'dirty', false)
        this.touched = this.checkResults(keys, results, 'touched', false)
        this.modified = this.checkResults(keys, results, 'modified', false)
      }
    },
    created (): void {
      this._validities = Object.create(null)
      this._validityWatchers = Object.create(null)
      this._validityKeys = []
      this._committing = false
    },
    destroyed (): void {
      this._validityKeys.forEach((key: string) => {
        this._validityWatchers[key]()
        delete this._validityWatchers[key]
        delete this._validities[key]
      })
      delete this._validityWatchers
      delete this._validities
      delete this._validityKeys
    },
    methods: {
      register (name: string, validity: ValidityComponent | ValidityGroupComponent): void {
        this._validities[name] = validity
        this._validityKeys = Object.keys(this._validities)
        this.setResults(name, {})
        this.withCommit(() => {
          this._validityWatchers[name] = validity.$watch('result', (val, old) => {
            this.setResults(name, val)
          }, { deep: true, immediate: true })
        })
      },
      unregister (name: string): void {
        this._validityWatchers[name]()
        delete this._validityWatchers[name]
        delete this._validities[name]
        this._validityKeys = Object.keys(this._validities)
        this.withCommit(() => {
          this.resetResults(name)
        })
      },
      isRegistered (name: string): boolean {
        return name in this._validities
      },
      getValidityKeys (): Array<string> {
        return this._validityKeys
      },
      checkResults (
        keys: Array<string>,
        results: $ValidityGroupResult,
        prop: string,
        checking: boolean
      ): boolean {
        let ret: boolean = checking
        for (let i: number = 0; i < keys.length; i++) {
          const result: ValidationResult = results[keys[i]]
          if (result[prop] !== checking) {
            ret = !checking
            break
          }
        }
        return ret
      },
      setResults (name: string, val: Object | ValidationResult): void {
        const newVal: $ValidityGroupResult = {}
        this._validityKeys.forEach((key: string) => {
          newVal[key] = extend({}, this.results[key])
        })
        newVal[name] = extend({}, val)
        this.results = newVal
      },
      resetResults (ignore: ?string): void {
        const newVal: $ValidityGroupResult = {}
        this._validityKeys.forEach((key: string) => {
          if (ignore && ignore !== key) {
            newVal[key] = extend({}, this.results[key])
          }
        })
        this.results = newVal
      },
      withCommit (fn: Function): void {
        const committing = this._committing
        this._committing = true
        fn()
        this._committing = committing
      }
    }
  }
}
