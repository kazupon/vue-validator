/**
 * Require the module at `name`.
 *
 * @param {String} name
 * @return {Object} exports
 * @api public
 */

function require(name) {
  var module = require.modules[name];
  if (!module) throw new Error('failed to require "' + name + '"');

  if (!('exports' in module) && typeof module.definition === 'function') {
    module.client = module.component = true;
    module.definition.call(this, module.exports = {}, module);
    delete module.definition;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Register module at `name` with callback `definition`.
 *
 * @param {String} name
 * @param {Function} definition
 * @api private
 */

require.register = function (name, definition) {
  require.modules[name] = {
    definition: definition
  };
};

/**
 * Define a module's exports immediately with `exports`.
 *
 * @param {String} name
 * @param {Generic} exports
 * @api private
 */

require.define = function (name, exports) {
  require.modules[name] = {
    exports: exports
  };
};
require.register("yyx990803~vue@v0.10.4", Function("exports, module",
"var config      = require(\"yyx990803~vue@v0.10.4/src/config.js\"),\n\
    ViewModel   = require(\"yyx990803~vue@v0.10.4/src/viewmodel.js\"),\n\
    utils       = require(\"yyx990803~vue@v0.10.4/src/utils.js\"),\n\
    makeHash    = utils.hash,\n\
    assetTypes  = ['directive', 'filter', 'partial', 'effect', 'component']\n\
\n\
// require these so Browserify can catch them\n\
// so they can be used in Vue.require\n\
require(\"yyx990803~vue@v0.10.4/src/observer.js\")\n\
require(\"yyx990803~vue@v0.10.4/src/transition.js\")\n\
\n\
ViewModel.options = config.globalAssets = {\n\
    directives  : require(\"yyx990803~vue@v0.10.4/src/directives/index.js\"),\n\
    filters     : require(\"yyx990803~vue@v0.10.4/src/filters.js\"),\n\
    partials    : makeHash(),\n\
    effects     : makeHash(),\n\
    components  : makeHash()\n\
}\n\
\n\
/**\n\
 *  Expose asset registration methods\n\
 */\n\
assetTypes.forEach(function (type) {\n\
    ViewModel[type] = function (id, value) {\n\
        var hash = this.options[type + 's']\n\
        if (!hash) {\n\
            hash = this.options[type + 's'] = makeHash()\n\
        }\n\
        if (!value) return hash[id]\n\
        if (type === 'partial') {\n\
            value = utils.toFragment(value)\n\
        } else if (type === 'component') {\n\
            value = utils.toConstructor(value)\n\
        } else if (type === 'filter') {\n\
            utils.checkFilter(value)\n\
        }\n\
        hash[id] = value\n\
        return this\n\
    }\n\
})\n\
\n\
/**\n\
 *  Set config options\n\
 */\n\
ViewModel.config = function (opts, val) {\n\
    if (typeof opts === 'string') {\n\
        if (val === undefined) {\n\
            return config[opts]\n\
        } else {\n\
            config[opts] = val\n\
        }\n\
    } else {\n\
        utils.extend(config, opts)\n\
    }\n\
    return this\n\
}\n\
\n\
/**\n\
 *  Expose an interface for plugins\n\
 */\n\
ViewModel.use = function (plugin) {\n\
    if (typeof plugin === 'string') {\n\
        try {\n\
            plugin = require(plugin)\n\
        } catch (e) {\n\
            utils.warn('Cannot find plugin: ' + plugin)\n\
            return\n\
        }\n\
    }\n\
\n\
    // additional parameters\n\
    var args = [].slice.call(arguments, 1)\n\
    args.unshift(this)\n\
\n\
    if (typeof plugin.install === 'function') {\n\
        plugin.install.apply(plugin, args)\n\
    } else {\n\
        plugin.apply(null, args)\n\
    }\n\
    return this\n\
}\n\
\n\
/**\n\
 *  Expose internal modules for plugins\n\
 */\n\
ViewModel.require = function (path) {\n\
    return require('./' + path)\n\
}\n\
\n\
ViewModel.extend = extend\n\
ViewModel.nextTick = utils.nextTick\n\
\n\
/**\n\
 *  Expose the main ViewModel class\n\
 *  and add extend method\n\
 */\n\
function extend (options) {\n\
\n\
    var ParentVM = this\n\
\n\
    // extend data options need to be copied\n\
    // on instantiation\n\
    if (options.data) {\n\
        options.defaultData = options.data\n\
        delete options.data\n\
    }\n\
\n\
    // inherit options\n\
    // but only when the super class is not the native Vue.\n\
    if (ParentVM !== ViewModel) {\n\
        options = inheritOptions(options, ParentVM.options, true)\n\
    }\n\
    utils.processOptions(options)\n\
\n\
    var ExtendedVM = function (opts, asParent) {\n\
        if (!asParent) {\n\
            opts = inheritOptions(opts, options, true)\n\
        }\n\
        ParentVM.call(this, opts, true)\n\
    }\n\
\n\
    // inherit prototype props\n\
    var proto = ExtendedVM.prototype = Object.create(ParentVM.prototype)\n\
    utils.defProtected(proto, 'constructor', ExtendedVM)\n\
\n\
    // allow extended VM to be further extended\n\
    ExtendedVM.extend  = extend\n\
    ExtendedVM.super   = ParentVM\n\
    ExtendedVM.options = options\n\
\n\
    // allow extended VM to add its own assets\n\
    assetTypes.forEach(function (type) {\n\
        ExtendedVM[type] = ViewModel[type]\n\
    })\n\
\n\
    // allow extended VM to use plugins\n\
    ExtendedVM.use     = ViewModel.use\n\
    ExtendedVM.require = ViewModel.require\n\
\n\
    return ExtendedVM\n\
}\n\
\n\
/**\n\
 *  Inherit options\n\
 *\n\
 *  For options such as `data`, `vms`, `directives`, 'partials',\n\
 *  they should be further extended. However extending should only\n\
 *  be done at top level.\n\
 *  \n\
 *  `proto` is an exception because it's handled directly on the\n\
 *  prototype.\n\
 *\n\
 *  `el` is an exception because it's not allowed as an\n\
 *  extension option, but only as an instance option.\n\
 */\n\
function inheritOptions (child, parent, topLevel) {\n\
    child = child || {}\n\
    if (!parent) return child\n\
    for (var key in parent) {\n\
        if (key === 'el') continue\n\
        var val = child[key],\n\
            parentVal = parent[key]\n\
        if (topLevel && typeof val === 'function' && parentVal) {\n\
            // merge hook functions into an array\n\
            child[key] = [val]\n\
            if (Array.isArray(parentVal)) {\n\
                child[key] = child[key].concat(parentVal)\n\
            } else {\n\
                child[key].push(parentVal)\n\
            }\n\
        } else if (\n\
            topLevel &&\n\
            (utils.isTrueObject(val) || utils.isTrueObject(parentVal))\n\
            && !(parentVal instanceof ViewModel)\n\
        ) {\n\
            // merge toplevel object options\n\
            child[key] = inheritOptions(val, parentVal)\n\
        } else if (val === undefined) {\n\
            // inherit if child doesn't override\n\
            child[key] = parentVal\n\
        }\n\
    }\n\
    return child\n\
}\n\
\n\
module.exports = ViewModel\n\
//# sourceURL=components/yyx990803/vue/v0.10.4/src/main.js"
));

require.register("yyx990803~vue@v0.10.4/src/emitter.js", Function("exports, module",
"var slice = [].slice\n\
\n\
function Emitter (ctx) {\n\
    this._ctx = ctx || this\n\
}\n\
\n\
var EmitterProto = Emitter.prototype\n\
\n\
EmitterProto.on = function (event, fn) {\n\
    this._cbs = this._cbs || {}\n\
    ;(this._cbs[event] = this._cbs[event] || [])\n\
        .push(fn)\n\
    return this\n\
}\n\
\n\
EmitterProto.once = function (event, fn) {\n\
    var self = this\n\
    this._cbs = this._cbs || {}\n\
\n\
    function on () {\n\
        self.off(event, on)\n\
        fn.apply(this, arguments)\n\
    }\n\
\n\
    on.fn = fn\n\
    this.on(event, on)\n\
    return this\n\
}\n\
\n\
EmitterProto.off = function (event, fn) {\n\
    this._cbs = this._cbs || {}\n\
\n\
    // all\n\
    if (!arguments.length) {\n\
        this._cbs = {}\n\
        return this\n\
    }\n\
\n\
    // specific event\n\
    var callbacks = this._cbs[event]\n\
    if (!callbacks) return this\n\
\n\
    // remove all handlers\n\
    if (arguments.length === 1) {\n\
        delete this._cbs[event]\n\
        return this\n\
    }\n\
\n\
    // remove specific handler\n\
    var cb\n\
    for (var i = 0; i < callbacks.length; i++) {\n\
        cb = callbacks[i]\n\
        if (cb === fn || cb.fn === fn) {\n\
            callbacks.splice(i, 1)\n\
            break\n\
        }\n\
    }\n\
    return this\n\
}\n\
\n\
/**\n\
 *  The internal, faster emit with fixed amount of arguments\n\
 *  using Function.call\n\
 */\n\
EmitterProto.emit = function (event, a, b, c) {\n\
    this._cbs = this._cbs || {}\n\
    var callbacks = this._cbs[event]\n\
\n\
    if (callbacks) {\n\
        callbacks = callbacks.slice(0)\n\
        for (var i = 0, len = callbacks.length; i < len; i++) {\n\
            callbacks[i].call(this._ctx, a, b, c)\n\
        }\n\
    }\n\
\n\
    return this\n\
}\n\
\n\
/**\n\
 *  The external emit using Function.apply\n\
 */\n\
EmitterProto.applyEmit = function (event) {\n\
    this._cbs = this._cbs || {}\n\
    var callbacks = this._cbs[event], args\n\
\n\
    if (callbacks) {\n\
        callbacks = callbacks.slice(0)\n\
        args = slice.call(arguments, 1)\n\
        for (var i = 0, len = callbacks.length; i < len; i++) {\n\
            callbacks[i].apply(this._ctx, args)\n\
        }\n\
    }\n\
\n\
    return this\n\
}\n\
\n\
module.exports = Emitter\n\
//# sourceURL=components/yyx990803/vue/v0.10.4/src/emitter.js"
));

require.register("yyx990803~vue@v0.10.4/src/config.js", Function("exports, module",
"var TextParser = require(\"yyx990803~vue@v0.10.4/src/text-parser.js\")\n\
\n\
module.exports = {\n\
    prefix         : 'v',\n\
    debug          : false,\n\
    silent         : false,\n\
    enterClass     : 'v-enter',\n\
    leaveClass     : 'v-leave',\n\
    interpolate    : true\n\
}\n\
\n\
Object.defineProperty(module.exports, 'delimiters', {\n\
    get: function () {\n\
        return TextParser.delimiters\n\
    },\n\
    set: function (delimiters) {\n\
        TextParser.setDelimiters(delimiters)\n\
    }\n\
})\n\
//# sourceURL=components/yyx990803/vue/v0.10.4/src/config.js"
));

require.register("yyx990803~vue@v0.10.4/src/utils.js", Function("exports, module",
"var config    = require(\"yyx990803~vue@v0.10.4/src/config.js\"),\n\
    toString  = ({}).toString,\n\
    win       = window,\n\
    console   = win.console,\n\
    def       = Object.defineProperty,\n\
    OBJECT    = 'object',\n\
    THIS_RE   = /[^\\w]this[^\\w]/,\n\
    hasClassList = 'classList' in document.documentElement,\n\
    ViewModel // late def\n\
\n\
var defer =\n\
    win.requestAnimationFrame ||\n\
    win.webkitRequestAnimationFrame ||\n\
    win.setTimeout\n\
\n\
var utils = module.exports = {\n\
\n\
    /**\n\
     *  Convert a string template to a dom fragment\n\
     */\n\
    toFragment: require(\"yyx990803~vue@v0.10.4/src/fragment.js\"),\n\
\n\
    /**\n\
     *  get a value from an object keypath\n\
     */\n\
    get: function (obj, key) {\n\
        /* jshint eqeqeq: false */\n\
        if (key.indexOf('.') < 0) {\n\
            return obj[key]\n\
        }\n\
        var path = key.split('.'),\n\
            d = -1, l = path.length\n\
        while (++d < l && obj != null) {\n\
            obj = obj[path[d]]\n\
        }\n\
        return obj\n\
    },\n\
\n\
    /**\n\
     *  set a value to an object keypath\n\
     */\n\
    set: function (obj, key, val) {\n\
        /* jshint eqeqeq: false */\n\
        if (key.indexOf('.') < 0) {\n\
            obj[key] = val\n\
            return\n\
        }\n\
        var path = key.split('.'),\n\
            d = -1, l = path.length - 1\n\
        while (++d < l) {\n\
            if (obj[path[d]] == null) {\n\
                obj[path[d]] = {}\n\
            }\n\
            obj = obj[path[d]]\n\
        }\n\
        obj[path[d]] = val\n\
    },\n\
\n\
    /**\n\
     *  return the base segment of a keypath\n\
     */\n\
    baseKey: function (key) {\n\
        return key.indexOf('.') > 0\n\
            ? key.split('.')[0]\n\
            : key\n\
    },\n\
\n\
    /**\n\
     *  Create a prototype-less object\n\
     *  which is a better hash/map\n\
     */\n\
    hash: function () {\n\
        return Object.create(null)\n\
    },\n\
\n\
    /**\n\
     *  get an attribute and remove it.\n\
     */\n\
    attr: function (el, type) {\n\
        var attr = config.prefix + '-' + type,\n\
            val = el.getAttribute(attr)\n\
        if (val !== null) {\n\
            el.removeAttribute(attr)\n\
        }\n\
        return val\n\
    },\n\
\n\
    /**\n\
     *  Define an ienumerable property\n\
     *  This avoids it being included in JSON.stringify\n\
     *  or for...in loops.\n\
     */\n\
    defProtected: function (obj, key, val, enumerable, writable) {\n\
        def(obj, key, {\n\
            value        : val,\n\
            enumerable   : enumerable,\n\
            writable     : writable,\n\
            configurable : true\n\
        })\n\
    },\n\
\n\
    /**\n\
     *  A less bullet-proof but more efficient type check\n\
     *  than Object.prototype.toString\n\
     */\n\
    isObject: function (obj) {\n\
        return typeof obj === OBJECT && obj && !Array.isArray(obj)\n\
    },\n\
\n\
    /**\n\
     *  A more accurate but less efficient type check\n\
     */\n\
    isTrueObject: function (obj) {\n\
        return toString.call(obj) === '[object Object]'\n\
    },\n\
\n\
    /**\n\
     *  Most simple bind\n\
     *  enough for the usecase and fast than native bind()\n\
     */\n\
    bind: function (fn, ctx) {\n\
        return function (arg) {\n\
            return fn.call(ctx, arg)\n\
        }\n\
    },\n\
\n\
    /**\n\
     *  Make sure null and undefined output empty string\n\
     */\n\
    guard: function (value) {\n\
        /* jshint eqeqeq: false, eqnull: true */\n\
        return value == null\n\
            ? ''\n\
            : (typeof value == 'object')\n\
                ? JSON.stringify(value)\n\
                : value\n\
    },\n\
\n\
    /**\n\
     *  When setting value on the VM, parse possible numbers\n\
     */\n\
    checkNumber: function (value) {\n\
        return (isNaN(value) || value === null || typeof value === 'boolean')\n\
            ? value\n\
            : Number(value)\n\
    },\n\
\n\
    /**\n\
     *  simple extend\n\
     */\n\
    extend: function (obj, ext) {\n\
        for (var key in ext) {\n\
            if (obj[key] !== ext[key]) {\n\
                obj[key] = ext[key]\n\
            }\n\
        }\n\
        return obj\n\
    },\n\
\n\
    /**\n\
     *  filter an array with duplicates into uniques\n\
     */\n\
    unique: function (arr) {\n\
        var hash = utils.hash(),\n\
            i = arr.length,\n\
            key, res = []\n\
        while (i--) {\n\
            key = arr[i]\n\
            if (hash[key]) continue\n\
            hash[key] = 1\n\
            res.push(key)\n\
        }\n\
        return res\n\
    },\n\
\n\
    /**\n\
     *  Convert the object to a ViewModel constructor\n\
     *  if it is not already one\n\
     */\n\
    toConstructor: function (obj) {\n\
        ViewModel = ViewModel || require(\"yyx990803~vue@v0.10.4/src/viewmodel.js\")\n\
        return utils.isObject(obj)\n\
            ? ViewModel.extend(obj)\n\
            : typeof obj === 'function'\n\
                ? obj\n\
                : null\n\
    },\n\
\n\
    /**\n\
     *  Check if a filter function contains references to `this`\n\
     *  If yes, mark it as a computed filter.\n\
     */\n\
    checkFilter: function (filter) {\n\
        if (THIS_RE.test(filter.toString())) {\n\
            filter.computed = true\n\
        }\n\
    },\n\
\n\
    /**\n\
     *  convert certain option values to the desired format.\n\
     */\n\
    processOptions: function (options) {\n\
        var components = options.components,\n\
            partials   = options.partials,\n\
            template   = options.template,\n\
            filters    = options.filters,\n\
            key\n\
        if (components) {\n\
            for (key in components) {\n\
                components[key] = utils.toConstructor(components[key])\n\
            }\n\
        }\n\
        if (partials) {\n\
            for (key in partials) {\n\
                partials[key] = utils.toFragment(partials[key])\n\
            }\n\
        }\n\
        if (filters) {\n\
            for (key in filters) {\n\
                utils.checkFilter(filters[key])\n\
            }\n\
        }\n\
        if (template) {\n\
            options.template = utils.toFragment(template)\n\
        }\n\
    },\n\
\n\
    /**\n\
     *  used to defer batch updates\n\
     */\n\
    nextTick: function (cb) {\n\
        defer(cb, 0)\n\
    },\n\
\n\
    /**\n\
     *  add class for IE9\n\
     *  uses classList if available\n\
     */\n\
    addClass: function (el, cls) {\n\
        if (hasClassList) {\n\
            el.classList.add(cls)\n\
        } else {\n\
            var cur = ' ' + el.className + ' '\n\
            if (cur.indexOf(' ' + cls + ' ') < 0) {\n\
                el.className = (cur + cls).trim()\n\
            }\n\
        }\n\
    },\n\
\n\
    /**\n\
     *  remove class for IE9\n\
     */\n\
    removeClass: function (el, cls) {\n\
        if (hasClassList) {\n\
            el.classList.remove(cls)\n\
        } else {\n\
            var cur = ' ' + el.className + ' ',\n\
                tar = ' ' + cls + ' '\n\
            while (cur.indexOf(tar) >= 0) {\n\
                cur = cur.replace(tar, ' ')\n\
            }\n\
            el.className = cur.trim()\n\
        }\n\
    },\n\
\n\
    /**\n\
     *  Convert an object to Array\n\
     *  used in v-repeat and array filters\n\
     */\n\
    objectToArray: function (obj) {\n\
        var res = [], val, data\n\
        for (var key in obj) {\n\
            val = obj[key]\n\
            data = utils.isObject(val)\n\
                ? val\n\
                : { $value: val }\n\
            data.$key = key\n\
            res.push(data)\n\
        }\n\
        return res\n\
    }\n\
}\n\
\n\
enableDebug()\n\
function enableDebug () {\n\
    /**\n\
     *  log for debugging\n\
     */\n\
    utils.log = function (msg) {\n\
        if (config.debug && console) {\n\
            console.log(msg)\n\
        }\n\
    }\n\
    \n\
    /**\n\
     *  warnings, traces by default\n\
     *  can be suppressed by `silent` option.\n\
     */\n\
    utils.warn = function (msg) {\n\
        if (!config.silent && console) {\n\
            console.warn(msg)\n\
            if (config.debug && console.trace) {\n\
                console.trace()\n\
            }\n\
        }\n\
    }\n\
}\n\
//# sourceURL=components/yyx990803/vue/v0.10.4/src/utils.js"
));

require.register("yyx990803~vue@v0.10.4/src/fragment.js", Function("exports, module",
"// string -> DOM conversion\n\
// wrappers originally from jQuery, scooped from component/domify\n\
var map = {\n\
    legend   : [1, '<fieldset>', '</fieldset>'],\n\
    tr       : [2, '<table><tbody>', '</tbody></table>'],\n\
    col      : [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],\n\
    _default : [0, '', '']\n\
}\n\
\n\
map.td =\n\
map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>']\n\
\n\
map.option =\n\
map.optgroup = [1, '<select multiple=\"multiple\">', '</select>']\n\
\n\
map.thead =\n\
map.tbody =\n\
map.colgroup =\n\
map.caption =\n\
map.tfoot = [1, '<table>', '</table>']\n\
\n\
map.text =\n\
map.circle =\n\
map.ellipse =\n\
map.line =\n\
map.path =\n\
map.polygon =\n\
map.polyline =\n\
map.rect = [1, '<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\">','</svg>']\n\
\n\
var TAG_RE = /<([\\w:]+)/\n\
\n\
module.exports = function (template) {\n\
\n\
    if (typeof template !== 'string') {\n\
        return template\n\
    }\n\
\n\
    // template by ID\n\
    if (template.charAt(0) === '#') {\n\
        var templateNode = document.getElementById(template.slice(1))\n\
        if (!templateNode) return\n\
        // if its a template tag and the browser supports it,\n\
        // its content is already a document fragment!\n\
        if (templateNode.tagName === 'TEMPLATE' && templateNode.content) {\n\
            return templateNode.content\n\
        }\n\
        template = templateNode.innerHTML\n\
    }\n\
\n\
    var frag = document.createDocumentFragment(),\n\
        m = TAG_RE.exec(template)\n\
    // text only\n\
    if (!m) {\n\
        frag.appendChild(document.createTextNode(template))\n\
        return frag\n\
    }\n\
\n\
    var tag = m[1],\n\
        wrap = map[tag] || map._default,\n\
        depth = wrap[0],\n\
        prefix = wrap[1],\n\
        suffix = wrap[2],\n\
        node = document.createElement('div')\n\
\n\
    node.innerHTML = prefix + template.trim() + suffix\n\
    while (depth--) node = node.lastChild\n\
\n\
    // one element\n\
    if (node.firstChild === node.lastChild) {\n\
        frag.appendChild(node.firstChild)\n\
        return frag\n\
    }\n\
\n\
    // multiple nodes, return a fragment\n\
    var child\n\
    /* jshint boss: true */\n\
    while (child = node.firstChild) {\n\
        if (node.nodeType === 1) {\n\
            frag.appendChild(child)\n\
        }\n\
    }\n\
    return frag\n\
}\n\
//# sourceURL=components/yyx990803/vue/v0.10.4/src/fragment.js"
));

require.register("yyx990803~vue@v0.10.4/src/compiler.js", Function("exports, module",
"var Emitter     = require(\"yyx990803~vue@v0.10.4/src/emitter.js\"),\n\
    Observer    = require(\"yyx990803~vue@v0.10.4/src/observer.js\"),\n\
    config      = require(\"yyx990803~vue@v0.10.4/src/config.js\"),\n\
    utils       = require(\"yyx990803~vue@v0.10.4/src/utils.js\"),\n\
    Binding     = require(\"yyx990803~vue@v0.10.4/src/binding.js\"),\n\
    Directive   = require(\"yyx990803~vue@v0.10.4/src/directive.js\"),\n\
    TextParser  = require(\"yyx990803~vue@v0.10.4/src/text-parser.js\"),\n\
    DepsParser  = require(\"yyx990803~vue@v0.10.4/src/deps-parser.js\"),\n\
    ExpParser   = require(\"yyx990803~vue@v0.10.4/src/exp-parser.js\"),\n\
    ViewModel,\n\
    \n\
    // cache methods\n\
    slice       = [].slice,\n\
    extend      = utils.extend,\n\
    hasOwn      = ({}).hasOwnProperty,\n\
    def         = Object.defineProperty,\n\
\n\
    // hooks to register\n\
    hooks = [\n\
        'created', 'ready',\n\
        'beforeDestroy', 'afterDestroy',\n\
        'attached', 'detached'\n\
    ],\n\
\n\
    // list of priority directives\n\
    // that needs to be checked in specific order\n\
    priorityDirectives = [\n\
        'if',\n\
        'repeat',\n\
        'view',\n\
        'component'\n\
    ]\n\
\n\
/**\n\
 *  The DOM compiler\n\
 *  scans a DOM node and compile bindings for a ViewModel\n\
 */\n\
function Compiler (vm, options) {\n\
\n\
    var compiler = this,\n\
        key, i\n\
\n\
    // default state\n\
    compiler.init       = true\n\
    compiler.destroyed  = false\n\
\n\
    // process and extend options\n\
    options = compiler.options = options || {}\n\
    utils.processOptions(options)\n\
\n\
    // copy compiler options\n\
    extend(compiler, options.compilerOptions)\n\
    // repeat indicates this is a v-repeat instance\n\
    compiler.repeat   = compiler.repeat || false\n\
    // expCache will be shared between v-repeat instances\n\
    compiler.expCache = compiler.expCache || {}\n\
\n\
    // initialize element\n\
    var el = compiler.el = compiler.setupElement(options)\n\
    utils.log('\\n\
new VM instance: ' + el.tagName + '\\n\
')\n\
\n\
    // set other compiler properties\n\
    compiler.vm       = el.vue_vm = vm\n\
    compiler.bindings = utils.hash()\n\
    compiler.dirs     = []\n\
    compiler.deferred = []\n\
    compiler.computed = []\n\
    compiler.children = []\n\
    compiler.emitter  = new Emitter(vm)\n\
\n\
    // create bindings for computed properties\n\
    if (options.methods) {\n\
        for (key in options.methods) {\n\
            compiler.createBinding(key)\n\
        }\n\
    }\n\
\n\
    // create bindings for methods\n\
    if (options.computed) {\n\
        for (key in options.computed) {\n\
            compiler.createBinding(key)\n\
        }\n\
    }\n\
\n\
    // VM ---------------------------------------------------------------------\n\
\n\
    // set VM properties\n\
    vm.$         = {}\n\
    vm.$el       = el\n\
    vm.$options  = options\n\
    vm.$compiler = compiler\n\
    vm.$event    = null\n\
\n\
    // set parent & root\n\
    var parentVM = options.parent\n\
    if (parentVM) {\n\
        compiler.parent = parentVM.$compiler\n\
        parentVM.$compiler.children.push(compiler)\n\
        vm.$parent = parentVM\n\
    }\n\
    vm.$root = getRoot(compiler).vm\n\
\n\
    // DATA -------------------------------------------------------------------\n\
\n\
    // setup observer\n\
    // this is necesarry for all hooks and data observation events\n\
    compiler.setupObserver()\n\
\n\
    // initialize data\n\
    var data = compiler.data = options.data || {},\n\
        defaultData = options.defaultData\n\
    if (defaultData) {\n\
        for (key in defaultData) {\n\
            if (!hasOwn.call(data, key)) {\n\
                data[key] = defaultData[key]\n\
            }\n\
        }\n\
    }\n\
\n\
    // copy paramAttributes\n\
    var params = options.paramAttributes\n\
    if (params) {\n\
        i = params.length\n\
        while (i--) {\n\
            data[params[i]] = utils.checkNumber(\n\
                compiler.eval(\n\
                    el.getAttribute(params[i])\n\
                )\n\
            )\n\
        }\n\
    }\n\
\n\
    // copy data properties to vm\n\
    // so user can access them in the created hook\n\
    extend(vm, data)\n\
    vm.$data = data\n\
\n\
    // beforeCompile hook\n\
    compiler.execHook('created')\n\
\n\
    // the user might have swapped the data ...\n\
    data = compiler.data = vm.$data\n\
\n\
    // user might also set some properties on the vm\n\
    // in which case we should copy back to $data\n\
    var vmProp\n\
    for (key in vm) {\n\
        vmProp = vm[key]\n\
        if (\n\
            key.charAt(0) !== '$' &&\n\
            data[key] !== vmProp &&\n\
            typeof vmProp !== 'function'\n\
        ) {\n\
            data[key] = vmProp\n\
        }\n\
    }\n\
\n\
    // now we can observe the data.\n\
    // this will convert data properties to getter/setters\n\
    // and emit the first batch of set events, which will\n\
    // in turn create the corresponding bindings.\n\
    compiler.observeData(data)\n\
\n\
    // COMPILE ----------------------------------------------------------------\n\
\n\
    // before compiling, resolve content insertion points\n\
    if (options.template) {\n\
        this.resolveContent()\n\
    }\n\
\n\
    // now parse the DOM and bind directives.\n\
    // During this stage, we will also create bindings for\n\
    // encountered keypaths that don't have a binding yet.\n\
    compiler.compile(el, true)\n\
\n\
    // Any directive that creates child VMs are deferred\n\
    // so that when they are compiled, all bindings on the\n\
    // parent VM have been created.\n\
    i = compiler.deferred.length\n\
    while (i--) {\n\
        compiler.bindDirective(compiler.deferred[i])\n\
    }\n\
    compiler.deferred = null\n\
\n\
    // extract dependencies for computed properties.\n\
    // this will evaluated all collected computed bindings\n\
    // and collect get events that are emitted.\n\
    if (this.computed.length) {\n\
        DepsParser.parse(this.computed)\n\
    }\n\
\n\
    // done!\n\
    compiler.init = false\n\
\n\
    // post compile / ready hook\n\
    compiler.execHook('ready')\n\
}\n\
\n\
var CompilerProto = Compiler.prototype\n\
\n\
/**\n\
 *  Initialize the VM/Compiler's element.\n\
 *  Fill it in with the template if necessary.\n\
 */\n\
CompilerProto.setupElement = function (options) {\n\
    // create the node first\n\
    var el = typeof options.el === 'string'\n\
        ? document.querySelector(options.el)\n\
        : options.el || document.createElement(options.tagName || 'div')\n\
\n\
    var template = options.template,\n\
        child, replacer, i, attr, attrs\n\
\n\
    if (template) {\n\
        // collect anything already in there\n\
        if (el.hasChildNodes()) {\n\
            this.rawContent = document.createElement('div')\n\
            /* jshint boss: true */\n\
            while (child = el.firstChild) {\n\
                this.rawContent.appendChild(child)\n\
            }\n\
        }\n\
        // replace option: use the first node in\n\
        // the template directly\n\
        if (options.replace && template.firstChild === template.lastChild) {\n\
            replacer = template.firstChild.cloneNode(true)\n\
            if (el.parentNode) {\n\
                el.parentNode.insertBefore(replacer, el)\n\
                el.parentNode.removeChild(el)\n\
            }\n\
            // copy over attributes\n\
            if (el.hasAttributes()) {\n\
                i = el.attributes.length\n\
                while (i--) {\n\
                    attr = el.attributes[i]\n\
                    replacer.setAttribute(attr.name, attr.value)\n\
                }\n\
            }\n\
            // replace\n\
            el = replacer\n\
        } else {\n\
            el.appendChild(template.cloneNode(true))\n\
        }\n\
\n\
    }\n\
\n\
    // apply element options\n\
    if (options.id) el.id = options.id\n\
    if (options.className) el.className = options.className\n\
    attrs = options.attributes\n\
    if (attrs) {\n\
        for (attr in attrs) {\n\
            el.setAttribute(attr, attrs[attr])\n\
        }\n\
    }\n\
\n\
    return el\n\
}\n\
\n\
/**\n\
 *  Deal with <content> insertion points\n\
 *  per the Web Components spec\n\
 */\n\
CompilerProto.resolveContent = function () {\n\
\n\
    var outlets = slice.call(this.el.getElementsByTagName('content')),\n\
        raw = this.rawContent,\n\
        outlet, select, i, j, main\n\
\n\
    i = outlets.length\n\
    if (i) {\n\
        // first pass, collect corresponding content\n\
        // for each outlet.\n\
        while (i--) {\n\
            outlet = outlets[i]\n\
            if (raw) {\n\
                select = outlet.getAttribute('select')\n\
                if (select) { // select content\n\
                    outlet.content =\n\
                        slice.call(raw.querySelectorAll(select))\n\
                } else { // default content\n\
                    main = outlet\n\
                }\n\
            } else { // fallback content\n\
                outlet.content =\n\
                    slice.call(outlet.childNodes)\n\
            }\n\
        }\n\
        // second pass, actually insert the contents\n\
        for (i = 0, j = outlets.length; i < j; i++) {\n\
            outlet = outlets[i]\n\
            if (outlet === main) continue\n\
            insert(outlet, outlet.content)\n\
        }\n\
        // finally insert the main content\n\
        if (raw && main) {\n\
            insert(main, slice.call(raw.childNodes))\n\
        }\n\
    }\n\
\n\
    function insert (outlet, contents) {\n\
        var parent = outlet.parentNode,\n\
            i = 0, j = contents.length\n\
        for (; i < j; i++) {\n\
            parent.insertBefore(contents[i], outlet)\n\
        }\n\
        parent.removeChild(outlet)\n\
    }\n\
\n\
    this.rawContent = null\n\
}\n\
\n\
/**\n\
 *  Setup observer.\n\
 *  The observer listens for get/set/mutate events on all VM\n\
 *  values/objects and trigger corresponding binding updates.\n\
 *  It also listens for lifecycle hooks.\n\
 */\n\
CompilerProto.setupObserver = function () {\n\
\n\
    var compiler = this,\n\
        bindings = compiler.bindings,\n\
        options  = compiler.options,\n\
        observer = compiler.observer = new Emitter(compiler.vm)\n\
\n\
    // a hash to hold event proxies for each root level key\n\
    // so they can be referenced and removed later\n\
    observer.proxies = {}\n\
\n\
    // add own listeners which trigger binding updates\n\
    observer\n\
        .on('get', onGet)\n\
        .on('set', onSet)\n\
        .on('mutate', onSet)\n\
\n\
    // register hooks\n\
    var i = hooks.length, j, hook, fns\n\
    while (i--) {\n\
        hook = hooks[i]\n\
        fns = options[hook]\n\
        if (Array.isArray(fns)) {\n\
            j = fns.length\n\
            // since hooks were merged with child at head,\n\
            // we loop reversely.\n\
            while (j--) {\n\
                registerHook(hook, fns[j])\n\
            }\n\
        } else if (fns) {\n\
            registerHook(hook, fns)\n\
        }\n\
    }\n\
\n\
    // broadcast attached/detached hooks\n\
    observer\n\
        .on('hook:attached', function () {\n\
            broadcast(1)\n\
        })\n\
        .on('hook:detached', function () {\n\
            broadcast(0)\n\
        })\n\
\n\
    function onGet (key) {\n\
        check(key)\n\
        DepsParser.catcher.emit('get', bindings[key])\n\
    }\n\
\n\
    function onSet (key, val, mutation) {\n\
        observer.emit('change:' + key, val, mutation)\n\
        check(key)\n\
        bindings[key].update(val)\n\
    }\n\
\n\
    function registerHook (hook, fn) {\n\
        observer.on('hook:' + hook, function () {\n\
            fn.call(compiler.vm)\n\
        })\n\
    }\n\
\n\
    function broadcast (event) {\n\
        var children = compiler.children\n\
        if (children) {\n\
            var child, i = children.length\n\
            while (i--) {\n\
                child = children[i]\n\
                if (child.el.parentNode) {\n\
                    event = 'hook:' + (event ? 'attached' : 'detached')\n\
                    child.observer.emit(event)\n\
                    child.emitter.emit(event)\n\
                }\n\
            }\n\
        }\n\
    }\n\
\n\
    function check (key) {\n\
        if (!bindings[key]) {\n\
            compiler.createBinding(key)\n\
        }\n\
    }\n\
}\n\
\n\
CompilerProto.observeData = function (data) {\n\
\n\
    var compiler = this,\n\
        observer = compiler.observer\n\
\n\
    // recursively observe nested properties\n\
    Observer.observe(data, '', observer)\n\
\n\
    // also create binding for top level $data\n\
    // so it can be used in templates too\n\
    var $dataBinding = compiler.bindings['$data'] = new Binding(compiler, '$data')\n\
    $dataBinding.update(data)\n\
\n\
    // allow $data to be swapped\n\
    def(compiler.vm, '$data', {\n\
        get: function () {\n\
            compiler.observer.emit('get', '$data')\n\
            return compiler.data\n\
        },\n\
        set: function (newData) {\n\
            var oldData = compiler.data\n\
            Observer.unobserve(oldData, '', observer)\n\
            compiler.data = newData\n\
            Observer.copyPaths(newData, oldData)\n\
            Observer.observe(newData, '', observer)\n\
            update()\n\
        }\n\
    })\n\
\n\
    // emit $data change on all changes\n\
    observer\n\
        .on('set', onSet)\n\
        .on('mutate', onSet)\n\
\n\
    function onSet (key) {\n\
        if (key !== '$data') update()\n\
    }\n\
\n\
    function update () {\n\
        $dataBinding.update(compiler.data)\n\
        observer.emit('change:$data', compiler.data)\n\
    }\n\
}\n\
\n\
/**\n\
 *  Compile a DOM node (recursive)\n\
 */\n\
CompilerProto.compile = function (node, root) {\n\
    var nodeType = node.nodeType\n\
    if (nodeType === 1 && node.tagName !== 'SCRIPT') { // a normal node\n\
        this.compileElement(node, root)\n\
    } else if (nodeType === 3 && config.interpolate) {\n\
        this.compileTextNode(node)\n\
    }\n\
}\n\
\n\
/**\n\
 *  Check for a priority directive\n\
 *  If it is present and valid, return true to skip the rest\n\
 */\n\
CompilerProto.checkPriorityDir = function (dirname, node, root) {\n\
    var expression, directive, Ctor\n\
    if (\n\
        dirname === 'component' &&\n\
        root !== true &&\n\
        (Ctor = this.resolveComponent(node, undefined, true))\n\
    ) {\n\
        directive = this.parseDirective(dirname, '', node)\n\
        directive.Ctor = Ctor\n\
    } else {\n\
        expression = utils.attr(node, dirname)\n\
        directive = expression && this.parseDirective(dirname, expression, node)\n\
    }\n\
    if (directive) {\n\
        if (root === true) {\n\
            utils.warn(\n\
                'Directive v-' + dirname + ' cannot be used on an already instantiated ' +\n\
                'VM\\'s root node. Use it from the parent\\'s template instead.'\n\
            )\n\
            return\n\
        }\n\
        this.deferred.push(directive)\n\
        return true\n\
    }\n\
}\n\
\n\
/**\n\
 *  Compile normal directives on a node\n\
 */\n\
CompilerProto.compileElement = function (node, root) {\n\
\n\
    // textarea is pretty annoying\n\
    // because its value creates childNodes which\n\
    // we don't want to compile.\n\
    if (node.tagName === 'TEXTAREA' && node.value) {\n\
        node.value = this.eval(node.value)\n\
    }\n\
\n\
    // only compile if this element has attributes\n\
    // or its tagName contains a hyphen (which means it could\n\
    // potentially be a custom element)\n\
    if (node.hasAttributes() || node.tagName.indexOf('-') > -1) {\n\
\n\
        // skip anything with v-pre\n\
        if (utils.attr(node, 'pre') !== null) {\n\
            return\n\
        }\n\
\n\
        var i, l, j, k\n\
\n\
        // check priority directives.\n\
        // if any of them are present, it will take over the node with a childVM\n\
        // so we can skip the rest\n\
        for (i = 0, l = priorityDirectives.length; i < l; i++) {\n\
            if (this.checkPriorityDir(priorityDirectives[i], node, root)) {\n\
                return\n\
            }\n\
        }\n\
\n\
        // check transition & animation properties\n\
        node.vue_trans  = utils.attr(node, 'transition')\n\
        node.vue_anim   = utils.attr(node, 'animation')\n\
        node.vue_effect = this.eval(utils.attr(node, 'effect'))\n\
\n\
        var prefix = config.prefix + '-',\n\
            attrs = slice.call(node.attributes),\n\
            params = this.options.paramAttributes,\n\
            attr, isDirective, exp, directives, directive, dirname\n\
\n\
        for (i = 0, l = attrs.length; i < l; i++) {\n\
\n\
            attr = attrs[i]\n\
            isDirective = false\n\
\n\
            if (attr.name.indexOf(prefix) === 0) {\n\
                // a directive - split, parse and bind it.\n\
                isDirective = true\n\
                dirname = attr.name.slice(prefix.length)\n\
                // build with multiple: true\n\
                directives = this.parseDirective(dirname, attr.value, node, true)\n\
                // loop through clauses (separated by \",\")\n\
                // inside each attribute\n\
                for (j = 0, k = directives.length; j < k; j++) {\n\
                    directive = directives[j]\n\
                    if (dirname === 'with') {\n\
                        this.bindDirective(directive, this.parent)\n\
                    } else {\n\
                        this.bindDirective(directive)\n\
                    }\n\
                }\n\
            } else if (config.interpolate) {\n\
                // non directive attribute, check interpolation tags\n\
                exp = TextParser.parseAttr(attr.value)\n\
                if (exp) {\n\
                    directive = this.parseDirective('attr', attr.name + ':' + exp, node)\n\
                    if (params && params.indexOf(attr.name) > -1) {\n\
                        // a param attribute... we should use the parent binding\n\
                        // to avoid circular updates like size={{size}}\n\
                        this.bindDirective(directive, this.parent)\n\
                    } else {\n\
                        this.bindDirective(directive)\n\
                    }\n\
                }\n\
            }\n\
\n\
            if (isDirective && dirname !== 'cloak') {\n\
                node.removeAttribute(attr.name)\n\
            }\n\
        }\n\
\n\
    }\n\
\n\
    // recursively compile childNodes\n\
    if (node.hasChildNodes()) {\n\
        slice.call(node.childNodes).forEach(this.compile, this)\n\
    }\n\
}\n\
\n\
/**\n\
 *  Compile a text node\n\
 */\n\
CompilerProto.compileTextNode = function (node) {\n\
\n\
    var tokens = TextParser.parse(node.nodeValue)\n\
    if (!tokens) return\n\
    var el, token, directive\n\
\n\
    for (var i = 0, l = tokens.length; i < l; i++) {\n\
\n\
        token = tokens[i]\n\
        directive = null\n\
\n\
        if (token.key) { // a binding\n\
            if (token.key.charAt(0) === '>') { // a partial\n\
                el = document.createComment('ref')\n\
                directive = this.parseDirective('partial', token.key.slice(1), el)\n\
            } else {\n\
                if (!token.html) { // text binding\n\
                    el = document.createTextNode('')\n\
                    directive = this.parseDirective('text', token.key, el)\n\
                } else { // html binding\n\
                    el = document.createComment(config.prefix + '-html')\n\
                    directive = this.parseDirective('html', token.key, el)\n\
                }\n\
            }\n\
        } else { // a plain string\n\
            el = document.createTextNode(token)\n\
        }\n\
\n\
        // insert node\n\
        node.parentNode.insertBefore(el, node)\n\
        // bind directive\n\
        this.bindDirective(directive)\n\
\n\
    }\n\
    node.parentNode.removeChild(node)\n\
}\n\
\n\
/**\n\
 *  Parse a directive name/value pair into one or more\n\
 *  directive instances\n\
 */\n\
CompilerProto.parseDirective = function (name, value, el, multiple) {\n\
    var compiler = this,\n\
        definition = compiler.getOption('directives', name)\n\
    if (definition) {\n\
        // parse into AST-like objects\n\
        var asts = Directive.parse(value)\n\
        return multiple\n\
            ? asts.map(build)\n\
            : build(asts[0])\n\
    }\n\
    function build (ast) {\n\
        return new Directive(name, ast, definition, compiler, el)\n\
    }\n\
}\n\
\n\
/**\n\
 *  Add a directive instance to the correct binding & viewmodel\n\
 */\n\
CompilerProto.bindDirective = function (directive, bindingOwner) {\n\
\n\
    if (!directive) return\n\
\n\
    // keep track of it so we can unbind() later\n\
    this.dirs.push(directive)\n\
\n\
    // for empty or literal directives, simply call its bind()\n\
    // and we're done.\n\
    if (directive.isEmpty || directive.isLiteral) {\n\
        if (directive.bind) directive.bind()\n\
        return\n\
    }\n\
\n\
    // otherwise, we got more work to do...\n\
    var binding,\n\
        compiler = bindingOwner || this,\n\
        key      = directive.key\n\
\n\
    if (directive.isExp) {\n\
        // expression bindings are always created on current compiler\n\
        binding = compiler.createBinding(key, directive)\n\
    } else {\n\
        // recursively locate which compiler owns the binding\n\
        while (compiler) {\n\
            if (compiler.hasKey(key)) {\n\
                break\n\
            } else {\n\
                compiler = compiler.parent\n\
            }\n\
        }\n\
        compiler = compiler || this\n\
        binding = compiler.bindings[key] || compiler.createBinding(key)\n\
    }\n\
    binding.dirs.push(directive)\n\
    directive.binding = binding\n\
\n\
    var value = binding.val()\n\
    // invoke bind hook if exists\n\
    if (directive.bind) {\n\
        directive.bind(value)\n\
    }\n\
    // set initial value\n\
    directive.$update(value, true)\n\
}\n\
\n\
/**\n\
 *  Create binding and attach getter/setter for a key to the viewmodel object\n\
 */\n\
CompilerProto.createBinding = function (key, directive) {\n\
\n\
    utils.log('  created binding: ' + key)\n\
\n\
    var compiler = this,\n\
        methods  = compiler.options.methods,\n\
        isExp    = directive && directive.isExp,\n\
        isFn     = (directive && directive.isFn) || (methods && methods[key]),\n\
        bindings = compiler.bindings,\n\
        computed = compiler.options.computed,\n\
        binding  = new Binding(compiler, key, isExp, isFn)\n\
\n\
    if (isExp) {\n\
        // expression bindings are anonymous\n\
        compiler.defineExp(key, binding, directive)\n\
    } else if (isFn) {\n\
        bindings[key] = binding\n\
        binding.value = compiler.vm[key] = methods[key]\n\
    } else {\n\
        bindings[key] = binding\n\
        if (binding.root) {\n\
            // this is a root level binding. we need to define getter/setters for it.\n\
            if (computed && computed[key]) {\n\
                // computed property\n\
                compiler.defineComputed(key, binding, computed[key])\n\
            } else if (key.charAt(0) !== '$') {\n\
                // normal property\n\
                compiler.defineProp(key, binding)\n\
            } else {\n\
                compiler.defineMeta(key, binding)\n\
            }\n\
        } else if (computed && computed[utils.baseKey(key)]) {\n\
            // nested path on computed property\n\
            compiler.defineExp(key, binding)\n\
        } else {\n\
            // ensure path in data so that computed properties that\n\
            // access the path don't throw an error and can collect\n\
            // dependencies\n\
            Observer.ensurePath(compiler.data, key)\n\
            var parentKey = key.slice(0, key.lastIndexOf('.'))\n\
            if (!bindings[parentKey]) {\n\
                // this is a nested value binding, but the binding for its parent\n\
                // has not been created yet. We better create that one too.\n\
                compiler.createBinding(parentKey)\n\
            }\n\
        }\n\
    }\n\
    return binding\n\
}\n\
\n\
/**\n\
 *  Define the getter/setter for a root-level property on the VM\n\
 *  and observe the initial value\n\
 */\n\
CompilerProto.defineProp = function (key, binding) {\n\
    var compiler = this,\n\
        data     = compiler.data,\n\
        ob       = data.__emitter__\n\
\n\
    // make sure the key is present in data\n\
    // so it can be observed\n\
    if (!(hasOwn.call(data, key))) {\n\
        data[key] = undefined\n\
    }\n\
\n\
    // if the data object is already observed, but the key\n\
    // is not observed, we need to add it to the observed keys.\n\
    if (ob && !(hasOwn.call(ob.values, key))) {\n\
        Observer.convertKey(data, key)\n\
    }\n\
\n\
    binding.value = data[key]\n\
\n\
    def(compiler.vm, key, {\n\
        get: function () {\n\
            return compiler.data[key]\n\
        },\n\
        set: function (val) {\n\
            compiler.data[key] = val\n\
        }\n\
    })\n\
}\n\
\n\
/**\n\
 *  Define a meta property, e.g. $index or $key,\n\
 *  which is bindable but only accessible on the VM,\n\
 *  not in the data.\n\
 */\n\
CompilerProto.defineMeta = function (key, binding) {\n\
    var ob = this.observer\n\
    binding.value = this.data[key]\n\
    delete this.data[key]\n\
    def(this.vm, key, {\n\
        get: function () {\n\
            if (Observer.shouldGet) ob.emit('get', key)\n\
            return binding.value\n\
        },\n\
        set: function (val) {\n\
            ob.emit('set', key, val)\n\
        }\n\
    })\n\
}\n\
\n\
/**\n\
 *  Define an expression binding, which is essentially\n\
 *  an anonymous computed property\n\
 */\n\
CompilerProto.defineExp = function (key, binding, directive) {\n\
    var computedKey = directive && directive.computedKey,\n\
        exp         = computedKey ? directive.expression : key,\n\
        getter      = this.expCache[exp]\n\
    if (!getter) {\n\
        getter = this.expCache[exp] = ExpParser.parse(computedKey || key, this)\n\
    }\n\
    if (getter) {\n\
        this.markComputed(binding, getter)\n\
    }\n\
}\n\
\n\
/**\n\
 *  Define a computed property on the VM\n\
 */\n\
CompilerProto.defineComputed = function (key, binding, value) {\n\
    this.markComputed(binding, value)\n\
    def(this.vm, key, {\n\
        get: binding.value.$get,\n\
        set: binding.value.$set\n\
    })\n\
}\n\
\n\
/**\n\
 *  Process a computed property binding\n\
 *  so its getter/setter are bound to proper context\n\
 */\n\
CompilerProto.markComputed = function (binding, value) {\n\
    binding.isComputed = true\n\
    // bind the accessors to the vm\n\
    if (binding.isFn) {\n\
        binding.value = value\n\
    } else {\n\
        if (typeof value === 'function') {\n\
            value = { $get: value }\n\
        }\n\
        binding.value = {\n\
            $get: utils.bind(value.$get, this.vm),\n\
            $set: value.$set\n\
                ? utils.bind(value.$set, this.vm)\n\
                : undefined\n\
        }\n\
    }\n\
    // keep track for dep parsing later\n\
    this.computed.push(binding)\n\
}\n\
\n\
/**\n\
 *  Retrive an option from the compiler\n\
 */\n\
CompilerProto.getOption = function (type, id, silent) {\n\
    var opts = this.options,\n\
        parent = this.parent,\n\
        globalAssets = config.globalAssets,\n\
        res = (opts[type] && opts[type][id]) || (\n\
            parent\n\
                ? parent.getOption(type, id, silent)\n\
                : globalAssets[type] && globalAssets[type][id]\n\
        )\n\
    if (!res && !silent && typeof id === 'string') {\n\
        utils.warn('Unknown ' + type.slice(0, -1) + ': ' + id)\n\
    }\n\
    return res\n\
}\n\
\n\
/**\n\
 *  Emit lifecycle events to trigger hooks\n\
 */\n\
CompilerProto.execHook = function (event) {\n\
    event = 'hook:' + event\n\
    this.observer.emit(event)\n\
    this.emitter.emit(event)\n\
}\n\
\n\
/**\n\
 *  Check if a compiler's data contains a keypath\n\
 */\n\
CompilerProto.hasKey = function (key) {\n\
    var baseKey = utils.baseKey(key)\n\
    return hasOwn.call(this.data, baseKey) ||\n\
        hasOwn.call(this.vm, baseKey)\n\
}\n\
\n\
/**\n\
 *  Do a one-time eval of a string that potentially\n\
 *  includes bindings. It accepts additional raw data\n\
 *  because we need to dynamically resolve v-component\n\
 *  before a childVM is even compiled...\n\
 */\n\
CompilerProto.eval = function (exp, data) {\n\
    var parsed = TextParser.parseAttr(exp)\n\
    return parsed\n\
        ? ExpParser.eval(parsed, this, data)\n\
        : exp\n\
}\n\
\n\
/**\n\
 *  Resolve a Component constructor for an element\n\
 *  with the data to be used\n\
 */\n\
CompilerProto.resolveComponent = function (node, data, test) {\n\
\n\
    // late require to avoid circular deps\n\
    ViewModel = ViewModel || require(\"yyx990803~vue@v0.10.4/src/viewmodel.js\")\n\
\n\
    var exp     = utils.attr(node, 'component'),\n\
        tagName = node.tagName,\n\
        id      = this.eval(exp, data),\n\
        tagId   = (tagName.indexOf('-') > 0 && tagName.toLowerCase()),\n\
        Ctor    = this.getOption('components', id || tagId, true)\n\
\n\
    if (id && !Ctor) {\n\
        utils.warn('Unknown component: ' + id)\n\
    }\n\
\n\
    return test\n\
        ? exp === ''\n\
            ? ViewModel\n\
            : Ctor\n\
        : Ctor || ViewModel\n\
}\n\
\n\
/**\n\
 *  Unbind and remove element\n\
 */\n\
CompilerProto.destroy = function () {\n\
\n\
    // avoid being called more than once\n\
    // this is irreversible!\n\
    if (this.destroyed) return\n\
\n\
    var compiler = this,\n\
        i, j, key, dir, dirs, binding,\n\
        vm          = compiler.vm,\n\
        el          = compiler.el,\n\
        directives  = compiler.dirs,\n\
        computed    = compiler.computed,\n\
        bindings    = compiler.bindings,\n\
        children    = compiler.children,\n\
        parent      = compiler.parent\n\
\n\
    compiler.execHook('beforeDestroy')\n\
\n\
    // unobserve data\n\
    Observer.unobserve(compiler.data, '', compiler.observer)\n\
\n\
    // unbind all direcitves\n\
    i = directives.length\n\
    while (i--) {\n\
        dir = directives[i]\n\
        // if this directive is an instance of an external binding\n\
        // e.g. a directive that refers to a variable on the parent VM\n\
        // we need to remove it from that binding's directives\n\
        // * empty and literal bindings do not have binding.\n\
        if (dir.binding && dir.binding.compiler !== compiler) {\n\
            dirs = dir.binding.dirs\n\
            if (dirs) {\n\
                j = dirs.indexOf(dir)\n\
                if (j > -1) dirs.splice(j, 1)\n\
            }\n\
        }\n\
        dir.$unbind()\n\
    }\n\
\n\
    // unbind all computed, anonymous bindings\n\
    i = computed.length\n\
    while (i--) {\n\
        computed[i].unbind()\n\
    }\n\
\n\
    // unbind all keypath bindings\n\
    for (key in bindings) {\n\
        binding = bindings[key]\n\
        if (binding) {\n\
            binding.unbind()\n\
        }\n\
    }\n\
\n\
    // destroy all children\n\
    i = children.length\n\
    while (i--) {\n\
        children[i].destroy()\n\
    }\n\
\n\
    // remove self from parent\n\
    if (parent) {\n\
        j = parent.children.indexOf(compiler)\n\
        if (j > -1) parent.children.splice(j, 1)\n\
    }\n\
\n\
    // finally remove dom element\n\
    if (el === document.body) {\n\
        el.innerHTML = ''\n\
    } else {\n\
        vm.$remove()\n\
    }\n\
    el.vue_vm = null\n\
\n\
    compiler.destroyed = true\n\
    // emit destroy hook\n\
    compiler.execHook('afterDestroy')\n\
\n\
    // finally, unregister all listeners\n\
    compiler.observer.off()\n\
    compiler.emitter.off()\n\
}\n\
\n\
// Helpers --------------------------------------------------------------------\n\
\n\
/**\n\
 *  shorthand for getting root compiler\n\
 */\n\
function getRoot (compiler) {\n\
    while (compiler.parent) {\n\
        compiler = compiler.parent\n\
    }\n\
    return compiler\n\
}\n\
\n\
module.exports = Compiler\n\
//# sourceURL=components/yyx990803/vue/v0.10.4/src/compiler.js"
));

require.register("yyx990803~vue@v0.10.4/src/viewmodel.js", Function("exports, module",
"var Compiler   = require(\"yyx990803~vue@v0.10.4/src/compiler.js\"),\n\
    utils      = require(\"yyx990803~vue@v0.10.4/src/utils.js\"),\n\
    transition = require(\"yyx990803~vue@v0.10.4/src/transition.js\"),\n\
    Batcher    = require(\"yyx990803~vue@v0.10.4/src/batcher.js\"),\n\
    slice      = [].slice,\n\
    def        = utils.defProtected,\n\
    nextTick   = utils.nextTick,\n\
\n\
    // batch $watch callbacks\n\
    watcherBatcher = new Batcher(),\n\
    watcherId      = 1\n\
\n\
/**\n\
 *  ViewModel exposed to the user that holds data,\n\
 *  computed properties, event handlers\n\
 *  and a few reserved methods\n\
 */\n\
function ViewModel (options) {\n\
    // just compile. options are passed directly to compiler\n\
    new Compiler(this, options)\n\
}\n\
\n\
// All VM prototype methods are inenumerable\n\
// so it can be stringified/looped through as raw data\n\
var VMProto = ViewModel.prototype\n\
\n\
/**\n\
 *  Convenience function to get a value from\n\
 *  a keypath\n\
 */\n\
def(VMProto, '$get', function (key) {\n\
    var val = utils.get(this, key)\n\
    return val === undefined && this.$parent\n\
        ? this.$parent.$get(key)\n\
        : val\n\
})\n\
\n\
/**\n\
 *  Convenience function to set an actual nested value\n\
 *  from a flat key string. Used in directives.\n\
 */\n\
def(VMProto, '$set', function (key, value) {\n\
    utils.set(this, key, value)\n\
})\n\
\n\
/**\n\
 *  watch a key on the viewmodel for changes\n\
 *  fire callback with new value\n\
 */\n\
def(VMProto, '$watch', function (key, callback) {\n\
    // save a unique id for each watcher\n\
    var id = watcherId++,\n\
        self = this\n\
    function on () {\n\
        var args = slice.call(arguments)\n\
        watcherBatcher.push({\n\
            id: id,\n\
            override: true,\n\
            execute: function () {\n\
                callback.apply(self, args)\n\
            }\n\
        })\n\
    }\n\
    callback._fn = on\n\
    self.$compiler.observer.on('change:' + key, on)\n\
})\n\
\n\
/**\n\
 *  unwatch a key\n\
 */\n\
def(VMProto, '$unwatch', function (key, callback) {\n\
    // workaround here\n\
    // since the emitter module checks callback existence\n\
    // by checking the length of arguments\n\
    var args = ['change:' + key],\n\
        ob = this.$compiler.observer\n\
    if (callback) args.push(callback._fn)\n\
    ob.off.apply(ob, args)\n\
})\n\
\n\
/**\n\
 *  unbind everything, remove everything\n\
 */\n\
def(VMProto, '$destroy', function () {\n\
    this.$compiler.destroy()\n\
})\n\
\n\
/**\n\
 *  broadcast an event to all child VMs recursively.\n\
 */\n\
def(VMProto, '$broadcast', function () {\n\
    var children = this.$compiler.children,\n\
        i = children.length,\n\
        child\n\
    while (i--) {\n\
        child = children[i]\n\
        child.emitter.applyEmit.apply(child.emitter, arguments)\n\
        child.vm.$broadcast.apply(child.vm, arguments)\n\
    }\n\
})\n\
\n\
/**\n\
 *  emit an event that propagates all the way up to parent VMs.\n\
 */\n\
def(VMProto, '$dispatch', function () {\n\
    var compiler = this.$compiler,\n\
        emitter = compiler.emitter,\n\
        parent = compiler.parent\n\
    emitter.applyEmit.apply(emitter, arguments)\n\
    if (parent) {\n\
        parent.vm.$dispatch.apply(parent.vm, arguments)\n\
    }\n\
})\n\
\n\
/**\n\
 *  delegate on/off/once to the compiler's emitter\n\
 */\n\
;['emit', 'on', 'off', 'once'].forEach(function (method) {\n\
    // internal emit has fixed number of arguments.\n\
    // exposed emit uses the external version\n\
    // with fn.apply.\n\
    var realMethod = method === 'emit'\n\
        ? 'applyEmit'\n\
        : method\n\
    def(VMProto, '$' + method, function () {\n\
        var emitter = this.$compiler.emitter\n\
        emitter[realMethod].apply(emitter, arguments)\n\
    })\n\
})\n\
\n\
// DOM convenience methods\n\
\n\
def(VMProto, '$appendTo', function (target, cb) {\n\
    target = query(target)\n\
    var el = this.$el\n\
    transition(el, 1, function () {\n\
        target.appendChild(el)\n\
        if (cb) nextTick(cb)\n\
    }, this.$compiler)\n\
})\n\
\n\
def(VMProto, '$remove', function (cb) {\n\
    var el = this.$el\n\
    transition(el, -1, function () {\n\
        if (el.parentNode) {\n\
            el.parentNode.removeChild(el)\n\
        }\n\
        if (cb) nextTick(cb)\n\
    }, this.$compiler)\n\
})\n\
\n\
def(VMProto, '$before', function (target, cb) {\n\
    target = query(target)\n\
    var el = this.$el\n\
    transition(el, 1, function () {\n\
        target.parentNode.insertBefore(el, target)\n\
        if (cb) nextTick(cb)\n\
    }, this.$compiler)\n\
})\n\
\n\
def(VMProto, '$after', function (target, cb) {\n\
    target = query(target)\n\
    var el = this.$el\n\
    transition(el, 1, function () {\n\
        if (target.nextSibling) {\n\
            target.parentNode.insertBefore(el, target.nextSibling)\n\
        } else {\n\
            target.parentNode.appendChild(el)\n\
        }\n\
        if (cb) nextTick(cb)\n\
    }, this.$compiler)\n\
})\n\
\n\
function query (el) {\n\
    return typeof el === 'string'\n\
        ? document.querySelector(el)\n\
        : el\n\
}\n\
\n\
module.exports = ViewModel\n\
//# sourceURL=components/yyx990803/vue/v0.10.4/src/viewmodel.js"
));

require.register("yyx990803~vue@v0.10.4/src/binding.js", Function("exports, module",
"var Batcher        = require(\"yyx990803~vue@v0.10.4/src/batcher.js\"),\n\
    bindingBatcher = new Batcher(),\n\
    bindingId      = 1\n\
\n\
/**\n\
 *  Binding class.\n\
 *\n\
 *  each property on the viewmodel has one corresponding Binding object\n\
 *  which has multiple directive instances on the DOM\n\
 *  and multiple computed property dependents\n\
 */\n\
function Binding (compiler, key, isExp, isFn) {\n\
    this.id = bindingId++\n\
    this.value = undefined\n\
    this.isExp = !!isExp\n\
    this.isFn = isFn\n\
    this.root = !this.isExp && key.indexOf('.') === -1\n\
    this.compiler = compiler\n\
    this.key = key\n\
    this.dirs = []\n\
    this.subs = []\n\
    this.deps = []\n\
    this.unbound = false\n\
}\n\
\n\
var BindingProto = Binding.prototype\n\
\n\
/**\n\
 *  Update value and queue instance updates.\n\
 */\n\
BindingProto.update = function (value) {\n\
    if (!this.isComputed || this.isFn) {\n\
        this.value = value\n\
    }\n\
    if (this.dirs.length || this.subs.length) {\n\
        var self = this\n\
        bindingBatcher.push({\n\
            id: this.id,\n\
            execute: function () {\n\
                if (!self.unbound) {\n\
                    self._update()\n\
                }\n\
            }\n\
        })\n\
    }\n\
}\n\
\n\
/**\n\
 *  Actually update the directives.\n\
 */\n\
BindingProto._update = function () {\n\
    var i = this.dirs.length,\n\
        value = this.val()\n\
    while (i--) {\n\
        this.dirs[i].$update(value)\n\
    }\n\
    this.pub()\n\
}\n\
\n\
/**\n\
 *  Return the valuated value regardless\n\
 *  of whether it is computed or not\n\
 */\n\
BindingProto.val = function () {\n\
    return this.isComputed && !this.isFn\n\
        ? this.value.$get()\n\
        : this.value\n\
}\n\
\n\
/**\n\
 *  Notify computed properties that depend on this binding\n\
 *  to update themselves\n\
 */\n\
BindingProto.pub = function () {\n\
    var i = this.subs.length\n\
    while (i--) {\n\
        this.subs[i].update()\n\
    }\n\
}\n\
\n\
/**\n\
 *  Unbind the binding, remove itself from all of its dependencies\n\
 */\n\
BindingProto.unbind = function () {\n\
    // Indicate this has been unbound.\n\
    // It's possible this binding will be in\n\
    // the batcher's flush queue when its owner\n\
    // compiler has already been destroyed.\n\
    this.unbound = true\n\
    var i = this.dirs.length\n\
    while (i--) {\n\
        this.dirs[i].$unbind()\n\
    }\n\
    i = this.deps.length\n\
    var subs\n\
    while (i--) {\n\
        subs = this.deps[i].subs\n\
        var j = subs.indexOf(this)\n\
        if (j > -1) subs.splice(j, 1)\n\
    }\n\
}\n\
\n\
module.exports = Binding\n\
//# sourceURL=components/yyx990803/vue/v0.10.4/src/binding.js"
));

require.register("yyx990803~vue@v0.10.4/src/observer.js", Function("exports, module",
"/* jshint proto:true */\n\
\n\
var Emitter  = require(\"yyx990803~vue@v0.10.4/src/emitter.js\"),\n\
    utils    = require(\"yyx990803~vue@v0.10.4/src/utils.js\"),\n\
    // cache methods\n\
    def      = utils.defProtected,\n\
    isObject = utils.isObject,\n\
    isArray  = Array.isArray,\n\
    hasOwn   = ({}).hasOwnProperty,\n\
    oDef     = Object.defineProperty,\n\
    slice    = [].slice,\n\
    // fix for IE + __proto__ problem\n\
    // define methods as inenumerable if __proto__ is present,\n\
    // otherwise enumerable so we can loop through and manually\n\
    // attach to array instances\n\
    hasProto = ({}).__proto__\n\
\n\
// Array Mutation Handlers & Augmentations ------------------------------------\n\
\n\
// The proxy prototype to replace the __proto__ of\n\
// an observed array\n\
var ArrayProxy = Object.create(Array.prototype)\n\
\n\
// intercept mutation methods\n\
;[\n\
    'push',\n\
    'pop',\n\
    'shift',\n\
    'unshift',\n\
    'splice',\n\
    'sort',\n\
    'reverse'\n\
].forEach(watchMutation)\n\
\n\
// Augment the ArrayProxy with convenience methods\n\
def(ArrayProxy, '$set', function (index, data) {\n\
    return this.splice(index, 1, data)[0]\n\
}, !hasProto)\n\
\n\
def(ArrayProxy, '$remove', function (index) {\n\
    if (typeof index !== 'number') {\n\
        index = this.indexOf(index)\n\
    }\n\
    if (index > -1) {\n\
        return this.splice(index, 1)[0]\n\
    }\n\
}, !hasProto)\n\
\n\
/**\n\
 *  Intercep a mutation event so we can emit the mutation info.\n\
 *  we also analyze what elements are added/removed and link/unlink\n\
 *  them with the parent Array.\n\
 */\n\
function watchMutation (method) {\n\
    def(ArrayProxy, method, function () {\n\
\n\
        var args = slice.call(arguments),\n\
            result = Array.prototype[method].apply(this, args),\n\
            inserted, removed\n\
\n\
        // determine new / removed elements\n\
        if (method === 'push' || method === 'unshift') {\n\
            inserted = args\n\
        } else if (method === 'pop' || method === 'shift') {\n\
            removed = [result]\n\
        } else if (method === 'splice') {\n\
            inserted = args.slice(2)\n\
            removed = result\n\
        }\n\
        \n\
        // link & unlink\n\
        linkArrayElements(this, inserted)\n\
        unlinkArrayElements(this, removed)\n\
\n\
        // emit the mutation event\n\
        this.__emitter__.emit('mutate', '', this, {\n\
            method   : method,\n\
            args     : args,\n\
            result   : result,\n\
            inserted : inserted,\n\
            removed  : removed\n\
        })\n\
\n\
        return result\n\
        \n\
    }, !hasProto)\n\
}\n\
\n\
/**\n\
 *  Link new elements to an Array, so when they change\n\
 *  and emit events, the owner Array can be notified.\n\
 */\n\
function linkArrayElements (arr, items) {\n\
    if (items) {\n\
        var i = items.length, item, owners\n\
        while (i--) {\n\
            item = items[i]\n\
            if (isWatchable(item)) {\n\
                // if object is not converted for observing\n\
                // convert it...\n\
                if (!item.__emitter__) {\n\
                    convert(item)\n\
                    watch(item)\n\
                }\n\
                owners = item.__emitter__.owners\n\
                if (owners.indexOf(arr) < 0) {\n\
                    owners.push(arr)\n\
                }\n\
            }\n\
        }\n\
    }\n\
}\n\
\n\
/**\n\
 *  Unlink removed elements from the ex-owner Array.\n\
 */\n\
function unlinkArrayElements (arr, items) {\n\
    if (items) {\n\
        var i = items.length, item\n\
        while (i--) {\n\
            item = items[i]\n\
            if (item && item.__emitter__) {\n\
                var owners = item.__emitter__.owners\n\
                if (owners) owners.splice(owners.indexOf(arr))\n\
            }\n\
        }\n\
    }\n\
}\n\
\n\
// Object add/delete key augmentation -----------------------------------------\n\
\n\
var ObjProxy = Object.create(Object.prototype)\n\
\n\
def(ObjProxy, '$add', function (key, val) {\n\
    if (hasOwn.call(this, key)) return\n\
    this[key] = val\n\
    convertKey(this, key, true)\n\
}, !hasProto)\n\
\n\
def(ObjProxy, '$delete', function (key) {\n\
    if (!(hasOwn.call(this, key))) return\n\
    // trigger set events\n\
    this[key] = undefined\n\
    delete this[key]\n\
    this.__emitter__.emit('delete', key)\n\
}, !hasProto)\n\
\n\
// Watch Helpers --------------------------------------------------------------\n\
\n\
/**\n\
 *  Check if a value is watchable\n\
 */\n\
function isWatchable (obj) {\n\
    return typeof obj === 'object' && obj && !obj.$compiler\n\
}\n\
\n\
/**\n\
 *  Convert an Object/Array to give it a change emitter.\n\
 */\n\
function convert (obj) {\n\
    if (obj.__emitter__) return true\n\
    var emitter = new Emitter()\n\
    def(obj, '__emitter__', emitter)\n\
    emitter\n\
        .on('set', function (key, val, propagate) {\n\
            if (propagate) propagateChange(obj)\n\
        })\n\
        .on('mutate', function () {\n\
            propagateChange(obj)\n\
        })\n\
    emitter.values = utils.hash()\n\
    emitter.owners = []\n\
    return false\n\
}\n\
\n\
/**\n\
 *  Propagate an array element's change to its owner arrays\n\
 */\n\
function propagateChange (obj) {\n\
    var owners = obj.__emitter__.owners,\n\
        i = owners.length\n\
    while (i--) {\n\
        owners[i].__emitter__.emit('set', '', '', true)\n\
    }\n\
}\n\
\n\
/**\n\
 *  Watch target based on its type\n\
 */\n\
function watch (obj) {\n\
    if (isArray(obj)) {\n\
        watchArray(obj)\n\
    } else {\n\
        watchObject(obj)\n\
    }\n\
}\n\
\n\
/**\n\
 *  Augment target objects with modified\n\
 *  methods\n\
 */\n\
function augment (target, src) {\n\
    if (hasProto) {\n\
        target.__proto__ = src\n\
    } else {\n\
        for (var key in src) {\n\
            def(target, key, src[key])\n\
        }\n\
    }\n\
}\n\
\n\
/**\n\
 *  Watch an Object, recursive.\n\
 */\n\
function watchObject (obj) {\n\
    augment(obj, ObjProxy)\n\
    for (var key in obj) {\n\
        convertKey(obj, key)\n\
    }\n\
}\n\
\n\
/**\n\
 *  Watch an Array, overload mutation methods\n\
 *  and add augmentations by intercepting the prototype chain\n\
 */\n\
function watchArray (arr) {\n\
    augment(arr, ArrayProxy)\n\
    linkArrayElements(arr, arr)\n\
}\n\
\n\
/**\n\
 *  Define accessors for a property on an Object\n\
 *  so it emits get/set events.\n\
 *  Then watch the value itself.\n\
 */\n\
function convertKey (obj, key, propagate) {\n\
    var keyPrefix = key.charAt(0)\n\
    if (keyPrefix === '$' || keyPrefix === '_') {\n\
        return\n\
    }\n\
    // emit set on bind\n\
    // this means when an object is observed it will emit\n\
    // a first batch of set events.\n\
    var emitter = obj.__emitter__,\n\
        values  = emitter.values\n\
\n\
    init(obj[key], propagate)\n\
\n\
    oDef(obj, key, {\n\
        enumerable: true,\n\
        configurable: true,\n\
        get: function () {\n\
            var value = values[key]\n\
            // only emit get on tip values\n\
            if (pub.shouldGet) {\n\
                emitter.emit('get', key)\n\
            }\n\
            return value\n\
        },\n\
        set: function (newVal) {\n\
            var oldVal = values[key]\n\
            unobserve(oldVal, key, emitter)\n\
            copyPaths(newVal, oldVal)\n\
            // an immediate property should notify its parent\n\
            // to emit set for itself too\n\
            init(newVal, true)\n\
        }\n\
    })\n\
\n\
    function init (val, propagate) {\n\
        values[key] = val\n\
        emitter.emit('set', key, val, propagate)\n\
        if (isArray(val)) {\n\
            emitter.emit('set', key + '.length', val.length, propagate)\n\
        }\n\
        observe(val, key, emitter)\n\
    }\n\
}\n\
\n\
/**\n\
 *  When a value that is already converted is\n\
 *  observed again by another observer, we can skip\n\
 *  the watch conversion and simply emit set event for\n\
 *  all of its properties.\n\
 */\n\
function emitSet (obj) {\n\
    var emitter = obj && obj.__emitter__\n\
    if (!emitter) return\n\
    if (isArray(obj)) {\n\
        emitter.emit('set', 'length', obj.length)\n\
    } else {\n\
        var key, val\n\
        for (key in obj) {\n\
            val = obj[key]\n\
            emitter.emit('set', key, val)\n\
            emitSet(val)\n\
        }\n\
    }\n\
}\n\
\n\
/**\n\
 *  Make sure all the paths in an old object exists\n\
 *  in a new object.\n\
 *  So when an object changes, all missing keys will\n\
 *  emit a set event with undefined value.\n\
 */\n\
function copyPaths (newObj, oldObj) {\n\
    if (!isObject(newObj) || !isObject(oldObj)) {\n\
        return\n\
    }\n\
    var path, oldVal, newVal\n\
    for (path in oldObj) {\n\
        if (!(hasOwn.call(newObj, path))) {\n\
            oldVal = oldObj[path]\n\
            if (isArray(oldVal)) {\n\
                newObj[path] = []\n\
            } else if (isObject(oldVal)) {\n\
                newVal = newObj[path] = {}\n\
                copyPaths(newVal, oldVal)\n\
            } else {\n\
                newObj[path] = undefined\n\
            }\n\
        }\n\
    }\n\
}\n\
\n\
/**\n\
 *  walk along a path and make sure it can be accessed\n\
 *  and enumerated in that object\n\
 */\n\
function ensurePath (obj, key) {\n\
    var path = key.split('.'), sec\n\
    for (var i = 0, d = path.length - 1; i < d; i++) {\n\
        sec = path[i]\n\
        if (!obj[sec]) {\n\
            obj[sec] = {}\n\
            if (obj.__emitter__) convertKey(obj, sec)\n\
        }\n\
        obj = obj[sec]\n\
    }\n\
    if (isObject(obj)) {\n\
        sec = path[i]\n\
        if (!(hasOwn.call(obj, sec))) {\n\
            obj[sec] = undefined\n\
            if (obj.__emitter__) convertKey(obj, sec)\n\
        }\n\
    }\n\
}\n\
\n\
// Main API Methods -----------------------------------------------------------\n\
\n\
/**\n\
 *  Observe an object with a given path,\n\
 *  and proxy get/set/mutate events to the provided observer.\n\
 */\n\
function observe (obj, rawPath, observer) {\n\
\n\
    if (!isWatchable(obj)) return\n\
\n\
    var path = rawPath ? rawPath + '.' : '',\n\
        alreadyConverted = convert(obj),\n\
        emitter = obj.__emitter__\n\
\n\
    // setup proxy listeners on the parent observer.\n\
    // we need to keep reference to them so that they\n\
    // can be removed when the object is un-observed.\n\
    observer.proxies = observer.proxies || {}\n\
    var proxies = observer.proxies[path] = {\n\
        get: function (key) {\n\
            observer.emit('get', path + key)\n\
        },\n\
        set: function (key, val, propagate) {\n\
            if (key) observer.emit('set', path + key, val)\n\
            // also notify observer that the object itself changed\n\
            // but only do so when it's a immediate property. this\n\
            // avoids duplicate event firing.\n\
            if (rawPath && propagate) {\n\
                observer.emit('set', rawPath, obj, true)\n\
            }\n\
        },\n\
        mutate: function (key, val, mutation) {\n\
            // if the Array is a root value\n\
            // the key will be null\n\
            var fixedPath = key ? path + key : rawPath\n\
            observer.emit('mutate', fixedPath, val, mutation)\n\
            // also emit set for Array's length when it mutates\n\
            var m = mutation.method\n\
            if (m !== 'sort' && m !== 'reverse') {\n\
                observer.emit('set', fixedPath + '.length', val.length)\n\
            }\n\
        }\n\
    }\n\
\n\
    // attach the listeners to the child observer.\n\
    // now all the events will propagate upwards.\n\
    emitter\n\
        .on('get', proxies.get)\n\
        .on('set', proxies.set)\n\
        .on('mutate', proxies.mutate)\n\
\n\
    if (alreadyConverted) {\n\
        // for objects that have already been converted,\n\
        // emit set events for everything inside\n\
        emitSet(obj)\n\
    } else {\n\
        watch(obj)\n\
    }\n\
}\n\
\n\
/**\n\
 *  Cancel observation, turn off the listeners.\n\
 */\n\
function unobserve (obj, path, observer) {\n\
\n\
    if (!obj || !obj.__emitter__) return\n\
\n\
    path = path ? path + '.' : ''\n\
    var proxies = observer.proxies[path]\n\
    if (!proxies) return\n\
\n\
    // turn off listeners\n\
    obj.__emitter__\n\
        .off('get', proxies.get)\n\
        .off('set', proxies.set)\n\
        .off('mutate', proxies.mutate)\n\
\n\
    // remove reference\n\
    observer.proxies[path] = null\n\
}\n\
\n\
// Expose API -----------------------------------------------------------------\n\
\n\
var pub = module.exports = {\n\
\n\
    // whether to emit get events\n\
    // only enabled during dependency parsing\n\
    shouldGet   : false,\n\
\n\
    observe     : observe,\n\
    unobserve   : unobserve,\n\
    ensurePath  : ensurePath,\n\
    copyPaths   : copyPaths,\n\
    watch       : watch,\n\
    convert     : convert,\n\
    convertKey  : convertKey\n\
}\n\
//# sourceURL=components/yyx990803/vue/v0.10.4/src/observer.js"
));

require.register("yyx990803~vue@v0.10.4/src/directive.js", Function("exports, module",
"var dirId           = 1,\n\
    ARG_RE          = /^[\\w\\$-]+$/,\n\
    FILTER_TOKEN_RE = /[^\\s'\"]+|'[^']+'|\"[^\"]+\"/g,\n\
    NESTING_RE      = /^\\$(parent|root)\\./,\n\
    SINGLE_VAR_RE   = /^[\\w\\.$]+$/,\n\
    QUOTE_RE        = /\"/g\n\
\n\
/**\n\
 *  Directive class\n\
 *  represents a single directive instance in the DOM\n\
 */\n\
function Directive (name, ast, definition, compiler, el) {\n\
\n\
    this.id             = dirId++\n\
    this.name           = name\n\
    this.compiler       = compiler\n\
    this.vm             = compiler.vm\n\
    this.el             = el\n\
    this.computeFilters = false\n\
    this.key            = ast.key\n\
    this.arg            = ast.arg\n\
    this.expression     = ast.expression\n\
\n\
    var isEmpty = this.expression === ''\n\
\n\
    // mix in properties from the directive definition\n\
    if (typeof definition === 'function') {\n\
        this[isEmpty ? 'bind' : 'update'] = definition\n\
    } else {\n\
        for (var prop in definition) {\n\
            this[prop] = definition[prop]\n\
        }\n\
    }\n\
\n\
    // empty expression, we're done.\n\
    if (isEmpty || this.isEmpty) {\n\
        this.isEmpty = true\n\
        return\n\
    }\n\
\n\
    this.expression = (\n\
        this.isLiteral\n\
            ? compiler.eval(this.expression)\n\
            : this.expression\n\
    ).trim()\n\
\n\
    var filters = ast.filters,\n\
        filter, fn, i, l, computed\n\
    if (filters) {\n\
        this.filters = []\n\
        for (i = 0, l = filters.length; i < l; i++) {\n\
            filter = filters[i]\n\
            fn = this.compiler.getOption('filters', filter.name)\n\
            if (fn) {\n\
                filter.apply = fn\n\
                this.filters.push(filter)\n\
                if (fn.computed) {\n\
                    computed = true\n\
                }\n\
            }\n\
        }\n\
    }\n\
\n\
    if (!this.filters || !this.filters.length) {\n\
        this.filters = null\n\
    }\n\
\n\
    if (computed) {\n\
        this.computedKey = Directive.inlineFilters(this.key, this.filters)\n\
        this.filters = null\n\
    }\n\
\n\
    this.isExp =\n\
        computed ||\n\
        !SINGLE_VAR_RE.test(this.key) ||\n\
        NESTING_RE.test(this.key)\n\
\n\
}\n\
\n\
var DirProto = Directive.prototype\n\
\n\
/**\n\
 *  called when a new value is set \n\
 *  for computed properties, this will only be called once\n\
 *  during initialization.\n\
 */\n\
DirProto.$update = function (value, init) {\n\
    if (this.$lock) return\n\
    if (init || value !== this.value || (value && typeof value === 'object')) {\n\
        this.value = value\n\
        if (this.update) {\n\
            this.update(\n\
                this.filters && !this.computeFilters\n\
                    ? this.$applyFilters(value)\n\
                    : value,\n\
                init\n\
            )\n\
        }\n\
    }\n\
}\n\
\n\
/**\n\
 *  pipe the value through filters\n\
 */\n\
DirProto.$applyFilters = function (value) {\n\
    var filtered = value, filter\n\
    for (var i = 0, l = this.filters.length; i < l; i++) {\n\
        filter = this.filters[i]\n\
        filtered = filter.apply.apply(this.vm, [filtered].concat(filter.args))\n\
    }\n\
    return filtered\n\
}\n\
\n\
/**\n\
 *  Unbind diretive\n\
 */\n\
DirProto.$unbind = function () {\n\
    // this can be called before the el is even assigned...\n\
    if (!this.el || !this.vm) return\n\
    if (this.unbind) this.unbind()\n\
    this.vm = this.el = this.binding = this.compiler = null\n\
}\n\
\n\
// Exposed static methods -----------------------------------------------------\n\
\n\
/**\n\
 *  Parse a directive string into an Array of\n\
 *  AST-like objects representing directives\n\
 */\n\
Directive.parse = function (str) {\n\
\n\
    var inSingle = false,\n\
        inDouble = false,\n\
        curly    = 0,\n\
        square   = 0,\n\
        paren    = 0,\n\
        begin    = 0,\n\
        argIndex = 0,\n\
        dirs     = [],\n\
        dir      = {},\n\
        lastFilterIndex = 0,\n\
        arg\n\
\n\
    for (var c, i = 0, l = str.length; i < l; i++) {\n\
        c = str.charAt(i)\n\
        if (inSingle) {\n\
            // check single quote\n\
            if (c === \"'\") inSingle = !inSingle\n\
        } else if (inDouble) {\n\
            // check double quote\n\
            if (c === '\"') inDouble = !inDouble\n\
        } else if (c === ',' && !paren && !curly && !square) {\n\
            // reached the end of a directive\n\
            pushDir()\n\
            // reset & skip the comma\n\
            dir = {}\n\
            begin = argIndex = lastFilterIndex = i + 1\n\
        } else if (c === ':' && !dir.key && !dir.arg) {\n\
            // argument\n\
            arg = str.slice(begin, i).trim()\n\
            if (ARG_RE.test(arg)) {\n\
                argIndex = i + 1\n\
                dir.arg = str.slice(begin, i).trim()\n\
            }\n\
        } else if (c === '|' && str.charAt(i + 1) !== '|' && str.charAt(i - 1) !== '|') {\n\
            if (dir.key === undefined) {\n\
                // first filter, end of key\n\
                lastFilterIndex = i + 1\n\
                dir.key = str.slice(argIndex, i).trim()\n\
            } else {\n\
                // already has filter\n\
                pushFilter()\n\
            }\n\
        } else if (c === '\"') {\n\
            inDouble = true\n\
        } else if (c === \"'\") {\n\
            inSingle = true\n\
        } else if (c === '(') {\n\
            paren++\n\
        } else if (c === ')') {\n\
            paren--\n\
        } else if (c === '[') {\n\
            square++\n\
        } else if (c === ']') {\n\
            square--\n\
        } else if (c === '{') {\n\
            curly++\n\
        } else if (c === '}') {\n\
            curly--\n\
        }\n\
    }\n\
    if (i === 0 || begin !== i) {\n\
        pushDir()\n\
    }\n\
\n\
    function pushDir () {\n\
        dir.expression = str.slice(begin, i).trim()\n\
        if (dir.key === undefined) {\n\
            dir.key = str.slice(argIndex, i).trim()\n\
        } else if (lastFilterIndex !== begin) {\n\
            pushFilter()\n\
        }\n\
        if (i === 0 || dir.key) {\n\
            dirs.push(dir)\n\
        }\n\
    }\n\
\n\
    function pushFilter () {\n\
        var exp = str.slice(lastFilterIndex, i).trim(),\n\
            filter\n\
        if (exp) {\n\
            filter = {}\n\
            var tokens = exp.match(FILTER_TOKEN_RE)\n\
            filter.name = tokens[0]\n\
            filter.args = tokens.length > 1 ? tokens.slice(1) : null\n\
        }\n\
        if (filter) {\n\
            (dir.filters = dir.filters || []).push(filter)\n\
        }\n\
        lastFilterIndex = i + 1\n\
    }\n\
\n\
    return dirs\n\
}\n\
\n\
/**\n\
 *  Inline computed filters so they become part\n\
 *  of the expression\n\
 */\n\
Directive.inlineFilters = function (key, filters) {\n\
    var args, filter\n\
    for (var i = 0, l = filters.length; i < l; i++) {\n\
        filter = filters[i]\n\
        args = filter.args\n\
            ? ',\"' + filter.args.map(escapeQuote).join('\",\"') + '\"'\n\
            : ''\n\
        key = 'this.$compiler.getOption(\"filters\", \"' +\n\
                filter.name +\n\
            '\").call(this,' +\n\
                key + args +\n\
            ')'\n\
    }\n\
    return key\n\
}\n\
\n\
/**\n\
 *  Convert double quotes to single quotes\n\
 *  so they don't mess up the generated function body\n\
 */\n\
function escapeQuote (v) {\n\
    return v.indexOf('\"') > -1\n\
        ? v.replace(QUOTE_RE, '\\'')\n\
        : v\n\
}\n\
\n\
module.exports = Directive\n\
//# sourceURL=components/yyx990803/vue/v0.10.4/src/directive.js"
));

require.register("yyx990803~vue@v0.10.4/src/exp-parser.js", Function("exports, module",
"var utils           = require(\"yyx990803~vue@v0.10.4/src/utils.js\"),\n\
    STR_SAVE_RE     = /\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*'/g,\n\
    STR_RESTORE_RE  = /\"(\\d+)\"/g,\n\
    NEWLINE_RE      = /\\n\
/g,\n\
    CTOR_RE         = new RegExp('constructor'.split('').join('[\\'\"+, ]*')),\n\
    UNICODE_RE      = /\\\\u\\d\\d\\d\\d/\n\
\n\
// Variable extraction scooped from https://github.com/RubyLouvre/avalon\n\
\n\
var KEYWORDS =\n\
        // keywords\n\
        'break,case,catch,continue,debugger,default,delete,do,else,false' +\n\
        ',finally,for,function,if,in,instanceof,new,null,return,switch,this' +\n\
        ',throw,true,try,typeof,var,void,while,with,undefined' +\n\
        // reserved\n\
        ',abstract,boolean,byte,char,class,const,double,enum,export,extends' +\n\
        ',final,float,goto,implements,import,int,interface,long,native' +\n\
        ',package,private,protected,public,short,static,super,synchronized' +\n\
        ',throws,transient,volatile' +\n\
        // ECMA 5 - use strict\n\
        ',arguments,let,yield' +\n\
        // allow using Math in expressions\n\
        ',Math',\n\
        \n\
    KEYWORDS_RE = new RegExp([\"\\\\b\" + KEYWORDS.replace(/,/g, '\\\\b|\\\\b') + \"\\\\b\"].join('|'), 'g'),\n\
    REMOVE_RE   = /\\/\\*(?:.|\\n\
)*?\\*\\/|\\/\\/[^\\n\
]*\\n\
|\\/\\/[^\\n\
]*$|'[^']*'|\"[^\"]*\"|[\\s\\t\\n\
]*\\.[\\s\\t\\n\
]*[$\\w\\.]+|[\\{,]\\s*[\\w\\$_]+\\s*:/g,\n\
    SPLIT_RE    = /[^\\w$]+/g,\n\
    NUMBER_RE   = /\\b\\d[^,]*/g,\n\
    BOUNDARY_RE = /^,+|,+$/g\n\
\n\
/**\n\
 *  Strip top level variable names from a snippet of JS expression\n\
 */\n\
function getVariables (code) {\n\
    code = code\n\
        .replace(REMOVE_RE, '')\n\
        .replace(SPLIT_RE, ',')\n\
        .replace(KEYWORDS_RE, '')\n\
        .replace(NUMBER_RE, '')\n\
        .replace(BOUNDARY_RE, '')\n\
    return code\n\
        ? code.split(/,+/)\n\
        : []\n\
}\n\
\n\
/**\n\
 *  A given path could potentially exist not on the\n\
 *  current compiler, but up in the parent chain somewhere.\n\
 *  This function generates an access relationship string\n\
 *  that can be used in the getter function by walking up\n\
 *  the parent chain to check for key existence.\n\
 *\n\
 *  It stops at top parent if no vm in the chain has the\n\
 *  key. It then creates any missing bindings on the\n\
 *  final resolved vm.\n\
 */\n\
function traceScope (path, compiler, data) {\n\
    var rel  = '',\n\
        dist = 0,\n\
        self = compiler\n\
\n\
    if (data && utils.get(data, path) !== undefined) {\n\
        // hack: temporarily attached data\n\
        return '$temp.'\n\
    }\n\
\n\
    while (compiler) {\n\
        if (compiler.hasKey(path)) {\n\
            break\n\
        } else {\n\
            compiler = compiler.parent\n\
            dist++\n\
        }\n\
    }\n\
    if (compiler) {\n\
        while (dist--) {\n\
            rel += '$parent.'\n\
        }\n\
        if (!compiler.bindings[path] && path.charAt(0) !== '$') {\n\
            compiler.createBinding(path)\n\
        }\n\
    } else {\n\
        self.createBinding(path)\n\
    }\n\
    return rel\n\
}\n\
\n\
/**\n\
 *  Create a function from a string...\n\
 *  this looks like evil magic but since all variables are limited\n\
 *  to the VM's data it's actually properly sandboxed\n\
 */\n\
function makeGetter (exp, raw) {\n\
    var fn\n\
    try {\n\
        fn = new Function(exp)\n\
    } catch (e) {\n\
        utils.warn('Error parsing expression: ' + raw)\n\
    }\n\
    return fn\n\
}\n\
\n\
/**\n\
 *  Escape a leading dollar sign for regex construction\n\
 */\n\
function escapeDollar (v) {\n\
    return v.charAt(0) === '$'\n\
        ? '\\\\' + v\n\
        : v\n\
}\n\
\n\
/**\n\
 *  Parse and return an anonymous computed property getter function\n\
 *  from an arbitrary expression, together with a list of paths to be\n\
 *  created as bindings.\n\
 */\n\
exports.parse = function (exp, compiler, data) {\n\
    // unicode and 'constructor' are not allowed for XSS security.\n\
    if (UNICODE_RE.test(exp) || CTOR_RE.test(exp)) {\n\
        utils.warn('Unsafe expression: ' + exp)\n\
        return\n\
    }\n\
    // extract variable names\n\
    var vars = getVariables(exp)\n\
    if (!vars.length) {\n\
        return makeGetter('return ' + exp, exp)\n\
    }\n\
    vars = utils.unique(vars)\n\
\n\
    var accessors = '',\n\
        has       = utils.hash(),\n\
        strings   = [],\n\
        // construct a regex to extract all valid variable paths\n\
        // ones that begin with \"$\" are particularly tricky\n\
        // because we can't use \\b for them\n\
        pathRE = new RegExp(\n\
            \"[^$\\\\w\\\\.](\" +\n\
            vars.map(escapeDollar).join('|') +\n\
            \")[$\\\\w\\\\.]*\\\\b\", 'g'\n\
        ),\n\
        body = (' ' + exp)\n\
            .replace(STR_SAVE_RE, saveStrings)\n\
            .replace(pathRE, replacePath)\n\
            .replace(STR_RESTORE_RE, restoreStrings)\n\
\n\
    body = accessors + 'return ' + body\n\
\n\
    function saveStrings (str) {\n\
        var i = strings.length\n\
        // escape newlines in strings so the expression\n\
        // can be correctly evaluated\n\
        strings[i] = str.replace(NEWLINE_RE, '\\\\n\
')\n\
        return '\"' + i + '\"'\n\
    }\n\
\n\
    function replacePath (path) {\n\
        // keep track of the first char\n\
        var c = path.charAt(0)\n\
        path = path.slice(1)\n\
        var val = 'this.' + traceScope(path, compiler, data) + path\n\
        if (!has[path]) {\n\
            accessors += val + ';'\n\
            has[path] = 1\n\
        }\n\
        // don't forget to put that first char back\n\
        return c + val\n\
    }\n\
\n\
    function restoreStrings (str, i) {\n\
        return strings[i]\n\
    }\n\
\n\
    return makeGetter(body, exp)\n\
}\n\
\n\
/**\n\
 *  Evaluate an expression in the context of a compiler.\n\
 *  Accepts additional data.\n\
 */\n\
exports.eval = function (exp, compiler, data) {\n\
    var getter = exports.parse(exp, compiler, data), res\n\
    if (getter) {\n\
        // hack: temporarily attach the additional data so\n\
        // it can be accessed in the getter\n\
        compiler.vm.$temp = data\n\
        res = getter.call(compiler.vm)\n\
        delete compiler.vm.$temp\n\
    }\n\
    return res\n\
}\n\
//# sourceURL=components/yyx990803/vue/v0.10.4/src/exp-parser.js"
));

require.register("yyx990803~vue@v0.10.4/src/text-parser.js", Function("exports, module",
"var openChar        = '{',\n\
    endChar         = '}',\n\
    ESCAPE_RE       = /[-.*+?^${}()|[\\]\\/\\\\]/g,\n\
    BINDING_RE      = buildInterpolationRegex(),\n\
    // lazy require\n\
    Directive\n\
\n\
function buildInterpolationRegex () {\n\
    var open = escapeRegex(openChar),\n\
        end  = escapeRegex(endChar)\n\
    return new RegExp(open + open + open + '?(.+?)' + end + '?' + end + end)\n\
}\n\
\n\
function escapeRegex (str) {\n\
    return str.replace(ESCAPE_RE, '\\\\$&')\n\
}\n\
\n\
function setDelimiters (delimiters) {\n\
    exports.delimiters = delimiters\n\
    openChar = delimiters[0]\n\
    endChar = delimiters[1]\n\
    BINDING_RE = buildInterpolationRegex()\n\
}\n\
\n\
/** \n\
 *  Parse a piece of text, return an array of tokens\n\
 *  token types:\n\
 *  1. plain string\n\
 *  2. object with key = binding key\n\
 *  3. object with key & html = true\n\
 */\n\
function parse (text) {\n\
    if (!BINDING_RE.test(text)) return null\n\
    var m, i, token, match, tokens = []\n\
    /* jshint boss: true */\n\
    while (m = text.match(BINDING_RE)) {\n\
        i = m.index\n\
        if (i > 0) tokens.push(text.slice(0, i))\n\
        token = { key: m[1].trim() }\n\
        match = m[0]\n\
        token.html =\n\
            match.charAt(2) === openChar &&\n\
            match.charAt(match.length - 3) === endChar\n\
        tokens.push(token)\n\
        text = text.slice(i + m[0].length)\n\
    }\n\
    if (text.length) tokens.push(text)\n\
    return tokens\n\
}\n\
\n\
/**\n\
 *  Parse an attribute value with possible interpolation tags\n\
 *  return a Directive-friendly expression\n\
 *\n\
 *  e.g.  a {{b}} c  =>  \"a \" + b + \" c\"\n\
 */\n\
function parseAttr (attr) {\n\
    Directive = Directive || require(\"yyx990803~vue@v0.10.4/src/directive.js\")\n\
    var tokens = parse(attr)\n\
    if (!tokens) return null\n\
    if (tokens.length === 1) return tokens[0].key\n\
    var res = [], token\n\
    for (var i = 0, l = tokens.length; i < l; i++) {\n\
        token = tokens[i]\n\
        res.push(\n\
            token.key\n\
                ? inlineFilters(token.key)\n\
                : ('\"' + token + '\"')\n\
        )\n\
    }\n\
    return res.join('+')\n\
}\n\
\n\
/**\n\
 *  Inlines any possible filters in a binding\n\
 *  so that we can combine everything into a huge expression\n\
 */\n\
function inlineFilters (key) {\n\
    if (key.indexOf('|') > -1) {\n\
        var dirs = Directive.parse(key),\n\
            dir = dirs && dirs[0]\n\
        if (dir && dir.filters) {\n\
            key = Directive.inlineFilters(\n\
                dir.key,\n\
                dir.filters\n\
            )\n\
        }\n\
    }\n\
    return '(' + key + ')'\n\
}\n\
\n\
exports.parse         = parse\n\
exports.parseAttr     = parseAttr\n\
exports.setDelimiters = setDelimiters\n\
exports.delimiters    = [openChar, endChar]\n\
//# sourceURL=components/yyx990803/vue/v0.10.4/src/text-parser.js"
));

require.register("yyx990803~vue@v0.10.4/src/deps-parser.js", Function("exports, module",
"var Emitter  = require(\"yyx990803~vue@v0.10.4/src/emitter.js\"),\n\
    utils    = require(\"yyx990803~vue@v0.10.4/src/utils.js\"),\n\
    Observer = require(\"yyx990803~vue@v0.10.4/src/observer.js\"),\n\
    catcher  = new Emitter()\n\
\n\
/**\n\
 *  Auto-extract the dependencies of a computed property\n\
 *  by recording the getters triggered when evaluating it.\n\
 */\n\
function catchDeps (binding) {\n\
    if (binding.isFn) return\n\
    utils.log('\\n\
- ' + binding.key)\n\
    var got = utils.hash()\n\
    binding.deps = []\n\
    catcher.on('get', function (dep) {\n\
        var has = got[dep.key]\n\
        if (\n\
            // avoid duplicate bindings\n\
            (has && has.compiler === dep.compiler) ||\n\
            // avoid repeated items as dependency\n\
            // only when the binding is from self or the parent chain\n\
            (dep.compiler.repeat && !isParentOf(dep.compiler, binding.compiler))\n\
        ) {\n\
            return\n\
        }\n\
        got[dep.key] = dep\n\
        utils.log('  - ' + dep.key)\n\
        binding.deps.push(dep)\n\
        dep.subs.push(binding)\n\
    })\n\
    binding.value.$get()\n\
    catcher.off('get')\n\
}\n\
\n\
/**\n\
 *  Test if A is a parent of or equals B\n\
 */\n\
function isParentOf (a, b) {\n\
    while (b) {\n\
        if (a === b) {\n\
            return true\n\
        }\n\
        b = b.parent\n\
    }\n\
}\n\
\n\
module.exports = {\n\
\n\
    /**\n\
     *  the observer that catches events triggered by getters\n\
     */\n\
    catcher: catcher,\n\
\n\
    /**\n\
     *  parse a list of computed property bindings\n\
     */\n\
    parse: function (bindings) {\n\
        utils.log('\\n\
parsing dependencies...')\n\
        Observer.shouldGet = true\n\
        bindings.forEach(catchDeps)\n\
        Observer.shouldGet = false\n\
        utils.log('\\n\
done.')\n\
    }\n\
    \n\
}\n\
//# sourceURL=components/yyx990803/vue/v0.10.4/src/deps-parser.js"
));

require.register("yyx990803~vue@v0.10.4/src/filters.js", Function("exports, module",
"var utils    = require(\"yyx990803~vue@v0.10.4/src/utils.js\"),\n\
    get      = utils.get,\n\
    slice    = [].slice,\n\
    QUOTE_RE = /^'.*'$/,\n\
    filters  = module.exports = utils.hash()\n\
\n\
/**\n\
 *  'abc' => 'Abc'\n\
 */\n\
filters.capitalize = function (value) {\n\
    if (!value && value !== 0) return ''\n\
    value = value.toString()\n\
    return value.charAt(0).toUpperCase() + value.slice(1)\n\
}\n\
\n\
/**\n\
 *  'abc' => 'ABC'\n\
 */\n\
filters.uppercase = function (value) {\n\
    return (value || value === 0)\n\
        ? value.toString().toUpperCase()\n\
        : ''\n\
}\n\
\n\
/**\n\
 *  'AbC' => 'abc'\n\
 */\n\
filters.lowercase = function (value) {\n\
    return (value || value === 0)\n\
        ? value.toString().toLowerCase()\n\
        : ''\n\
}\n\
\n\
/**\n\
 *  12345 => $12,345.00\n\
 */\n\
filters.currency = function (value, sign) {\n\
    if (!value && value !== 0) return ''\n\
    sign = sign || '$'\n\
    var s = Math.floor(value).toString(),\n\
        i = s.length % 3,\n\
        h = i > 0 ? (s.slice(0, i) + (s.length > 3 ? ',' : '')) : '',\n\
        f = '.' + value.toFixed(2).slice(-2)\n\
    return sign + h + s.slice(i).replace(/(\\d{3})(?=\\d)/g, '$1,') + f\n\
}\n\
\n\
/**\n\
 *  args: an array of strings corresponding to\n\
 *  the single, double, triple ... forms of the word to\n\
 *  be pluralized. When the number to be pluralized\n\
 *  exceeds the length of the args, it will use the last\n\
 *  entry in the array.\n\
 *\n\
 *  e.g. ['single', 'double', 'triple', 'multiple']\n\
 */\n\
filters.pluralize = function (value) {\n\
    var args = slice.call(arguments, 1)\n\
    return args.length > 1\n\
        ? (args[value - 1] || args[args.length - 1])\n\
        : (args[value - 1] || args[0] + 's')\n\
}\n\
\n\
/**\n\
 *  A special filter that takes a handler function,\n\
 *  wraps it so it only gets triggered on specific keypresses.\n\
 *\n\
 *  v-on only\n\
 */\n\
\n\
var keyCodes = {\n\
    enter    : 13,\n\
    tab      : 9,\n\
    'delete' : 46,\n\
    up       : 38,\n\
    left     : 37,\n\
    right    : 39,\n\
    down     : 40,\n\
    esc      : 27\n\
}\n\
\n\
filters.key = function (handler, key) {\n\
    if (!handler) return\n\
    var code = keyCodes[key]\n\
    if (!code) {\n\
        code = parseInt(key, 10)\n\
    }\n\
    return function (e) {\n\
        if (e.keyCode === code) {\n\
            return handler.call(this, e)\n\
        }\n\
    }\n\
}\n\
\n\
/**\n\
 *  Filter filter for v-repeat\n\
 */\n\
filters.filterBy = function (arr, searchKey, delimiter, dataKey) {\n\
\n\
    // allow optional `in` delimiter\n\
    // because why not\n\
    if (delimiter && delimiter !== 'in') {\n\
        dataKey = delimiter\n\
    }\n\
\n\
    // get the search string\n\
    var search = stripQuotes(searchKey) || this.$get(searchKey)\n\
    if (!search) return arr\n\
    search = search.toLowerCase()\n\
\n\
    // get the optional dataKey\n\
    dataKey = dataKey && (stripQuotes(dataKey) || this.$get(dataKey))\n\
\n\
    // convert object to array\n\
    if (!Array.isArray(arr)) {\n\
        arr = utils.objectToArray(arr)\n\
    }\n\
\n\
    return arr.filter(function (item) {\n\
        return dataKey\n\
            ? contains(get(item, dataKey), search)\n\
            : contains(item, search)\n\
    })\n\
\n\
}\n\
\n\
filters.filterBy.computed = true\n\
\n\
/**\n\
 *  Sort fitler for v-repeat\n\
 */\n\
filters.orderBy = function (arr, sortKey, reverseKey) {\n\
\n\
    var key = stripQuotes(sortKey) || this.$get(sortKey)\n\
    if (!key) return arr\n\
\n\
    // convert object to array\n\
    if (!Array.isArray(arr)) {\n\
        arr = utils.objectToArray(arr)\n\
    }\n\
\n\
    var order = 1\n\
    if (reverseKey) {\n\
        if (reverseKey === '-1') {\n\
            order = -1\n\
        } else if (reverseKey.charAt(0) === '!') {\n\
            reverseKey = reverseKey.slice(1)\n\
            order = this.$get(reverseKey) ? 1 : -1\n\
        } else {\n\
            order = this.$get(reverseKey) ? -1 : 1\n\
        }\n\
    }\n\
\n\
    // sort on a copy to avoid mutating original array\n\
    return arr.slice().sort(function (a, b) {\n\
        a = get(a, key)\n\
        b = get(b, key)\n\
        return a === b ? 0 : a > b ? order : -order\n\
    })\n\
\n\
}\n\
\n\
filters.orderBy.computed = true\n\
\n\
// Array filter helpers -------------------------------------------------------\n\
\n\
/**\n\
 *  String contain helper\n\
 */\n\
function contains (val, search) {\n\
    /* jshint eqeqeq: false */\n\
    if (utils.isObject(val)) {\n\
        for (var key in val) {\n\
            if (contains(val[key], search)) {\n\
                return true\n\
            }\n\
        }\n\
    } else if (val != null) {\n\
        return val.toString().toLowerCase().indexOf(search) > -1\n\
    }\n\
}\n\
\n\
/**\n\
 *  Test whether a string is in quotes,\n\
 *  if yes return stripped string\n\
 */\n\
function stripQuotes (str) {\n\
    if (QUOTE_RE.test(str)) {\n\
        return str.slice(1, -1)\n\
    }\n\
}\n\
//# sourceURL=components/yyx990803/vue/v0.10.4/src/filters.js"
));

require.register("yyx990803~vue@v0.10.4/src/transition.js", Function("exports, module",
"var endEvents  = sniffEndEvents(),\n\
    config     = require(\"yyx990803~vue@v0.10.4/src/config.js\"),\n\
    // batch enter animations so we only force the layout once\n\
    Batcher    = require(\"yyx990803~vue@v0.10.4/src/batcher.js\"),\n\
    batcher    = new Batcher(),\n\
    // cache timer functions\n\
    setTO      = window.setTimeout,\n\
    clearTO    = window.clearTimeout,\n\
    // exit codes for testing\n\
    codes = {\n\
        CSS_E     : 1,\n\
        CSS_L     : 2,\n\
        JS_E      : 3,\n\
        JS_L      : 4,\n\
        CSS_SKIP  : -1,\n\
        JS_SKIP   : -2,\n\
        JS_SKIP_E : -3,\n\
        JS_SKIP_L : -4,\n\
        INIT      : -5,\n\
        SKIP      : -6\n\
    }\n\
\n\
// force layout before triggering transitions/animations\n\
batcher._preFlush = function () {\n\
    /* jshint unused: false */\n\
    var f = document.body.offsetHeight\n\
}\n\
\n\
/**\n\
 *  stage:\n\
 *    1 = enter\n\
 *    2 = leave\n\
 */\n\
var transition = module.exports = function (el, stage, cb, compiler) {\n\
\n\
    var changeState = function () {\n\
        cb()\n\
        compiler.execHook(stage > 0 ? 'attached' : 'detached')\n\
    }\n\
\n\
    if (compiler.init) {\n\
        changeState()\n\
        return codes.INIT\n\
    }\n\
\n\
    var hasTransition = el.vue_trans === '',\n\
        hasAnimation  = el.vue_anim === '',\n\
        effectId      = el.vue_effect\n\
\n\
    if (effectId) {\n\
        return applyTransitionFunctions(\n\
            el,\n\
            stage,\n\
            changeState,\n\
            effectId,\n\
            compiler\n\
        )\n\
    } else if (hasTransition || hasAnimation) {\n\
        return applyTransitionClass(\n\
            el,\n\
            stage,\n\
            changeState,\n\
            hasAnimation\n\
        )\n\
    } else {\n\
        changeState()\n\
        return codes.SKIP\n\
    }\n\
\n\
}\n\
\n\
transition.codes = codes\n\
\n\
/**\n\
 *  Togggle a CSS class to trigger transition\n\
 */\n\
function applyTransitionClass (el, stage, changeState, hasAnimation) {\n\
\n\
    if (!endEvents.trans) {\n\
        changeState()\n\
        return codes.CSS_SKIP\n\
    }\n\
\n\
    // if the browser supports transition,\n\
    // it must have classList...\n\
    var onEnd,\n\
        classList        = el.classList,\n\
        existingCallback = el.vue_trans_cb,\n\
        enterClass       = config.enterClass,\n\
        leaveClass       = config.leaveClass,\n\
        endEvent         = hasAnimation ? endEvents.anim : endEvents.trans\n\
\n\
    // cancel unfinished callbacks and jobs\n\
    if (existingCallback) {\n\
        el.removeEventListener(endEvent, existingCallback)\n\
        classList.remove(enterClass)\n\
        classList.remove(leaveClass)\n\
        el.vue_trans_cb = null\n\
    }\n\
\n\
    if (stage > 0) { // enter\n\
\n\
        // set to enter state before appending\n\
        classList.add(enterClass)\n\
        // append\n\
        changeState()\n\
        // trigger transition\n\
        if (!hasAnimation) {\n\
            batcher.push({\n\
                execute: function () {\n\
                    classList.remove(enterClass)\n\
                }\n\
            })\n\
        } else {\n\
            onEnd = function (e) {\n\
                if (e.target === el) {\n\
                    el.removeEventListener(endEvent, onEnd)\n\
                    el.vue_trans_cb = null\n\
                    classList.remove(enterClass)\n\
                }\n\
            }\n\
            el.addEventListener(endEvent, onEnd)\n\
            el.vue_trans_cb = onEnd\n\
        }\n\
        return codes.CSS_E\n\
\n\
    } else { // leave\n\
\n\
        if (el.offsetWidth || el.offsetHeight) {\n\
            // trigger hide transition\n\
            classList.add(leaveClass)\n\
            onEnd = function (e) {\n\
                if (e.target === el) {\n\
                    el.removeEventListener(endEvent, onEnd)\n\
                    el.vue_trans_cb = null\n\
                    // actually remove node here\n\
                    changeState()\n\
                    classList.remove(leaveClass)\n\
                }\n\
            }\n\
            // attach transition end listener\n\
            el.addEventListener(endEvent, onEnd)\n\
            el.vue_trans_cb = onEnd\n\
        } else {\n\
            // directly remove invisible elements\n\
            changeState()\n\
        }\n\
        return codes.CSS_L\n\
        \n\
    }\n\
\n\
}\n\
\n\
function applyTransitionFunctions (el, stage, changeState, effectId, compiler) {\n\
\n\
    var funcs = compiler.getOption('effects', effectId)\n\
    if (!funcs) {\n\
        changeState()\n\
        return codes.JS_SKIP\n\
    }\n\
\n\
    var enter = funcs.enter,\n\
        leave = funcs.leave,\n\
        timeouts = el.vue_timeouts\n\
\n\
    // clear previous timeouts\n\
    if (timeouts) {\n\
        var i = timeouts.length\n\
        while (i--) {\n\
            clearTO(timeouts[i])\n\
        }\n\
    }\n\
\n\
    timeouts = el.vue_timeouts = []\n\
    function timeout (cb, delay) {\n\
        var id = setTO(function () {\n\
            cb()\n\
            timeouts.splice(timeouts.indexOf(id), 1)\n\
            if (!timeouts.length) {\n\
                el.vue_timeouts = null\n\
            }\n\
        }, delay)\n\
        timeouts.push(id)\n\
    }\n\
\n\
    if (stage > 0) { // enter\n\
        if (typeof enter !== 'function') {\n\
            changeState()\n\
            return codes.JS_SKIP_E\n\
        }\n\
        enter(el, changeState, timeout)\n\
        return codes.JS_E\n\
    } else { // leave\n\
        if (typeof leave !== 'function') {\n\
            changeState()\n\
            return codes.JS_SKIP_L\n\
        }\n\
        leave(el, changeState, timeout)\n\
        return codes.JS_L\n\
    }\n\
\n\
}\n\
\n\
/**\n\
 *  Sniff proper transition end event name\n\
 */\n\
function sniffEndEvents () {\n\
    var el = document.createElement('vue'),\n\
        defaultEvent = 'transitionend',\n\
        events = {\n\
            'transition'       : defaultEvent,\n\
            'mozTransition'    : defaultEvent,\n\
            'webkitTransition' : 'webkitTransitionEnd'\n\
        },\n\
        ret = {}\n\
    for (var name in events) {\n\
        if (el.style[name] !== undefined) {\n\
            ret.trans = events[name]\n\
            break\n\
        }\n\
    }\n\
    ret.anim = el.style.animation === ''\n\
        ? 'animationend'\n\
        : 'webkitAnimationEnd'\n\
    return ret\n\
}\n\
//# sourceURL=components/yyx990803/vue/v0.10.4/src/transition.js"
));

require.register("yyx990803~vue@v0.10.4/src/batcher.js", Function("exports, module",
"var utils = require(\"yyx990803~vue@v0.10.4/src/utils.js\")\n\
\n\
function Batcher () {\n\
    this.reset()\n\
}\n\
\n\
var BatcherProto = Batcher.prototype\n\
\n\
BatcherProto.push = function (job) {\n\
    if (!job.id || !this.has[job.id]) {\n\
        this.queue.push(job)\n\
        this.has[job.id] = job\n\
        if (!this.waiting) {\n\
            this.waiting = true\n\
            utils.nextTick(utils.bind(this.flush, this))\n\
        }\n\
    } else if (job.override) {\n\
        var oldJob = this.has[job.id]\n\
        oldJob.cancelled = true\n\
        this.queue.push(job)\n\
        this.has[job.id] = job\n\
    }\n\
}\n\
\n\
BatcherProto.flush = function () {\n\
    // before flush hook\n\
    if (this._preFlush) this._preFlush()\n\
    // do not cache length because more jobs might be pushed\n\
    // as we execute existing jobs\n\
    for (var i = 0; i < this.queue.length; i++) {\n\
        var job = this.queue[i]\n\
        if (!job.cancelled) {\n\
            job.execute()\n\
        }\n\
    }\n\
    this.reset()\n\
}\n\
\n\
BatcherProto.reset = function () {\n\
    this.has = utils.hash()\n\
    this.queue = []\n\
    this.waiting = false\n\
}\n\
\n\
module.exports = Batcher\n\
//# sourceURL=components/yyx990803/vue/v0.10.4/src/batcher.js"
));

require.register("yyx990803~vue@v0.10.4/src/directives/index.js", Function("exports, module",
"var utils      = require(\"yyx990803~vue@v0.10.4/src/utils.js\"),\n\
    config     = require(\"yyx990803~vue@v0.10.4/src/config.js\"),\n\
    transition = require(\"yyx990803~vue@v0.10.4/src/transition.js\"),\n\
    directives = module.exports = utils.hash()\n\
\n\
/**\n\
 *  Nest and manage a Child VM\n\
 */\n\
directives.component = {\n\
    isLiteral: true,\n\
    bind: function () {\n\
        if (!this.el.vue_vm) {\n\
            this.childVM = new this.Ctor({\n\
                el: this.el,\n\
                parent: this.vm\n\
            })\n\
        }\n\
    },\n\
    unbind: function () {\n\
        if (this.childVM) {\n\
            this.childVM.$destroy()\n\
        }\n\
    }\n\
}\n\
\n\
/**\n\
 *  Binding HTML attributes\n\
 */\n\
directives.attr = {\n\
    bind: function () {\n\
        var params = this.vm.$options.paramAttributes\n\
        this.isParam = params && params.indexOf(this.arg) > -1\n\
    },\n\
    update: function (value) {\n\
        if (value || value === 0) {\n\
            this.el.setAttribute(this.arg, value)\n\
        } else {\n\
            this.el.removeAttribute(this.arg)\n\
        }\n\
        if (this.isParam) {\n\
            this.vm[this.arg] = utils.checkNumber(value)\n\
        }\n\
    }\n\
}\n\
\n\
/**\n\
 *  Binding textContent\n\
 */\n\
directives.text = {\n\
    bind: function () {\n\
        this.attr = this.el.nodeType === 3\n\
            ? 'nodeValue'\n\
            : 'textContent'\n\
    },\n\
    update: function (value) {\n\
        this.el[this.attr] = utils.guard(value)\n\
    }\n\
}\n\
\n\
/**\n\
 *  Binding CSS display property\n\
 */\n\
directives.show = function (value) {\n\
    var el = this.el,\n\
        target = value ? '' : 'none',\n\
        change = function () {\n\
            el.style.display = target\n\
        }\n\
    transition(el, value ? 1 : -1, change, this.compiler)\n\
}\n\
\n\
/**\n\
 *  Binding CSS classes\n\
 */\n\
directives['class'] = function (value) {\n\
    if (this.arg) {\n\
        utils[value ? 'addClass' : 'removeClass'](this.el, this.arg)\n\
    } else {\n\
        if (this.lastVal) {\n\
            utils.removeClass(this.el, this.lastVal)\n\
        }\n\
        if (value) {\n\
            utils.addClass(this.el, value)\n\
            this.lastVal = value\n\
        }\n\
    }\n\
}\n\
\n\
/**\n\
 *  Only removed after the owner VM is ready\n\
 */\n\
directives.cloak = {\n\
    isEmpty: true,\n\
    bind: function () {\n\
        var el = this.el\n\
        this.compiler.observer.once('hook:ready', function () {\n\
            el.removeAttribute(config.prefix + '-cloak')\n\
        })\n\
    }\n\
}\n\
\n\
/**\n\
 *  Store a reference to self in parent VM's $\n\
 */\n\
directives.ref = {\n\
    isLiteral: true,\n\
    bind: function () {\n\
        var id = this.expression\n\
        if (id) {\n\
            this.vm.$parent.$[id] = this.vm\n\
        }\n\
    },\n\
    unbind: function () {\n\
        var id = this.expression\n\
        if (id) {\n\
            delete this.vm.$parent.$[id]\n\
        }\n\
    }\n\
}\n\
\n\
directives.on      = require(\"yyx990803~vue@v0.10.4/src/directives/on.js\")\n\
directives.repeat  = require(\"yyx990803~vue@v0.10.4/src/directives/repeat.js\")\n\
directives.model   = require(\"yyx990803~vue@v0.10.4/src/directives/model.js\")\n\
directives['if']   = require(\"yyx990803~vue@v0.10.4/src/directives/if.js\")\n\
directives['with'] = require(\"yyx990803~vue@v0.10.4/src/directives/with.js\")\n\
directives.html    = require(\"yyx990803~vue@v0.10.4/src/directives/html.js\")\n\
directives.style   = require(\"yyx990803~vue@v0.10.4/src/directives/style.js\")\n\
directives.partial = require(\"yyx990803~vue@v0.10.4/src/directives/partial.js\")\n\
directives.view    = require(\"yyx990803~vue@v0.10.4/src/directives/view.js\")\n\
//# sourceURL=components/yyx990803/vue/v0.10.4/src/directives/index.js"
));

require.register("yyx990803~vue@v0.10.4/src/directives/if.js", Function("exports, module",
"var utils    = require(\"yyx990803~vue@v0.10.4/src/utils.js\")\n\
\n\
/**\n\
 *  Manages a conditional child VM\n\
 */\n\
module.exports = {\n\
\n\
    bind: function () {\n\
        \n\
        this.parent = this.el.parentNode\n\
        this.ref    = document.createComment('vue-if')\n\
        this.Ctor   = this.compiler.resolveComponent(this.el)\n\
\n\
        // insert ref\n\
        this.parent.insertBefore(this.ref, this.el)\n\
        this.parent.removeChild(this.el)\n\
\n\
        if (utils.attr(this.el, 'view')) {\n\
            utils.warn(\n\
                'Conflict: v-if cannot be used together with v-view. ' +\n\
                'Just set v-view\\'s binding value to empty string to empty it.'\n\
            )\n\
        }\n\
        if (utils.attr(this.el, 'repeat')) {\n\
            utils.warn(\n\
                'Conflict: v-if cannot be used together with v-repeat. ' +\n\
                'Use `v-show` or the `filterBy` filter instead.'\n\
            )\n\
        }\n\
    },\n\
\n\
    update: function (value) {\n\
\n\
        if (!value) {\n\
            this.unbind()\n\
        } else if (!this.childVM) {\n\
            this.childVM = new this.Ctor({\n\
                el: this.el.cloneNode(true),\n\
                parent: this.vm\n\
            })\n\
            if (this.compiler.init) {\n\
                this.parent.insertBefore(this.childVM.$el, this.ref)\n\
            } else {\n\
                this.childVM.$before(this.ref)\n\
            }\n\
        }\n\
        \n\
    },\n\
\n\
    unbind: function () {\n\
        if (this.childVM) {\n\
            this.childVM.$destroy()\n\
            this.childVM = null\n\
        }\n\
    }\n\
}\n\
//# sourceURL=components/yyx990803/vue/v0.10.4/src/directives/if.js"
));

require.register("yyx990803~vue@v0.10.4/src/directives/repeat.js", Function("exports, module",
"var utils      = require(\"yyx990803~vue@v0.10.4/src/utils.js\"),\n\
    config     = require(\"yyx990803~vue@v0.10.4/src/config.js\")\n\
\n\
/**\n\
 *  Binding that manages VMs based on an Array\n\
 */\n\
module.exports = {\n\
\n\
    bind: function () {\n\
\n\
        this.identifier = '$r' + this.id\n\
\n\
        // a hash to cache the same expressions on repeated instances\n\
        // so they don't have to be compiled for every single instance\n\
        this.expCache = utils.hash()\n\
\n\
        var el   = this.el,\n\
            ctn  = this.container = el.parentNode\n\
\n\
        // extract child Id, if any\n\
        this.childId = this.compiler.eval(utils.attr(el, 'ref'))\n\
\n\
        // create a comment node as a reference node for DOM insertions\n\
        this.ref = document.createComment(config.prefix + '-repeat-' + this.key)\n\
        ctn.insertBefore(this.ref, el)\n\
        ctn.removeChild(el)\n\
\n\
        this.collection = null\n\
        this.vms = null\n\
\n\
    },\n\
\n\
    update: function (collection) {\n\
\n\
        if (!Array.isArray(collection)) {\n\
            if (utils.isObject(collection)) {\n\
                collection = utils.objectToArray(collection)\n\
            } else {\n\
                utils.warn('v-repeat only accepts Array or Object values.')\n\
            }\n\
        }\n\
\n\
        // keep reference of old data and VMs\n\
        // so we can reuse them if possible\n\
        this.oldVMs = this.vms\n\
        this.oldCollection = this.collection\n\
        collection = this.collection = collection || []\n\
\n\
        var isObject = collection[0] && utils.isObject(collection[0])\n\
        this.vms = this.oldCollection\n\
            ? this.diff(collection, isObject)\n\
            : this.init(collection, isObject)\n\
\n\
        if (this.childId) {\n\
            this.vm.$[this.childId] = this.vms\n\
        }\n\
\n\
    },\n\
\n\
    init: function (collection, isObject) {\n\
        var vm, vms = []\n\
        for (var i = 0, l = collection.length; i < l; i++) {\n\
            vm = this.build(collection[i], i, isObject)\n\
            vms.push(vm)\n\
            if (this.compiler.init) {\n\
                this.container.insertBefore(vm.$el, this.ref)\n\
            } else {\n\
                vm.$before(this.ref)\n\
            }\n\
        }\n\
        return vms\n\
    },\n\
\n\
    /**\n\
     *  Diff the new array with the old\n\
     *  and determine the minimum amount of DOM manipulations.\n\
     */\n\
    diff: function (newCollection, isObject) {\n\
\n\
        var i, l, item, vm,\n\
            oldIndex,\n\
            targetNext,\n\
            currentNext,\n\
            nextEl,\n\
            ctn    = this.container,\n\
            oldVMs = this.oldVMs,\n\
            vms    = []\n\
\n\
        vms.length = newCollection.length\n\
\n\
        // first pass, collect new reused and new created\n\
        for (i = 0, l = newCollection.length; i < l; i++) {\n\
            item = newCollection[i]\n\
            if (isObject) {\n\
                item.$index = i\n\
                if (item.__emitter__ && item.__emitter__[this.identifier]) {\n\
                    // this piece of data is being reused.\n\
                    // record its final position in reused vms\n\
                    item.$reused = true\n\
                } else {\n\
                    vms[i] = this.build(item, i, isObject)\n\
                }\n\
            } else {\n\
                // we can't attach an identifier to primitive values\n\
                // so have to do an indexOf...\n\
                oldIndex = indexOf(oldVMs, item)\n\
                if (oldIndex > -1) {\n\
                    // record the position on the existing vm\n\
                    oldVMs[oldIndex].$reused = true\n\
                    oldVMs[oldIndex].$data.$index = i\n\
                } else {\n\
                    vms[i] = this.build(item, i, isObject)\n\
                }\n\
            }\n\
        }\n\
\n\
        // second pass, collect old reused and destroy unused\n\
        for (i = 0, l = oldVMs.length; i < l; i++) {\n\
            vm = oldVMs[i]\n\
            item = this.arg\n\
                ? vm.$data[this.arg]\n\
                : vm.$data\n\
            if (item.$reused) {\n\
                vm.$reused = true\n\
                delete item.$reused\n\
            }\n\
            if (vm.$reused) {\n\
                // update the index to latest\n\
                vm.$index = item.$index\n\
                // the item could have had a new key\n\
                if (item.$key && item.$key !== vm.$key) {\n\
                    vm.$key = item.$key\n\
                }\n\
                vms[vm.$index] = vm\n\
            } else {\n\
                // this one can be destroyed.\n\
                if (item.__emitter__) {\n\
                    delete item.__emitter__[this.identifier]\n\
                }\n\
                vm.$destroy()\n\
            }\n\
        }\n\
\n\
        // final pass, move/insert DOM elements\n\
        i = vms.length\n\
        while (i--) {\n\
            vm = vms[i]\n\
            item = vm.$data\n\
            targetNext = vms[i + 1]\n\
            if (vm.$reused) {\n\
                nextEl = vm.$el.nextSibling\n\
                // destroyed VMs' element might still be in the DOM\n\
                // due to transitions\n\
                while (!nextEl.vue_vm && nextEl !== this.ref) {\n\
                    nextEl = nextEl.nextSibling\n\
                }\n\
                currentNext = nextEl.vue_vm\n\
                if (currentNext !== targetNext) {\n\
                    if (!targetNext) {\n\
                        ctn.insertBefore(vm.$el, this.ref)\n\
                    } else {\n\
                        nextEl = targetNext.$el\n\
                        // new VMs' element might not be in the DOM yet\n\
                        // due to transitions\n\
                        while (!nextEl.parentNode) {\n\
                            targetNext = vms[nextEl.vue_vm.$index + 1]\n\
                            nextEl = targetNext\n\
                                ? targetNext.$el\n\
                                : this.ref\n\
                        }\n\
                        ctn.insertBefore(vm.$el, nextEl)\n\
                    }\n\
                }\n\
                delete vm.$reused\n\
                delete item.$index\n\
                delete item.$key\n\
            } else { // a new vm\n\
                vm.$before(targetNext ? targetNext.$el : this.ref)\n\
            }\n\
        }\n\
\n\
        return vms\n\
    },\n\
\n\
    build: function (data, index, isObject) {\n\
\n\
        // wrap non-object values\n\
        var raw, alias,\n\
            wrap = !isObject || this.arg\n\
        if (wrap) {\n\
            raw = data\n\
            alias = this.arg || '$value'\n\
            data = {}\n\
            data[alias] = raw\n\
        }\n\
        data.$index = index\n\
\n\
        var el = this.el.cloneNode(true),\n\
            Ctor = this.compiler.resolveComponent(el, data),\n\
            vm = new Ctor({\n\
                el: el,\n\
                data: data,\n\
                parent: this.vm,\n\
                compilerOptions: {\n\
                    repeat: true,\n\
                    expCache: this.expCache\n\
                }\n\
            })\n\
\n\
        if (isObject) {\n\
            // attach an ienumerable identifier to the raw data\n\
            (raw || data).__emitter__[this.identifier] = true\n\
        }\n\
\n\
        return vm\n\
\n\
    },\n\
\n\
    unbind: function () {\n\
        if (this.childId) {\n\
            delete this.vm.$[this.childId]\n\
        }\n\
        if (this.vms) {\n\
            var i = this.vms.length\n\
            while (i--) {\n\
                this.vms[i].$destroy()\n\
            }\n\
        }\n\
    }\n\
}\n\
\n\
// Helpers --------------------------------------------------------------------\n\
\n\
/**\n\
 *  Find an object or a wrapped data object\n\
 *  from an Array\n\
 */\n\
function indexOf (vms, obj) {\n\
    for (var vm, i = 0, l = vms.length; i < l; i++) {\n\
        vm = vms[i]\n\
        if (!vm.$reused && vm.$value === obj) {\n\
            return i\n\
        }\n\
    }\n\
    return -1\n\
}\n\
//# sourceURL=components/yyx990803/vue/v0.10.4/src/directives/repeat.js"
));

require.register("yyx990803~vue@v0.10.4/src/directives/on.js", Function("exports, module",
"var utils    = require(\"yyx990803~vue@v0.10.4/src/utils.js\")\n\
\n\
/**\n\
 *  Binding for event listeners\n\
 */\n\
module.exports = {\n\
\n\
    isFn: true,\n\
\n\
    bind: function () {\n\
        this.context = this.binding.isExp\n\
            ? this.vm\n\
            : this.binding.compiler.vm\n\
    },\n\
\n\
    update: function (handler) {\n\
        if (typeof handler !== 'function') {\n\
            utils.warn('Directive \"v-on:' + this.expression + '\" expects a method.')\n\
            return\n\
        }\n\
        this.unbind()\n\
        var vm = this.vm,\n\
            context = this.context\n\
        this.handler = function (e) {\n\
            e.targetVM = vm\n\
            context.$event = e\n\
            var res = handler.call(context, e)\n\
            context.$event = null\n\
            return res\n\
        }\n\
        this.el.addEventListener(this.arg, this.handler)\n\
    },\n\
\n\
    unbind: function () {\n\
        this.el.removeEventListener(this.arg, this.handler)\n\
    }\n\
}\n\
//# sourceURL=components/yyx990803/vue/v0.10.4/src/directives/on.js"
));

require.register("yyx990803~vue@v0.10.4/src/directives/model.js", Function("exports, module",
"var utils = require(\"yyx990803~vue@v0.10.4/src/utils.js\"),\n\
    isIE9 = navigator.userAgent.indexOf('MSIE 9.0') > 0,\n\
    filter = [].filter\n\
\n\
/**\n\
 *  Returns an array of values from a multiple select\n\
 */\n\
function getMultipleSelectOptions (select) {\n\
    return filter\n\
        .call(select.options, function (option) {\n\
            return option.selected\n\
        })\n\
        .map(function (option) {\n\
            return option.value || option.text\n\
        })\n\
}\n\
\n\
/**\n\
 *  Two-way binding for form input elements\n\
 */\n\
module.exports = {\n\
\n\
    bind: function () {\n\
\n\
        var self = this,\n\
            el   = self.el,\n\
            type = el.type,\n\
            tag  = el.tagName\n\
\n\
        self.lock = false\n\
        self.ownerVM = self.binding.compiler.vm\n\
\n\
        // determine what event to listen to\n\
        self.event =\n\
            (self.compiler.options.lazy ||\n\
            tag === 'SELECT' ||\n\
            type === 'checkbox' || type === 'radio')\n\
                ? 'change'\n\
                : 'input'\n\
\n\
        // determine the attribute to change when updating\n\
        self.attr = type === 'checkbox'\n\
            ? 'checked'\n\
            : (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA')\n\
                ? 'value'\n\
                : 'innerHTML'\n\
\n\
        // select[multiple] support\n\
        if(tag === 'SELECT' && el.hasAttribute('multiple')) {\n\
            this.multi = true\n\
        }\n\
\n\
        var compositionLock = false\n\
        self.cLock = function () {\n\
            compositionLock = true\n\
        }\n\
        self.cUnlock = function () {\n\
            compositionLock = false\n\
        }\n\
        el.addEventListener('compositionstart', this.cLock)\n\
        el.addEventListener('compositionend', this.cUnlock)\n\
\n\
        // attach listener\n\
        self.set = self.filters\n\
            ? function () {\n\
                if (compositionLock) return\n\
                // if this directive has filters\n\
                // we need to let the vm.$set trigger\n\
                // update() so filters are applied.\n\
                // therefore we have to record cursor position\n\
                // so that after vm.$set changes the input\n\
                // value we can put the cursor back at where it is\n\
                var cursorPos\n\
                try { cursorPos = el.selectionStart } catch (e) {}\n\
\n\
                self._set()\n\
\n\
                // since updates are async\n\
                // we need to reset cursor position async too\n\
                utils.nextTick(function () {\n\
                    if (cursorPos !== undefined) {\n\
                        el.setSelectionRange(cursorPos, cursorPos)\n\
                    }\n\
                })\n\
            }\n\
            : function () {\n\
                if (compositionLock) return\n\
                // no filters, don't let it trigger update()\n\
                self.lock = true\n\
\n\
                self._set()\n\
\n\
                utils.nextTick(function () {\n\
                    self.lock = false\n\
                })\n\
            }\n\
        el.addEventListener(self.event, self.set)\n\
\n\
        // fix shit for IE9\n\
        // since it doesn't fire input on backspace / del / cut\n\
        if (isIE9) {\n\
            self.onCut = function () {\n\
                // cut event fires before the value actually changes\n\
                utils.nextTick(function () {\n\
                    self.set()\n\
                })\n\
            }\n\
            self.onDel = function (e) {\n\
                if (e.keyCode === 46 || e.keyCode === 8) {\n\
                    self.set()\n\
                }\n\
            }\n\
            el.addEventListener('cut', self.onCut)\n\
            el.addEventListener('keyup', self.onDel)\n\
        }\n\
    },\n\
\n\
    _set: function () {\n\
        this.ownerVM.$set(\n\
            this.key, this.multi\n\
                ? getMultipleSelectOptions(this.el)\n\
                : this.el[this.attr]\n\
        )\n\
    },\n\
\n\
    update: function (value, init) {\n\
        /* jshint eqeqeq: false */\n\
        // sync back inline value if initial data is undefined\n\
        if (init && value === undefined) {\n\
            return this._set()\n\
        }\n\
        if (this.lock) return\n\
        var el = this.el\n\
        if (el.tagName === 'SELECT') { // select dropdown\n\
            el.selectedIndex = -1\n\
            if(this.multi && Array.isArray(value)) {\n\
                value.forEach(this.updateSelect, this)\n\
            } else {\n\
                this.updateSelect(value)\n\
            }\n\
        } else if (el.type === 'radio') { // radio button\n\
            el.checked = value == el.value\n\
        } else if (el.type === 'checkbox') { // checkbox\n\
            el.checked = !!value\n\
        } else {\n\
            el[this.attr] = utils.guard(value)\n\
        }\n\
    },\n\
\n\
    updateSelect: function (value) {\n\
        /* jshint eqeqeq: false */\n\
        // setting <select>'s value in IE9 doesn't work\n\
        // we have to manually loop through the options\n\
        var options = this.el.options,\n\
            i = options.length\n\
        while (i--) {\n\
            if (options[i].value == value) {\n\
                options[i].selected = true\n\
                break\n\
            }\n\
        }\n\
    },\n\
\n\
    unbind: function () {\n\
        var el = this.el\n\
        el.removeEventListener(this.event, this.set)\n\
        el.removeEventListener('compositionstart', this.cLock)\n\
        el.removeEventListener('compositionend', this.cUnlock)\n\
        if (isIE9) {\n\
            el.removeEventListener('cut', this.onCut)\n\
            el.removeEventListener('keyup', this.onDel)\n\
        }\n\
    }\n\
}\n\
//# sourceURL=components/yyx990803/vue/v0.10.4/src/directives/model.js"
));

require.register("yyx990803~vue@v0.10.4/src/directives/with.js", Function("exports, module",
"var utils = require(\"yyx990803~vue@v0.10.4/src/utils.js\")\n\
\n\
/**\n\
 *  Binding for inheriting data from parent VMs.\n\
 */\n\
module.exports = {\n\
\n\
    bind: function () {\n\
\n\
        var self      = this,\n\
            childKey  = self.arg,\n\
            parentKey = self.key,\n\
            compiler  = self.compiler,\n\
            owner     = self.binding.compiler\n\
\n\
        if (compiler === owner) {\n\
            this.alone = true\n\
            return\n\
        }\n\
\n\
        if (childKey) {\n\
            if (!compiler.bindings[childKey]) {\n\
                compiler.createBinding(childKey)\n\
            }\n\
            // sync changes on child back to parent\n\
            compiler.observer.on('change:' + childKey, function (val) {\n\
                if (compiler.init) return\n\
                if (!self.lock) {\n\
                    self.lock = true\n\
                    utils.nextTick(function () {\n\
                        self.lock = false\n\
                    })\n\
                }\n\
                owner.vm.$set(parentKey, val)\n\
            })\n\
        }\n\
    },\n\
\n\
    update: function (value) {\n\
        // sync from parent\n\
        if (!this.alone && !this.lock) {\n\
            if (this.arg) {\n\
                this.vm.$set(this.arg, value)\n\
            } else {\n\
                this.vm.$data = value\n\
            }\n\
        }\n\
    }\n\
\n\
}\n\
//# sourceURL=components/yyx990803/vue/v0.10.4/src/directives/with.js"
));

require.register("yyx990803~vue@v0.10.4/src/directives/html.js", Function("exports, module",
"var utils = require(\"yyx990803~vue@v0.10.4/src/utils.js\"),\n\
    slice = [].slice\n\
\n\
/**\n\
 *  Binding for innerHTML\n\
 */\n\
module.exports = {\n\
\n\
    bind: function () {\n\
        // a comment node means this is a binding for\n\
        // {{{ inline unescaped html }}}\n\
        if (this.el.nodeType === 8) {\n\
            // hold nodes\n\
            this.nodes = []\n\
        }\n\
    },\n\
\n\
    update: function (value) {\n\
        value = utils.guard(value)\n\
        if (this.nodes) {\n\
            this.swap(value)\n\
        } else {\n\
            this.el.innerHTML = value\n\
        }\n\
    },\n\
\n\
    swap: function (value) {\n\
        var parent = this.el.parentNode,\n\
            nodes  = this.nodes,\n\
            i      = nodes.length\n\
        // remove old nodes\n\
        while (i--) {\n\
            parent.removeChild(nodes[i])\n\
        }\n\
        // convert new value to a fragment\n\
        var frag = utils.toFragment(value)\n\
        // save a reference to these nodes so we can remove later\n\
        this.nodes = slice.call(frag.childNodes)\n\
        parent.insertBefore(frag, this.el)\n\
    }\n\
}\n\
//# sourceURL=components/yyx990803/vue/v0.10.4/src/directives/html.js"
));

require.register("yyx990803~vue@v0.10.4/src/directives/style.js", Function("exports, module",
"var camelRE = /-([a-z])/g,\n\
    prefixes = ['webkit', 'moz', 'ms']\n\
\n\
function camelReplacer (m) {\n\
    return m[1].toUpperCase()\n\
}\n\
\n\
/**\n\
 *  Binding for CSS styles\n\
 */\n\
module.exports = {\n\
\n\
    bind: function () {\n\
        var prop = this.arg\n\
        if (!prop) return\n\
        var first = prop.charAt(0)\n\
        if (first === '$') {\n\
            // properties that start with $ will be auto-prefixed\n\
            prop = prop.slice(1)\n\
            this.prefixed = true\n\
        } else if (first === '-') {\n\
            // normal starting hyphens should not be converted\n\
            prop = prop.slice(1)\n\
        }\n\
        this.prop = prop.replace(camelRE, camelReplacer)\n\
    },\n\
\n\
    update: function (value) {\n\
        var prop = this.prop\n\
        if (prop) {\n\
            this.el.style[prop] = value\n\
            if (this.prefixed) {\n\
                prop = prop.charAt(0).toUpperCase() + prop.slice(1)\n\
                var i = prefixes.length\n\
                while (i--) {\n\
                    this.el.style[prefixes[i] + prop] = value\n\
                }\n\
            }\n\
        } else {\n\
            this.el.style.cssText = value\n\
        }\n\
    }\n\
\n\
}\n\
//# sourceURL=components/yyx990803/vue/v0.10.4/src/directives/style.js"
));

require.register("yyx990803~vue@v0.10.4/src/directives/partial.js", Function("exports, module",
"var utils = require(\"yyx990803~vue@v0.10.4/src/utils.js\")\n\
\n\
/**\n\
 *  Binding for partials\n\
 */\n\
module.exports = {\n\
\n\
    isLiteral: true,\n\
\n\
    bind: function () {\n\
\n\
        var id = this.expression\n\
        if (!id) return\n\
\n\
        var el       = this.el,\n\
            compiler = this.compiler,\n\
            partial  = compiler.getOption('partials', id)\n\
\n\
        if (!partial) {\n\
            if (id === 'yield') {\n\
                utils.warn('{{>yield}} syntax has been deprecated. Use <content> tag instead.')\n\
            }\n\
            return\n\
        }\n\
\n\
        partial = partial.cloneNode(true)\n\
\n\
        // comment ref node means inline partial\n\
        if (el.nodeType === 8) {\n\
\n\
            // keep a ref for the partial's content nodes\n\
            var nodes = [].slice.call(partial.childNodes),\n\
                parent = el.parentNode\n\
            parent.insertBefore(partial, el)\n\
            parent.removeChild(el)\n\
            // compile partial after appending, because its children's parentNode\n\
            // will change from the fragment to the correct parentNode.\n\
            // This could affect directives that need access to its element's parentNode.\n\
            nodes.forEach(compiler.compile, compiler)\n\
\n\
        } else {\n\
\n\
            // just set innerHTML...\n\
            el.innerHTML = ''\n\
            el.appendChild(partial.cloneNode(true))\n\
\n\
        }\n\
    }\n\
\n\
}\n\
//# sourceURL=components/yyx990803/vue/v0.10.4/src/directives/partial.js"
));

require.register("yyx990803~vue@v0.10.4/src/directives/view.js", Function("exports, module",
"/**\n\
 *  Manages a conditional child VM using the\n\
 *  binding's value as the component ID.\n\
 */\n\
module.exports = {\n\
\n\
    bind: function () {\n\
\n\
        // track position in DOM with a ref node\n\
        var el       = this.raw = this.el,\n\
            parent   = el.parentNode,\n\
            ref      = this.ref = document.createComment('v-view')\n\
        parent.insertBefore(ref, el)\n\
        parent.removeChild(el)\n\
\n\
        // cache original content\n\
        /* jshint boss: true */\n\
        var node,\n\
            frag = this.inner = document.createElement('div')\n\
        while (node = el.firstChild) {\n\
            frag.appendChild(node)\n\
        }\n\
\n\
    },\n\
\n\
    update: function(value) {\n\
\n\
        this.unbind()\n\
\n\
        var Ctor  = this.compiler.getOption('components', value)\n\
        if (!Ctor) return\n\
\n\
        this.childVM = new Ctor({\n\
            el: this.raw.cloneNode(true),\n\
            parent: this.vm,\n\
            compilerOptions: {\n\
                rawContent: this.inner.cloneNode(true)\n\
            }\n\
        })\n\
\n\
        this.el = this.childVM.$el\n\
        if (this.compiler.init) {\n\
            this.ref.parentNode.insertBefore(this.el, this.ref)\n\
        } else {\n\
            this.childVM.$before(this.ref)\n\
        }\n\
\n\
    },\n\
\n\
    unbind: function() {\n\
        if (this.childVM) {\n\
            this.childVM.$destroy()\n\
        }\n\
    }\n\
\n\
}\n\
//# sourceURL=components/yyx990803/vue/v0.10.4/src/directives/view.js"
));

require.modules["yyx990803-vue"] = require.modules["yyx990803~vue@v0.10.4"];
require.modules["yyx990803~vue"] = require.modules["yyx990803~vue@v0.10.4"];
require.modules["vue"] = require.modules["yyx990803~vue@v0.10.4"];


require.register("vue-validator", Function("exports, module",
"/**\n\
 * import(s)\n\
 */\n\
\n\
var Vue = require(\"yyx990803~vue@v0.10.4\")\n\
\n\
\n\
/**\n\
 * export(s)\n\
 */\n\
\n\
exports.install = function (Vue) {\n\
}\n\
\n\
//# sourceURL=index.js"
));

require.modules["vue-validator"] = require.modules["vue-validator"];


require("vue-validator")
