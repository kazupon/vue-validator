/**
 * vue-validator v1.4.4
 * (c) 2014-2015 kazuya kawaguchi
 * Released under the MIT License.
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["vue-validator"] = factory();
	else
		root["vue-validator"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _validators = __webpack_require__(1);

	var validators = _interopRequireWildcard(_validators);

	/**
	 * VueValidator class
	 */

	var VueValidator = (function () {
	  function VueValidator() {
	    _classCallCheck(this, VueValidator);
	  }

	  _createClass(VueValidator, null, [{
	    key: 'install',

	    /**
	     * install
	     *
	     * @param {Function} Vue
	     * @param {Object} options
	     */

	    value: function install(Vue) {
	      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	      Vue.options.validators = validators;
	      VueValidator.Vue = Vue;
	    }

	    /**
	     * assets
	     *
	     * @param {String} id
	     * @param {Function} definition
	     * @return {Function} validator
	     */
	  }, {
	    key: 'assets',
	    value: function assets(id, definition) {
	      var asset = null;
	      var Vue = VueValidator.Vue;

	      if (!definition) {
	        asset = Vue.util.resolveAsset(Vue.options, 'validators', id);
	      } else {
	        Vue.options.validators[id] = definition;
	      }

	      return asset;
	    }
	  }]);

	  return VueValidator;
	})();

	exports['default'] = VueValidator;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	/**
	 * Fundamental validate functions
	 */

	/**
	 * required
	 *
	 * This function validate whether the value has been filled out.
	 *
	 * @param val
	 * @return {Boolean}
	 */

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.required = required;
	exports.pattern = pattern;
	exports.minLength = minLength;
	exports.maxLength = maxLength;
	exports.min = min;
	exports.max = max;
	exports.isInteger = isInteger;

	function required(val) {
	  if (Array.isArray(val)) {
	    return val.length > 0;
	  } else if (typeof val === 'number' || typeof val === 'function') {
	    return true;
	  } else if (typeof val === 'boolean') {
	    return val;
	  } else if (typeof val === 'string') {
	    return val.length > 0;
	  } else if (val !== null && typeof val === 'object') {
	    return Object.keys(val).length > 0;
	  } else if (val === null || val === undefined) {
	    return false;
	  }
	}

	/**
	 * pattern
	 *
	 * This function validate whether the value matches the regex pattern
	 *
	 * @param val
	 * @param {String} pat
	 * @return {Boolean}
	 */

	function pattern(val, pat) {
	  if (typeof pat !== 'string') {
	    return false;
	  }

	  var match = pat.match(new RegExp('^/(.*?)/([gimy]*)$'));
	  if (!match) {
	    return false;
	  }

	  return new RegExp(match[1], match[2]).test(val);
	}

	/**
	 * minLength
	 *
	 * This function validate whether the minimum length of the string.
	 *
	 * @param {String} val
	 * @param {String|Number} min
	 * @return {Boolean}
	 */

	function minLength(val, min) {
	  return typeof val === 'string' && isInteger(min, 10) && val.length >= parseInt(min, 10);
	}

	/**
	 * maxLength
	 *
	 * This function validate whether the maximum length of the string.
	 *
	 * @param {String} val
	 * @param {String|Number} max
	 * @return {Boolean}
	 */

	function maxLength(val, max) {
	  return typeof val === 'string' && isInteger(max, 10) && val.length <= parseInt(max, 10);
	}

	/**
	 * min
	 *
	 * This function validate whether the minimum value of the numberable value.
	 *
	 * @param {*} val
	 * @param {*} arg minimum
	 * @return {Boolean}
	 */

	function min(val, arg) {
	  return !isNaN(+val) && !isNaN(+arg) && +val >= +arg;
	}

	/**
	 * max
	 *
	 * This function validate whether the maximum value of the numberable value.
	 *
	 * @param {*} val
	 * @param {*} arg maximum
	 * @return {Boolean}
	 */

	function max(val, arg) {
	  return !isNaN(+val) && !isNaN(+arg) && +val <= +arg;
	}

	/**
	 * isInteger
	 *
	 * This function check whether the value of the string is integer.
	 *
	 * @param {String} val
	 * @return {Boolean}
	 * @private
	 */

	function isInteger(val) {
	  return (/^(-?[1-9]\d*|0)$/.test(val)
	  );
	}

/***/ }
/******/ ])
});
;
