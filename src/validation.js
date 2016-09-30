/* @flow */
import Group from './group'

export default function (Vue: any) {
  const ValidityGroup = Group(Vue)

  class Validation {
    _host: Component
    _result: Dictionary<Object>
    _validities: Dictionary<ValidityComponent | ValidityGroupComponent>
    _named: Dictionary<ValidityGroupComponent>
    _group: Dictionary<ValidityGroupComponent>
    _watcher: Function
    _validityManager: any // TODO: should be deinfed strict type
    _beginDestroy: boolean

    constructor (options: Object = {}) {
      this._result = {}
      this._host = options.host
      this._named = Object.create(null)
      this._group = Object.create(null)
      this._validities = Object.create(null)
      this._beginDestroy = false
      Vue.util.defineReactive(this._host, '$validation', this._result)
    }

    register (
      field: string,
      validity: ValidityComponent | ValidityGroupComponent,
      options: { named?: string, group?: string } = {}
    ): void {
      // NOTE: lazy setup (in constructor, occured callstack recursive errors ...)
      if (!this._validityManager) {
        this._validityManager = new Vue(ValidityGroup)
        this._watchValidityResult()
      }

      if (this._validities[field]) {
        // TODO: should be output console.error
        return
      }
      this._validities[field] = validity

      const { named, group }: { named?: string, group?: string } = options
      const groupValidity: ?ValidityGroupComponent = group 
        ? this._getValidityGroup('group', group) || this._registerValidityGroup('group', group)
        : null
      const namedValidity: ?ValidityGroupComponent = named
        ? this._getValidityGroup('named', named) || this._registerValidityGroup('named',named)
        : null
      if (named && group && namedValidity && groupValidity) {
        groupValidity.register(field, validity)
        !namedValidity.isRegistered(group) && namedValidity.register(group, groupValidity)
        !this._validityManager.isRegistered(named) && this._validityManager.register(named, namedValidity)
      } else if (namedValidity) {
        namedValidity.register(field, validity)
        !this._validityManager.isRegistered(named) && this._validityManager.register(named, namedValidity)
      } else if (groupValidity) {
        groupValidity.register(field, validity)
        !this._validityManager.isRegistered(group) && this._validityManager.register(group, groupValidity)
      } else {
        this._validityManager.register(field, validity)
      }
    }

    unregister (
      field: string,
      options: { named?: string, group?: string } = {}
    ): void {
      if (!this._validityManager) {
        // TODO: should be output error
        return
      }

      if (!this._validities[field]) {
        // TODO: should be output error
        return
      }
      delete this._validities[field]

      const { named, group }: { named?: string, group?: string } = options
      const groupValidity: ?ValidityGroupComponent = group ? this._getValidityGroup('group', group) : null
      const namedValidity: ?ValidityGroupComponent = named ? this._getValidityGroup('named', named) : null
      if (named && group && namedValidity && groupValidity) {
        groupValidity.unregister(field)
        namedValidity.isRegistered(group) && namedValidity.unregister(group)
        this._validityManager.isRegistered(named) && this._validityManager.unregister(named)
      } else if (namedValidity) {
        namedValidity.unregister(field)
        this._validityManager.isRegistered(named) && this._validityManager.unregister(named)
      } else if (groupValidity) {
        groupValidity.unregister(field)
        this._validityManager.isRegistered(group) && this._validityManager.unregister(group)
      } else {
        this._validityManager.unregister(field)
      }

      group && this._unregisterValidityGroup('group', group)
      named && this._unregisterValidityGroup('named', named)
    }

    destroy (): void {
      const validityKeys = Object.keys(this._validities)
      const namedKeys = Object.keys(this._named)
      const groupKeys = Object.keys(this._group)

      // unregister validity
      validityKeys.forEach((validityKey: string) => {
        groupKeys.forEach((groupKey: string) => {
          const group: ?ValidityGroupComponent = this._getValidityGroup('group', groupKey)
          if (group && group.isRegistered(groupKey)) {
            group.unregister(validityKey)
          }
        })
        namedKeys.forEach((namedKey: string) => {
          const named: ?ValidityGroupComponent = this._getValidityGroup('named', namedKey)
          if (named && named.isRegistered(validityKey)) {
            named.unregister(validityKey)
          }
        })
        if (this._validityManager.isRegistered(validityKey)) {
          this._validityManager.unregister(validityKey)
        }
        delete this._validities[validityKey]
      })

      // unregister grouped validity
      groupKeys.forEach((groupKey: string) => {
        namedKeys.forEach((namedKey: string) => {
          const named: ?ValidityGroupComponent = this._getValidityGroup('named', namedKey)
          if (named && named.isRegistered(groupKey)) {
            named.unregister(groupKey)
          }
        })
        if (this._validityManager.isRegistered(groupKey)) {
          this._validityManager.unregister(groupKey)
        }
        this._unregisterValidityGroup('group', groupKey)
      })

      // unregister named validity
      namedKeys.forEach((namedKey: string) => {
        if (this._validityManager.isRegistered(namedKey)) {
          this._validityManager.unregister(namedKey)
        }
        this._unregisterValidityGroup('named', namedKey)
      })

      this._beginDestroy = true
    }

    _getValidityGroup (type: string, name: string): ?ValidityGroupComponent {
      return type === 'named' ? this._named[name] : this._group[name]
    }

    _registerValidityGroup (type: string, name: string): ValidityGroupComponent {
      const groups = type === 'named' ? this._named : this._group
      groups[name] = new Vue(ValidityGroup)
      return groups[name]
    }

    _unregisterValidityGroup (type: string, name: string): void {
      const groups = type === 'named' ? this._named : this._group
      if (!groups[name]) {
        // TODO: should be warn
        return
      }

      groups[name].$destroy()
      delete groups[name]
    }

    _watchValidityResult (): void {
      const validation = this
      this._watcher = this._validityManager.$watch('results', (val: any, old: any) => {
        Vue.set(this._host, '$validation', val)
        if (this._beginDestroy) {
          this._destroyValidityMananger()
        }
      }, { deep: true })
    }

    _unwatchValidityResult (): void {
      this._watcher()
      delete this._watcher
    }

    _destroyValidityMananger (): void {
      this._unwatchValidityResult()
      this._validityManager.$destroy()
      this._validityManager = null
    }
  }

  return Validation
}
