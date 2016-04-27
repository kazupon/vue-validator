import { VALIDATE_UPDATE, PRIORITY_VALIDATE_CLASS, REGEX_VALIDATE_DIRECTIVE } from '../const'


let classId = 0 // ID for validation class


export default function (Vue) {
  const vIf = Vue.directive('if')
  const FragmentFactory = Vue.FragmentFactory
  const { toArray, replace, createAnchor } = Vue.util


  /**
   * `v-validate-class` directive
   */

  Vue.directive('validate-class', {
    terminal: true,
    priority: vIf.priority + PRIORITY_VALIDATE_CLASS,

    bind () {
      const id = String(classId++)
      this.setClassIds(this.el, id)

      this.vm.$on(VALIDATE_UPDATE, this.cb = (classIds, validation, results) => {
        if (classIds.indexOf(id) > -1) {
          validation.updateClasses(results, this.frag.node)
        }
      })

      this.setupFragment()
    },

    unbind () {
      this.vm.$off(VALIDATE_UPDATE, this.cb)
      this.teardownFragment()
    },

    setClassIds (el, id) {
      let childNodes = toArray(el.childNodes)
      for (let i = 0, l = childNodes.length; i < l; i++) {
        let element = childNodes[i]
        if (element.nodeType === 1) {
          let hasAttrs = element.hasAttributes()
          let attrs = hasAttrs && toArray(element.attributes)
          for (let k = 0, l = attrs.length; k < l; k++) {
            let attr = attrs[k]
            if (attr.name.match(REGEX_VALIDATE_DIRECTIVE)) {
              let existingId = element.getAttribute(VALIDATE_UPDATE)
              let value = existingId ? (existingId + ',' + id) : id
              element.setAttribute(VALIDATE_UPDATE, value)
            }
          }
        }

        if (element.hasChildNodes()) {
          this.setClassIds(element, id)
        }
      }
    },

    setupFragment () {
      this.anchor = createAnchor('v-validate-class')
      replace(this.el, this.anchor)

      this.factory = new FragmentFactory(this.vm, this.el)
      this.frag = this.factory.create(this._host, this._scope, this._frag)
      this.frag.before(this.anchor)
    },

    teardownFragment () {
      if (this.frag) {
        this.frag.remove()
        this.frag = null
        this.factory = null
      }

      replace(this.anchor, this.el)
      this.anchor = null
    }
  })
}
