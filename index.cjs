Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
let _unified_latex_unified_latex_util_ligatures = require("@unified-latex/unified-latex-util-ligatures");
let _unified_latex_unified_latex_util_match = require("@unified-latex/unified-latex-util-match");
let _unified_latex_unified_latex_util_visit = require("@unified-latex/unified-latex-util-visit");
let _unified_latex_unified_latex_util_print_raw = require("@unified-latex/unified-latex-util-print-raw");
let _unified_latex_unified_latex_util_arguments = require("@unified-latex/unified-latex-util-arguments");
let _unified_latex_unified_latex_util_html_like = require("@unified-latex/unified-latex-util-html-like");
let _unified_latex_unified_latex_builder = require("@unified-latex/unified-latex-builder");
let _unified_latex_unified_latex_util_replace = require("@unified-latex/unified-latex-util-replace");
let _unified_latex_unified_latex_util_split = require("@unified-latex/unified-latex-util-split");
let _unified_latex_unified_latex_lint_rules_unified_latex_lint_no_tex_font_shaping_commands = require("@unified-latex/unified-latex-lint/rules/unified-latex-lint-no-tex-font-shaping-commands");
let _unified_latex_unified_latex_util_comments = require("@unified-latex/unified-latex-util-comments");
let _unified_latex_unified_latex_util_trim = require("@unified-latex/unified-latex-util-trim");
let _unified_latex_unified_latex_ctan_package_tabularx = require("@unified-latex/unified-latex-ctan/package/tabularx");
let _unified_latex_unified_latex_util_align = require("@unified-latex/unified-latex-util-align");
let _unified_latex_unified_latex_ctan_package_exam = require("@unified-latex/unified-latex-ctan/package/exam");
let _unified_latex_unified_latex_ctan_package_systeme = require("@unified-latex/unified-latex-ctan/package/systeme");
let _unified_latex_unified_latex_ctan_package_xcolor = require("@unified-latex/unified-latex-ctan/package/xcolor");
let _unified_latex_unified_latex_util_macros = require("@unified-latex/unified-latex-util-macros");
let _unified_latex_unified_latex = require("@unified-latex/unified-latex");
require("@unified-latex/unified-latex-types");
//#region ../../node_modules/xastscript/lib/index.js
/**
* @typedef {import('xast').Element} Element
* @typedef {import('xast').Nodes} Nodes
* @typedef {import('xast').Root} Root
*/
/**
* @typedef {Element | Root} Result
*   Result from a `x` call.
*
* @typedef {boolean | number | string | null | undefined} Value
*   Attribute value
*
* @typedef {{[attribute: string]: Value}} Attributes
*   Acceptable value for element properties.
*
* @typedef {boolean | number | string | null | undefined} PrimitiveChild
*   Primitive children, either ignored (nullish), or turned into text nodes.
* @typedef {Array<Nodes | PrimitiveChild>} ArrayChild
*   List of children.
* @typedef {Nodes | PrimitiveChild | ArrayChild} Child
*   Acceptable child value.
*/
/**
* @typedef {import('./jsx-classic.js').Element} x.JSX.Element
* @typedef {import('./jsx-classic.js').IntrinsicAttributes} x.JSX.IntrinsicAttributes
* @typedef {import('./jsx-classic.js').IntrinsicElements} x.JSX.IntrinsicElements
* @typedef {import('./jsx-classic.js').ElementChildrenAttribute} x.JSX.ElementChildrenAttribute
*/
/**
* Create XML trees in xast.
*
* @param name
*   Qualified name.
*
*   Case sensitive and can contain a namespace prefix (such as `rdf:RDF`).
*   When string, an `Element` is built.
*   When nullish, a `Root` is built instead.
* @param attributes
*   Attributes of the element or first child.
* @param children
*   Children of the node.
* @returns
*   `Element` or `Root`.
*/
var x = (function(name, attributes, ...children) {
	let index = -1;
	/** @type {Result} */
	let node;
	if (name === void 0 || name === null) {
		node = {
			type: "root",
			children: []
		};
		children.unshift(attributes);
	} else if (typeof name === "string") {
		node = {
			type: "element",
			name,
			attributes: {},
			children: []
		};
		if (isAttributes(attributes)) {
			/** @type {string} */
			let key;
			for (key in attributes) if (attributes[key] !== void 0 && attributes[key] !== null && (typeof attributes[key] !== "number" || !Number.isNaN(attributes[key]))) node.attributes[key] = String(attributes[key]);
		} else children.unshift(attributes);
	} else throw new TypeError("Expected element name, got `" + name + "`");
	while (++index < children.length) addChild(node.children, children[index]);
	return node;
});
/**
* Add children.
*
* @param {Array<Child>} nodes
*   List of nodes.
* @param {Child} value
*   Child.
* @returns {undefined}
*   Nothing.
*/
function addChild(nodes, value) {
	let index = -1;
	if (value === void 0 || value === null) {} else if (typeof value === "string" || typeof value === "number") nodes.push({
		type: "text",
		value: String(value)
	});
	else if (Array.isArray(value)) while (++index < value.length) addChild(nodes, value[index]);
	else if (typeof value === "object" && "type" in value) if (value.type === "root") addChild(nodes, value.children);
	else nodes.push(value);
	else throw new TypeError("Expected node, nodes, string, got `" + value + "`");
}
/**
* Check if `value` is `Attributes`.
*
* @param {Attributes | Child} value
*   Value.
* @returns {value is Attributes}
*   Whether `value` is `Attributes`.
*/
function isAttributes(value) {
	if (value === null || value === void 0 || typeof value !== "object" || Array.isArray(value)) return false;
	return true;
}
//#endregion
//#region ../../node_modules/bail/index.js
/**
* Throw a given error.
*
* @param {Error|null|undefined} [error]
*   Maybe error.
* @returns {asserts error is null|undefined}
*/
function bail(error) {
	if (error) throw error;
}
//#endregion
//#region ../../node_modules/is-buffer/index.js
var require_is_buffer = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	* Determine if an object is a Buffer
	*
	* @author   Feross Aboukhadijeh <https://feross.org>
	* @license  MIT
	*/
	module.exports = function isBuffer(obj) {
		return obj != null && obj.constructor != null && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
	};
}));
//#endregion
//#region ../../node_modules/extend/index.js
var require_extend = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var hasOwn = Object.prototype.hasOwnProperty;
	var toStr = Object.prototype.toString;
	var defineProperty = Object.defineProperty;
	var gOPD = Object.getOwnPropertyDescriptor;
	var isArray = function isArray(arr) {
		if (typeof Array.isArray === "function") return Array.isArray(arr);
		return toStr.call(arr) === "[object Array]";
	};
	var isPlainObject = function isPlainObject(obj) {
		if (!obj || toStr.call(obj) !== "[object Object]") return false;
		var hasOwnConstructor = hasOwn.call(obj, "constructor");
		var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, "isPrototypeOf");
		if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) return false;
		var key;
		for (key in obj);
		return typeof key === "undefined" || hasOwn.call(obj, key);
	};
	var setProperty = function setProperty(target, options) {
		if (defineProperty && options.name === "__proto__") defineProperty(target, options.name, {
			enumerable: true,
			configurable: true,
			value: options.newValue,
			writable: true
		});
		else target[options.name] = options.newValue;
	};
	var getProperty = function getProperty(obj, name) {
		if (name === "__proto__") {
			if (!hasOwn.call(obj, name)) return;
			else if (gOPD) return gOPD(obj, name).value;
		}
		return obj[name];
	};
	module.exports = function extend() {
		var options, name, src, copy, copyIsArray, clone;
		var target = arguments[0];
		var i = 1;
		var length = arguments.length;
		var deep = false;
		if (typeof target === "boolean") {
			deep = target;
			target = arguments[1] || {};
			i = 2;
		}
		if (target == null || typeof target !== "object" && typeof target !== "function") target = {};
		for (; i < length; ++i) {
			options = arguments[i];
			if (options != null) for (name in options) {
				src = getProperty(target, name);
				copy = getProperty(options, name);
				if (target !== copy) {
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else clone = src && isPlainObject(src) ? src : {};
						setProperty(target, {
							name,
							newValue: extend(deep, clone, copy)
						});
					} else if (typeof copy !== "undefined") setProperty(target, {
						name,
						newValue: copy
					});
				}
			}
		}
		return target;
	};
}));
//#endregion
//#region node_modules/is-plain-obj/index.js
function isPlainObject(value) {
	if (typeof value !== "object" || value === null) return false;
	const prototype = Object.getPrototypeOf(value);
	return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in value) && !(Symbol.iterator in value);
}
//#endregion
//#region ../../node_modules/trough/lib/index.js
/**
* @typedef {(error?: Error | null | undefined, ...output: Array<any>) => void} Callback
*   Callback.
*
* @typedef {(...input: Array<any>) => any} Middleware
*   Ware.
*
* @typedef Pipeline
*   Pipeline.
* @property {Run} run
*   Run the pipeline.
* @property {Use} use
*   Add middleware.
*
* @typedef {(...input: Array<any>) => void} Run
*   Call all middleware.
*
*   Calls `done` on completion with either an error or the output of the
*   last middleware.
*
*   > 👉 **Note**: as the length of input defines whether async functions get a
*   > `next` function,
*   > it’s recommended to keep `input` at one value normally.

*
* @typedef {(fn: Middleware) => Pipeline} Use
*   Add middleware.
*/
/**
* Create new middleware.
*
* @returns {Pipeline}
*   Pipeline.
*/
function trough() {
	/** @type {Array<Middleware>} */
	const fns = [];
	/** @type {Pipeline} */
	const pipeline = {
		run,
		use
	};
	return pipeline;
	/** @type {Run} */
	function run(...values) {
		let middlewareIndex = -1;
		/** @type {Callback} */
		const callback = values.pop();
		if (typeof callback !== "function") throw new TypeError("Expected function as last argument, not " + callback);
		next(null, ...values);
		/**
		* Run the next `fn`, or we’re done.
		*
		* @param {Error | null | undefined} error
		* @param {Array<any>} output
		*/
		function next(error, ...output) {
			const fn = fns[++middlewareIndex];
			let index = -1;
			if (error) {
				callback(error);
				return;
			}
			while (++index < values.length) if (output[index] === null || output[index] === void 0) output[index] = values[index];
			values = output;
			if (fn) wrap(fn, next)(...output);
			else callback(null, ...output);
		}
	}
	/** @type {Use} */
	function use(middelware) {
		if (typeof middelware !== "function") throw new TypeError("Expected `middelware` to be a function, not " + middelware);
		fns.push(middelware);
		return pipeline;
	}
}
/**
* Wrap `middleware` into a uniform interface.
*
* You can pass all input to the resulting function.
* `callback` is then called with the output of `middleware`.
*
* If `middleware` accepts more arguments than the later given in input,
* an extra `done` function is passed to it after that input,
* which must be called by `middleware`.
*
* The first value in `input` is the main input value.
* All other input values are the rest input values.
* The values given to `callback` are the input values,
* merged with every non-nullish output value.
*
* * if `middleware` throws an error,
*   returns a promise that is rejected,
*   or calls the given `done` function with an error,
*   `callback` is called with that error
* * if `middleware` returns a value or returns a promise that is resolved,
*   that value is the main output value
* * if `middleware` calls `done`,
*   all non-nullish values except for the first one (the error) overwrite the
*   output values
*
* @param {Middleware} middleware
*   Function to wrap.
* @param {Callback} callback
*   Callback called with the output of `middleware`.
* @returns {Run}
*   Wrapped middleware.
*/
function wrap(middleware, callback) {
	/** @type {boolean} */
	let called;
	return wrapped;
	/**
	* Call `middleware`.
	* @this {any}
	* @param {Array<any>} parameters
	* @returns {void}
	*/
	function wrapped(...parameters) {
		const fnExpectsCallback = middleware.length > parameters.length;
		/** @type {any} */
		let result;
		if (fnExpectsCallback) parameters.push(done);
		try {
			result = middleware.apply(this, parameters);
		} catch (error) {
			const exception = error;
			if (fnExpectsCallback && called) throw exception;
			return done(exception);
		}
		if (!fnExpectsCallback) if (result && result.then && typeof result.then === "function") result.then(then, done);
		else if (result instanceof Error) done(result);
		else then(result);
	}
	/**
	* Call `callback`, only once.
	*
	* @type {Callback}
	*/
	function done(error, ...output) {
		if (!called) {
			called = true;
			callback(error, ...output);
		}
	}
	/**
	* Call `done` with one value.
	*
	* @param {any} [value]
	*/
	function then(value) {
		done(null, value);
	}
}
//#endregion
//#region node_modules/unified/node_modules/unist-util-stringify-position/lib/index.js
/**
* @typedef {import('unist').Node} Node
* @typedef {import('unist').Point} Point
* @typedef {import('unist').Position} Position
*/
/**
* @typedef NodeLike
* @property {string} type
* @property {PositionLike | null | undefined} [position]
*
* @typedef PositionLike
* @property {PointLike | null | undefined} [start]
* @property {PointLike | null | undefined} [end]
*
* @typedef PointLike
* @property {number | null | undefined} [line]
* @property {number | null | undefined} [column]
* @property {number | null | undefined} [offset]
*/
/**
* Serialize the positional info of a point, position (start and end points),
* or node.
*
* @param {Node | NodeLike | Position | PositionLike | Point | PointLike | null | undefined} [value]
*   Node, position, or point.
* @returns {string}
*   Pretty printed positional info of a node (`string`).
*
*   In the format of a range `ls:cs-le:ce` (when given `node` or `position`)
*   or a point `l:c` (when given `point`), where `l` stands for line, `c` for
*   column, `s` for `start`, and `e` for end.
*   An empty string (`''`) is returned if the given value is neither `node`,
*   `position`, nor `point`.
*/
function stringifyPosition$1(value) {
	if (!value || typeof value !== "object") return "";
	if ("position" in value || "type" in value) return position$1(value.position);
	if ("start" in value || "end" in value) return position$1(value);
	if ("line" in value || "column" in value) return point$1(value);
	return "";
}
/**
* @param {Point | PointLike | null | undefined} point
* @returns {string}
*/
function point$1(point) {
	return index$1(point && point.line) + ":" + index$1(point && point.column);
}
/**
* @param {Position | PositionLike | null | undefined} pos
* @returns {string}
*/
function position$1(pos) {
	return point$1(pos && pos.start) + "-" + point$1(pos && pos.end);
}
/**
* @param {number | null | undefined} value
* @returns {number}
*/
function index$1(value) {
	return value && typeof value === "number" ? value : 1;
}
//#endregion
//#region node_modules/unified/node_modules/vfile-message/lib/index.js
/**
* @typedef {import('unist').Node} Node
* @typedef {import('unist').Position} Position
* @typedef {import('unist').Point} Point
* @typedef {object & {type: string, position?: Position | undefined}} NodeLike
*/
/**
* Message.
*/
var VFileMessage$1 = class extends Error {
	/**
	* Create a message for `reason` at `place` from `origin`.
	*
	* When an error is passed in as `reason`, the `stack` is copied.
	*
	* @param {string | Error | VFileMessage} reason
	*   Reason for message, uses the stack and message of the error if given.
	*
	*   > 👉 **Note**: you should use markdown.
	* @param {Node | NodeLike | Position | Point | null | undefined} [place]
	*   Place in file where the message occurred.
	* @param {string | null | undefined} [origin]
	*   Place in code where the message originates (example:
	*   `'my-package:my-rule'` or `'my-rule'`).
	* @returns
	*   Instance of `VFileMessage`.
	*/
	constructor(reason, place, origin) {
		/** @type {[string | null, string | null]} */
		const parts = [null, null];
		/** @type {Position} */
		let position = {
			start: {
				line: null,
				column: null
			},
			end: {
				line: null,
				column: null
			}
		};
		super();
		if (typeof place === "string") {
			origin = place;
			place = void 0;
		}
		if (typeof origin === "string") {
			const index = origin.indexOf(":");
			if (index === -1) parts[1] = origin;
			else {
				parts[0] = origin.slice(0, index);
				parts[1] = origin.slice(index + 1);
			}
		}
		if (place) {
			if ("type" in place || "position" in place) {
				if (place.position) position = place.position;
			} else if ("start" in place || "end" in place) position = place;
			else if ("line" in place || "column" in place) position.start = place;
		}
		/**
		* Serialized positional info of error.
		*
		* On normal errors, this would be something like `ParseError`, buit in
		* `VFile` messages we use this space to show where an error happened.
		*/
		this.name = stringifyPosition$1(place) || "1:1";
		/**
		* Reason for message.
		*
		* @type {string}
		*/
		this.message = typeof reason === "object" ? reason.message : reason;
		/**
		* Stack of message.
		*
		* This is used by normal errors to show where something happened in
		* programming code, irrelevant for `VFile` messages,
		*
		* @type {string}
		*/
		this.stack = "";
		if (typeof reason === "object" && reason.stack) this.stack = reason.stack;
		/**
		* Reason for message.
		*
		* > 👉 **Note**: you should use markdown.
		*
		* @type {string}
		*/
		this.reason = this.message;
		/**
		* State of problem.
		*
		* * `true` — marks associated file as no longer processable (error)
		* * `false` — necessitates a (potential) change (warning)
		* * `null | undefined` — for things that might not need changing (info)
		*
		* @type {boolean | null | undefined}
		*/
		this.fatal;
		/**
		* Starting line of error.
		*
		* @type {number | null}
		*/
		this.line = position.start.line;
		/**
		* Starting column of error.
		*
		* @type {number | null}
		*/
		this.column = position.start.column;
		/**
		* Full unist position.
		*
		* @type {Position | null}
		*/
		this.position = position;
		/**
		* Namespace of message (example: `'my-package'`).
		*
		* @type {string | null}
		*/
		this.source = parts[0];
		/**
		* Category of message (example: `'my-rule'`).
		*
		* @type {string | null}
		*/
		this.ruleId = parts[1];
		/**
		* Path of a file (used throughout the `VFile` ecosystem).
		*
		* @type {string | null}
		*/
		this.file;
		/**
		* Specify the source value that’s being reported, which is deemed
		* incorrect.
		*
		* @type {string | null}
		*/
		this.actual;
		/**
		* Suggest acceptable values that can be used instead of `actual`.
		*
		* @type {Array<string> | null}
		*/
		this.expected;
		/**
		* Link to docs for the message.
		*
		* > 👉 **Note**: this must be an absolute URL that can be passed as `x`
		* > to `new URL(x)`.
		*
		* @type {string | null}
		*/
		this.url;
		/**
		* Long form description of the message (you should use markdown).
		*
		* @type {string | null}
		*/
		this.note;
	}
};
VFileMessage$1.prototype.file = "";
VFileMessage$1.prototype.name = "";
VFileMessage$1.prototype.reason = "";
VFileMessage$1.prototype.message = "";
VFileMessage$1.prototype.stack = "";
VFileMessage$1.prototype.fatal = null;
VFileMessage$1.prototype.column = null;
VFileMessage$1.prototype.line = null;
VFileMessage$1.prototype.source = null;
VFileMessage$1.prototype.ruleId = null;
VFileMessage$1.prototype.position = null;
//#endregion
//#region node_modules/unified/node_modules/vfile/lib/minpath.browser.js
var path = {
	basename,
	dirname,
	extname,
	join,
	sep: "/"
};
/**
* Get the basename from a path.
*
* @param {string} path
*   File path.
* @param {string | undefined} [ext]
*   Extension to strip.
* @returns {string}
*   Stem or basename.
*/
function basename(path, ext) {
	if (ext !== void 0 && typeof ext !== "string") throw new TypeError("\"ext\" argument must be a string");
	assertPath$1(path);
	let start = 0;
	let end = -1;
	let index = path.length;
	/** @type {boolean | undefined} */
	let seenNonSlash;
	if (ext === void 0 || ext.length === 0 || ext.length > path.length) {
		while (index--) if (path.charCodeAt(index) === 47) {
			if (seenNonSlash) {
				start = index + 1;
				break;
			}
		} else if (end < 0) {
			seenNonSlash = true;
			end = index + 1;
		}
		return end < 0 ? "" : path.slice(start, end);
	}
	if (ext === path) return "";
	let firstNonSlashEnd = -1;
	let extIndex = ext.length - 1;
	while (index--) if (path.charCodeAt(index) === 47) {
		if (seenNonSlash) {
			start = index + 1;
			break;
		}
	} else {
		if (firstNonSlashEnd < 0) {
			seenNonSlash = true;
			firstNonSlashEnd = index + 1;
		}
		if (extIndex > -1) if (path.charCodeAt(index) === ext.charCodeAt(extIndex--)) {
			if (extIndex < 0) end = index;
		} else {
			extIndex = -1;
			end = firstNonSlashEnd;
		}
	}
	if (start === end) end = firstNonSlashEnd;
	else if (end < 0) end = path.length;
	return path.slice(start, end);
}
/**
* Get the dirname from a path.
*
* @param {string} path
*   File path.
* @returns {string}
*   File path.
*/
function dirname(path) {
	assertPath$1(path);
	if (path.length === 0) return ".";
	let end = -1;
	let index = path.length;
	/** @type {boolean | undefined} */
	let unmatchedSlash;
	while (--index) if (path.charCodeAt(index) === 47) {
		if (unmatchedSlash) {
			end = index;
			break;
		}
	} else if (!unmatchedSlash) unmatchedSlash = true;
	return end < 0 ? path.charCodeAt(0) === 47 ? "/" : "." : end === 1 && path.charCodeAt(0) === 47 ? "//" : path.slice(0, end);
}
/**
* Get an extname from a path.
*
* @param {string} path
*   File path.
* @returns {string}
*   Extname.
*/
function extname(path) {
	assertPath$1(path);
	let index = path.length;
	let end = -1;
	let startPart = 0;
	let startDot = -1;
	let preDotState = 0;
	/** @type {boolean | undefined} */
	let unmatchedSlash;
	while (index--) {
		const code = path.charCodeAt(index);
		if (code === 47) {
			if (unmatchedSlash) {
				startPart = index + 1;
				break;
			}
			continue;
		}
		if (end < 0) {
			unmatchedSlash = true;
			end = index + 1;
		}
		if (code === 46) {
			if (startDot < 0) startDot = index;
			else if (preDotState !== 1) preDotState = 1;
		} else if (startDot > -1) preDotState = -1;
	}
	if (startDot < 0 || end < 0 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) return "";
	return path.slice(startDot, end);
}
/**
* Join segments from a path.
*
* @param {Array<string>} segments
*   Path segments.
* @returns {string}
*   File path.
*/
function join(...segments) {
	let index = -1;
	/** @type {string | undefined} */
	let joined;
	while (++index < segments.length) {
		assertPath$1(segments[index]);
		if (segments[index]) joined = joined === void 0 ? segments[index] : joined + "/" + segments[index];
	}
	return joined === void 0 ? "." : normalize(joined);
}
/**
* Normalize a basic file path.
*
* @param {string} path
*   File path.
* @returns {string}
*   File path.
*/
function normalize(path) {
	assertPath$1(path);
	const absolute = path.charCodeAt(0) === 47;
	let value = normalizeString(path, !absolute);
	if (value.length === 0 && !absolute) value = ".";
	if (value.length > 0 && path.charCodeAt(path.length - 1) === 47) value += "/";
	return absolute ? "/" + value : value;
}
/**
* Resolve `.` and `..` elements in a path with directory names.
*
* @param {string} path
*   File path.
* @param {boolean} allowAboveRoot
*   Whether `..` can move above root.
* @returns {string}
*   File path.
*/
function normalizeString(path, allowAboveRoot) {
	let result = "";
	let lastSegmentLength = 0;
	let lastSlash = -1;
	let dots = 0;
	let index = -1;
	/** @type {number | undefined} */
	let code;
	/** @type {number} */
	let lastSlashIndex;
	while (++index <= path.length) {
		if (index < path.length) code = path.charCodeAt(index);
		else if (code === 47) break;
		else code = 47;
		if (code === 47) {
			if (lastSlash === index - 1 || dots === 1) {} else if (lastSlash !== index - 1 && dots === 2) {
				if (result.length < 2 || lastSegmentLength !== 2 || result.charCodeAt(result.length - 1) !== 46 || result.charCodeAt(result.length - 2) !== 46) {
					if (result.length > 2) {
						lastSlashIndex = result.lastIndexOf("/");
						if (lastSlashIndex !== result.length - 1) {
							if (lastSlashIndex < 0) {
								result = "";
								lastSegmentLength = 0;
							} else {
								result = result.slice(0, lastSlashIndex);
								lastSegmentLength = result.length - 1 - result.lastIndexOf("/");
							}
							lastSlash = index;
							dots = 0;
							continue;
						}
					} else if (result.length > 0) {
						result = "";
						lastSegmentLength = 0;
						lastSlash = index;
						dots = 0;
						continue;
					}
				}
				if (allowAboveRoot) {
					result = result.length > 0 ? result + "/.." : "..";
					lastSegmentLength = 2;
				}
			} else {
				if (result.length > 0) result += "/" + path.slice(lastSlash + 1, index);
				else result = path.slice(lastSlash + 1, index);
				lastSegmentLength = index - lastSlash - 1;
			}
			lastSlash = index;
			dots = 0;
		} else if (code === 46 && dots > -1) dots++;
		else dots = -1;
	}
	return result;
}
/**
* Make sure `path` is a string.
*
* @param {string} path
*   File path.
* @returns {asserts path is string}
*   Nothing.
*/
function assertPath$1(path) {
	if (typeof path !== "string") throw new TypeError("Path must be a string. Received " + JSON.stringify(path));
}
//#endregion
//#region node_modules/unified/node_modules/vfile/lib/minproc.browser.js
var proc = { cwd };
function cwd() {
	return "/";
}
//#endregion
//#region node_modules/unified/node_modules/vfile/lib/minurl.shared.js
/**
* @typedef URL
* @property {string} hash
* @property {string} host
* @property {string} hostname
* @property {string} href
* @property {string} origin
* @property {string} password
* @property {string} pathname
* @property {string} port
* @property {string} protocol
* @property {string} search
* @property {any} searchParams
* @property {string} username
* @property {() => string} toString
* @property {() => string} toJSON
*/
/**
* Check if `fileUrlOrPath` looks like a URL.
*
* @param {unknown} fileUrlOrPath
*   File path or URL.
* @returns {fileUrlOrPath is URL}
*   Whether it’s a URL.
*/
function isUrl(fileUrlOrPath) {
	return fileUrlOrPath !== null && typeof fileUrlOrPath === "object" && fileUrlOrPath.href && fileUrlOrPath.origin;
}
//#endregion
//#region node_modules/unified/node_modules/vfile/lib/minurl.browser.js
/**
* @param {string | URL} path
*   File URL.
* @returns {string}
*   File URL.
*/
function urlToPath(path) {
	if (typeof path === "string") path = new URL(path);
	else if (!isUrl(path)) {
		/** @type {NodeJS.ErrnoException} */
		const error = /* @__PURE__ */ new TypeError("The \"path\" argument must be of type string or an instance of URL. Received `" + path + "`");
		error.code = "ERR_INVALID_ARG_TYPE";
		throw error;
	}
	if (path.protocol !== "file:") {
		/** @type {NodeJS.ErrnoException} */
		const error = /* @__PURE__ */ new TypeError("The URL must be of scheme file");
		error.code = "ERR_INVALID_URL_SCHEME";
		throw error;
	}
	return getPathFromURLPosix(path);
}
/**
* Get a path from a POSIX URL.
*
* @param {URL} url
*   URL.
* @returns {string}
*   File path.
*/
function getPathFromURLPosix(url) {
	if (url.hostname !== "") {
		/** @type {NodeJS.ErrnoException} */
		const error = /* @__PURE__ */ new TypeError("File URL host must be \"localhost\" or empty on darwin");
		error.code = "ERR_INVALID_FILE_URL_HOST";
		throw error;
	}
	const pathname = url.pathname;
	let index = -1;
	while (++index < pathname.length) if (pathname.charCodeAt(index) === 37 && pathname.charCodeAt(index + 1) === 50) {
		const third = pathname.charCodeAt(index + 2);
		if (third === 70 || third === 102) {
			/** @type {NodeJS.ErrnoException} */
			const error = /* @__PURE__ */ new TypeError("File URL path must not include encoded / characters");
			error.code = "ERR_INVALID_FILE_URL_PATH";
			throw error;
		}
	}
	return decodeURIComponent(pathname);
}
//#endregion
//#region node_modules/unified/node_modules/vfile/lib/index.js
var import_is_buffer = /* @__PURE__ */ __toESM(require_is_buffer(), 1);
/**
* Order of setting (least specific to most), we need this because otherwise
* `{stem: 'a', path: '~/b.js'}` would throw, as a path is needed before a
* stem can be set.
*
* @type {Array<'basename' | 'dirname' | 'extname' | 'history' | 'path' | 'stem'>}
*/
var order = [
	"history",
	"path",
	"basename",
	"stem",
	"extname",
	"dirname"
];
var VFile = class {
	/**
	* Create a new virtual file.
	*
	* `options` is treated as:
	*
	* *   `string` or `Buffer` — `{value: options}`
	* *   `URL` — `{path: options}`
	* *   `VFile` — shallow copies its data over to the new file
	* *   `object` — all fields are shallow copied over to the new file
	*
	* Path related fields are set in the following order (least specific to
	* most specific): `history`, `path`, `basename`, `stem`, `extname`,
	* `dirname`.
	*
	* You cannot set `dirname` or `extname` without setting either `history`,
	* `path`, `basename`, or `stem` too.
	*
	* @param {Compatible | null | undefined} [value]
	*   File value.
	* @returns
	*   New instance.
	*/
	constructor(value) {
		/** @type {Options | VFile} */
		let options;
		if (!value) options = {};
		else if (typeof value === "string" || buffer(value)) options = { value };
		else if (isUrl(value)) options = { path: value };
		else options = value;
		/**
		* Place to store custom information (default: `{}`).
		*
		* It’s OK to store custom data directly on the file but moving it to
		* `data` is recommended.
		*
		* @type {Data}
		*/
		this.data = {};
		/**
		* List of messages associated with the file.
		*
		* @type {Array<VFileMessage>}
		*/
		this.messages = [];
		/**
		* List of filepaths the file moved between.
		*
		* The first is the original path and the last is the current path.
		*
		* @type {Array<string>}
		*/
		this.history = [];
		/**
		* Base of `path` (default: `process.cwd()` or `'/'` in browsers).
		*
		* @type {string}
		*/
		this.cwd = proc.cwd();
		/**
		* Raw value.
		*
		* @type {Value}
		*/
		this.value;
		/**
		* Whether a file was saved to disk.
		*
		* This is used by vfile reporters.
		*
		* @type {boolean}
		*/
		this.stored;
		/**
		* Custom, non-string, compiled, representation.
		*
		* This is used by unified to store non-string results.
		* One example is when turning markdown into React nodes.
		*
		* @type {unknown}
		*/
		this.result;
		/**
		* Source map.
		*
		* This type is equivalent to the `RawSourceMap` type from the `source-map`
		* module.
		*
		* @type {Map | null | undefined}
		*/
		this.map;
		let index = -1;
		while (++index < order.length) {
			const prop = order[index];
			if (prop in options && options[prop] !== void 0 && options[prop] !== null) this[prop] = prop === "history" ? [...options[prop]] : options[prop];
		}
		/** @type {string} */
		let prop;
		for (prop in options) if (!order.includes(prop)) this[prop] = options[prop];
	}
	/**
	* Get the full path (example: `'~/index.min.js'`).
	*
	* @returns {string}
	*/
	get path() {
		return this.history[this.history.length - 1];
	}
	/**
	* Set the full path (example: `'~/index.min.js'`).
	*
	* Cannot be nullified.
	* You can set a file URL (a `URL` object with a `file:` protocol) which will
	* be turned into a path with `url.fileURLToPath`.
	*
	* @param {string | URL} path
	*/
	set path(path) {
		if (isUrl(path)) path = urlToPath(path);
		assertNonEmpty(path, "path");
		if (this.path !== path) this.history.push(path);
	}
	/**
	* Get the parent path (example: `'~'`).
	*/
	get dirname() {
		return typeof this.path === "string" ? path.dirname(this.path) : void 0;
	}
	/**
	* Set the parent path (example: `'~'`).
	*
	* Cannot be set if there’s no `path` yet.
	*/
	set dirname(dirname) {
		assertPath(this.basename, "dirname");
		this.path = path.join(dirname || "", this.basename);
	}
	/**
	* Get the basename (including extname) (example: `'index.min.js'`).
	*/
	get basename() {
		return typeof this.path === "string" ? path.basename(this.path) : void 0;
	}
	/**
	* Set basename (including extname) (`'index.min.js'`).
	*
	* Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
	* on windows).
	* Cannot be nullified (use `file.path = file.dirname` instead).
	*/
	set basename(basename) {
		assertNonEmpty(basename, "basename");
		assertPart(basename, "basename");
		this.path = path.join(this.dirname || "", basename);
	}
	/**
	* Get the extname (including dot) (example: `'.js'`).
	*/
	get extname() {
		return typeof this.path === "string" ? path.extname(this.path) : void 0;
	}
	/**
	* Set the extname (including dot) (example: `'.js'`).
	*
	* Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
	* on windows).
	* Cannot be set if there’s no `path` yet.
	*/
	set extname(extname) {
		assertPart(extname, "extname");
		assertPath(this.dirname, "extname");
		if (extname) {
			if (extname.charCodeAt(0) !== 46) throw new Error("`extname` must start with `.`");
			if (extname.includes(".", 1)) throw new Error("`extname` cannot contain multiple dots");
		}
		this.path = path.join(this.dirname, this.stem + (extname || ""));
	}
	/**
	* Get the stem (basename w/o extname) (example: `'index.min'`).
	*/
	get stem() {
		return typeof this.path === "string" ? path.basename(this.path, this.extname) : void 0;
	}
	/**
	* Set the stem (basename w/o extname) (example: `'index.min'`).
	*
	* Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
	* on windows).
	* Cannot be nullified (use `file.path = file.dirname` instead).
	*/
	set stem(stem) {
		assertNonEmpty(stem, "stem");
		assertPart(stem, "stem");
		this.path = path.join(this.dirname || "", stem + (this.extname || ""));
	}
	/**
	* Serialize the file.
	*
	* @param {BufferEncoding | null | undefined} [encoding='utf8']
	*   Character encoding to understand `value` as when it’s a `Buffer`
	*   (default: `'utf8'`).
	* @returns {string}
	*   Serialized file.
	*/
	toString(encoding) {
		return (this.value || "").toString(encoding || void 0);
	}
	/**
	* Create a warning message associated with the file.
	*
	* Its `fatal` is set to `false` and `file` is set to the current file path.
	* Its added to `file.messages`.
	*
	* @param {string | Error | VFileMessage} reason
	*   Reason for message, uses the stack and message of the error if given.
	* @param {Node | NodeLike | Position | Point | null | undefined} [place]
	*   Place in file where the message occurred.
	* @param {string | null | undefined} [origin]
	*   Place in code where the message originates (example:
	*   `'my-package:my-rule'` or `'my-rule'`).
	* @returns {VFileMessage}
	*   Message.
	*/
	message(reason, place, origin) {
		const message = new VFileMessage$1(reason, place, origin);
		if (this.path) {
			message.name = this.path + ":" + message.name;
			message.file = this.path;
		}
		message.fatal = false;
		this.messages.push(message);
		return message;
	}
	/**
	* Create an info message associated with the file.
	*
	* Its `fatal` is set to `null` and `file` is set to the current file path.
	* Its added to `file.messages`.
	*
	* @param {string | Error | VFileMessage} reason
	*   Reason for message, uses the stack and message of the error if given.
	* @param {Node | NodeLike | Position | Point | null | undefined} [place]
	*   Place in file where the message occurred.
	* @param {string | null | undefined} [origin]
	*   Place in code where the message originates (example:
	*   `'my-package:my-rule'` or `'my-rule'`).
	* @returns {VFileMessage}
	*   Message.
	*/
	info(reason, place, origin) {
		const message = this.message(reason, place, origin);
		message.fatal = null;
		return message;
	}
	/**
	* Create a fatal error associated with the file.
	*
	* Its `fatal` is set to `true` and `file` is set to the current file path.
	* Its added to `file.messages`.
	*
	* > 👉 **Note**: a fatal error means that a file is no longer processable.
	*
	* @param {string | Error | VFileMessage} reason
	*   Reason for message, uses the stack and message of the error if given.
	* @param {Node | NodeLike | Position | Point | null | undefined} [place]
	*   Place in file where the message occurred.
	* @param {string | null | undefined} [origin]
	*   Place in code where the message originates (example:
	*   `'my-package:my-rule'` or `'my-rule'`).
	* @returns {never}
	*   Message.
	* @throws {VFileMessage}
	*   Message.
	*/
	fail(reason, place, origin) {
		const message = this.message(reason, place, origin);
		message.fatal = true;
		throw message;
	}
};
/**
* Assert that `part` is not a path (as in, does not contain `path.sep`).
*
* @param {string | null | undefined} part
*   File path part.
* @param {string} name
*   Part name.
* @returns {void}
*   Nothing.
*/
function assertPart(part, name) {
	if (part && part.includes(path.sep)) throw new Error("`" + name + "` cannot be a path: did not expect `" + path.sep + "`");
}
/**
* Assert that `part` is not empty.
*
* @param {string | undefined} part
*   Thing.
* @param {string} name
*   Part name.
* @returns {asserts part is string}
*   Nothing.
*/
function assertNonEmpty(part, name) {
	if (!part) throw new Error("`" + name + "` cannot be empty");
}
/**
* Assert `path` exists.
*
* @param {string | undefined} path
*   Path.
* @param {string} name
*   Dependency name.
* @returns {asserts path is string}
*   Nothing.
*/
function assertPath(path, name) {
	if (!path) throw new Error("Setting `" + name + "` requires `path` to be set too");
}
/**
* Assert `value` is a buffer.
*
* @param {unknown} value
*   thing.
* @returns {value is Buffer}
*   Whether `value` is a Node.js buffer.
*/
function buffer(value) {
	return (0, import_is_buffer.default)(value);
}
//#endregion
//#region node_modules/unified/lib/index.js
/**
* @typedef {import('unist').Node} Node
* @typedef {import('vfile').VFileCompatible} VFileCompatible
* @typedef {import('vfile').VFileValue} VFileValue
* @typedef {import('..').Processor} Processor
* @typedef {import('..').Plugin} Plugin
* @typedef {import('..').Preset} Preset
* @typedef {import('..').Pluggable} Pluggable
* @typedef {import('..').PluggableList} PluggableList
* @typedef {import('..').Transformer} Transformer
* @typedef {import('..').Parser} Parser
* @typedef {import('..').Compiler} Compiler
* @typedef {import('..').RunCallback} RunCallback
* @typedef {import('..').ProcessCallback} ProcessCallback
*
* @typedef Context
* @property {Node} tree
* @property {VFile} file
*/
var import_extend = /* @__PURE__ */ __toESM(require_extend(), 1);
var unified = base().freeze();
var own$2 = {}.hasOwnProperty;
/**
* @returns {Processor}
*/
function base() {
	const transformers = trough();
	/** @type {Processor['attachers']} */
	const attachers = [];
	/** @type {Record<string, unknown>} */
	let namespace = {};
	/** @type {boolean|undefined} */
	let frozen;
	let freezeIndex = -1;
	processor.data = data;
	processor.Parser = void 0;
	processor.Compiler = void 0;
	processor.freeze = freeze;
	processor.attachers = attachers;
	processor.use = use;
	processor.parse = parse;
	processor.stringify = stringify;
	processor.run = run;
	processor.runSync = runSync;
	processor.process = process;
	processor.processSync = processSync;
	return processor;
	/** @type {Processor} */
	function processor() {
		const destination = base();
		let index = -1;
		while (++index < attachers.length) destination.use(...attachers[index]);
		destination.data((0, import_extend.default)(true, {}, namespace));
		return destination;
	}
	/**
	* @param {string|Record<string, unknown>} [key]
	* @param {unknown} [value]
	* @returns {unknown}
	*/
	function data(key, value) {
		if (typeof key === "string") {
			if (arguments.length === 2) {
				assertUnfrozen("data", frozen);
				namespace[key] = value;
				return processor;
			}
			return own$2.call(namespace, key) && namespace[key] || null;
		}
		if (key) {
			assertUnfrozen("data", frozen);
			namespace = key;
			return processor;
		}
		return namespace;
	}
	/** @type {Processor['freeze']} */
	function freeze() {
		if (frozen) return processor;
		while (++freezeIndex < attachers.length) {
			const [attacher, ...options] = attachers[freezeIndex];
			if (options[0] === false) continue;
			if (options[0] === true) options[0] = void 0;
			/** @type {Transformer|void} */
			const transformer = attacher.call(processor, ...options);
			if (typeof transformer === "function") transformers.use(transformer);
		}
		frozen = true;
		freezeIndex = Number.POSITIVE_INFINITY;
		return processor;
	}
	/**
	* @param {Pluggable|null|undefined} [value]
	* @param {...unknown} options
	* @returns {Processor}
	*/
	function use(value, ...options) {
		/** @type {Record<string, unknown>|undefined} */
		let settings;
		assertUnfrozen("use", frozen);
		if (value === null || value === void 0) {} else if (typeof value === "function") addPlugin(value, ...options);
		else if (typeof value === "object") if (Array.isArray(value)) addList(value);
		else addPreset(value);
		else throw new TypeError("Expected usable value, not `" + value + "`");
		if (settings) namespace.settings = Object.assign(namespace.settings || {}, settings);
		return processor;
		/**
		* @param {import('..').Pluggable<unknown[]>} value
		* @returns {void}
		*/
		function add(value) {
			if (typeof value === "function") addPlugin(value);
			else if (typeof value === "object") if (Array.isArray(value)) {
				const [plugin, ...options] = value;
				addPlugin(plugin, ...options);
			} else addPreset(value);
			else throw new TypeError("Expected usable value, not `" + value + "`");
		}
		/**
		* @param {Preset} result
		* @returns {void}
		*/
		function addPreset(result) {
			addList(result.plugins);
			if (result.settings) settings = Object.assign(settings || {}, result.settings);
		}
		/**
		* @param {PluggableList|null|undefined} [plugins]
		* @returns {void}
		*/
		function addList(plugins) {
			let index = -1;
			if (plugins === null || plugins === void 0) {} else if (Array.isArray(plugins)) while (++index < plugins.length) {
				const thing = plugins[index];
				add(thing);
			}
			else throw new TypeError("Expected a list of plugins, not `" + plugins + "`");
		}
		/**
		* @param {Plugin} plugin
		* @param {...unknown} [value]
		* @returns {void}
		*/
		function addPlugin(plugin, value) {
			let index = -1;
			/** @type {Processor['attachers'][number]|undefined} */
			let entry;
			while (++index < attachers.length) if (attachers[index][0] === plugin) {
				entry = attachers[index];
				break;
			}
			if (entry) {
				if (isPlainObject(entry[1]) && isPlainObject(value)) value = (0, import_extend.default)(true, entry[1], value);
				entry[1] = value;
			} else attachers.push([...arguments]);
		}
	}
	/** @type {Processor['parse']} */
	function parse(doc) {
		processor.freeze();
		const file = vfile(doc);
		const Parser = processor.Parser;
		assertParser("parse", Parser);
		if (newable(Parser, "parse")) return new Parser(String(file), file).parse();
		return Parser(String(file), file);
	}
	/** @type {Processor['stringify']} */
	function stringify(node, doc) {
		processor.freeze();
		const file = vfile(doc);
		const Compiler = processor.Compiler;
		assertCompiler("stringify", Compiler);
		assertNode(node);
		if (newable(Compiler, "compile")) return new Compiler(node, file).compile();
		return Compiler(node, file);
	}
	/**
	* @param {Node} node
	* @param {VFileCompatible|RunCallback} [doc]
	* @param {RunCallback} [callback]
	* @returns {Promise<Node>|void}
	*/
	function run(node, doc, callback) {
		assertNode(node);
		processor.freeze();
		if (!callback && typeof doc === "function") {
			callback = doc;
			doc = void 0;
		}
		if (!callback) return new Promise(executor);
		executor(null, callback);
		/**
		* @param {null|((node: Node) => void)} resolve
		* @param {(error: Error) => void} reject
		* @returns {void}
		*/
		function executor(resolve, reject) {
			transformers.run(node, vfile(doc), done);
			/**
			* @param {Error|null} error
			* @param {Node} tree
			* @param {VFile} file
			* @returns {void}
			*/
			function done(error, tree, file) {
				tree = tree || node;
				if (error) reject(error);
				else if (resolve) resolve(tree);
				else callback(null, tree, file);
			}
		}
	}
	/** @type {Processor['runSync']} */
	function runSync(node, file) {
		/** @type {Node|undefined} */
		let result;
		/** @type {boolean|undefined} */
		let complete;
		processor.run(node, file, done);
		assertDone("runSync", "run", complete);
		return result;
		/**
		* @param {Error|null} [error]
		* @param {Node} [tree]
		* @returns {void}
		*/
		function done(error, tree) {
			bail(error);
			result = tree;
			complete = true;
		}
	}
	/**
	* @param {VFileCompatible} doc
	* @param {ProcessCallback} [callback]
	* @returns {Promise<VFile>|undefined}
	*/
	function process(doc, callback) {
		processor.freeze();
		assertParser("process", processor.Parser);
		assertCompiler("process", processor.Compiler);
		if (!callback) return new Promise(executor);
		executor(null, callback);
		/**
		* @param {null|((file: VFile) => void)} resolve
		* @param {(error?: Error|null|undefined) => void} reject
		* @returns {void}
		*/
		function executor(resolve, reject) {
			const file = vfile(doc);
			processor.run(processor.parse(file), file, (error, tree, file) => {
				if (error || !tree || !file) done(error);
				else {
					/** @type {unknown} */
					const result = processor.stringify(tree, file);
					if (result === void 0 || result === null) {} else if (looksLikeAVFileValue(result)) file.value = result;
					else file.result = result;
					done(error, file);
				}
			});
			/**
			* @param {Error|null|undefined} [error]
			* @param {VFile|undefined} [file]
			* @returns {void}
			*/
			function done(error, file) {
				if (error || !file) reject(error);
				else if (resolve) resolve(file);
				else callback(null, file);
			}
		}
	}
	/** @type {Processor['processSync']} */
	function processSync(doc) {
		/** @type {boolean|undefined} */
		let complete;
		processor.freeze();
		assertParser("processSync", processor.Parser);
		assertCompiler("processSync", processor.Compiler);
		const file = vfile(doc);
		processor.process(file, done);
		assertDone("processSync", "process", complete);
		return file;
		/**
		* @param {Error|null|undefined} [error]
		* @returns {void}
		*/
		function done(error) {
			complete = true;
			bail(error);
		}
	}
}
/**
* Check if `value` is a constructor.
*
* @param {unknown} value
* @param {string} name
* @returns {boolean}
*/
function newable(value, name) {
	return typeof value === "function" && value.prototype && (keys(value.prototype) || name in value.prototype);
}
/**
* Check if `value` is an object with keys.
*
* @param {Record<string, unknown>} value
* @returns {boolean}
*/
function keys(value) {
	/** @type {string} */
	let key;
	for (key in value) if (own$2.call(value, key)) return true;
	return false;
}
/**
* Assert a parser is available.
*
* @param {string} name
* @param {unknown} value
* @returns {asserts value is Parser}
*/
function assertParser(name, value) {
	if (typeof value !== "function") throw new TypeError("Cannot `" + name + "` without `Parser`");
}
/**
* Assert a compiler is available.
*
* @param {string} name
* @param {unknown} value
* @returns {asserts value is Compiler}
*/
function assertCompiler(name, value) {
	if (typeof value !== "function") throw new TypeError("Cannot `" + name + "` without `Compiler`");
}
/**
* Assert the processor is not frozen.
*
* @param {string} name
* @param {unknown} frozen
* @returns {asserts frozen is false}
*/
function assertUnfrozen(name, frozen) {
	if (frozen) throw new Error("Cannot call `" + name + "` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`.");
}
/**
* Assert `node` is a unist node.
*
* @param {unknown} node
* @returns {asserts node is Node}
*/
function assertNode(node) {
	if (!isPlainObject(node) || typeof node.type !== "string") throw new TypeError("Expected node, got `" + node + "`");
}
/**
* Assert that `complete` is `true`.
*
* @param {string} name
* @param {string} asyncName
* @param {unknown} complete
* @returns {asserts complete is true}
*/
function assertDone(name, asyncName, complete) {
	if (!complete) throw new Error("`" + name + "` finished async. Use `" + asyncName + "` instead");
}
/**
* @param {VFileCompatible} [value]
* @returns {VFile}
*/
function vfile(value) {
	return looksLikeAVFile(value) ? value : new VFile(value);
}
/**
* @param {VFileCompatible} [value]
* @returns {value is VFile}
*/
function looksLikeAVFile(value) {
	return Boolean(value && typeof value === "object" && "message" in value && "messages" in value);
}
/**
* @param {unknown} [value]
* @returns {value is VFileValue}
*/
function looksLikeAVFileValue(value) {
	return typeof value === "string" || (0, import_is_buffer.default)(value);
}
//#endregion
//#region ../../node_modules/unist-util-stringify-position/lib/index.js
/**
* @typedef {import('unist').Node} Node
* @typedef {import('unist').Point} Point
* @typedef {import('unist').Position} Position
*/
/**
* @typedef NodeLike
* @property {string} type
* @property {PositionLike | null | undefined} [position]
*
* @typedef PointLike
* @property {number | null | undefined} [line]
* @property {number | null | undefined} [column]
* @property {number | null | undefined} [offset]
*
* @typedef PositionLike
* @property {PointLike | null | undefined} [start]
* @property {PointLike | null | undefined} [end]
*/
/**
* Serialize the positional info of a point, position (start and end points),
* or node.
*
* @param {Node | NodeLike | Point | PointLike | Position | PositionLike | null | undefined} [value]
*   Node, position, or point.
* @returns {string}
*   Pretty printed positional info of a node (`string`).
*
*   In the format of a range `ls:cs-le:ce` (when given `node` or `position`)
*   or a point `l:c` (when given `point`), where `l` stands for line, `c` for
*   column, `s` for `start`, and `e` for end.
*   An empty string (`''`) is returned if the given value is neither `node`,
*   `position`, nor `point`.
*/
function stringifyPosition(value) {
	if (!value || typeof value !== "object") return "";
	if ("position" in value || "type" in value) return position(value.position);
	if ("start" in value || "end" in value) return position(value);
	if ("line" in value || "column" in value) return point(value);
	return "";
}
/**
* @param {Point | PointLike | null | undefined} point
* @returns {string}
*/
function point(point) {
	return index(point && point.line) + ":" + index(point && point.column);
}
/**
* @param {Position | PositionLike | null | undefined} pos
* @returns {string}
*/
function position(pos) {
	return point(pos && pos.start) + "-" + point(pos && pos.end);
}
/**
* @param {number | null | undefined} value
* @returns {number}
*/
function index(value) {
	return value && typeof value === "number" ? value : 1;
}
//#endregion
//#region ../../node_modules/vfile-message/lib/index.js
/**
* @typedef {import('unist').Node} Node
* @typedef {import('unist').Point} Point
* @typedef {import('unist').Position} Position
*/
/**
* @typedef {object & {type: string, position?: Position | undefined}} NodeLike
*
* @typedef Options
*   Configuration.
* @property {Array<Node> | null | undefined} [ancestors]
*   Stack of (inclusive) ancestor nodes surrounding the message (optional).
* @property {Error | null | undefined} [cause]
*   Original error cause of the message (optional).
* @property {Point | Position | null | undefined} [place]
*   Place of message (optional).
* @property {string | null | undefined} [ruleId]
*   Category of message (optional, example: `'my-rule'`).
* @property {string | null | undefined} [source]
*   Namespace of who sent the message (optional, example: `'my-package'`).
*/
/**
* Message.
*/
var VFileMessage = class extends Error {
	/**
	* Create a message for `reason`.
	*
	* > 🪦 **Note**: also has obsolete signatures.
	*
	* @overload
	* @param {string} reason
	* @param {Options | null | undefined} [options]
	* @returns
	*
	* @overload
	* @param {string} reason
	* @param {Node | NodeLike | null | undefined} parent
	* @param {string | null | undefined} [origin]
	* @returns
	*
	* @overload
	* @param {string} reason
	* @param {Point | Position | null | undefined} place
	* @param {string | null | undefined} [origin]
	* @returns
	*
	* @overload
	* @param {string} reason
	* @param {string | null | undefined} [origin]
	* @returns
	*
	* @overload
	* @param {Error | VFileMessage} cause
	* @param {Node | NodeLike | null | undefined} parent
	* @param {string | null | undefined} [origin]
	* @returns
	*
	* @overload
	* @param {Error | VFileMessage} cause
	* @param {Point | Position | null | undefined} place
	* @param {string | null | undefined} [origin]
	* @returns
	*
	* @overload
	* @param {Error | VFileMessage} cause
	* @param {string | null | undefined} [origin]
	* @returns
	*
	* @param {Error | VFileMessage | string} causeOrReason
	*   Reason for message, should use markdown.
	* @param {Node | NodeLike | Options | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
	*   Configuration (optional).
	* @param {string | null | undefined} [origin]
	*   Place in code where the message originates (example:
	*   `'my-package:my-rule'` or `'my-rule'`).
	* @returns
	*   Instance of `VFileMessage`.
	*/
	constructor(causeOrReason, optionsOrParentOrPlace, origin) {
		super();
		if (typeof optionsOrParentOrPlace === "string") {
			origin = optionsOrParentOrPlace;
			optionsOrParentOrPlace = void 0;
		}
		/** @type {string} */
		let reason = "";
		/** @type {Options} */
		let options = {};
		let legacyCause = false;
		if (optionsOrParentOrPlace) if ("line" in optionsOrParentOrPlace && "column" in optionsOrParentOrPlace) options = { place: optionsOrParentOrPlace };
		else if ("start" in optionsOrParentOrPlace && "end" in optionsOrParentOrPlace) options = { place: optionsOrParentOrPlace };
		else if ("type" in optionsOrParentOrPlace) options = {
			ancestors: [optionsOrParentOrPlace],
			place: optionsOrParentOrPlace.position
		};
		else options = { ...optionsOrParentOrPlace };
		if (typeof causeOrReason === "string") reason = causeOrReason;
		else if (!options.cause && causeOrReason) {
			legacyCause = true;
			reason = causeOrReason.message;
			options.cause = causeOrReason;
		}
		if (!options.ruleId && !options.source && typeof origin === "string") {
			const index = origin.indexOf(":");
			if (index === -1) options.ruleId = origin;
			else {
				options.source = origin.slice(0, index);
				options.ruleId = origin.slice(index + 1);
			}
		}
		if (!options.place && options.ancestors && options.ancestors) {
			const parent = options.ancestors[options.ancestors.length - 1];
			if (parent) options.place = parent.position;
		}
		const start = options.place && "start" in options.place ? options.place.start : options.place;
		/**
		* Stack of ancestor nodes surrounding the message.
		*
		* @type {Array<Node> | undefined}
		*/
		this.ancestors = options.ancestors || void 0;
		/**
		* Original error cause of the message.
		*
		* @type {Error | undefined}
		*/
		this.cause = options.cause || void 0;
		/**
		* Starting column of message.
		*
		* @type {number | undefined}
		*/
		this.column = start ? start.column : void 0;
		/**
		* State of problem.
		*
		* * `true` — error, file not usable
		* * `false` — warning, change may be needed
		* * `undefined` — change likely not needed
		*
		* @type {boolean | null | undefined}
		*/
		this.fatal = void 0;
		/**
		* Path of a file (used throughout the `VFile` ecosystem).
		*
		* @type {string | undefined}
		*/
		this.file;
		/**
		* Reason for message.
		*
		* @type {string}
		*/
		this.message = reason;
		/**
		* Starting line of error.
		*
		* @type {number | undefined}
		*/
		this.line = start ? start.line : void 0;
		/**
		* Serialized positional info of message.
		*
		* On normal errors, this would be something like `ParseError`, buit in
		* `VFile` messages we use this space to show where an error happened.
		*/
		this.name = stringifyPosition(options.place) || "1:1";
		/**
		* Place of message.
		*
		* @type {Point | Position | undefined}
		*/
		this.place = options.place || void 0;
		/**
		* Reason for message, should use markdown.
		*
		* @type {string}
		*/
		this.reason = this.message;
		/**
		* Category of message (example: `'my-rule'`).
		*
		* @type {string | undefined}
		*/
		this.ruleId = options.ruleId || void 0;
		/**
		* Namespace of message (example: `'my-package'`).
		*
		* @type {string | undefined}
		*/
		this.source = options.source || void 0;
		/**
		* Stack of message.
		*
		* This is used by normal errors to show where something happened in
		* programming code, irrelevant for `VFile` messages,
		*
		* @type {string}
		*/
		this.stack = legacyCause && options.cause && typeof options.cause.stack === "string" ? options.cause.stack : "";
		/**
		* Specify the source value that’s being reported, which is deemed
		* incorrect.
		*
		* @type {string | undefined}
		*/
		this.actual;
		/**
		* Suggest acceptable values that can be used instead of `actual`.
		*
		* @type {Array<string> | undefined}
		*/
		this.expected;
		/**
		* Long form description of the message (you should use markdown).
		*
		* @type {string | undefined}
		*/
		this.note;
		/**
		* Link to docs for the message.
		*
		* > 👉 **Note**: this must be an absolute URL that can be passed as `x`
		* > to `new URL(x)`.
		*
		* @type {string | undefined}
		*/
		this.url;
	}
};
VFileMessage.prototype.file = "";
VFileMessage.prototype.name = "";
VFileMessage.prototype.reason = "";
VFileMessage.prototype.message = "";
VFileMessage.prototype.stack = "";
VFileMessage.prototype.column = void 0;
VFileMessage.prototype.line = void 0;
VFileMessage.prototype.ancestors = void 0;
VFileMessage.prototype.cause = void 0;
VFileMessage.prototype.fatal = void 0;
VFileMessage.prototype.place = void 0;
VFileMessage.prototype.ruleId = void 0;
VFileMessage.prototype.source = void 0;
//#endregion
//#region libs/pre-conversion-subs/utils.ts
/**
* Create a warning message about node from the given source file.
*/
function makeWarningMessage(node, message, warningType) {
	const newMessage = new VFileMessage(message, node);
	newMessage.source = `unified-latex-to-pretext:${warningType}`;
	return newMessage;
}
/**
* Create an empty Ast.String node, adding a warning message from
* the source file into the VFile.
*/
function emptyStringWithWarningFactory(warningMessage) {
	return (node, info, file) => {
		if (file) {
			const message = makeWarningMessage(node, warningMessage, "macro-subs");
			file.message(message, message.place, `unified-latex-to-pretext:macro-subs`);
		}
		return (0, _unified_latex_unified_latex_builder.s)("");
	};
}
/**
* Sanitize a string for use in xml:id attributes and corresponding refs.
*/
function sanitizeXmlId(str) {
	return str.replace(/["'<>&:\s]/g, (match) => {
		switch (match) {
			case "&":
			case ":": return "-";
			case " ":
			case "	": return "_";
			default: return "";
		}
	});
}
//#endregion
//#region libs/pre-conversion-subs/break-on-boundaries.ts
var divisionGroups = [
	[{
		division: "part",
		mappedEnviron: "_part"
	}],
	[
		{
			division: "chapter",
			mappedEnviron: "_chapter"
		},
		{
			division: "preface",
			mappedEnviron: "_preface"
		},
		{
			division: "biography",
			mappedEnviron: "_biography"
		},
		{
			division: "dedication",
			mappedEnviron: "_dedication"
		},
		{
			division: "glossary",
			mappedEnviron: "_glossary"
		}
	],
	[
		{
			division: "section",
			mappedEnviron: "_section"
		},
		{
			division: "exercises",
			mappedEnviron: "_exercises"
		},
		{
			division: "solutions",
			mappedEnviron: "_solutions"
		},
		{
			division: "worksheet",
			mappedEnviron: "_worksheet"
		},
		{
			division: "readingquestions",
			mappedEnviron: "_readingquestions",
			pretextTag: "reading-questions"
		}
	],
	[{
		division: "subsection",
		mappedEnviron: "_subsection"
	}],
	[{
		division: "subsubsection",
		mappedEnviron: "_subsubsection"
	}],
	[{
		division: "paragraph",
		mappedEnviron: "_paragraph"
	}],
	[{
		division: "subparagraph",
		mappedEnviron: "_subparagraph"
	}]
];
var isExamListEnviron = _unified_latex_unified_latex_util_match.match.createEnvironmentMatcher([
	"parts",
	"subparts",
	"subsubparts"
]);
/**
* Flat view of all division entries — useful for lookups.
*/
var divisions = divisionGroups.flat();
var isDivisionMacro = _unified_latex_unified_latex_util_match.match.createMacroMatcher(divisions.map((x) => x.division));
var isMappedEnviron = _unified_latex_unified_latex_util_match.match.createEnvironmentMatcher(divisions.map((x) => x.mappedEnviron));
/**
* Breaks up division macros into environments. Returns an object of warning messages
* for any groups that were removed.
*/
function breakOnBoundaries(ast) {
	const messagesLst = { messages: [] };
	(0, _unified_latex_unified_latex_util_replace.replaceNode)(ast, (node) => {
		if (_unified_latex_unified_latex_util_match.match.group(node)) {
			if (node.content.some((child) => {
				return (0, _unified_latex_unified_latex_util_match.anyMacro)(child) && isDivisionMacro(child);
			})) {
				messagesLst.messages.push(makeWarningMessage(node, "Warning: hoisted out of a group, which might break the LaTeX code.", "break-on-boundaries"));
				return node.content;
			}
		}
	});
	(0, _unified_latex_unified_latex_util_visit.visit)(ast, (node, info) => {
		if (!((0, _unified_latex_unified_latex_util_match.anyEnvironment)(node) || node.type === "root" || _unified_latex_unified_latex_util_match.match.group(node)) || info.context.hasMathModeAncestor) return;
		else if ((0, _unified_latex_unified_latex_util_match.anyEnvironment)(node) && isMappedEnviron(node)) return;
		else if ((0, _unified_latex_unified_latex_util_match.anyEnvironment)(node) && isExamListEnviron(node)) return;
		node.content = breakUp(node.content, 0);
	});
	(0, _unified_latex_unified_latex_util_replace.replaceNode)(ast, (node, info) => {
		if ((0, _unified_latex_unified_latex_util_match.anyMacro)(node) && isDivisionMacro(node)) {
			if (info.parents.some((p) => (0, _unified_latex_unified_latex_util_match.anyEnvironment)(p) && isExamListEnviron(p))) return;
			return null;
		}
	});
	return messagesLst;
}
/**
* Recursively breaks up the AST at the division macros.
* Each depth corresponds to a group of peer divisions in `divisionGroups`.
*/
function breakUp(content, depth) {
	if (depth >= divisionGroups.length) return content;
	const group = divisionGroups[depth];
	const splits = (0, _unified_latex_unified_latex_util_split.splitOnMacro)(content, group.map((d) => d.division));
	for (let i = 0; i < splits.segments.length; i++) splits.segments[i] = breakUp(splits.segments[i], depth + 1);
	createEnvironments(splits, group);
	return (0, _unified_latex_unified_latex_util_split.unsplitOnMacro)(splits);
}
/**
* Create the new environments that replace the division macros.
* Each macro in `splits.macros` is looked up in `group` to find its mapped
* environment name, allowing multiple macro types at the same depth level.
*/
function createEnvironments(splits, group) {
	const macroToEnv = new Map(group.map((d) => [d.division, d.mappedEnviron]));
	for (let i = 1; i < splits.segments.length; i++) {
		const macro = splits.macros[i - 1];
		const mappedEnv = macroToEnv.get(macro.content) ?? "_unknown";
		const title = (0, _unified_latex_unified_latex_util_arguments.getNamedArgsContent)(macro)["title"];
		const titleArg = [];
		if (title) titleArg.push((0, _unified_latex_unified_latex_builder.arg)(title, { braces: "[]" }));
		splits.segments[i] = [(0, _unified_latex_unified_latex_builder.env)(mappedEnv, splits.segments[i], titleArg)];
	}
}
//#endregion
//#region libs/pretext-subs/to-pretext.ts
function formatNodeForError(node) {
	try {
		return (0, _unified_latex_unified_latex_util_print_raw.printRaw)(node);
	} catch {}
	return JSON.stringify(node);
}
/**
* Create a `toPretext` function that will log by making a call to `logger`.
*/
function toPretextWithLoggerFactory(logger) {
	/**
	* Convert Ast.Node to Xast nodes.
	*/
	return function toPretext(node) {
		const htmlNode = node;
		if ((0, _unified_latex_unified_latex_util_html_like.isHtmlLikeTag)(htmlNode)) {
			const extracted = (0, _unified_latex_unified_latex_util_html_like.extractFromHtmlLike)(htmlNode);
			const attributes = extracted.attributes;
			return x(extracted.tag, attributes, extracted.content.flatMap(toPretext));
		}
		switch (node.type) {
			case "string": return {
				type: "text",
				value: node.content,
				position: node.position
			};
			case "comment": return {
				type: "comment",
				value: node.content,
				position: node.position
			};
			case "inlinemath": return x("m", (0, _unified_latex_unified_latex_util_print_raw.printRaw)(node.content));
			case "mathenv":
			case "displaymath": return x("md", (0, _unified_latex_unified_latex_util_print_raw.printRaw)(node.content));
			case "verb": return x("c", node.content);
			case "verbatim": return x("pre", node.content);
			case "whitespace": return {
				type: "text",
				value: " ",
				position: node.position
			};
			case "parbreak":
				logger(`There is no equivalent for parbreak, so it was replaced with an empty string.`, node);
				return {
					type: "text",
					value: "",
					position: node.position
				};
			case "group": return node.content.flatMap(toPretext);
			case "environment":
				if (isMappedEnviron(node)) {
					const divEntry = divisions.find((x) => x.mappedEnviron === node.env);
					if (divEntry?.division === "subparagraph") logger(`Warning: There is no equivalent tag for "subparagraph", "paragraphs" was used as a replacement.`, node);
					let tagName = divEntry?.pretextTag ?? divEntry?.division;
					if (tagName === "paragraph" || tagName === "subparagraph") tagName = "paragraphs";
					const attributes = {};
					if (node._renderInfo?.additionalAttributes) Object.assign(attributes, node._renderInfo.additionalAttributes);
					const title = (0, _unified_latex_unified_latex_util_arguments.getArgsContent)(node)[0];
					if (!title) logger(`Warning: No title was given, so an empty title tag was used.`, node);
					const titleTag = x("title", title?.flatMap(toPretext));
					if (tagName) return x(tagName, attributes, [titleTag, ...node.content.flatMap(toPretext)]);
				}
				logger(`Unknown environment when converting to XML \`${formatNodeForError(node.env)}\``, node);
				return node.content.flatMap(toPretext);
			case "macro":
				logger(`Unknown macro when converting to XML \`${formatNodeForError(node)}\``, node);
				return (node.args || []).map(toPretext).flat();
			case "argument":
				logger(`Unknown argument when converting to XML \`${formatNodeForError(node)}\``, node);
				return {
					type: "text",
					value: (0, _unified_latex_unified_latex_util_print_raw.printRaw)(node.content),
					position: node.position
				};
			case "root": return node.content.flatMap(toPretext);
			default: throw new Error(`Unknown node type; cannot convert to XAST ${JSON.stringify(node)}`);
		}
	};
}
toPretextWithLoggerFactory(console.warn);
//#endregion
//#region libs/split-for-pars.ts
/**
* Takes an array of nodes and splits it into chunks that should be wrapped
* in HTML `<p>...</p>` tags, vs. not. By default environments are not wrapped
* unless they are specified, and macros are included in a par unless they are excluded.
*
*/
function splitForPars(nodes, options) {
	const ret = [];
	let currBody = [];
	(0, _unified_latex_unified_latex_util_trim.trim)(nodes);
	const isParBreakingMacro = _unified_latex_unified_latex_util_match.match.createMacroMatcher(options.macrosThatBreakPars);
	const isEnvThatShouldNotBreakPar = _unified_latex_unified_latex_util_match.match.createEnvironmentMatcher(options.environmentsThatDontBreakPars);
	/**
	* Push and clear the contents of `currBody` to the return array.
	* If there are any contents, it should be wrapped in an array.
	*/
	function pushBody() {
		if (currBody.length > 0) {
			(0, _unified_latex_unified_latex_util_trim.trim)(currBody);
			ret.push({
				content: currBody,
				wrapInPar: true
			});
			currBody = [];
		}
	}
	for (const node of nodes) {
		if (isParBreakingMacro(node)) {
			pushBody();
			ret.push({
				content: [node],
				wrapInPar: false
			});
			continue;
		}
		if (_unified_latex_unified_latex_util_match.match.anyEnvironment(node) && !isEnvThatShouldNotBreakPar(node)) {
			pushBody();
			ret.push({
				content: [node],
				wrapInPar: false
			});
			continue;
		}
		if (_unified_latex_unified_latex_util_match.match.parbreak(node) || _unified_latex_unified_latex_util_match.match.macro(node, "par")) {
			pushBody();
			continue;
		}
		currBody.push(node);
	}
	pushBody();
	return ret;
}
//#endregion
//#region libs/wrap-pars.ts
/**
* Wrap paragraphs in `<p>...</p>` tags.
*
* Paragraphs are inserted at
*   * parbreak tokens
*   * macros listed in `macrosThatBreakPars`
*   * environments not listed in `environmentsThatDontBreakPars`
*/
function wrapPars(nodes, options) {
	const { macrosThatBreakPars = [
		"part",
		"chapter",
		"section",
		"subsection",
		"subsubsection",
		"paragraph",
		"subparagraph",
		"vspace",
		"smallskip",
		"medskip",
		"bigskip",
		"hfill",
		"includegraphics",
		"title"
	], environmentsThatDontBreakPars = [
		"index",
		"itemize",
		"enumerate"
	] } = options || {};
	return splitForPars(nodes, {
		macrosThatBreakPars,
		environmentsThatDontBreakPars
	}).flatMap((part) => {
		if (part.wrapInPar) return (0, _unified_latex_unified_latex_util_html_like.htmlLike)({
			tag: "p",
			content: part.content
		});
		else return part.content;
	});
}
//#endregion
//#region libs/pre-conversion-subs/create-table-from-tabular.ts
/**
* Convert env into a tabular in PreTeXt.
*/
function createTableFromTabular(env) {
	const tabularBody = (0, _unified_latex_unified_latex_util_align.parseAlignEnvironment)(env.content);
	const args = (0, _unified_latex_unified_latex_util_arguments.getArgsContent)(env);
	let columnSpecs = [];
	try {
		columnSpecs = (0, _unified_latex_unified_latex_ctan_package_tabularx.parseTabularSpec)(args[1] || []);
	} catch (e) {}
	const attributes = {};
	let notLeftAligned = false;
	const columnRightBorder = {};
	const tableBody = tabularBody.map((row) => {
		return (0, _unified_latex_unified_latex_util_html_like.htmlLike)({
			tag: "row",
			content: row.cells.map((cell, i) => {
				const columnSpec = columnSpecs[i];
				if (columnSpec) {
					const { alignment } = columnSpec;
					if (columnSpec.pre_dividers.some((div) => div.type === "vert_divider")) attributes["left"] = "minor";
					if (columnSpec.post_dividers.some((div) => div.type === "vert_divider")) columnRightBorder[i] = true;
					if (alignment.alignment !== "left") notLeftAligned = true;
				}
				(0, _unified_latex_unified_latex_util_trim.trim)(cell);
				return (0, _unified_latex_unified_latex_util_html_like.htmlLike)({
					tag: "cell",
					content: cell
				});
			})
		});
	});
	if (notLeftAligned || Object.values(columnRightBorder).some((b) => b)) for (let i = columnSpecs.length; i >= 0; i--) {
		const columnSpec = columnSpecs[i];
		if (!columnSpec) continue;
		const colAttributes = {};
		const { alignment } = columnSpec;
		if (alignment.alignment !== "left") colAttributes["halign"] = alignment.alignment;
		if (columnRightBorder[i] === true) colAttributes["right"] = "minor";
		tableBody.unshift((0, _unified_latex_unified_latex_util_html_like.htmlLike)({
			tag: "col",
			attributes: colAttributes
		}));
	}
	return (0, _unified_latex_unified_latex_util_html_like.htmlLike)({
		tag: "tabular",
		content: tableBody,
		attributes
	});
}
//#endregion
//#region libs/pre-conversion-subs/environment-subs.ts
var ITEM_ARG_NAMES_REG = ["label"];
var ITEM_ARG_NAMES_BEAMER = [
	null,
	"label",
	null
];
/**
* Extract the arguments to an `\item` macro.
*/
function getItemArgs(node) {
	if (!Array.isArray(node.args)) throw new Error(`Cannot find \\item macros arguments; you must attach the \\item body to the macro before calling this function ${JSON.stringify(node)}`);
	const argNames = node.args.length - 1 === ITEM_ARG_NAMES_BEAMER.length ? ITEM_ARG_NAMES_BEAMER : ITEM_ARG_NAMES_REG;
	return Object.assign({ body: node.args[node.args.length - 1].content }, (0, _unified_latex_unified_latex_util_arguments.getNamedArgsContent)(node, argNames));
}
function enumerateFactory(parentTag = "ol") {
	return function enumerateToHtml(env) {
		const items = env.content.filter((node) => _unified_latex_unified_latex_util_match.match.macro(node, "item"));
		let isDescriptionList = false;
		const content = items.flatMap((node) => {
			if (!_unified_latex_unified_latex_util_match.match.macro(node) || !node.args) return [];
			const namedArgs = getItemArgs(node);
			namedArgs.body = wrapPars(namedArgs.body);
			if (namedArgs.label != null) {
				isDescriptionList = true;
				namedArgs.body.unshift((0, _unified_latex_unified_latex_util_html_like.htmlLike)({
					tag: "title",
					content: namedArgs.label
				}));
			}
			const body = namedArgs.body;
			return (0, _unified_latex_unified_latex_util_html_like.htmlLike)({
				tag: "li",
				content: body
			});
		});
		return (0, _unified_latex_unified_latex_util_html_like.htmlLike)({
			tag: isDescriptionList ? "dl" : parentTag,
			content
		});
	};
}
/**
* Tags that should be siblings of `<statement>` rather than children of it,
* when nested inside a theorem-like or exercise-like environment.
* For example, `<proof>` must follow `<statement>` inside `<theorem>`.
*/
var STATEMENT_SIBLING_TAGS = new Set([
	"proof",
	"hint",
	"answer",
	"solution"
]);
function envFactory(tag, options = {}) {
	const { requiresStatementTag = false, wrapContentInPars = true, extractTitleFromArgs = true, warningMessage = "" } = options;
	return (env, info, file) => {
		if (warningMessage && file) {
			const message = makeWarningMessage(env, warningMessage, "env-subs");
			file.message(message, message.place, message.source);
		}
		let content;
		if (requiresStatementTag) {
			const statementEnvContent = [];
			const statementSiblings = [];
			for (const node of env.content) if ((0, _unified_latex_unified_latex_util_html_like.isHtmlLikeTag)(node) && STATEMENT_SIBLING_TAGS.has(node.content.slice(9))) statementSiblings.push(node);
			else statementEnvContent.push(node);
			content = [(0, _unified_latex_unified_latex_util_html_like.htmlLike)({
				tag: "statement",
				content: wrapContentInPars ? wrapPars(statementEnvContent) : statementEnvContent
			}), ...statementSiblings];
		} else content = wrapContentInPars ? wrapPars(env.content) : env.content;
		if (extractTitleFromArgs) {
			const args = (0, _unified_latex_unified_latex_util_arguments.getArgsContent)(env);
			if (args[0]) content.unshift((0, _unified_latex_unified_latex_util_html_like.htmlLike)({
				tag: "title",
				content: args[0] || []
			}));
		}
		const attributes = {};
		if (env._renderInfo?.additionalAttributes) Object.assign(attributes, env._renderInfo.additionalAttributes);
		return (0, _unified_latex_unified_latex_util_html_like.htmlLike)({
			tag,
			content,
			attributes
		});
	};
}
/**
* Rules for replacing a macro with an html-like macro
* that will render has pretext when printed.
*/
var environmentReplacements = {
	enumerate: enumerateFactory("ol"),
	itemize: enumerateFactory("ul"),
	tabular: createTableFromTabular,
	center: envFactory("blockquote"),
	quote: envFactory("blockquote"),
	figure: envFactory("figure", {
		requiresStatementTag: false,
		wrapContentInPars: false,
		extractTitleFromArgs: false
	}),
	table: envFactory("table", {
		requiresStatementTag: false,
		wrapContentInPars: false,
		extractTitleFromArgs: false
	}),
	code: (env) => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({
		tag: "pre",
		content: [{
			type: "string",
			content: (0, _unified_latex_unified_latex_util_print_raw.printRaw)(env.content)
		}]
	}),
	poem: (env) => {
		const title = (0, _unified_latex_unified_latex_util_arguments.getArgsContent)(env)[0];
		const raw = (0, _unified_latex_unified_latex_util_print_raw.printRaw)(env.content).trim();
		const stanzas = raw.split(/\n[ \t]*\n/).map((s) => s.trim()).filter((s) => s.length > 0).map((stanzaText) => {
			return (0, _unified_latex_unified_latex_util_html_like.htmlLike)({
				tag: "stanza",
				content: stanzaText.split(/\\\\[ \t]*\n?/).map((l) => l.trim()).filter((l) => l.length > 0).map((lineText) => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({
					tag: "line",
					content: [{
						type: "string",
						content: lineText
					}]
				}))
			});
		});
		if (stanzas.length === 0) stanzas.push((0, _unified_latex_unified_latex_util_html_like.htmlLike)({
			tag: "stanza",
			content: [(0, _unified_latex_unified_latex_util_html_like.htmlLike)({
				tag: "line",
				content: [{
					type: "string",
					content: raw
				}]
			})]
		}));
		const children = [];
		if (title) children.push((0, _unified_latex_unified_latex_util_html_like.htmlLike)({
			tag: "title",
			content: title
		}));
		children.push(...stanzas);
		return (0, _unified_latex_unified_latex_util_html_like.htmlLike)({
			tag: "poem",
			content: children
		});
	},
	sidebyside: envFactory("sidebyside", {
		requiresStatementTag: false,
		extractTitleFromArgs: false
	}),
	program: (env) => {
		const args = (0, _unified_latex_unified_latex_util_arguments.getArgsContent)(env);
		const lang = args[0] ? (0, _unified_latex_unified_latex_util_print_raw.printRaw)(args[0]).trim() : void 0;
		return (0, _unified_latex_unified_latex_util_html_like.htmlLike)({
			tag: "program",
			content: [(0, _unified_latex_unified_latex_util_html_like.htmlLike)({
				tag: "input",
				content: [{
					type: "string",
					content: (0, _unified_latex_unified_latex_util_print_raw.printRaw)(env.content).trim()
				}]
			})],
			attributes: lang ? { language: lang } : {}
		});
	},
	console: (env) => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({
		tag: "console",
		content: [{
			type: "string",
			content: (0, _unified_latex_unified_latex_util_print_raw.printRaw)(env.content).trim()
		}]
	}),
	sage: (env) => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({
		tag: "sage",
		content: [(0, _unified_latex_unified_latex_util_html_like.htmlLike)({
			tag: "input",
			content: [{
				type: "string",
				content: (0, _unified_latex_unified_latex_util_print_raw.printRaw)(env.content).trim()
			}]
		})]
	}),
	webwork: envFactory("webwork", { requiresStatementTag: false }),
	preface: envFactory("preface"),
	biography: envFactory("biography"),
	dedication: envFactory("dedication"),
	glossary: envFactory("glossary"),
	biblio: envFactory("biblio"),
	gi: envFactory("gi", { requiresStatementTag: false }),
	exercises: envFactory("exercises"),
	exercisegroup: envFactory("exercisegroup"),
	subexercises: envFactory("subexercises"),
	worksheet: envFactory("worksheet"),
	"reading-questions": envFactory("reading-questions"),
	readingquestions: envFactory("reading-questions"),
	solutions: envFactory("solutions"),
	introduction: envFactory("introduction"),
	conclusion: envFactory("conclusion"),
	paragraphs: envFactory("paragraphs"),
	objectives: envFactory("objectives"),
	outcomes: envFactory("outcomes"),
	list: envFactory("list", {
		requiresStatementTag: false,
		wrapContentInPars: false,
		extractTitleFromArgs: false
	}),
	listing: envFactory("listing", {
		requiresStatementTag: false,
		wrapContentInPars: false,
		extractTitleFromArgs: false
	}),
	sbsgroup: envFactory("sbsgroup", { requiresStatementTag: false }),
	stack: envFactory("stack", { requiresStatementTag: false }),
	...genEnvironmentReplacements()
};
function genEnvironmentReplacements() {
	const exapandedEnvAliases = Object.entries({
		abstract: {
			requiresStatement: false,
			aliases: ["abs", "abstr"]
		},
		acknowledgement: {
			requiresStatement: false,
			aliases: ["ack"]
		},
		algorithm: {
			requiresStatement: true,
			aliases: ["algo", "alg"]
		},
		answer: {
			requiresStatement: false,
			aliases: ["ans"]
		},
		assumption: {
			requiresStatement: true,
			aliases: ["assu", "ass"]
		},
		axiom: {
			requiresStatement: true,
			aliases: ["axm"]
		},
		claim: {
			requiresStatement: true,
			aliases: ["cla"]
		},
		conjecture: {
			requiresStatement: true,
			aliases: [
				"con",
				"conj",
				"conjec"
			]
		},
		activity: {
			requiresStatement: false,
			aliases: []
		},
		aside: {
			requiresStatement: false,
			aliases: []
		},
		assemblage: {
			requiresStatement: false,
			aliases: []
		},
		biographical: {
			requiresStatement: false,
			aliases: []
		},
		case: {
			requiresStatement: false,
			aliases: []
		},
		computation: {
			requiresStatement: false,
			aliases: ["comp"]
		},
		construction: {
			requiresStatement: false,
			aliases: []
		},
		convention: {
			requiresStatement: false,
			aliases: ["conv"]
		},
		corollary: {
			requiresStatement: true,
			aliases: [
				"cor",
				"corr",
				"coro",
				"corol",
				"corss"
			]
		},
		definition: {
			requiresStatement: true,
			aliases: [
				"def",
				"defn",
				"dfn",
				"defi",
				"defin",
				"de"
			]
		},
		example: {
			requiresStatement: true,
			aliases: [
				"exam",
				"exa",
				"eg",
				"exmp",
				"expl",
				"exm"
			]
		},
		exercise: {
			requiresStatement: true,
			aliases: ["exer", "exers"]
		},
		data: {
			requiresStatement: false,
			aliases: []
		},
		exploration: {
			requiresStatement: false,
			aliases: []
		},
		fact: {
			requiresStatement: true,
			aliases: []
		},
		heuristic: {
			requiresStatement: true,
			aliases: []
		},
		hint: {
			requiresStatement: false,
			aliases: []
		},
		historical: {
			requiresStatement: false,
			aliases: []
		},
		hypothesis: {
			requiresStatement: true,
			aliases: ["hyp"]
		},
		identity: {
			requiresStatement: true,
			aliases: ["idnty"]
		},
		insight: {
			requiresStatement: false,
			aliases: []
		},
		investigation: {
			requiresStatement: false,
			aliases: []
		},
		lemma: {
			requiresStatement: true,
			aliases: [
				"lem",
				"lma",
				"lemm",
				"lm"
			]
		},
		notation: {
			requiresStatement: false,
			aliases: [
				"no",
				"nota",
				"ntn",
				"nt",
				"notn",
				"notat"
			]
		},
		note: {
			requiresStatement: false,
			aliases: ["notes"]
		},
		observation: {
			requiresStatement: false,
			aliases: ["obs"]
		},
		principle: {
			requiresStatement: true,
			aliases: []
		},
		problem: {
			requiresStatement: true,
			aliases: ["prob", "prb"]
		},
		project: {
			requiresStatement: false,
			aliases: []
		},
		proof: {
			requiresStatement: false,
			aliases: [
				"pf",
				"prf",
				"demo"
			]
		},
		proposition: {
			requiresStatement: true,
			aliases: [
				"prop",
				"pro",
				"prp",
				"props"
			]
		},
		question: {
			requiresStatement: true,
			aliases: [
				"qu",
				"ques",
				"quest",
				"qsn"
			]
		},
		remark: {
			requiresStatement: false,
			aliases: [
				"rem",
				"rmk",
				"rema",
				"bem",
				"subrem"
			]
		},
		task: {
			requiresStatement: true,
			aliases: []
		},
		technology: {
			requiresStatement: false,
			aliases: ["tech"]
		},
		theorem: {
			requiresStatement: true,
			aliases: [
				"thm",
				"theo",
				"theor",
				"thmss",
				"thrm"
			]
		},
		solution: {
			requiresStatement: false,
			aliases: ["sol"]
		},
		warning: {
			requiresStatement: false,
			aliases: ["warn", "wrn"]
		}
	}).flatMap(([env, spec]) => [[env, envFactory(env, { requiresStatementTag: spec.requiresStatement })], ...spec.aliases.map((name) => [name, envFactory(env, { requiresStatementTag: spec.requiresStatement })])]);
	return Object.fromEntries(exapandedEnvAliases);
}
_unified_latex_unified_latex_ctan_package_exam.environments["questions"], _unified_latex_unified_latex_ctan_package_exam.environments["parts"], _unified_latex_unified_latex_ctan_package_exam.environments["subparts"], _unified_latex_unified_latex_ctan_package_exam.environments["subsubparts"];
var EXAM_ITEM_MACROS = new Set([
	"question",
	"part",
	"subpart",
	"subsubpart"
]);
/**
* The default parser already runs `cleanEnumerateBody` on exam environments via the
* CTAN exam environment info. This means item macros like `\question[5] body` have
* their entire body (including the `[5]`) placed into `args[0]` with openMark:"".
*
* However, `\part` is also a document-division macro with signature `"s o m"` in the
* standard LaTeX2e macros. The parser attaches those args first (star, optional, mandatory),
* and then `cleanEnumerateBody` appends the remaining body as an additional arg.  So for
* `\part[3] First part`, the args are: [sArg, {openMark:"[", content:["3"]}, {openMark:"{",
* content:["First"]}, {openMark:"", content:[" part"]}].
*
* This function re-processes exam item macros to normalize them to a two-arg form:
*   args[0] = optional points arg (Argument with openMark:"[" if present, else empty)
*   args[1] = body content arg (Argument with openMark:"")
*/
function fixExamMacroArgs(tree) {
	(0, _unified_latex_unified_latex_util_visit.visit)(tree, (node) => {
		const macro = node;
		if (!EXAM_ITEM_MACROS.has(macro.content)) return;
		if (!macro.args || macro.args.length === 0) return;
		const lastArg = macro.args[macro.args.length - 1];
		if (macro.args.length >= 4 && macro.args[macro.args.length - 2].openMark === "{" && lastArg.openMark === "") {
			const pointsArg = macro.args[macro.args.length - 3];
			const mandatoryContent = macro.args[macro.args.length - 2].content;
			const bodyContent = lastArg.content;
			macro.args = [pointsArg, (0, _unified_latex_unified_latex_builder.arg)([...mandatoryContent, ...bodyContent], {
				openMark: "",
				closeMark: ""
			})];
			return;
		}
		if (macro.args.length !== 1 || lastArg.openMark !== "") return;
		const bodyContent = [...lastArg.content];
		const { args: parsedArgs } = (0, _unified_latex_unified_latex_util_arguments.gobbleArguments)(bodyContent, "o");
		macro.args = [parsedArgs[0], (0, _unified_latex_unified_latex_builder.arg)(bodyContent, {
			openMark: "",
			closeMark: ""
		})];
	}, { test: _unified_latex_unified_latex_util_match.match.anyMacro });
}
/**
* Extract the point value from an exam item macro's optional argument.
* Returns the trimmed string value, or undefined if no points were specified.
*/
function getPointsAttribute(node) {
	const pointsArg = (0, _unified_latex_unified_latex_util_arguments.getArgsContent)(node)[0];
	if (pointsArg && pointsArg.length > 0) {
		const value = (0, _unified_latex_unified_latex_util_print_raw.printRaw)(pointsArg).trim();
		if (value) return { points: value };
	}
	return {};
}
/**
* Get the body content from an exam item macro (the last argument,
* attached by `cleanEnumerateBody`).
*/
function getItemBody(node) {
	if (!node.args || node.args.length === 0) return [];
	return node.args[node.args.length - 1].content;
}
function isWhitespaceLike(node) {
	return node.type === "whitespace" || node.type === "comment";
}
function isVfillMacro(node) {
	return _unified_latex_unified_latex_util_match.match.macro(node, "vfill") || _unified_latex_unified_latex_util_match.match.macro(node, "vfil");
}
function isVspaceMacro(node) {
	return _unified_latex_unified_latex_util_match.match.macro(node, "vspace");
}
function getVspaceWorkspace(node) {
	const args = (0, _unified_latex_unified_latex_util_arguments.getArgsContent)(node);
	for (let i = args.length - 1; i >= 0; i--) {
		const argContent = args[i];
		if (!argContent || argContent.length === 0) continue;
		const value = (0, _unified_latex_unified_latex_util_print_raw.printRaw)(argContent).trim();
		if (value) return value;
	}
}
function extractTrailingWorkspace(bodyNodes) {
	const remainingBody = [...bodyNodes];
	while (remainingBody.length > 0 && isWhitespaceLike(remainingBody[remainingBody.length - 1])) remainingBody.pop();
	const lastNode = remainingBody[remainingBody.length - 1];
	if (!lastNode) return { bodyNodes: remainingBody };
	if (isVfillMacro(lastNode)) {
		remainingBody.pop();
		(0, _unified_latex_unified_latex_util_trim.trim)(remainingBody);
		return {
			bodyNodes: remainingBody,
			workspace: "1in"
		};
	}
	if (isVspaceMacro(lastNode)) {
		const workspace = getVspaceWorkspace(lastNode);
		if (!workspace) return { bodyNodes: remainingBody };
		remainingBody.pop();
		(0, _unified_latex_unified_latex_util_trim.trim)(remainingBody);
		return {
			bodyNodes: remainingBody,
			workspace
		};
	}
	if (lastNode.type !== "string") return { bodyNodes: remainingBody };
	let index = remainingBody.length - 2;
	while (index >= 0 && isWhitespaceLike(remainingBody[index])) index--;
	const macroNode = remainingBody[index];
	if (!macroNode || !_unified_latex_unified_latex_util_match.match.macro(macroNode, "vskip")) return { bodyNodes: remainingBody };
	const workspace = lastNode.content.trim();
	if (!workspace) return { bodyNodes: remainingBody };
	remainingBody.splice(index);
	(0, _unified_latex_unified_latex_util_trim.trim)(remainingBody);
	return {
		bodyNodes: remainingBody,
		workspace
	};
}
function getExamItemAttributes(node) {
	const pointsAttributes = getPointsAttribute(node);
	const { bodyNodes, workspace } = extractTrailingWorkspace(getItemBody(node));
	return {
		attributes: workspace ? {
			...pointsAttributes,
			workspace
		} : pointsAttributes,
		bodyNodes
	};
}
/**
* Tags that are solution-like (not part of the statement body).
* In PreTeXt, these are siblings of `<statement>`, not inside it.
*/
var SOLUTION_LIKE_TAGS = new Set([
	"html-tag:solution",
	"html-tag:answer",
	"html-tag:hint"
]);
function isSolutionLike(node) {
	return _unified_latex_unified_latex_util_match.match.anyMacro(node) && SOLUTION_LIKE_TAGS.has(node.content);
}
/**
* Split body nodes into statement content (before any solution-like nodes)
* and the solution-like nodes themselves (solution, answer, hint).
*/
function splitStatementFromSolutions(bodyNodes) {
	const firstSolutionIdx = bodyNodes.findIndex(isSolutionLike);
	if (firstSolutionIdx === -1) return {
		statementNodes: bodyNodes,
		solutionNodes: []
	};
	return {
		statementNodes: bodyNodes.slice(0, firstSolutionIdx),
		solutionNodes: bodyNodes.filter(isSolutionLike)
	};
}
/**
* Check whether a node is a converted `<task>` html-like element.
*/
function isTaskNode(node) {
	return _unified_latex_unified_latex_util_match.match.macro(node, "html-tag:task");
}
function isPageBreakNode(node) {
	return _unified_latex_unified_latex_util_match.match.macro(node, "newpage") || _unified_latex_unified_latex_util_match.match.macro(node, "clearpage");
}
/**
* Build a `<task>` element from an item macro (`\part` or `\subpart`).
* If the body contains converted sub-task nodes, the content before them
* becomes an `<introduction>` and the tasks follow directly.
* Otherwise the body is wrapped in a `<statement>`.
*/
function buildTask(itemMacro) {
	const { attributes, bodyNodes } = getExamItemAttributes(itemMacro);
	const firstTaskIndex = bodyNodes.findIndex(isTaskNode);
	if (firstTaskIndex === -1) {
		const { statementNodes, solutionNodes } = splitStatementFromSolutions(bodyNodes);
		return (0, _unified_latex_unified_latex_util_html_like.htmlLike)({
			tag: "task",
			attributes,
			content: [(0, _unified_latex_unified_latex_util_html_like.htmlLike)({
				tag: "statement",
				content: wrapPars(statementNodes)
			}), ...solutionNodes]
		});
	} else {
		const introNodes = bodyNodes.slice(0, firstTaskIndex);
		const taskNodes = bodyNodes.filter(isTaskNode);
		const content = [];
		(0, _unified_latex_unified_latex_util_trim.trim)(introNodes);
		if (introNodes.length > 0) content.push((0, _unified_latex_unified_latex_util_html_like.htmlLike)({
			tag: "introduction",
			content: wrapPars(introNodes)
		}));
		content.push(...taskNodes);
		return (0, _unified_latex_unified_latex_util_html_like.htmlLike)({
			tag: "task",
			attributes,
			content
		});
	}
}
/**
* Convert a `subsubparts` environment to an array of `<task>` html-like nodes.
*/
function subsubpartsToTasks(env) {
	return env.content.filter((node) => _unified_latex_unified_latex_util_match.match.macro(node, "subsubpart")).reduce((tasks, node) => {
		if (!_unified_latex_unified_latex_util_match.match.macro(node) || !node.args) return tasks;
		const { attributes, bodyNodes } = getExamItemAttributes(node);
		tasks.push((0, _unified_latex_unified_latex_util_html_like.htmlLike)({
			tag: "task",
			attributes,
			content: [(0, _unified_latex_unified_latex_util_html_like.htmlLike)({
				tag: "statement",
				content: wrapPars(bodyNodes)
			})]
		}));
		return tasks;
	}, []);
}
/**
* Convert a `subparts` environment to an array of `<task>` html-like nodes.
*/
function subpartsToTasks(env) {
	return env.content.filter((node) => _unified_latex_unified_latex_util_match.match.macro(node, "subpart")).reduce((tasks, node) => {
		if (!_unified_latex_unified_latex_util_match.match.macro(node) || !node.args) return tasks;
		tasks.push(buildTask(node));
		return tasks;
	}, []);
}
/**
* Convert a `parts` environment to an array of `<task>` html-like nodes.
*/
function partsToTasks(env) {
	return env.content.filter((node) => _unified_latex_unified_latex_util_match.match.macro(node, "part")).reduce((tasks, node) => {
		if (!_unified_latex_unified_latex_util_match.match.macro(node) || !node.args) return tasks;
		tasks.push(buildTask(node));
		return tasks;
	}, []);
}
/**
* Convert a `questions` environment to an `<exercises>` html-like node
* containing `<exercise>` elements.
*
* Each `\question` becomes an `<exercise>`. If the question body contains
* converted `<task>` nodes (from a nested `parts` environment), the content
* before them becomes an `<introduction>` and the tasks are placed directly
* inside the `<exercise>`. Otherwise the body is wrapped in a `<statement>`.
*/
function questionsToExercises(env, _info) {
	const titleArg = env.content.find((n) => _unified_latex_unified_latex_util_match.match.macro(n, "title"))?.args?.find((a) => a.openMark === "{");
	const titleElement = titleArg && titleArg.content.length > 0 ? (0, _unified_latex_unified_latex_util_html_like.htmlLike)({
		tag: "title",
		content: titleArg.content
	}) : void 0;
	function extractTrailingPageBreak(bodyNodes) {
		const remainingBody = [...bodyNodes];
		while (remainingBody.length > 0 && isWhitespaceLike(remainingBody[remainingBody.length - 1])) remainingBody.pop();
		const lastNode = remainingBody[remainingBody.length - 1];
		if (!lastNode || !isPageBreakNode(lastNode)) return {
			bodyNodes: remainingBody,
			breakAfter: false
		};
		remainingBody.pop();
		(0, _unified_latex_unified_latex_util_trim.trim)(remainingBody);
		return {
			bodyNodes: remainingBody,
			breakAfter: true
		};
	}
	function questionToExercise(node) {
		const { attributes, bodyNodes: rawBodyNodes } = getExamItemAttributes(node);
		const { bodyNodes, breakAfter } = extractTrailingPageBreak(rawBodyNodes);
		const firstTaskIndex = bodyNodes.findIndex(isTaskNode);
		let exerciseContent;
		if (firstTaskIndex === -1) {
			const { statementNodes, solutionNodes } = splitStatementFromSolutions(bodyNodes);
			exerciseContent = [(0, _unified_latex_unified_latex_util_html_like.htmlLike)({
				tag: "statement",
				content: wrapPars(statementNodes)
			}), ...solutionNodes];
		} else {
			const introNodes = bodyNodes.slice(0, firstTaskIndex);
			const taskNodes = bodyNodes.filter(isTaskNode);
			exerciseContent = [];
			(0, _unified_latex_unified_latex_util_trim.trim)(introNodes);
			if (introNodes.length > 0) exerciseContent.push((0, _unified_latex_unified_latex_util_html_like.htmlLike)({
				tag: "introduction",
				content: wrapPars(introNodes)
			}));
			exerciseContent.push(...taskNodes);
		}
		return {
			exercise: (0, _unified_latex_unified_latex_util_html_like.htmlLike)({
				tag: "exercise",
				attributes,
				content: exerciseContent
			}),
			breakAfter
		};
	}
	const convertedQuestions = env.content.reduce((items, node) => {
		if (!_unified_latex_unified_latex_util_match.match.macro(node, "question") || !node.args) return items;
		items.push(questionToExercise(node));
		return items;
	}, []);
	if (!convertedQuestions.some((question) => question.breakAfter)) {
		const exercises = convertedQuestions.map((question) => question.exercise);
		return (0, _unified_latex_unified_latex_util_html_like.htmlLike)({
			tag: "worksheet",
			content: titleElement ? [titleElement, ...exercises] : exercises
		});
	}
	const pages = [];
	let currentPageContent = [];
	const closePage = () => {
		pages.push((0, _unified_latex_unified_latex_util_html_like.htmlLike)({
			tag: "page",
			content: currentPageContent
		}));
		currentPageContent = [];
	};
	for (const question of convertedQuestions) {
		currentPageContent.push(question.exercise);
		if (question.breakAfter) closePage();
	}
	closePage();
	return (0, _unified_latex_unified_latex_util_html_like.htmlLike)({
		tag: "worksheet",
		content: titleElement ? [titleElement, ...pages] : pages
	});
}
/**
* Environment replacement rules for the exam documentclass.
*/
var examEnvironmentReplacements = {
	questions: questionsToExercises,
	parts: partsToTasks,
	subparts: subpartsToTasks,
	subsubparts: subsubpartsToTasks
};
var katex_support_default = {
	KATEX_MACROS: [
		" ",
		"!",
		"\"",
		"#",
		"&",
		"'",
		"*",
		",",
		".",
		":",
		";",
		"=",
		">",
		"AA",
		"AE",
		"Alpha",
		"And",
		"Arrowvert",
		"Bbb",
		"Bbbk",
		"Beta",
		"Big",
		"Bigg",
		"Biggl",
		"Biggm",
		"Biggr",
		"Bigl",
		"Bigm",
		"Bigr",
		"Box",
		"Bra",
		"Bumpeq",
		"C",
		"Cap",
		"Chi",
		"Colonapprox",
		"Coloneq",
		"Coloneqq",
		"Colonsim",
		"Complex",
		"Coppa",
		"Cup",
		"Dagger",
		"Darr",
		"DeclareMathOperator",
		"Delta",
		"Diamond",
		"Digamma",
		"Doteq",
		"Downarrow",
		"Epsilon",
		"Eqcolon",
		"Eqqcolon",
		"Eta",
		"Finv",
		"Game",
		"Gamma",
		"H",
		"Harr",
		"Huge",
		"Im",
		"Iota",
		"Join",
		"KaTeX",
		"Kappa",
		"Ket",
		"Koppa",
		"L",
		"LARGE",
		"LaTeX",
		"Lambda",
		"Large",
		"Larr",
		"LeftArrow",
		"Leftarrow",
		"Leftrightarrow",
		"Lleftarrow",
		"Longleftarrow",
		"Longleftrightarrow",
		"Longrightarrow",
		"Lrarr",
		"Lsh",
		"Mu",
		"N",
		"Newextarrow",
		"Nu",
		"O",
		"OE",
		"Omega",
		"Omicron",
		"Overrightarrow",
		"P",
		"Phi",
		"Pi",
		"Pr",
		"Psi",
		"Q",
		"R",
		"Rarr",
		"Re",
		"Reals",
		"Rho",
		"Rightarrow",
		"Rrightarrow",
		"Rsh",
		"Rule",
		"S",
		"Sampi",
		"Sigma",
		"Space",
		"Stigma",
		"Subset",
		"Supset",
		"Tau",
		"TeX",
		"Theta",
		"Tiny",
		"Uarr",
		"Uparrow",
		"Updownarrow",
		"Upsilon",
		"Vdash",
		"Vert",
		"Vvdash",
		"Xi",
		"Z",
		"Zeta",
		"\\",
		"^",
		"_",
		"`",
		"aa",
		"above",
		"abovewithdelims",
		"acute",
		"add",
		"ae",
		"alef",
		"alefsym",
		"aleph",
		"allowbreak",
		"alpha",
		"amalg",
		"and",
		"ang",
		"angl",
		"angle",
		"angln",
		"approx",
		"approxcolon",
		"approxcoloncolon",
		"approxeq",
		"arccos",
		"arcctg",
		"arcsin",
		"arctan",
		"arctg",
		"arg",
		"argmax",
		"argmin",
		"array",
		"arraystretch",
		"arrowvert",
		"ast",
		"asymp",
		"atop",
		"atopwithdelims",
		"backepsilon",
		"backprime",
		"backsim",
		"backsimeq",
		"backslash",
		"bar",
		"barwedge",
		"bbox",
		"bcancel",
		"because",
		"begin",
		"begingroup",
		"beta",
		"beth",
		"between",
		"bf",
		"bfseries",
		"big",
		"bigcap",
		"bigcirc",
		"bigcup",
		"bigg",
		"biggl",
		"biggm",
		"biggr",
		"bigl",
		"bigm",
		"bigodot",
		"bigominus",
		"bigoplus",
		"bigoslash",
		"bigotimes",
		"bigr",
		"bigsqcap",
		"bigsqcup",
		"bigstar",
		"bigtriangledown",
		"bigtriangleup",
		"biguplus",
		"bigvee",
		"bigwedge",
		"binom",
		"blacklozenge",
		"blacksquare",
		"blacktriangle",
		"blacktriangledown",
		"blacktriangleleft",
		"blacktriangleright",
		"bm",
		"bmod",
		"bold",
		"boldsymbol",
		"bot",
		"bowtie",
		"boxdot",
		"boxed",
		"boxminus",
		"boxplus",
		"boxtimes",
		"bra",
		"brace",
		"bracevert",
		"brack",
		"braket",
		"breve",
		"buildrel",
		"bull",
		"bullet",
		"bumpeq",
		"cal",
		"cancel",
		"cancelto",
		"cap",
		"cases",
		"cdot",
		"cdotp",
		"cdots",
		"ce",
		"cee",
		"centerdot",
		"cf",
		"cfrac",
		"ch",
		"char",
		"check",
		"checkmark",
		"chi",
		"chk",
		"choose",
		"circ",
		"circeq",
		"circlearrowleft",
		"circlearrowright",
		"circledR",
		"circledS",
		"circledast",
		"circledcirc",
		"circleddash",
		"class",
		"cline",
		"clubs",
		"clubsuit",
		"cnums",
		"colon",
		"colonapprox",
		"coloncolon",
		"coloncolonapprox",
		"coloncolonequals",
		"coloncolonminus",
		"coloncolonsim",
		"coloneq",
		"coloneqq",
		"colonequals",
		"colonminus",
		"colonsim",
		"color",
		"colorbox",
		"complement",
		"cong",
		"coppa",
		"coprod",
		"copyright",
		"cos",
		"cosec",
		"cosh",
		"cot",
		"cotg",
		"coth",
		"cr",
		"csc",
		"cssId",
		"ctg",
		"cth",
		"cup",
		"curlyeqprec",
		"curlyeqsucc",
		"curlyvee",
		"curlywedge",
		"curvearrowleft",
		"curvearrowright",
		"dArr",
		"dag",
		"dagger",
		"daleth",
		"darr",
		"dashleftarrow",
		"dashrightarrow",
		"dashv",
		"dbinom",
		"dblcolon",
		"ddag",
		"ddagger",
		"ddddot",
		"dddot",
		"ddot",
		"ddots",
		"def",
		"definecolor",
		"deg",
		"degree",
		"delta",
		"det",
		"dfrac",
		"diagdown",
		"diagup",
		"diamond",
		"diamonds",
		"diamondsuit",
		"digamma",
		"dim",
		"displaylines",
		"displaystyle",
		"div",
		"divideontimes",
		"dot",
		"doteq",
		"doteqdot",
		"dotplus",
		"dots",
		"dotsb",
		"dotsc",
		"dotsi",
		"dotsm",
		"dotso",
		"doublebarwedge",
		"doublecap",
		"doublecup",
		"downarrow",
		"downdownarrows",
		"downharpoonleft",
		"downharpoonright",
		"edef",
		"ell",
		"else",
		"em",
		"emph",
		"empty",
		"emptyset",
		"enclose",
		"end",
		"endgroup",
		"enspace",
		"epsilon",
		"eqalign",
		"eqalignno",
		"eqcirc",
		"eqcolon",
		"eqqcolon",
		"eqref",
		"eqsim",
		"eqslantgtr",
		"eqslantless",
		"equalscolon",
		"equalscoloncolon",
		"equiv",
		"eta",
		"eth",
		"euro",
		"exist",
		"exists",
		"exp",
		"expandafter",
		"fallingdotseq",
		"fbox",
		"fcolorbox",
		"fi",
		"flat",
		"foo",
		"footnotesize",
		"forall",
		"frac",
		"frak",
		"frown",
		"futurelet",
		"gamma",
		"gcd",
		"gdef",
		"ge",
		"geneuro",
		"geneuronarrow",
		"geneurowide",
		"genfrac",
		"geq",
		"geqq",
		"geqslant",
		"gets",
		"gg",
		"ggg",
		"gggtr",
		"gimel",
		"global",
		"gnapprox",
		"gneq",
		"gneqq",
		"gnsim",
		"grave",
		"greet",
		"gt",
		"gtrapprox",
		"gtrdot",
		"gtreqless",
		"gtreqqless",
		"gtrless",
		"gtrsim",
		"gvertneqq",
		"hArr",
		"hail",
		"harr",
		"hat",
		"hbar",
		"hbox",
		"hdashline",
		"hearts",
		"heartsuit",
		"hfil",
		"hfill",
		"hline",
		"hom",
		"hookleftarrow",
		"hookrightarrow",
		"hphantom",
		"href",
		"hskip",
		"hslash",
		"hspace",
		"htmlClass",
		"htmlData",
		"htmlId",
		"htmlStyle",
		"huge",
		"i",
		"iddots",
		"idotsint",
		"if",
		"iff",
		"ifmode",
		"ifx",
		"iiiint",
		"iiint",
		"iint",
		"image",
		"imageof",
		"imath",
		"impliedby",
		"implies",
		"in",
		"includegraphics",
		"inf",
		"infin",
		"infty",
		"injlim",
		"int",
		"intercal",
		"intop",
		"iota",
		"isin",
		"it",
		"itshape",
		"j",
		"jmath",
		"kappa",
		"ker",
		"kern",
		"ket",
		"koppa",
		"l",
		"lArr",
		"lBrace",
		"lVert",
		"label",
		"lambda",
		"land",
		"lang",
		"langle",
		"large",
		"larr",
		"lbrace",
		"lbrack",
		"lceil",
		"ldotp",
		"ldots",
		"le",
		"leadsto",
		"left",
		"leftarrow",
		"leftarrowtail",
		"leftharpoondown",
		"leftharpoonup",
		"leftleftarrows",
		"leftrightarrow",
		"leftrightarrows",
		"leftrightharpoons",
		"leftrightsquigarrow",
		"leftroot",
		"leftthreetimes",
		"leq",
		"leqalignno",
		"leqq",
		"leqslant",
		"lessapprox",
		"lessdot",
		"lesseqgtr",
		"lesseqqgtr",
		"lessgtr",
		"lesssim",
		"let",
		"lfloor",
		"lg",
		"lgroup",
		"lhd",
		"lim",
		"liminf",
		"limits",
		"limsup",
		"ll",
		"llap",
		"llbracket",
		"llcorner",
		"lll",
		"llless",
		"lmoustache",
		"ln",
		"lnapprox",
		"lneq",
		"lneqq",
		"lnot",
		"lnsim",
		"log",
		"long",
		"longleftarrow",
		"longleftrightarrow",
		"longmapsto",
		"longrightarrow",
		"looparrowleft",
		"looparrowright",
		"lor",
		"lower",
		"lozenge",
		"lparen",
		"lq",
		"lrArr",
		"lrarr",
		"lrcorner",
		"lt",
		"ltimes",
		"lvert",
		"lvertneqq",
		"maltese",
		"mapsto",
		"mathbb",
		"mathbf",
		"mathbin",
		"mathcal",
		"mathchoice",
		"mathclap",
		"mathclose",
		"mathellipsis",
		"mathfrak",
		"mathinner",
		"mathit",
		"mathllap",
		"mathnormal",
		"mathop",
		"mathopen",
		"mathord",
		"mathpunct",
		"mathrel",
		"mathring",
		"mathrlap",
		"mathrm",
		"mathscr",
		"mathsf",
		"mathsterling",
		"mathstrut",
		"mathtip",
		"mathtt",
		"matrix",
		"max",
		"mbox",
		"md",
		"mdseries",
		"measuredangle",
		"medspace",
		"mho",
		"mid",
		"middle",
		"min",
		"minuscolon",
		"minuscoloncolon",
		"minuso",
		"mit",
		"mkern",
		"mmlToken",
		"mod",
		"models",
		"moveleft",
		"moveright",
		"mp",
		"mskip",
		"mspace",
		"mu",
		"multicolumn",
		"multimap",
		"nLeftarrow",
		"nLeftrightarrow",
		"nRightarrow",
		"nVDash",
		"nVdash",
		"nabla",
		"natnums",
		"natural",
		"ncong",
		"ne",
		"nearrow",
		"neg",
		"negmedspace",
		"negthickspace",
		"negthinspace",
		"neq",
		"newcommand",
		"newenvironment",
		"newline",
		"nexists",
		"ngeq",
		"ngeqq",
		"ngeqslant",
		"ngtr",
		"ni",
		"nleftarrow",
		"nleftrightarrow",
		"nleq",
		"nleqq",
		"nleqslant",
		"nless",
		"nmid",
		"nobreak",
		"nobreakspace",
		"noexpand",
		"nolimits",
		"nonumber",
		"normalfont",
		"normalsize",
		"not",
		"notag",
		"notin",
		"notni",
		"nparallel",
		"nprec",
		"npreceq",
		"nrightarrow",
		"nshortmid",
		"nshortparallel",
		"nsim",
		"nsubseteq",
		"nsubseteqq",
		"nsucc",
		"nsucceq",
		"nsupseteq",
		"nsupseteqq",
		"ntriangleleft",
		"ntrianglelefteq",
		"ntriangleright",
		"ntrianglerighteq",
		"nu",
		"nvDash",
		"nvdash",
		"nwarrow",
		"o",
		"odot",
		"oe",
		"officialeuro",
		"oiiint",
		"oiint",
		"oint",
		"oldstyle",
		"omega",
		"omicron",
		"ominus",
		"operatorname",
		"operatornamewithlimits",
		"oplus",
		"or",
		"origof",
		"oslash",
		"otimes",
		"over",
		"overbrace",
		"overbracket",
		"overgroup",
		"overleftarrow",
		"overleftharpoon",
		"overleftrightarrow",
		"overline",
		"overlinesegment",
		"overparen",
		"overrightarrow",
		"overrightharpoon",
		"overset",
		"overwithdelims",
		"owns",
		"pagecolor",
		"parallel",
		"part",
		"partial",
		"perp",
		"phantom",
		"phase",
		"phi",
		"pi",
		"pitchfork",
		"plim",
		"plusmn",
		"pm",
		"pmatrix",
		"pmb",
		"pmod",
		"pod",
		"pounds",
		"prec",
		"precapprox",
		"preccurlyeq",
		"preceq",
		"precnapprox",
		"precneqq",
		"precnsim",
		"precsim",
		"prime",
		"prod",
		"projlim",
		"propto",
		"providecommand",
		"psi",
		"pu",
		"qquad",
		"quad",
		"r",
		"rArr",
		"rBrace",
		"rVert",
		"raise",
		"raisebox",
		"rang",
		"rangle",
		"rarr",
		"ratio",
		"rbrace",
		"rbrack",
		"rceil",
		"real",
		"reals",
		"ref",
		"relax",
		"renewcommand",
		"renewenvironment",
		"require",
		"restriction",
		"rfloor",
		"rgroup",
		"rhd",
		"rho",
		"right",
		"rightarrow",
		"rightarrowtail",
		"rightharpoondown",
		"rightharpoonup",
		"rightleftarrows",
		"rightleftharpoons",
		"rightrightarrows",
		"rightsquigarrow",
		"rightthreetimes",
		"risingdotseq",
		"rlap",
		"rm",
		"rmoustache",
		"root",
		"rotatebox",
		"rparen",
		"rq",
		"rrbracket",
		"rtimes",
		"rule",
		"rvert",
		"sampi",
		"sc",
		"scalebox",
		"scr",
		"scriptscriptstyle",
		"scriptsize",
		"scriptstyle",
		"sdot",
		"searrow",
		"sec",
		"sect",
		"setlength",
		"setminus",
		"sf",
		"sh",
		"sharp",
		"shortmid",
		"shortparallel",
		"shoveleft",
		"shoveright",
		"sideset",
		"sigma",
		"sim",
		"simcolon",
		"simcoloncolon",
		"simeq",
		"sin",
		"sinh",
		"sixptsize",
		"skew",
		"skip",
		"sl",
		"small",
		"smallfrown",
		"smallint",
		"smallsetminus",
		"smallsmile",
		"smash",
		"smile",
		"smiley",
		"sout",
		"space",
		"spades",
		"spadesuit",
		"sphericalangle",
		"sqcap",
		"sqcup",
		"sqrt",
		"sqsubset",
		"sqsubseteq",
		"sqsupset",
		"sqsupseteq",
		"square",
		"ss",
		"stackrel",
		"star",
		"stigma",
		"strut",
		"style",
		"sub",
		"sube",
		"subset",
		"subseteq",
		"subseteqq",
		"subsetneq",
		"subsetneqq",
		"substack",
		"succ",
		"succapprox",
		"succcurlyeq",
		"succeq",
		"succnapprox",
		"succneqq",
		"succnsim",
		"succsim",
		"sum",
		"sup",
		"supe",
		"supset",
		"supseteq",
		"supseteqq",
		"supsetneq",
		"supsetneqq",
		"surd",
		"swarrow",
		"tag",
		"tan",
		"tanh",
		"tau",
		"tbinom",
		"text",
		"textasciicircum",
		"textasciitilde",
		"textbackslash",
		"textbar",
		"textbardbl",
		"textbf",
		"textbraceleft",
		"textbraceright",
		"textcircled",
		"textcolor",
		"textdagger",
		"textdaggerdbl",
		"textdegree",
		"textdollar",
		"textellipsis",
		"textemdash",
		"textendash",
		"textgreater",
		"textit",
		"textless",
		"textmd",
		"textnormal",
		"textquotedblleft",
		"textquotedblright",
		"textquoteleft",
		"textquoteright",
		"textregistered",
		"textrm",
		"textsc",
		"textsf",
		"textsl",
		"textsterling",
		"textstyle",
		"texttip",
		"texttt",
		"textunderscore",
		"textup",
		"textvisiblespace",
		"tfrac",
		"tg",
		"th",
		"therefore",
		"theta",
		"thetasym",
		"thickapprox",
		"thicksim",
		"thickspace",
		"thinspace",
		"tilde",
		"times",
		"tiny",
		"to",
		"toggle",
		"top",
		"triangle",
		"triangledown",
		"triangleleft",
		"trianglelefteq",
		"triangleq",
		"triangleright",
		"trianglerighteq",
		"tt",
		"twoheadleftarrow",
		"twoheadrightarrow",
		"u",
		"uArr",
		"uarr",
		"ulcorner",
		"underbar",
		"underbrace",
		"underbracket",
		"undergroup",
		"underleftarrow",
		"underleftrightarrow",
		"underline",
		"underlinesegment",
		"underparen",
		"underrightarrow",
		"underset",
		"unicode",
		"unlhd",
		"unrhd",
		"up",
		"uparrow",
		"updownarrow",
		"upharpoonleft",
		"upharpoonright",
		"uplus",
		"uproot",
		"upshape",
		"upsilon",
		"upuparrows",
		"urcorner",
		"url",
		"utilde",
		"v",
		"vDash",
		"varDelta",
		"varGamma",
		"varLambda",
		"varOmega",
		"varPhi",
		"varPi",
		"varPsi",
		"varSigma",
		"varTheta",
		"varUpsilon",
		"varXi",
		"varcoppa",
		"varepsilon",
		"varinjlim",
		"varkappa",
		"varliminf",
		"varlimsup",
		"varnothing",
		"varphi",
		"varpi",
		"varprojlim",
		"varpropto",
		"varrho",
		"varsigma",
		"varstigma",
		"varsubsetneq",
		"varsubsetneqq",
		"varsupsetneq",
		"varsupsetneqq",
		"vartheta",
		"vartriangle",
		"vartriangleleft",
		"vartriangleright",
		"vcentcolon",
		"vcenter",
		"vdash",
		"vdots",
		"vec",
		"vee",
		"veebar",
		"vert",
		"vfil",
		"vfill",
		"vline",
		"vphantom",
		"wedge",
		"weierp",
		"widecheck",
		"widehat",
		"wideparen",
		"widetilde",
		"wp",
		"wr",
		"xLeftarrow",
		"xLeftrightarrow",
		"xRightarrow",
		"xcancel",
		"xdef",
		"xhookleftarrow",
		"xhookrightarrow",
		"xi",
		"xleftarrow",
		"xleftharpoondown",
		"xleftharpoonup",
		"xleftrightarrow",
		"xleftrightharpoons",
		"xlongequal",
		"xmapsto",
		"xrightarrow",
		"xrightharpoondown",
		"xrightharpoonup",
		"xrightleftharpoons",
		"xtofrom",
		"xtwoheadleftarrow",
		"xtwoheadrightarrow",
		"yen",
		"zeta",
		"{",
		"|",
		"}",
		"~"
	],
	KATEX_ENVIRONMENTS: [
		"align",
		"align*",
		"alignat",
		"alignat*",
		"aligned",
		"alignedat",
		"array",
		"Bmatrix",
		"bmatrix",
		"Bmatrix*",
		"bmatrix*",
		"cases",
		"CD",
		"darray",
		"dcases",
		"drcases",
		"equation",
		"equation*",
		"gather",
		"gathered",
		"matrix",
		"matrix*",
		"pmatrix",
		"pmatrix*",
		"rcases",
		"smallmatrix",
		"split",
		"Vmatrix",
		"vmatrix",
		"Vmatrix*",
		"vmatrix*"
	]
};
//#endregion
//#region libs/pre-conversion-subs/katex-subs.ts
var LEFT = {
	type: "macro",
	content: "left"
};
var RIGHT = {
	type: "macro",
	content: "right"
};
var DEFAULT_LEFT_DELIM = {
	type: "macro",
	content: "{"
};
var DEFAULT_RIGHT_DELIM = {
	type: "string",
	content: "."
};
var mathjaxSpecificMacroReplacements = {
	systeme: (node) => {
		try {
			const args = (0, _unified_latex_unified_latex_util_arguments.getArgsContent)(node);
			const whitelistedVariables = args[1] || void 0;
			const ret = (0, _unified_latex_unified_latex_ctan_package_systeme.systemeContentsToArray)(args[3] || [], {
				properSpacing: false,
				whitelistedVariables
			});
			if (node?._renderInfo?.sysdelims) {
				const [frontDelim, backDelim] = node._renderInfo?.sysdelims;
				return [
					LEFT,
					...frontDelim || [],
					ret,
					RIGHT,
					...backDelim || []
				];
			}
			return [
				LEFT,
				DEFAULT_LEFT_DELIM,
				ret,
				RIGHT,
				DEFAULT_RIGHT_DELIM
			];
		} catch (e) {
			return node;
		}
	},
	sysdelim: () => []
};
var mathjaxSpecificEnvironmentReplacements = {};
/**
* Attach `renderInfo` needed for converting some macros into their
* mathjax equivalents.
*/
function attachNeededRenderInfo(ast) {
	(0, _unified_latex_unified_latex_ctan_package_systeme.attachSystemeSettingsAsRenderInfo)(ast);
}
var KATEX_SUPPORT = {
	macros: katex_support_default["KATEX_MACROS"],
	environments: katex_support_default["KATEX_ENVIRONMENTS"]
};
//#endregion
//#region libs/pre-conversion-subs/macro-subs.ts
/**
* Factory function that generates html-like macros that wrap their contents.
* warningMessage is a warning for any latex macros that don't have an equivalent
* pretext tag.
*/
function factory$1(tag, warningMessage = "", attributes) {
	return (macro, info, file) => {
		if (!macro.args) throw new Error(`Found macro to replace but couldn't find content ${(0, _unified_latex_unified_latex_util_print_raw.printRaw)(macro)}`);
		if (warningMessage && file) {
			const message = makeWarningMessage(macro, `Warning: There is no equivalent tag for \"${macro.content}\", \"${tag}\" was used as a replacement.`, "macro-subs");
			file.message(message, message.place, message.source);
		}
		const args = (0, _unified_latex_unified_latex_util_arguments.getArgsContent)(macro);
		return (0, _unified_latex_unified_latex_util_html_like.htmlLike)({
			tag,
			content: args[args.length - 1] || [],
			attributes
		});
	};
}
function createHeading(tag, attrs = {}) {
	return (macro) => {
		const args = (0, _unified_latex_unified_latex_util_arguments.getArgsContent)(macro);
		const attributes = {};
		if (attrs) Object.assign(attributes, attrs);
		return (0, _unified_latex_unified_latex_util_html_like.htmlLike)({
			tag,
			content: args[args.length - 1] || [],
			attributes
		});
	};
}
var macroReplacements = {
	emph: factory$1("em"),
	textrm: factory$1("em", `Warning: There is no equivalent tag for \"textrm\", \"em\" was used as a replacement.`),
	textsf: factory$1("em", `Warning: There is no equivalent tag for \"textsf\", \"em\" was used as a replacement.`),
	texttt: factory$1("em", `Warning: There is no equivalent tag for \"textsf\", \"em\" was used as a replacement.`),
	textsl: factory$1("em", `Warning: There is no equivalent tag for \"textsl\", \"em\" was used as a replacement.`),
	textit: factory$1("em"),
	textbf: factory$1("alert"),
	term: factory$1("term"),
	underline: factory$1("em", `Warning: There is no equivalent tag for \"underline\", \"em\" was used as a replacement.`),
	mbox: emptyStringWithWarningFactory(`Warning: There is no equivalent tag for \"mbox\", an empty Ast.String was used as a replacement.`),
	phantom: emptyStringWithWarningFactory(`Warning: There is no equivalent tag for \"phantom\", an empty Ast.String was used as a replacement.`),
	appendix: createHeading("appendix"),
	url: (node) => {
		const url = (0, _unified_latex_unified_latex_util_print_raw.printRaw)((0, _unified_latex_unified_latex_util_arguments.getArgsContent)(node)[0] || "#");
		return (0, _unified_latex_unified_latex_util_html_like.htmlLike)({
			tag: "url",
			attributes: { href: url },
			content: [{
				type: "string",
				content: url
			}]
		});
	},
	href: (node) => {
		const args = (0, _unified_latex_unified_latex_util_arguments.getArgsContent)(node);
		return (0, _unified_latex_unified_latex_util_html_like.htmlLike)({
			tag: "url",
			attributes: { href: (0, _unified_latex_unified_latex_util_print_raw.printRaw)(args[1] || "#") },
			content: args[2] || []
		});
	},
	hyperref: (node) => {
		const args = (0, _unified_latex_unified_latex_util_arguments.getArgsContent)(node);
		return (0, _unified_latex_unified_latex_util_html_like.htmlLike)({
			tag: "url",
			attributes: { href: "#" + (0, _unified_latex_unified_latex_util_print_raw.printRaw)(args[0] || "") },
			content: args[1] || []
		});
	},
	ref: (node) => {
		return (0, _unified_latex_unified_latex_util_html_like.htmlLike)({
			tag: "xref",
			attributes: { ref: sanitizeXmlId((0, _unified_latex_unified_latex_util_print_raw.printRaw)((0, _unified_latex_unified_latex_util_arguments.getArgsContent)(node)[1] || "")) || "" }
		});
	},
	eqref: (node) => {
		return (0, _unified_latex_unified_latex_util_html_like.htmlLike)({
			tag: "xref",
			attributes: { ref: sanitizeXmlId((0, _unified_latex_unified_latex_util_print_raw.printRaw)((0, _unified_latex_unified_latex_util_arguments.getArgsContent)(node)[0] || "")) || "" }
		});
	},
	cref: (node) => {
		return (0, _unified_latex_unified_latex_util_html_like.htmlLike)({
			tag: "xref",
			attributes: { ref: sanitizeXmlId((0, _unified_latex_unified_latex_util_print_raw.printRaw)((0, _unified_latex_unified_latex_util_arguments.getArgsContent)(node)[1] || "")) || "" }
		});
	},
	Cref: (node) => {
		return (0, _unified_latex_unified_latex_util_html_like.htmlLike)({
			tag: "xref",
			attributes: { ref: sanitizeXmlId((0, _unified_latex_unified_latex_util_print_raw.printRaw)((0, _unified_latex_unified_latex_util_arguments.getArgsContent)(node)[1] || "")) || "" }
		});
	},
	cite: (node) => {
		return (0, _unified_latex_unified_latex_util_html_like.htmlLike)({
			tag: "xref",
			attributes: { ref: sanitizeXmlId((0, _unified_latex_unified_latex_util_print_raw.printRaw)((0, _unified_latex_unified_latex_util_arguments.getArgsContent)(node)[1] || "")) || "" }
		});
	},
	index: (node) => {
		return (0, _unified_latex_unified_latex_util_html_like.htmlLike)({
			tag: "idx",
			content: (0, _unified_latex_unified_latex_util_html_like.htmlLike)({
				tag: "h",
				content: (0, _unified_latex_unified_latex_util_arguments.getArgsContent)(node)[0] || []
			})
		});
	},
	"\\": emptyStringWithWarningFactory(`Warning: There is no equivalent tag for \"\\\", an empty Ast.String was used as a replacement.`),
	vspace: emptyStringWithWarningFactory(`Warning: There is no equivalent tag for \"vspace\", an empty Ast.String was used as a replacement.`),
	hspace: emptyStringWithWarningFactory(`Warning: There is no equivalent tag for \"hspace\", an empty Ast.String was used as a replacement.`),
	textcolor: factory$1("em", `Warning: There is no equivalent tag for \"textcolor\", \"em\" was used as a replacement.`),
	textsize: emptyStringWithWarningFactory(`Warning: There is no equivalent tag for \"textsize\", an empty Ast.String was used as a replacement.`),
	makebox: emptyStringWithWarningFactory(`Warning: There is no equivalent tag for \"makebox\", an empty Ast.String was used as a replacement.`),
	noindent: emptyStringWithWarningFactory(`Warning: There is no equivalent tag for \"noindent\", an empty Ast.String was used as a replacement.`),
	latex: (node) => {
		return (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "latex" });
	},
	latexe: (node) => {
		return (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "latex" });
	},
	today: (node) => {
		return (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "today" });
	},
	tex: (node) => {
		return (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "tex" });
	},
	eg: () => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "eg" }),
	ie: () => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "ie" }),
	etc: () => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "etc" }),
	XeTeX: () => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "xetex" }),
	XeLaTeX: () => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "xelatex" }),
	LuaTeX: () => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "luatex" }),
	PreTeXt: () => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "pretext" }),
	PreFigure: () => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "prefigure" }),
	AD: () => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "ad" }),
	BC: () => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "bc" }),
	AM: () => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "am" }),
	PM: () => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "pm" }),
	nb: () => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "nb" }),
	ps: () => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "ps" }),
	vs: () => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "vs" }),
	viz: () => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "viz" }),
	etal: () => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "etal" }),
	circa: () => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "ca" }),
	ca: () => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "ca" }),
	timeofday: () => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "timeofday" }),
	code: factory$1("c"),
	lstinline: factory$1("c"),
	fn: factory$1("fn"),
	footnote: factory$1("fn"),
	q: factory$1("q"),
	sq: factory$1("sq"),
	enquote: factory$1("q"),
	enquotestar: factory$1("sq"),
	abbr: factory$1("abbr"),
	ac: factory$1("acro"),
	acro: factory$1("acro"),
	init: factory$1("init"),
	foreign: factory$1("foreign"),
	foreignlanguage: factory$1("foreign"),
	booktitle: factory$1("pubtitle"),
	pubtitle: factory$1("pubtitle"),
	articletitle: factory$1("articletitle"),
	xmltag: factory$1("tag"),
	xmlattr: factory$1("attr"),
	taxon: factory$1("taxon"),
	kbd: factory$1("kbd"),
	icon: factory$1("icon"),
	fillin: () => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "fillin" }),
	sout: factory$1("delete"),
	insert: factory$1("insert"),
	stale: factory$1("stale"),
	mdash: () => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "mdash" }),
	ndash: () => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "ndash" }),
	nbsp: () => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "nbsp" }),
	P: () => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "pilcrow" }),
	S: () => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "section-mark" }),
	copyright: () => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "copyright" }),
	registered: () => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "registered" }),
	trademark: () => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "trademark" }),
	degree: () => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "degree" }),
	textdegree: () => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "degree" }),
	dagger: () => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "dagger" }),
	ddagger: () => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "dagger" }),
	ldots: () => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "ellipsis" }),
	dots: () => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "ellipsis" }),
	textpm: () => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "plusminus" }),
	textregistered: () => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "registered" }),
	texttrademark: () => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "trademark" }),
	textsection: () => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "section-mark" }),
	textpilcrow: () => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "pilcrow" }),
	textperiodcentered: () => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "midpoint" }),
	texttildelow: () => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "swungdash" }),
	textperthousand: () => (0, _unified_latex_unified_latex_util_html_like.htmlLike)({ tag: "permille" }),
	includegraphics: (node) => {
		const args = (0, _unified_latex_unified_latex_util_arguments.getArgsContent)(node);
		return (0, _unified_latex_unified_latex_util_html_like.htmlLike)({
			tag: "image",
			attributes: { source: (0, _unified_latex_unified_latex_util_print_raw.printRaw)(args[args.length - 1] || []) },
			content: []
		});
	},
	caption: (node, parent) => {
		const args = (0, _unified_latex_unified_latex_util_arguments.getArgsContent)(node);
		const captionText = (0, _unified_latex_unified_latex_util_arguments.getNamedArgsContent)(node)["captionText"] || args[args.length - 1] || [];
		return (0, _unified_latex_unified_latex_util_html_like.htmlLike)({
			tag: parent?.parents?.some((ancestor) => ancestor.type === "macro" && ancestor.content === "html-tag:table") ?? false ? "title" : "caption",
			content: captionText
		});
	}
};
//#endregion
//#region libs/pre-conversion-subs/streaming-command-subs.ts
/**
* Factory function that generates a macro with bound arguments.
*
* e.g.
* ```
* factory("foo")("bar") -> `\foo{bar}`
* ```
*
* ```
* factory("foo", "baz")("bar") -> `\foo{baz}{bar}`
* ```
*/
function factory(macroName, ...boundArgs) {
	return (content, originalCommand) => {
		return (0, _unified_latex_unified_latex_builder.m)(macroName, boundArgs.map((a) => (0, _unified_latex_unified_latex_builder.arg)(a)).concat((0, _unified_latex_unified_latex_builder.arg)(content)));
	};
}
var streamingMacroReplacements = {
	color: _unified_latex_unified_latex_ctan_package_xcolor.colorToTextcolorMacro,
	bfseries: factory("textbf"),
	itshape: factory("textit"),
	rmfamily: factory("textrm"),
	scshape: factory("textsc"),
	sffamily: factory("textsf"),
	slshape: factory("textsl"),
	ttfamily: factory("texttt"),
	Huge: factory("textsize", "Huge"),
	huge: factory("textsize", "huge"),
	LARGE: factory("textsize", "LARGE"),
	Large: factory("textsize", "Large"),
	large: factory("textsize", "large"),
	normalsize: factory("textsize", "normalsize"),
	small: factory("textsize", "small"),
	footnotesize: factory("textsize", "footnotesize"),
	scriptsize: factory("textsize", "scriptsize"),
	tiny: factory("textsize", "tiny")
};
//#endregion
//#region libs/unified-latex-wrap-pars.ts
/**
* Unified plugin to wrap paragraphs in `\html-tag:p{...}` macros.
* Because `-` and `:` cannot occur in regular macros, there is no risk of
* a conflict.
*/
var unifiedLatexWrapPars = function unifiedLatexWrapPars(options) {
	const { macrosThatBreakPars, environmentsThatDontBreakPars } = options || {};
	return (tree) => {
		let hasDocumentEnv = false;
		(0, _unified_latex_unified_latex_util_visit.visit)(tree, (env) => {
			if (_unified_latex_unified_latex_util_match.match.environment(env, "document") || isMappedEnviron(env)) {
				if (_unified_latex_unified_latex_util_match.match.environment(env, "document")) hasDocumentEnv = true;
				env.content = wrapPars(env.content, {
					macrosThatBreakPars,
					environmentsThatDontBreakPars
				});
			}
		}, { test: _unified_latex_unified_latex_util_match.match.anyEnvironment });
		if (!hasDocumentEnv) tree.content = wrapPars(tree.content, {
			macrosThatBreakPars,
			environmentsThatDontBreakPars
		});
	};
};
//#endregion
//#region libs/pre-conversion-subs/report-unsupported-macro-mathjax.ts
/**
* Return a list of macros used in ast that are unsupported by KaTeX
*/
function reportMacrosUnsupportedByMathjax(ast) {
	const unsupported = { messages: [] };
	const isSupported = _unified_latex_unified_latex_util_match.match.createMacroMatcher(KATEX_SUPPORT.macros);
	(0, _unified_latex_unified_latex_util_visit.visit)(ast, (node, info) => {
		if ((0, _unified_latex_unified_latex_util_match.anyMacro)(node) && info.context.hasMathModeAncestor) {
			if (!isSupported(node)) unsupported.messages.push(makeWarningMessage(node, `Warning: \"${node.content}\" is unsupported by Katex.`, "report-unsupported-macro-katex"));
		}
	});
	return unsupported;
}
//#endregion
//#region libs/unified-latex-plugin-to-pretext-like.ts
/**
* Unified plugin to convert a `unified-latex` AST into an html-like AST. This replaces nodes
* with html-like macros `\html-tag:p{...}`, etc. macros. It is a step along the way to converting to HTML.
* **It is unlikely you want to use this plugin directly**.
*
* Note: this plugin only wraps paragraphs in `p` tags if there are multiple paragraphs. Otherwise it omits the <p> tags.
*/
var unifiedLatexToPretextLike = function unifiedLatexToHtmlLike(options) {
	const macroReplacements$1 = Object.assign({}, macroReplacements, options?.macroReplacements || {});
	const environmentReplacements$1 = Object.assign({}, environmentReplacements, examEnvironmentReplacements, options?.environmentReplacements || {});
	const producePretextFragment = options?.producePretextFragment ? options?.producePretextFragment : false;
	const isReplaceableMacro = _unified_latex_unified_latex_util_match.match.createMacroMatcher(macroReplacements$1);
	const isReplaceableEnvironment = _unified_latex_unified_latex_util_match.match.createEnvironmentMatcher(environmentReplacements$1);
	const isMathjaxMacro = _unified_latex_unified_latex_util_match.match.createMacroMatcher(mathjaxSpecificMacroReplacements);
	const isMathjaxEnvironment = _unified_latex_unified_latex_util_match.match.createEnvironmentMatcher(mathjaxSpecificEnvironmentReplacements);
	return (tree, file) => {
		const originalTree = tree;
		(0, _unified_latex_unified_latex_util_comments.deleteComments)(tree);
		let processor = unified().use(_unified_latex_unified_latex_lint_rules_unified_latex_lint_no_tex_font_shaping_commands.unifiedLatexLintNoTexFontShapingCommands, { fix: true }).use(_unified_latex_unified_latex_util_replace.unifiedLatexReplaceStreamingCommands, { replacers: streamingMacroReplacements });
		const warningMessages = breakOnBoundaries(tree);
		for (const warningMessage of warningMessages.messages) file.message(warningMessage, warningMessage.place, "unified-latex-to-pretext:break-on-boundaries");
		attachAdditionalAttributes(tree);
		if (shouldBeWrappedInPars(tree)) processor = processor.use(unifiedLatexWrapPars);
		tree = processor.runSync(tree, file);
		(0, _unified_latex_unified_latex_util_replace.replaceNode)(tree, (node, info) => {
			if (info.context.hasMathModeAncestor) return;
			if (isReplaceableEnvironment(node)) return environmentReplacements$1[(0, _unified_latex_unified_latex_util_print_raw.printRaw)(node.env)](node, info, file);
		});
		(0, _unified_latex_unified_latex_util_replace.replaceNode)(tree, (node, info) => {
			if (info.context.hasMathModeAncestor) return;
			if (isReplaceableMacro(node)) return macroReplacements$1[node.content](node, info, file);
		});
		const unsupportedByMathjax = reportMacrosUnsupportedByMathjax(tree);
		for (const warningMessage of unsupportedByMathjax.messages) file.message(warningMessage, warningMessage.place, "unified-latex-to-pretext:report-unsupported-macro-mathjax");
		attachNeededRenderInfo(tree);
		(0, _unified_latex_unified_latex_util_replace.replaceNode)(tree, (node) => {
			if (isMathjaxMacro(node)) return mathjaxSpecificMacroReplacements[node.content](node);
			if (isMathjaxEnvironment(node)) return mathjaxSpecificEnvironmentReplacements[(0, _unified_latex_unified_latex_util_print_raw.printRaw)(node.env)](node);
		});
		if (!producePretextFragment) {
			createValidPretextDoc(tree);
			tree.content = [(0, _unified_latex_unified_latex_util_html_like.htmlLike)({
				tag: "pretext",
				content: tree.content
			})];
		}
		originalTree.content = tree.content;
	};
};
/**
* Does the content contain multiple paragraphs? If so, it should be wrapped in `p` tags.
*/
function shouldBeWrappedInPars(tree) {
	let content = tree.content;
	(0, _unified_latex_unified_latex_util_visit.visit)(tree, (env) => {
		if (_unified_latex_unified_latex_util_match.match.anyEnvironment(env)) {
			content = env.content;
			return _unified_latex_unified_latex_util_visit.EXIT;
		}
	}, { test: (node) => _unified_latex_unified_latex_util_match.match.environment(node, "document") });
	return containsPar(content);
}
function containsPar(content) {
	return content.some((node) => {
		if (isMappedEnviron(node)) return containsPar(node.content);
		return _unified_latex_unified_latex_util_match.match.parbreak(node) || _unified_latex_unified_latex_util_match.match.macro(node, "par");
	});
}
/**
* Wrap the tree content in a book or article tag.
*/
function createValidPretextDoc(tree) {
	let isBook = false;
	const docClass = findMacro(tree, "documentclass");
	if (docClass) {
		const docClassArg = (0, _unified_latex_unified_latex_util_arguments.getArgsContent)(docClass)[0];
		if (docClassArg) {
			const docClassTitle = docClassArg[0];
			if (docClassTitle.content == "book" || docClassTitle.content == "memoir") isBook = true;
		}
	}
	if (!isBook) (0, _unified_latex_unified_latex_util_visit.visit)(tree, (node) => {
		if ((0, _unified_latex_unified_latex_util_match.anyEnvironment)(node) && node.env == "_chapter") {
			isBook = true;
			return _unified_latex_unified_latex_util_visit.EXIT;
		}
	});
	const title = findMacro(tree, "title");
	if (title) {
		const titleArg = (0, _unified_latex_unified_latex_util_arguments.getArgsContent)(title)[1];
		if (titleArg) {
			tree.content.unshift((0, _unified_latex_unified_latex_util_html_like.htmlLike)({
				tag: "title",
				content: titleArg
			}));
			(0, _unified_latex_unified_latex_util_replace.replaceNode)(tree, (node) => {
				if (node === title) return [];
			});
		} else tree.content.unshift((0, _unified_latex_unified_latex_util_html_like.htmlLike)({
			tag: "title",
			content: (0, _unified_latex_unified_latex_builder.s)("")
		}));
	} else tree.content.unshift((0, _unified_latex_unified_latex_util_html_like.htmlLike)({
		tag: "title",
		content: (0, _unified_latex_unified_latex_builder.s)("")
	}));
	if (isBook) tree.content = [(0, _unified_latex_unified_latex_util_html_like.htmlLike)({
		tag: "book",
		content: tree.content
	})];
	else tree.content = [(0, _unified_latex_unified_latex_util_html_like.htmlLike)({
		tag: "article",
		content: tree.content
	})];
}
/**
* Look for nearby macros such as \label and attach their content as an additional attribute to the parent's renderInfo.
*
* @param tree
*/
function attachAdditionalAttributes(tree) {
	(0, _unified_latex_unified_latex_util_replace.replaceNode)(tree, (node, info) => {
		if (_unified_latex_unified_latex_util_match.match.macro(node, "label")) {
			const args = (0, _unified_latex_unified_latex_util_arguments.getArgsContent)(node);
			const labelContent = args[args.length - 1];
			if (labelContent) {
				const renderInfo = info.parents[0]?._renderInfo ?? {};
				if (renderInfo) {
					renderInfo.additionalAttributes = renderInfo.additionalAttributes ?? {};
					renderInfo.additionalAttributes["xml:id"] = sanitizeXmlId((0, _unified_latex_unified_latex_util_print_raw.printRaw)(labelContent));
					info.parents[0]._renderInfo = renderInfo;
				}
			}
			return null;
		}
	});
}
function findMacro(tree, content) {
	let macro = null;
	(0, _unified_latex_unified_latex_util_visit.visit)(tree, (node) => {
		if ((0, _unified_latex_unified_latex_util_match.anyEnvironment)(node)) return _unified_latex_unified_latex_util_visit.SKIP;
		if ((0, _unified_latex_unified_latex_util_match.anyMacro)(node) && node.content === content) {
			macro = node;
			return _unified_latex_unified_latex_util_visit.EXIT;
		}
	});
	return macro;
}
//#endregion
//#region libs/pre-conversion-subs/expand-user-defined-macros.ts
/**
* Expands user-defined macros
*/
function expandUserDefinedMacros(ast) {
	const newcommands = (0, _unified_latex_unified_latex_util_macros.listNewcommands)(ast);
	const macrosToExpand = new Set(newcommands.map((command) => command.name));
	const macroInfo = Object.fromEntries(newcommands.map((m) => [m.name, { signature: m.signature }]));
	for (let i = 0; i < 100; i++) {
		if (!needToExpand(ast, macrosToExpand)) break;
		(0, _unified_latex_unified_latex_util_arguments.attachMacroArgs)(ast, macroInfo);
		(0, _unified_latex_unified_latex_util_macros.expandMacrosExcludingDefinitions)(ast, newcommands);
	}
}
function needToExpand(ast, macros) {
	let needExpand = false;
	(0, _unified_latex_unified_latex_util_visit.visit)(ast, (node) => {
		if ((0, _unified_latex_unified_latex_util_match.anyMacro)(node) && macros.has(node.content)) needExpand = true;
	});
	return needExpand;
}
//#endregion
//#region libs/pre-conversion-subs/replace-quote-ligatures.ts
function isStr(node, content) {
	return node.type === "string" && node.content === content;
}
function isLetter(node) {
	if (!node || node.type !== "string") return false;
	return /^[a-zA-Z]/.test(node.content);
}
/**
* Scan `nodes` for LaTeX quote ligatures and replace matched pairs with macros:
*   ``...''  →  \enquote{...}   (double quotes, unambiguous)
*   `...'    →  \sq{...}        (single quotes, with disambiguation)
*
* Single-quote disambiguation: a `'` is treated as a closing single-quote only
* when (a) there is an open `` ` `` on the stack AND (b) it is NOT immediately
* followed by a letter (to preserve contractions like "don't" and "it's").
*
* Nesting is handled correctly: double-quote pairs may contain single-quote
* pairs and vice-versa.
*
* Matching never spans parbreak nodes.
*/
function processQuotes(nodes) {
	const result = [];
	const stack = [];
	let i = 0;
	while (i < nodes.length) {
		const node = nodes[i];
		const next = nodes[i + 1];
		if (_unified_latex_unified_latex_util_match.match.parbreak(node)) {
			while (stack.length > 0) stack.pop();
			result.push(node);
			i++;
			continue;
		}
		if (isStr(node, "`") && next && isStr(next, "`")) {
			stack.push({
				kind: "double",
				startIndex: result.length
			});
			result.push(node, next);
			i += 2;
			continue;
		}
		if (isStr(node, "'") && next && isStr(next, "'")) {
			const idx = findLastOf(stack, "double");
			if (idx !== -1) {
				const entry = stack.splice(idx, 1)[0];
				const inner = result.splice(entry.startIndex);
				inner.splice(0, 2);
				const processedInner = processQuotes(inner);
				result.push((0, _unified_latex_unified_latex_builder.m)("enquote", [(0, _unified_latex_unified_latex_builder.arg)(processedInner, { braces: "{}" })]));
				i += 2;
				continue;
			}
			result.push(node, next);
			i += 2;
			continue;
		}
		if (isStr(node, "`") && !(next && isStr(next, "`"))) {
			stack.push({
				kind: "single",
				startIndex: result.length
			});
			result.push(node);
			i++;
			continue;
		}
		if (isStr(node, "'") && !(next && isStr(next, "'"))) {
			const idx = findLastOf(stack, "single");
			if (idx !== -1 && !isLetter(nodes[i + 1])) {
				const entry = stack.splice(idx, 1)[0];
				const inner = result.splice(entry.startIndex);
				inner.splice(0, 1);
				const processedInner = processQuotes(inner);
				result.push((0, _unified_latex_unified_latex_builder.m)("sq", [(0, _unified_latex_unified_latex_builder.arg)(processedInner, { braces: "{}" })]));
				i++;
				continue;
			}
			result.push(node);
			i++;
			continue;
		}
		result.push(node);
		i++;
	}
	return result;
}
function findLastOf(stack, kind) {
	for (let i = stack.length - 1; i >= 0; i--) if (stack[i].kind === kind) return i;
	return -1;
}
/**
* After quote matching, convert any remaining raw ligature string nodes
* (dashes, tilde, unmatched quotes) directly to ASCII string nodes so that
* `expandUnicodeLigatures` never has a chance to emit non-ASCII Unicode characters.
*/
function cleanupLigatures(nodes) {
	const result = [];
	let i = 0;
	while (i < nodes.length) {
		const node = nodes[i];
		const next = nodes[i + 1];
		const next2 = nodes[i + 2];
		if (isStr(node, "-") && isStr(next, "-") && isStr(next2, "-")) {
			result.push((0, _unified_latex_unified_latex_builder.m)("mdash"));
			i += 3;
			continue;
		}
		if (isStr(node, "-") && isStr(next, "-")) {
			result.push((0, _unified_latex_unified_latex_builder.m)("ndash"));
			i += 2;
			continue;
		}
		if (isStr(node, "~")) {
			result.push((0, _unified_latex_unified_latex_builder.m)("nbsp"));
			i++;
			continue;
		}
		if (isStr(node, "'") || isStr(node, "`")) {
			result.push(node);
			i++;
			continue;
		}
		result.push(node);
		i++;
	}
	return result;
}
/**
* Replace LaTeX quote ligatures (`` `` ``...``''`` and `` ` ``...``'``) with
* `\enquote{...}` and `\sq{...}` macros, and convert dash/tilde ligatures to
* their PreTeXt macro equivalents, throughout the AST (text mode only).
*
* This must run BEFORE the main macro-replacement pass so that the resulting
* macros are converted to PreTeXt elements by the normal pipeline, preventing
* `expandUnicodeLigatures` from emitting non-ASCII Unicode characters.
*/
function replaceQuoteLigatures(ast) {
	(0, _unified_latex_unified_latex_util_visit.visit)(ast, (nodes, info) => {
		if (info.context.inMathMode || info.context.hasMathModeAncestor) return;
		const replaced = cleanupLigatures(processQuotes(nodes));
		nodes.length = 0;
		nodes.push(...replaced);
	}, {
		includeArrays: true,
		test: Array.isArray
	});
}
//#endregion
//#region libs/provides.ts
/**
* Register macro signatures for PreTeXt-specific macros.
* Add new macro names here when they are handled in macro-subs.ts
* but not already defined in the unified-latex-ctan packages.
*/
var macros = {
	term: { signature: "m" },
	code: { signature: "m" },
	lstinline: { signature: "m" },
	preface: {
		signature: "s o m",
		renderInfo: {
			breakAround: true,
			inParMode: true,
			namedArguments: [
				"starred",
				"tocTitle",
				"title"
			]
		}
	},
	biography: {
		signature: "s o m",
		renderInfo: {
			breakAround: true,
			inParMode: true,
			namedArguments: [
				"starred",
				"tocTitle",
				"title"
			]
		}
	},
	dedication: {
		signature: "s o m",
		renderInfo: {
			breakAround: true,
			inParMode: true,
			namedArguments: [
				"starred",
				"tocTitle",
				"title"
			]
		}
	},
	glossary: {
		signature: "s o m",
		renderInfo: {
			breakAround: true,
			inParMode: true,
			namedArguments: [
				"starred",
				"tocTitle",
				"title"
			]
		}
	},
	exercises: {
		signature: "s o m",
		renderInfo: {
			breakAround: true,
			inParMode: true,
			namedArguments: [
				"starred",
				"tocTitle",
				"title"
			]
		}
	},
	worksheet: {
		signature: "s o m",
		renderInfo: {
			breakAround: true,
			inParMode: true,
			namedArguments: [
				"starred",
				"tocTitle",
				"title"
			]
		}
	},
	readingquestions: {
		signature: "s o m",
		renderInfo: {
			breakAround: true,
			inParMode: true,
			namedArguments: [
				"starred",
				"tocTitle",
				"title"
			]
		}
	},
	solutions: {
		signature: "s o m",
		renderInfo: {
			breakAround: true,
			inParMode: true,
			namedArguments: [
				"starred",
				"tocTitle",
				"title"
			]
		}
	},
	fn: { signature: "m" },
	q: { signature: "m" },
	sq: { signature: "m" },
	enquote: { signature: "m" },
	enquotestar: { signature: "m" },
	abbr: { signature: "m" },
	ac: { signature: "m" },
	acro: { signature: "m" },
	init: { signature: "m" },
	foreign: { signature: "m" },
	foreignlanguage: { signature: "m m" },
	booktitle: { signature: "m" },
	pubtitle: { signature: "m" },
	articletitle: { signature: "m" },
	xmltag: { signature: "m" },
	xmlattr: { signature: "m" },
	taxon: { signature: "m" },
	kbd: { signature: "m" },
	icon: { signature: "m" },
	nb: { signature: "" },
	ps: { signature: "" },
	vs: { signature: "" },
	viz: { signature: "" },
	etal: { signature: "" },
	circa: { signature: "" },
	ca: { signature: "" },
	PreFigure: { signature: "" },
	XeLaTeX: { signature: "" },
	timeofday: { signature: "" },
	mdash: { signature: "" },
	ndash: { signature: "" },
	nbsp: { signature: "" },
	sout: { signature: "m" },
	insert: { signature: "m" },
	stale: { signature: "m" }
};
/**
* Register environment signatures for PreTeXt-specific environments.
* These are environments whose names don't exist in any CTAN package, so
* the parser needs to be told to consume an optional `[title]` argument.
* Add new environment names here when they are handled in environment-subs.ts
* but not already defined in the unified-latex-ctan packages.
*/
var environments = {
	aside: { signature: "o" },
	biographical: { signature: "o" },
	historical: { signature: "o" },
	assemblage: { signature: "o" },
	activity: { signature: "o" },
	exploration: { signature: "o" },
	investigation: { signature: "o" },
	project: { signature: "o" },
	computation: { signature: "o" },
	technology: { signature: "o" },
	data: { signature: "o" },
	case: { signature: "o" },
	poem: { signature: "o" },
	sidebyside: { signature: "o" },
	program: { signature: "o" },
	console: { signature: "" },
	sage: { signature: "" },
	webwork: { signature: "o" },
	task: { signature: "o" },
	preface: { signature: "o" },
	biography: { signature: "o" },
	dedication: { signature: "o" },
	glossary: { signature: "o" },
	exercises: { signature: "o" },
	exercisegroup: { signature: "o" },
	subexercises: { signature: "o" },
	worksheet: { signature: "o" },
	readingquestions: { signature: "o" },
	"reading-questions": { signature: "o" },
	introduction: { signature: "o" },
	conclusion: { signature: "o" },
	paragraphs: { signature: "o" },
	objectives: { signature: "o" },
	outcomes: { signature: "o" },
	solutions: { signature: "o" },
	gi: { signature: "o" },
	sbsgroup: { signature: "o" },
	stack: { signature: "o" },
	list: { signature: "o" },
	listing: { signature: "o" }
};
//#endregion
//#region libs/unified-latex-plugin-to-pretext.ts
/** Replace Unicode characters produced by ligature expansion with plain ASCII. */
function unicodeToAscii(str) {
	return str.replace(/\u2014/g, "---").replace(/\u2013/g, "--").replace(/\u00A0/g, " ").replace(/\u201C/g, "``").replace(/\u201D/g, "''").replace(/\u2018/g, "`").replace(/\u2019/g, "'").replace(/\u00AB/g, "<<").replace(/\u00BB/g, ">>").replace(/\u2026/g, "...").replace(/\u2009/g, " ").replace(/\u2005/g, " ").replace(/\u2002/g, " ").replace(/\u2003/g, " ");
}
/**
* Unified plugin to convert a `unified-latex` AST into a `xast` AST representation of PreTeXt source.
*/
var unifiedLatexToPretext = function unifiedLatexAttachMacroArguments(options) {
	return (tree, file) => {
		const producePretextFragment = options?.producePretextFragment ? options?.producePretextFragment : false;
		expandUserDefinedMacros(tree);
		replaceQuoteLigatures(tree);
		(0, _unified_latex_unified_latex_util_arguments.attachMacroArgs)(tree, macros);
		(0, _unified_latex_unified_latex_util_visit.visit)(tree, (node) => {
			if (!_unified_latex_unified_latex_util_match.match.environment(node)) return;
			const envInfo = environments[(0, _unified_latex_unified_latex_util_print_raw.printRaw)(node.env)];
			if (envInfo?.signature && node.args == null) {
				const { args } = (0, _unified_latex_unified_latex_util_arguments.gobbleArguments)(node.content, envInfo.signature);
				node.args = args;
			}
		});
		fixExamMacroArgs(tree);
		let content = tree.content;
		(0, _unified_latex_unified_latex_util_visit.visit)(tree, (env) => {
			content = env.content;
			return _unified_latex_unified_latex_util_visit.EXIT;
		}, { test: ((node) => _unified_latex_unified_latex_util_match.match.environment(node, "document")) });
		tree.content = content;
		unified().use(unifiedLatexToPretextLike, options).run(tree, file);
		(0, _unified_latex_unified_latex_util_ligatures.expandUnicodeLigatures)(tree);
		content = tree.content;
		let converted = toPretextWithLoggerFactory(file.message.bind(file))({
			type: "root",
			content
		});
		if (!Array.isArray(converted)) converted = [converted];
		let ret = x();
		ret.children = converted;
		if (!producePretextFragment) ret.children.unshift({
			type: "instruction",
			name: "xml",
			value: "version='1.0' encoding='utf-8'"
		});
		(function normalizeToAscii(nodes) {
			for (const node of nodes) if (node.type === "text") node.value = unicodeToAscii(node.value);
			else if ("children" in node) normalizeToAscii(node.children);
		})(ret.children);
		return ret;
	};
};
//#endregion
//#region ../../node_modules/stringify-entities/lib/core.js
/**
* @typedef CoreOptions
* @property {ReadonlyArray<string>} [subset=[]]
*   Whether to only escape the given subset of characters.
* @property {boolean} [escapeOnly=false]
*   Whether to only escape possibly dangerous characters.
*   Those characters are `"`, `&`, `'`, `<`, `>`, and `` ` ``.
*
* @typedef FormatOptions
* @property {(code: number, next: number, options: CoreWithFormatOptions) => string} format
*   Format strategy.
*
* @typedef {CoreOptions & FormatOptions & import('./util/format-smart.js').FormatSmartOptions} CoreWithFormatOptions
*/
var defaultSubsetRegex = /["&'<>`]/g;
var surrogatePairsRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
var controlCharactersRegex = /[\x01-\t\v\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g;
var regexEscapeRegex = /[|\\{}()[\]^$+*?.]/g;
/** @type {WeakMap<ReadonlyArray<string>, RegExp>} */
var subsetToRegexCache = /* @__PURE__ */ new WeakMap();
/**
* Encode certain characters in `value`.
*
* @param {string} value
* @param {CoreWithFormatOptions} options
* @returns {string}
*/
function core(value, options) {
	value = value.replace(options.subset ? charactersToExpressionCached(options.subset) : defaultSubsetRegex, basic);
	if (options.subset || options.escapeOnly) return value;
	return value.replace(surrogatePairsRegex, surrogate).replace(controlCharactersRegex, basic);
	/**
	* @param {string} pair
	* @param {number} index
	* @param {string} all
	*/
	function surrogate(pair, index, all) {
		return options.format((pair.charCodeAt(0) - 55296) * 1024 + pair.charCodeAt(1) - 56320 + 65536, all.charCodeAt(index + 2), options);
	}
	/**
	* @param {string} character
	* @param {number} index
	* @param {string} all
	*/
	function basic(character, index, all) {
		return options.format(character.charCodeAt(0), all.charCodeAt(index + 1), options);
	}
}
/**
* A wrapper function that caches the result of `charactersToExpression` with a WeakMap.
* This can improve performance when tooling calls `charactersToExpression` repeatedly
* with the same subset.
*
* @param {ReadonlyArray<string>} subset
* @returns {RegExp}
*/
function charactersToExpressionCached(subset) {
	let cached = subsetToRegexCache.get(subset);
	if (!cached) {
		cached = charactersToExpression(subset);
		subsetToRegexCache.set(subset, cached);
	}
	return cached;
}
/**
* @param {ReadonlyArray<string>} subset
* @returns {RegExp}
*/
function charactersToExpression(subset) {
	/** @type {Array<string>} */
	const groups = [];
	let index = -1;
	while (++index < subset.length) groups.push(subset[index].replace(regexEscapeRegex, "\\$&"));
	return new RegExp("(?:" + groups.join("|") + ")", "g");
}
//#endregion
//#region ../../node_modules/stringify-entities/lib/util/format-basic.js
/**
* The smallest way to encode a character.
*
* @param {number} code
* @returns {string}
*/
function formatBasic(code) {
	return "&#x" + code.toString(16).toUpperCase() + ";";
}
//#endregion
//#region ../../node_modules/stringify-entities/lib/index.js
/**
* @typedef {import('./core.js').CoreOptions & import('./util/format-smart.js').FormatSmartOptions} Options
* @typedef {import('./core.js').CoreOptions} LightOptions
*/
/**
* Encode special characters in `value` as hexadecimals.
*
* @param {string} value
*   Value to encode.
* @param {LightOptions} [options]
*   Configuration.
* @returns {string}
*   Encoded value.
*/
function stringifyEntitiesLight(value, options) {
	return core(value, Object.assign({ format: formatBasic }, options));
}
//#endregion
//#region ../../node_modules/xast-util-to-xml/lib/util-escape.js
var noncharacter = /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g;
/**
* Escape a string.
*
* @param {string} value
*   Raw string.
* @param {Array<string>} subset
*   Characters to escape.
* @param {RegExp | null | undefined} [unsafe]
*   Regex to scope `subset` to (optional).
* @returns {string}
*   Escaped string.
*/
function escape(value, subset, unsafe) {
	const result = clean(value);
	return unsafe ? result.replace(unsafe, encode) : encode(result);
	/**
	* Actually escape characters.
	*
	* @param {string} value
	*   Raw value.
	* @returns {string}
	*   Copy of `value`, escaped.
	*/
	function encode(value) {
		return stringifyEntitiesLight(value, { subset });
	}
}
/**
* Remove non-characters.
*
* @param {string} value
*   Raw value.
* @returns {string}
*   Copy of `value` with non-characters removed.
*/
function clean(value) {
	return String(value || "").replace(noncharacter, "");
}
//#endregion
//#region ../../node_modules/xast-util-to-xml/lib/cdata.js
/**
* @typedef {import('xast').Cdata} Cdata
*/
var unsafe$1 = /]]>/g;
var subset$3 = [">"];
/**
* Serialize a CDATA section.
*
* @param {Cdata} node
*   xast cdata node.
* @returns {string}
*   Serialized XML.
*/
function cdata(node) {
	return "<![CDATA[" + escape(node.value, subset$3, unsafe$1) + "]]>";
}
//#endregion
//#region ../../node_modules/xast-util-to-xml/lib/comment.js
/**
* @typedef {import('xast').Comment} Comment
*/
/**
* Serialize a comment.
*
* @param {Comment} node
*   xast comment node.
* @returns {string}
*   Serialized XML.
*/
function comment(node) {
	return "<!--" + escape(node.value, ["-"]) + "-->";
}
//#endregion
//#region ../../node_modules/xast-util-to-xml/lib/name.js
var subset$2 = [
	"	",
	"\n",
	" ",
	"\"",
	"&",
	"'",
	"/",
	"<",
	"=",
	">"
];
/**
* Encode a node name.
*
* @param {string} value
*   Raw name.
* @returns {string}
*   Escaped name.
*/
function name(value) {
	return escape(value, subset$2);
}
//#endregion
//#region ../../node_modules/ccount/index.js
/**
* Count how often a character (or substring) is used in a string.
*
* @param {string} value
*   Value to search in.
* @param {string} character
*   Character (or substring) to look for.
* @return {number}
*   Number of times `character` occurred in `value`.
*/
function ccount(value, character) {
	const source = String(value);
	if (typeof character !== "string") throw new TypeError("Expected character");
	let count = 0;
	let index = source.indexOf(character);
	while (index !== -1) {
		count++;
		index = source.indexOf(character, index + character.length);
	}
	return count;
}
//#endregion
//#region ../../node_modules/xast-util-to-xml/lib/value.js
/**
* @typedef {import('./index.js').State} State
*/
/**
* Serialize an attribute value.
*
* @param {string} value
*   Raw attribute value.
* @param {State} state
*   Info passed around about the current state.
* @returns {string}
*   Serialized attribute value.
*/
function value(value, state) {
	const result = String(value);
	let quote = state.options.quote || "\"";
	if (state.options.quoteSmart) {
		const other = quote === "\"" ? "'" : "\"";
		if (ccount(result, quote) > ccount(result, other)) quote = other;
	}
	return quote + escape(result, [
		"<",
		"&",
		quote
	]) + quote;
}
//#endregion
//#region ../../node_modules/xast-util-to-xml/lib/doctype.js
/**
* @typedef {import('xast').Doctype} Doctype
* @typedef {import('./index.js').State} State
*/
/**
* Serialize a doctype.
*
* @param {Doctype} node
*   xast doctype node.
* @param {State} state
*   Info passed around about the current state.
* @returns {string}
*   Serialized XML.
*/
function doctype(node, state) {
	const nodeName = name(node.name);
	const pub = node.public;
	const sys = node.system;
	let result = "<!DOCTYPE";
	if (nodeName !== "") result += " " + nodeName;
	if (pub) result += " PUBLIC " + value(pub, state);
	else if (sys) result += " SYSTEM";
	if (sys) result += " " + value(sys, state);
	return result + ">";
}
//#endregion
//#region ../../node_modules/xast-util-to-xml/lib/element.js
/**
* @typedef {import('xast').Element} Element
* @typedef {import('./index.js').State} State
*/
var own$1 = {}.hasOwnProperty;
/**
* Serialize an element.
*
* @param {Element} node
*   xast element node.
* @param {State} state
*   Info passed around about the current state.
* @returns {string}
*   Serialized XML.
*/
function element(node, state) {
	const nodeName = name(node.name);
	const content = all(node, state);
	const attributes = node.attributes || {};
	const close = content ? false : state.options.closeEmptyElements;
	/** @type {Array<string>} */
	const attrs = [];
	/** @type {string} */
	let key;
	for (key in attributes) if (own$1.call(attributes, key)) {
		const result = attributes[key];
		if (result !== null && result !== void 0) attrs.push(name(key) + "=" + value(result, state));
	}
	return "<" + nodeName + (attrs.length === 0 ? "" : " " + attrs.join(" ")) + (close ? (state.options.tightClose ? "" : " ") + "/" : "") + ">" + content + (close ? "" : "</" + nodeName + ">");
}
//#endregion
//#region ../../node_modules/xast-util-to-xml/lib/instruction.js
/**
* @typedef {import('xast').Instruction} Instruction
*/
var unsafe = /\?>/g;
var subset$1 = [">"];
/**
* Serialize an instruction.
*
* @param {Instruction} node
*   xast instruction node.
* @returns {string}
*   Serialized XML.
*/
function instruction(node) {
	const nodeName = name(node.name) || "x";
	const result = escape(node.value, subset$1, unsafe);
	return "<?" + nodeName + (result ? " " + result : "") + "?>";
}
//#endregion
//#region ../../node_modules/xast-util-to-xml/lib/text.js
/**
* @typedef {import('xast').Text} Text
* @typedef {import('../index.js').Raw} Raw
*/
var subset = ["&", "<"];
/**
* Serialize a text.
*
* @param {Raw | Text} node
*   xast text node (or raw).
* @returns {string}
*   Serialized XML.
*/
function text(node) {
	return escape(node.value, subset);
}
//#endregion
//#region ../../node_modules/xast-util-to-xml/lib/raw.js
/**
* @typedef {import('../index.js').Raw} Raw
* @typedef {import('./index.js').State} State
*/
/**
* Serialize a (non-standard) raw.
*
* @param {Raw} node
*   xast raw node.
* @param {State} state
*   Info passed around about the current state.
* @returns {string}
*   Serialized XML.
*/
function raw(node, state) {
	return state.options.allowDangerousXml ? node.value : text(node);
}
//#endregion
//#region ../../node_modules/xast-util-to-xml/lib/one.js
/**
* @typedef {import('xast').Nodes} Nodes
* @typedef {import('xast').Parents} Parents
* @typedef {import('xast').RootContent} RootContent
* @typedef {import('./index.js').State} State
*/
var own = {}.hasOwnProperty;
var handlers = {
	cdata,
	comment,
	doctype,
	element,
	instruction,
	raw,
	root: all,
	text
};
/**
* Serialize a node.
*
* @param {Nodes} node
*   xast node.
* @param {State} state
*   Info passed around about the current state.
* @returns {string}
*   Serialized XML.
*/
function one(node, state) {
	const type = node && node.type;
	if (!type) throw new Error("Expected node, not `" + node + "`");
	if (!own.call(handlers, type)) throw new Error("Cannot compile unknown node `" + type + "`");
	const handle = handlers[type];
	return handle(node, state);
}
/**
* Serialize all children of `parent`.
*
* @param {Parents} parent
*   xast parent node.
* @param {State} state
*   Info passed around about the current state.
* @returns {string}
*   Serialized XML.
*/
function all(parent, state) {
	/** @type {Array<RootContent>} */
	const children = parent && parent.children || [];
	let index = -1;
	/** @type {Array<string>} */
	const results = [];
	while (++index < children.length) results[index] = one(children[index], state);
	return results.join("");
}
//#endregion
//#region ../../node_modules/xast-util-to-xml/lib/index.js
/**
* @typedef {import('xast').Literal} Literal
* @typedef {import('xast').Nodes} Nodes
*/
/**
* @typedef Options
*   Configuration.
* @property {boolean | null | undefined} [allowDangerousXml=false]
*   Allow `raw` nodes and insert them as raw XML (default: `false`).
*
*   When `false`, `Raw` nodes are encoded.
*
*   > ⚠️ **Danger**: only set this if you completely trust the content.
* @property {boolean | null | undefined} [closeEmptyElements=false]
*   Close elements without any content with slash (`/`) on the opening tag
*   instead of an end tag: `<circle />` instead of `<circle></circle>`
*   (default: `false`).
*
*   See `tightClose` to control whether a space is used before the slash.
* @property {Quote | null | undefined} [quote='"']
*   Preferred quote to use (default: `'"'`).
* @property {boolean | null | undefined} [quoteSmart=false]
*   Use the other quote if that results in less bytes (default: `false`).
* @property {boolean | null | undefined} [tightClose=false]
*   Do not use an extra space when closing self-closing elements: `<circle/>`
*   instead of `<circle />` (default: `false`).
*
*   > 👉 **Note**: only used if `closeEmptyElements: true`.
*
* @typedef {'"' | "'"} Quote
*   XML quotes for attribute values.
*
* @typedef State
*   Info passed around about the current state.
* @property {Options} options
*   Configuration.
*/
/**
* Serialize a xast tree to XML.
*
* @param {Array<Nodes> | Nodes} tree
*   xast node(s) to serialize.
* @param {Options | null | undefined} [options]
*   Configuration (optional).
* @returns {string}
*   Serialized XML.
*/
function toXml(tree, options) {
	/** @type {State} */
	const state = { options: options || {} };
	if (typeof state.options.quote === "string" && state.options.quote !== "\"" && state.options.quote !== "'") throw new Error("Invalid quote `" + state.options.quote + "`, expected `'` or `\"`");
	return one(Array.isArray(tree) ? {
		type: "root",
		children: tree
	} : tree, state);
}
//#endregion
//#region libs/convert-to-pretext.ts
/**
* Unified plugin to convert a `XAST` AST to a string.
*/
var xmlCompilePlugin = function() {
	this.Compiler = (tree) => toXml(tree, { closeEmptyElements: true });
};
var _processor = (0, _unified_latex_unified_latex.processLatexViaUnified)().use(unifiedLatexToPretext).use(xmlCompilePlugin);
/**
* Convert the `unified-latex` AST `tree` into an HTML string. If you need
* more precise control or further processing, consider using `unified`
* directly with the `unifiedLatexToPretext` plugin.
*
* For example,
* ```
* unified()
*      .use(unifiedLatexFromString)
*      .use(unifiedLatexToPretext)
*      .use(rehypeStringify)
*      .processSync("\\LaTeX to convert")
* ```
*/
function convertToPretext(tree, options) {
	let processor = _processor;
	if (!Array.isArray(tree) && tree.type !== "root") tree = {
		type: "root",
		content: [tree]
	};
	if (Array.isArray(tree)) tree = {
		type: "root",
		content: tree
	};
	if (options) processor = _processor.use(unifiedLatexToPretext, options);
	const hast = processor.runSync(tree);
	return processor.stringify(hast);
}
//#endregion
//#region index.ts
/**
* ## What is this?
*
* Functions to convert `unified-latex` Abstract Syntax Tree (AST) to a XAST (xml-like)
* tree in the [PreTeXt](https://pretextbook.org/) format.
*
* ## When should I use this?
*
* If you want to convert LaTeX to PreTeXt for further processing with the PreTeXt compiler.
*
* ## Controlling the PreTeXt output
*
* This plugin comes with presets for several common LaTeX macros/environments, but you probably want to
* control how various macros evaluate yourself. For example, you may have used `\includegraphics` with `pdf`s
* in your LaTeX source by want the output to reference different files.
* You can accomplish this by passing `macroReplacements` (for environments, there is the similarly-named
*  `environmentReplacements`) to the plugin.
*
* For example,
* ```typescript
* import { unified } from "unified";
* import rehypeStringify from "rehype-stringify";
* import { htmlLike } from "@unified-latex/unified-latex-util-html-like";
* import { printRaw } from "@unified-latex/unified-latex-util-print-raw";
* import { unifiedLatexToPretext } from "@unified-latex/unified-latex-to-pretext";
* import { unifiedLatexFromString } from "@unified-latex/unified-latex-util-parse";
* import { getArgsContent } from "@unified-latex/unified-latex-util-arguments";
*
* const convert = (value) =>
*     unified()
*         .use(unifiedLatexFromString)
*         .use(unifiedLatexToPretext, {
*             macroReplacements: {
*                 includegraphics: (node) => {
*                     const args = getArgsContent(node);
*                     const path = printRaw(
*                         args[args.length - 1] || []
*                     ).replace(/\.pdf$/, ".png");
*                     return htmlLike({
*                         tag: "img",
*                         attributes: { src: path },
*                     });
*                 },
*             },
*         })
*         .use(rehypeStringify)
*         .processSync(value).value;
*
* console.log(convert(`\\includegraphics{foo.pdf}`));
* ```
*
* `macroReplacements` and `environmentReplacements` functions can return any unified-latex `Node`, but
* using the `htmlLike` utility function will return nodes that get converted to specific HTML. See `htmlLike`'s
* documentation for more details.
*/
//#endregion
exports.KATEX_SUPPORT = KATEX_SUPPORT;
exports.attachNeededRenderInfo = attachNeededRenderInfo;
exports.convertToPretext = convertToPretext;
exports.environments = environments;
exports.macros = macros;
exports.mathjaxSpecificEnvironmentReplacements = mathjaxSpecificEnvironmentReplacements;
exports.mathjaxSpecificMacroReplacements = mathjaxSpecificMacroReplacements;
exports.unifiedLatexToPretext = unifiedLatexToPretext;
exports.unifiedLatexWrapPars = unifiedLatexWrapPars;
exports.wrapPars = wrapPars;
exports.xmlCompilePlugin = xmlCompilePlugin;

//# sourceMappingURL=index.cjs.map