/* @flow */

export default function (Vue: GlobalAPI): Object {
  function getValue (options?: Object): any {
    return this._elementable.getValue()
  }

  function checkModified (): boolean {
    return this._elementable.checkModified()
  }

  function willUpdateTouched (options?: any): void {
    if (!this.touched) {
      this.touched = true
      this._fireEvent('touched')
    }
  }

  function willUpdateDirty (): void {
    if (!this.dirty && this.checkModified()) {
      this.dirty = true
      this._fireEvent('dirty')
    }
  }

  function willUpdateModified (): void {
    const modified: boolean = this.modified = this.checkModified()
    if (this._modified !== modified) {
      this._modified = modified
      this._fireEvent('modified', modified)
    }
  }

  function handleInputable (e: Event): void {
    this.willUpdateDirty()
    this.willUpdateModified()
  }

  function watchInputable (val: any): void {
    this.willUpdateDirty()
    this.willUpdateModified()
  }

  function reset (): void {
    this._unwatchValidationRawResults()
    const keys: Array<string> = this._keysCached(this._uid.toString(), this.results)
    for (let i = 0; i < keys.length; i++) {
      this.results[keys[i]] = undefined
      this.progresses[keys[i]] = ''
    }
    this.valid = true
    this.dirty = false
    this.touched = false
    this.modified = false
    this._modified = false
    this._watchValidationRawResults()
  }

  function _watchValidationRawResults (): void {
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
      this._fireEvent(valid ? 'valid' : 'invalid')
    }, { deep: true })
  }

  function _unwatchValidationRawResults (): void {
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
    handleInputable,
    watchInputable,
    reset,
    _watchValidationRawResults,
    _unwatchValidationRawResults
  }
}
