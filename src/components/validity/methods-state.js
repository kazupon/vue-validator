/* @flow */
import { addClass, removeClass, toggleClasses } from '../../util'

export default function (Vue: GlobalAPI): Object {
  const { isPlainObject } = Vue.util

  function getValue (options?: Object): any {
    return this._elementable.getValue()
  }

  function checkModified (): boolean {
    return this._elementable.checkModified()
  }

  function willUpdateTouched (options?: any): void {
    if (!this.touched) {
      this.touched = true
      toggleClasses(this.$el, this.classes.touched, addClass)
      toggleClasses(this.$el, this.classes.untouched, removeClass)
      this._fireEvent('touched')
    }
  }

  function willUpdateDirty (): void {
    if (!this.dirty && this.checkModified()) {
      this.dirty = true
      toggleClasses(this.$el, this.classes.dirty, addClass)
      toggleClasses(this.$el, this.classes.pristine, removeClass)
      this._fireEvent('dirty')
    }
  }

  function willUpdateModified (): void {
    const modified: boolean = this.modified = this.checkModified()
    if (this._modified !== modified) {
      this._modified = modified
      toggleClasses(this.$el, this.classes.modified, modified ? addClass : removeClass)
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

  function _initStates (keys: Array<string>, target: any, init = undefined) {
    for (let i = 0; i < keys.length; i++) {
      const result = target[keys[i]]
      if (isPlainObject(result)) {
        const nestedKeys = Object.keys(result)
        _initStates(nestedKeys, result, init)
      } else {
        target[keys[i]] = init
      }
    }
  }

  function reset (): void {
    this._unwatchValidationRawResults()
    const keys: Array<string> = this._keysCached(this._uid.toString(), this.results)
    _initStates(keys, this.results, undefined)
    _initStates(keys, this.progresses, '')
    toggleClasses(this.$el, this.classes.valid, removeClass)
    toggleClasses(this.$el, this.classes.invalid, removeClass)
    toggleClasses(this.$el, this.classes.touched, removeClass)
    toggleClasses(this.$el, this.classes.untouched, addClass)
    toggleClasses(this.$el, this.classes.dirty, removeClass)
    toggleClasses(this.$el, this.classes.pristine, addClass)
    toggleClasses(this.$el, this.classes.modified, removeClass)
    this.valid = true
    this.dirty = false
    this.touched = false
    this.modified = false
    this._modified = false
    this._watchValidationRawResults()
  }

  function _walkValid (keys: Array<string>, target: any): boolean {
    let valid = true
    for (let i = 0; i < keys.length; i++) {
      const result = target[keys[i]]
      if (typeof result === 'boolean' && !result) {
        valid = false
        break
      }
      if (typeof result === 'string' && result) {
        valid = false
        break
      }
      if (isPlainObject(result)) {
        const nestedKeys = Object.keys(result)
        valid = _walkValid(nestedKeys, result)
        if (!valid) {
          break
        }
      }
    }
    return valid
  }

  function _watchValidationRawResults (): void {
    this._unwatch = this.$watch('results', (val: Object) => {
      this.valid = _walkValid(this._keysCached(this._uid.toString(), this.results), this.results)
      if (this.valid) {
        toggleClasses(this.$el, this.classes.valid, addClass)
        toggleClasses(this.$el, this.classes.invalid, removeClass)
      } else {
        toggleClasses(this.$el, this.classes.valid, removeClass)
        toggleClasses(this.$el, this.classes.invalid, addClass)
      }

      this._fireEvent(this.valid ? 'valid' : 'invalid')
    }, { deep: true })
  }

  function _unwatchValidationRawResults (): void {
    this._unwatch()
    this._unwatch = undefined
    delete this._unwatch
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
