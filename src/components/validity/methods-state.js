/* @flow */

export default function (Vue: GlobalAPI): Object {
  function getValue (options?: Object): any {
    return 'value'
  }

  function checkModified (options?: Object): boolean {
    return this._initValue !== this.getValue(options)
  }

  function willUpdateTouched (options?: Object): void {
    if (!this.touched) {
      this.touched = true
      this.fireEvent('touched')
    }
  }

  function willUpdateDirty (options?: Object): void {
    if (!this.dirty && this.checkModified(options)) {
      this.dirty = true
      this.fireEvent('dirty')
    }
  }

  function willUpdateModified (options?: Object): void {
    const modified: boolean = this.modified = this.checkModified(options)
    if (this._modified !== modified) {
      this._modified = modified
      this.fireEvent('modified', modified)
    }
  }

  function reset (): void {
    this.unwatchValidationRawResults()
    const keys: Array<string> = this._keysCached(this._uid.toString(), this.results)
    for (let i = 0; i < keys.length; i++) {
      this.results[keys[i]] = undefined
    }
    this.valid = true
    this.dirty = false
    this.touched = false
    this.modified = false
    this._modified = false
    this.watchValidationRawResults()
  }

  function watchValidationRawResults (): void {
    this._unwatch = this.$watch('results', (val: Object) => {
      let valid: boolean = true
      const keys: Array<string> = this._keysCached(this._uid.toString(), this.results)
      for (let i = 0; i < keys.length; i++) {
        const result: $ValidationRawResult = this.results[keys[i]]
        if (typeof result === 'boolean' && !result) {
          valid = false
          break
        }
        if (typeof result === 'string' && result) {
          valid = false
          break
        }
      }
      this.valid = valid
      this.fireEvent(valid ? 'valid' : 'invalid')
    }, { deep: true })
  }

  function unwatchValidationRawResults (): void {
    this._unwatch()
    this._unwatch = undefined
    delete this['_unwatch']
  }

  return {
    getValue,
    checkModified,
    willUpdateTouched,
    willUpdateDirty,
    willUpdateModified,
    reset,
    watchValidationRawResults,
    unwatchValidationRawResults
  }
}
