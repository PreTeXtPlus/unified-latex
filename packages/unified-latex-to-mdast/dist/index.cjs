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
let _unified_latex_unified_latex_to_hast = require("@unified-latex/unified-latex-to-hast");
let hast_util_to_mdast = require("hast-util-to-mdast");
let hast_util_to_string = require("hast-util-to-string");
let _unified_latex_unified_latex = require("@unified-latex/unified-latex");
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
//#region node_modules/unist-util-stringify-position/lib/index.js
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
//#region node_modules/vfile-message/lib/index.js
/**
* @typedef {import('unist').Node} Node
* @typedef {import('unist').Position} Position
* @typedef {import('unist').Point} Point
* @typedef {object & {type: string, position?: Position | undefined}} NodeLike
*/
/**
* Message.
*/
var VFileMessage = class extends Error {
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
		this.name = stringifyPosition(place) || "1:1";
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
VFileMessage.prototype.file = "";
VFileMessage.prototype.name = "";
VFileMessage.prototype.reason = "";
VFileMessage.prototype.message = "";
VFileMessage.prototype.stack = "";
VFileMessage.prototype.fatal = null;
VFileMessage.prototype.column = null;
VFileMessage.prototype.line = null;
VFileMessage.prototype.source = null;
VFileMessage.prototype.ruleId = null;
VFileMessage.prototype.position = null;
//#endregion
//#region node_modules/vfile/lib/minpath.browser.js
var path = {
	basename,
	dirname,
	extname,
	join: join$1,
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
function join$1(...segments) {
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
//#region node_modules/vfile/lib/minproc.browser.js
var proc = { cwd };
function cwd() {
	return "/";
}
//#endregion
//#region node_modules/vfile/lib/minurl.shared.js
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
//#region node_modules/vfile/lib/minurl.browser.js
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
//#region node_modules/vfile/lib/index.js
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
		const message = new VFileMessage(reason, place, origin);
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
var own$1 = {}.hasOwnProperty;
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
			return own$1.call(namespace, key) && namespace[key] || null;
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
	for (key in value) if (own$1.call(value, key)) return true;
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
//#region ../../node_modules/rehype-remark/lib/index.js
/**
* @typedef {import('hast').Root} HastRoot
* @typedef {import('hast-util-to-mdast').Options} Options
* @typedef {import('mdast').Root} MdastRoot
* @typedef {import('unified').Processor<MdastRoot>} Processor
* @typedef {import('vfile').VFile} VFile
*/
/**
* @callback TransformBridge
*   Bridge-mode.
*
*   Runs the destination with the new mdast tree.
*   Discards result.
* @param {HastRoot} tree
*   Tree.
* @param {VFile} file
*   File.
* @returns {Promise<undefined>}
*   Nothing.
*
* @callback TransformMutate
*  Mutate-mode.
*
*  Further transformers run on the mdast tree.
* @param {HastRoot} tree
*   Tree.
* @param {VFile} file
*   File.
* @returns {MdastRoot}
*   Tree (mdast).
*/
/** @satisfies {Options} */
var defaults = { document: true };
/**
* Turn HTML into markdown.
*
* ###### Notes
*
* *   if a processor is given, runs the (remark) plugins used on it with an
*     mdast tree, then discards the result (*bridge mode*)
* *   otherwise, returns an mdast tree, the plugins used after `rehypeRemark`
*     are remark plugins (*mutate mode*)
*
* > 👉 **Note**: It’s highly unlikely that you want to pass a `processor`.
*
* @overload
* @param {Processor} processor
* @param {Options | null | undefined} [options]
* @returns {TransformBridge}
*
* @overload
* @param {Options | null | undefined} [options]
* @returns {TransformMutate}
*
* @param {Options | Processor | null | undefined} [destination]
*   Processor or configuration (optional).
* @param {Options | null | undefined} [options]
*   When a processor was given, configuration (optional).
* @returns {TransformBridge | TransformMutate}
*   Transform.
*/
function rehypeRemark(destination, options) {
	if (destination && "run" in destination)
 /**
	* @type {TransformBridge}
	*/
	return async function(tree, file) {
		const mdastTree = (0, hast_util_to_mdast.toMdast)(tree, {
			...defaults,
			...options
		});
		await destination.run(mdastTree, file);
	};
	/**
	* @type {TransformMutate}
	*/
	return function(tree) {
		return (0, hast_util_to_mdast.toMdast)(tree, {
			...defaults,
			...destination
		});
	};
}
//#endregion
//#region libs/remark-handlers-defaults.ts
var defaultHandlers = {
	span(state, node, parent) {
		if ((node.properties.className || []).includes("inline-math")) return {
			type: "html",
			value: `$${(0, hast_util_to_string.toString)(node)}$`
		};
		return state.all(node);
	},
	div(state, node, parent) {
		if ((node.properties.className || []).includes("display-math")) return {
			type: "code",
			lang: "math",
			value: (0, hast_util_to_string.toString)(node)
		};
		return state.all(node);
	}
};
//#endregion
//#region libs/unified-latex-plugin-to-mdast.ts
/**
* Unified plugin to convert a `unified-latex` AST into a `mdast` AST.
*/
var unifiedLatexToMdast = function unifiedLatexToMdast(options) {
	const handlers = Object.assign({}, defaultHandlers, options?.handlers);
	options = Object.assign({}, options, { handlers });
	return (tree, file) => {
		return unified().use(_unified_latex_unified_latex_to_hast.unifiedLatexToHast, options).use(rehypeRemark, options).runSync(tree, file);
	};
};
//#endregion
//#region ../../node_modules/zwitch/index.js
/**
* @callback Handler
*   Handle a value, with a certain ID field set to a certain value.
*   The ID field is passed to `zwitch`, and it’s value is this function’s
*   place on the `handlers` record.
* @param {...any} parameters
*   Arbitrary parameters passed to the zwitch.
*   The first will be an object with a certain ID field set to a certain value.
* @returns {any}
*   Anything!
*/
/**
* @callback UnknownHandler
*   Handle values that do have a certain ID field, but it’s set to a value
*   that is not listed in the `handlers` record.
* @param {unknown} value
*   An object with a certain ID field set to an unknown value.
* @param {...any} rest
*   Arbitrary parameters passed to the zwitch.
* @returns {any}
*   Anything!
*/
/**
* @callback InvalidHandler
*   Handle values that do not have a certain ID field.
* @param {unknown} value
*   Any unknown value.
* @param {...any} rest
*   Arbitrary parameters passed to the zwitch.
* @returns {void|null|undefined|never}
*   This should crash or return nothing.
*/
/**
* @template {InvalidHandler} [Invalid=InvalidHandler]
* @template {UnknownHandler} [Unknown=UnknownHandler]
* @template {Record<string, Handler>} [Handlers=Record<string, Handler>]
* @typedef Options
*   Configuration (required).
* @property {Invalid} [invalid]
*   Handler to use for invalid values.
* @property {Unknown} [unknown]
*   Handler to use for unknown values.
* @property {Handlers} [handlers]
*   Handlers to use.
*/
var own = {}.hasOwnProperty;
/**
* Handle values based on a field.
*
* @template {InvalidHandler} [Invalid=InvalidHandler]
* @template {UnknownHandler} [Unknown=UnknownHandler]
* @template {Record<string, Handler>} [Handlers=Record<string, Handler>]
* @param {string} key
*   Field to switch on.
* @param {Options<Invalid, Unknown, Handlers>} [options]
*   Configuration (required).
* @returns {{unknown: Unknown, invalid: Invalid, handlers: Handlers, (...parameters: Parameters<Handlers[keyof Handlers]>): ReturnType<Handlers[keyof Handlers]>, (...parameters: Parameters<Unknown>): ReturnType<Unknown>}}
*/
function zwitch(key, options) {
	const settings = options || {};
	/**
	* Handle one value.
	*
	* Based on the bound `key`, a respective handler will be called.
	* If `value` is not an object, or doesn’t have a `key` property, the special
	* “invalid” handler will be called.
	* If `value` has an unknown `key`, the special “unknown” handler will be
	* called.
	*
	* All arguments, and the context object, are passed through to the handler,
	* and it’s result is returned.
	*
	* @this {unknown}
	*   Any context object.
	* @param {unknown} [value]
	*   Any value.
	* @param {...unknown} parameters
	*   Arbitrary parameters passed to the zwitch.
	* @property {Handler} invalid
	*   Handle for values that do not have a certain ID field.
	* @property {Handler} unknown
	*   Handle values that do have a certain ID field, but it’s set to a value
	*   that is not listed in the `handlers` record.
	* @property {Handlers} handlers
	*   Record of handlers.
	* @returns {unknown}
	*   Anything.
	*/
	function one(value, ...parameters) {
		/** @type {Handler|undefined} */
		let fn = one.invalid;
		const handlers = one.handlers;
		if (value && own.call(value, key)) {
			const id = String(value[key]);
			fn = own.call(handlers, id) ? handlers[id] : one.unknown;
		}
		if (fn) return fn.call(this, value, ...parameters);
	}
	one.handlers = settings.handlers || {};
	one.invalid = settings.invalid;
	one.unknown = settings.unknown;
	return one;
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/configure.js
/**
* @typedef {import('./types.js').Options} Options
* @typedef {import('./types.js').State} State
*/
/**
* @param {State} base
* @param {Options} extension
* @returns {State}
*/
function configure(base, extension) {
	let index = -1;
	/** @type {keyof Options} */
	let key;
	if (extension.extensions) while (++index < extension.extensions.length) configure(base, extension.extensions[index]);
	for (key in extension) if (key === "extensions") {} else if (key === "unsafe" || key === "join")
 /* c8 ignore next 2 */
	base[key] = [...base[key] || [], ...extension[key] || []];
	else if (key === "handlers") base[key] = Object.assign(base[key], extension[key] || {});
	else base.options[key] = extension[key];
	return base;
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/blockquote.js
/**
* @typedef {import('mdast').Blockquote} Blockquote
* @typedef {import('../types.js').Parent} Parent
* @typedef {import('../types.js').State} State
* @typedef {import('../types.js').Info} Info
* @typedef {import('../types.js').Map} Map
*/
/**
* @param {Blockquote} node
* @param {Parent | undefined} _
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function blockquote(node, _, state, info) {
	const exit = state.enter("blockquote");
	const tracker = state.createTracker(info);
	tracker.move("> ");
	tracker.shift(2);
	const value = state.indentLines(state.containerFlow(node, tracker.current()), map$1);
	exit();
	return value;
}
/** @type {Map} */
function map$1(line, _, blank) {
	return ">" + (blank ? "" : " ") + line;
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/pattern-in-scope.js
/**
* @typedef {import('../types.js').Unsafe} Unsafe
* @typedef {import('../types.js').ConstructName} ConstructName
*/
/**
* @param {Array<ConstructName>} stack
* @param {Unsafe} pattern
* @returns {boolean}
*/
function patternInScope(stack, pattern) {
	return listInScope(stack, pattern.inConstruct, true) && !listInScope(stack, pattern.notInConstruct, false);
}
/**
* @param {Array<ConstructName>} stack
* @param {Unsafe['inConstruct']} list
* @param {boolean} none
* @returns {boolean}
*/
function listInScope(stack, list, none) {
	if (typeof list === "string") list = [list];
	if (!list || list.length === 0) return none;
	let index = -1;
	while (++index < list.length) if (stack.includes(list[index])) return true;
	return false;
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/break.js
/**
* @typedef {import('mdast').Break} Break
* @typedef {import('../types.js').Parent} Parent
* @typedef {import('../types.js').State} State
* @typedef {import('../types.js').Info} Info
*/
/**
* @param {Break} _
* @param {Parent | undefined} _1
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function hardBreak(_, _1, state, info) {
	let index = -1;
	while (++index < state.unsafe.length) if (state.unsafe[index].character === "\n" && patternInScope(state.stack, state.unsafe[index])) return /[ \t]/.test(info.before) ? "" : " ";
	return "\\\n";
}
//#endregion
//#region ../../node_modules/longest-streak/index.js
/**
* Get the count of the longest repeating streak of `substring` in `value`.
*
* @param {string} value
*   Content to search in.
* @param {string} substring
*   Substring to look for, typically one character.
* @returns {number}
*   Count of most frequent adjacent `substring`s in `value`.
*/
function longestStreak(value, substring) {
	const source = String(value);
	let index = source.indexOf(substring);
	let expected = index;
	let count = 0;
	let max = 0;
	if (typeof substring !== "string") throw new TypeError("Expected substring");
	while (index !== -1) {
		if (index === expected) {
			if (++count > max) max = count;
		} else count = 1;
		expected = index + substring.length;
		index = source.indexOf(substring, expected);
	}
	return max;
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/format-code-as-indented.js
/**
* @typedef {import('mdast').Code} Code
* @typedef {import('../types.js').State} State
*/
/**
* @param {Code} node
* @param {State} state
* @returns {boolean}
*/
function formatCodeAsIndented(node, state) {
	return Boolean(!state.options.fences && node.value && !node.lang && /[^ \r\n]/.test(node.value) && !/^[\t ]*(?:[\r\n]|$)|(?:^|[\r\n])[\t ]*$/.test(node.value));
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/check-fence.js
/**
* @typedef {import('../types.js').State} State
* @typedef {import('../types.js').Options} Options
*/
/**
* @param {State} state
* @returns {Exclude<Options['fence'], null | undefined>}
*/
function checkFence(state) {
	const marker = state.options.fence || "`";
	if (marker !== "`" && marker !== "~") throw new Error("Cannot serialize code with `" + marker + "` for `options.fence`, expected `` ` `` or `~`");
	return marker;
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/code.js
/**
* @typedef {import('mdast').Code} Code
* @typedef {import('../types.js').Parent} Parent
* @typedef {import('../types.js').State} State
* @typedef {import('../types.js').Info} Info
* @typedef {import('../types.js').Map} Map
*/
/**
* @param {Code} node
* @param {Parent | undefined} _
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function code(node, _, state, info) {
	const marker = checkFence(state);
	const raw = node.value || "";
	const suffix = marker === "`" ? "GraveAccent" : "Tilde";
	if (formatCodeAsIndented(node, state)) {
		const exit = state.enter("codeIndented");
		const value = state.indentLines(raw, map);
		exit();
		return value;
	}
	const tracker = state.createTracker(info);
	const sequence = marker.repeat(Math.max(longestStreak(raw, marker) + 1, 3));
	const exit = state.enter("codeFenced");
	let value = tracker.move(sequence);
	if (node.lang) {
		const subexit = state.enter(`codeFencedLang${suffix}`);
		value += tracker.move(state.safe(node.lang, {
			before: value,
			after: " ",
			encode: ["`"],
			...tracker.current()
		}));
		subexit();
	}
	if (node.lang && node.meta) {
		const subexit = state.enter(`codeFencedMeta${suffix}`);
		value += tracker.move(" ");
		value += tracker.move(state.safe(node.meta, {
			before: value,
			after: "\n",
			encode: ["`"],
			...tracker.current()
		}));
		subexit();
	}
	value += tracker.move("\n");
	if (raw) value += tracker.move(raw + "\n");
	value += tracker.move(sequence);
	exit();
	return value;
}
/** @type {Map} */
function map(line, _, blank) {
	return (blank ? "" : "    ") + line;
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/check-quote.js
/**
* @typedef {import('../types.js').State} State
* @typedef {import('../types.js').Options} Options
*/
/**
* @param {State} state
* @returns {Exclude<Options['quote'], null | undefined>}
*/
function checkQuote(state) {
	const marker = state.options.quote || "\"";
	if (marker !== "\"" && marker !== "'") throw new Error("Cannot serialize title with `" + marker + "` for `options.quote`, expected `\"`, or `'`");
	return marker;
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/definition.js
/**
* @typedef {import('mdast').Definition} Definition
* @typedef {import('../types.js').Parent} Parent
* @typedef {import('../types.js').State} State
* @typedef {import('../types.js').Info} Info
*/
/**
* @param {Definition} node
* @param {Parent | undefined} _
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function definition(node, _, state, info) {
	const quote = checkQuote(state);
	const suffix = quote === "\"" ? "Quote" : "Apostrophe";
	const exit = state.enter("definition");
	let subexit = state.enter("label");
	const tracker = state.createTracker(info);
	let value = tracker.move("[");
	value += tracker.move(state.safe(state.associationId(node), {
		before: value,
		after: "]",
		...tracker.current()
	}));
	value += tracker.move("]: ");
	subexit();
	if (!node.url || /[\0- \u007F]/.test(node.url)) {
		subexit = state.enter("destinationLiteral");
		value += tracker.move("<");
		value += tracker.move(state.safe(node.url, {
			before: value,
			after: ">",
			...tracker.current()
		}));
		value += tracker.move(">");
	} else {
		subexit = state.enter("destinationRaw");
		value += tracker.move(state.safe(node.url, {
			before: value,
			after: node.title ? " " : "\n",
			...tracker.current()
		}));
	}
	subexit();
	if (node.title) {
		subexit = state.enter(`title${suffix}`);
		value += tracker.move(" " + quote);
		value += tracker.move(state.safe(node.title, {
			before: value,
			after: quote,
			...tracker.current()
		}));
		value += tracker.move(quote);
		subexit();
	}
	exit();
	return value;
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/check-emphasis.js
/**
* @typedef {import('../types.js').State} State
* @typedef {import('../types.js').Options} Options
*/
/**
* @param {State} state
* @returns {Exclude<Options['emphasis'], null | undefined>}
*/
function checkEmphasis(state) {
	const marker = state.options.emphasis || "*";
	if (marker !== "*" && marker !== "_") throw new Error("Cannot serialize emphasis with `" + marker + "` for `options.emphasis`, expected `*`, or `_`");
	return marker;
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/emphasis.js
/**
* @typedef {import('mdast').Emphasis} Emphasis
* @typedef {import('../types.js').Parent} Parent
* @typedef {import('../types.js').State} State
* @typedef {import('../types.js').Info} Info
*/
emphasis.peek = emphasisPeek;
/**
* @param {Emphasis} node
* @param {Parent | undefined} _
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function emphasis(node, _, state, info) {
	const marker = checkEmphasis(state);
	const exit = state.enter("emphasis");
	const tracker = state.createTracker(info);
	let value = tracker.move(marker);
	value += tracker.move(state.containerPhrasing(node, {
		before: value,
		after: marker,
		...tracker.current()
	}));
	value += tracker.move(marker);
	exit();
	return value;
}
/**
* @param {Emphasis} _
* @param {Parent | undefined} _1
* @param {State} state
* @returns {string}
*/
function emphasisPeek(_, _1, state) {
	return state.options.emphasis || "*";
}
//#endregion
//#region ../../node_modules/unist-util-visit/node_modules/unist-util-is/lib/index.js
/**
* Generate an assertion from a test.
*
* Useful if you’re going to test many nodes, for example when creating a
* utility where something else passes a compatible test.
*
* The created function is a bit faster because it expects valid input only:
* a `node`, `index`, and `parent`.
*
* @param test
*   *   when nullish, checks if `node` is a `Node`.
*   *   when `string`, works like passing `(node) => node.type === test`.
*   *   when `function` checks if function passed the node is true.
*   *   when `object`, checks that all keys in test are in node, and that they have (strictly) equal values.
*   *   when `array`, checks if any one of the subtests pass.
* @returns
*   An assertion.
*/
var convert$1 = (function(test) {
	if (test === void 0 || test === null) return ok$1;
	if (typeof test === "string") return typeFactory$1(test);
	if (typeof test === "object") return Array.isArray(test) ? anyFactory$1(test) : propsFactory$1(test);
	if (typeof test === "function") return castFactory$1(test);
	throw new Error("Expected function, string, or object as test");
});
/**
* @param {Array<string | Props | TestFunctionAnything>} tests
* @returns {AssertAnything}
*/
function anyFactory$1(tests) {
	/** @type {Array<AssertAnything>} */
	const checks = [];
	let index = -1;
	while (++index < tests.length) checks[index] = convert$1(tests[index]);
	return castFactory$1(any);
	/**
	* @this {unknown}
	* @param {Array<unknown>} parameters
	* @returns {boolean}
	*/
	function any(...parameters) {
		let index = -1;
		while (++index < checks.length) if (checks[index].call(this, ...parameters)) return true;
		return false;
	}
}
/**
* Turn an object into a test for a node with a certain fields.
*
* @param {Props} check
* @returns {AssertAnything}
*/
function propsFactory$1(check) {
	return castFactory$1(all);
	/**
	* @param {Node} node
	* @returns {boolean}
	*/
	function all(node) {
		/** @type {string} */
		let key;
		for (key in check) if (node[key] !== check[key]) return false;
		return true;
	}
}
/**
* Turn a string into a test for a node with a certain type.
*
* @param {string} check
* @returns {AssertAnything}
*/
function typeFactory$1(check) {
	return castFactory$1(type);
	/**
	* @param {Node} node
	*/
	function type(node) {
		return node && node.type === check;
	}
}
/**
* Turn a custom test into a test for a node that passes that test.
*
* @param {TestFunctionAnything} check
* @returns {AssertAnything}
*/
function castFactory$1(check) {
	return assertion;
	/**
	* @this {unknown}
	* @param {unknown} node
	* @param {Array<unknown>} parameters
	* @returns {boolean}
	*/
	function assertion(node, ...parameters) {
		return Boolean(node && typeof node === "object" && "type" in node && Boolean(check.call(this, node, ...parameters)));
	}
}
function ok$1() {
	return true;
}
//#endregion
//#region ../../node_modules/unist-util-visit/node_modules/unist-util-visit-parents/lib/color.browser.js
/**
* @param {string} d
* @returns {string}
*/
function color(d) {
	return d;
}
/**
* Visit nodes, with ancestral information.
*
* This algorithm performs *depth-first* *tree traversal* in *preorder*
* (**NLR**) or if `reverse` is given, in *reverse preorder* (**NRL**).
*
* You can choose for which nodes `visitor` is called by passing a `test`.
* For complex tests, you should test yourself in `visitor`, as it will be
* faster and will have improved type information.
*
* Walking the tree is an intensive task.
* Make use of the return values of the visitor when possible.
* Instead of walking a tree multiple times, walk it once, use `unist-util-is`
* to check if a node matches, and then perform different operations.
*
* You can change the tree.
* See `Visitor` for more info.
*
* @param tree
*   Tree to traverse.
* @param test
*   `unist-util-is`-compatible test
* @param visitor
*   Handle each node.
* @param reverse
*   Traverse in reverse preorder (NRL) instead of the default preorder (NLR).
* @returns
*   Nothing.
*/
var visitParents = (function(tree, test, visitor, reverse) {
	if (typeof test === "function" && typeof visitor !== "function") {
		reverse = visitor;
		visitor = test;
		test = null;
	}
	const is = convert$1(test);
	const step = reverse ? -1 : 1;
	factory(tree, void 0, [])();
	/**
	* @param {Node} node
	* @param {number | undefined} index
	* @param {Array<Parent>} parents
	*/
	function factory(node, index, parents) {
		/** @type {Record<string, unknown>} */
		const value = node && typeof node === "object" ? node : {};
		if (typeof value.type === "string") {
			const name = typeof value.tagName === "string" ? value.tagName : typeof value.name === "string" ? value.name : void 0;
			Object.defineProperty(visit, "name", { value: "node (" + color(node.type + (name ? "<" + name + ">" : "")) + ")" });
		}
		return visit;
		function visit() {
			/** @type {ActionTuple} */
			let result = [];
			/** @type {ActionTuple} */
			let subresult;
			/** @type {number} */
			let offset;
			/** @type {Array<Parent>} */
			let grandparents;
			if (!test || is(node, index, parents[parents.length - 1] || null)) {
				result = toResult(visitor(node, parents));
				if (result[0] === false) return result;
			}
			if (node.children && result[0] !== "skip") {
				offset = (reverse ? node.children.length : -1) + step;
				grandparents = parents.concat(node);
				while (offset > -1 && offset < node.children.length) {
					subresult = factory(node.children[offset], offset, grandparents)();
					if (subresult[0] === false) return subresult;
					offset = typeof subresult[1] === "number" ? subresult[1] : offset + step;
				}
			}
			return result;
		}
	}
});
/**
* Turn a return value into a clean result.
*
* @param {VisitorResult} value
*   Valid return values from visitors.
* @returns {ActionTuple}
*   Clean result.
*/
function toResult(value) {
	if (Array.isArray(value)) return value;
	if (typeof value === "number") return [true, value];
	return [value];
}
//#endregion
//#region ../../node_modules/unist-util-visit/lib/index.js
/**
* @typedef {import('unist').Node} Node
* @typedef {import('unist').Parent} Parent
* @typedef {import('unist-util-is').Test} Test
* @typedef {import('unist-util-visit-parents').VisitorResult} VisitorResult
*/
/**
* Check if `Child` can be a child of `Ancestor`.
*
* Returns the ancestor when `Child` can be a child of `Ancestor`, or returns
* `never`.
*
* @template {Node} Ancestor
*   Node type.
* @template {Node} Child
*   Node type.
* @typedef {(
*   Ancestor extends Parent
*     ? Child extends Ancestor['children'][number]
*       ? Ancestor
*       : never
*     : never
* )} ParentsOf
*/
/**
* @template {Node} [Visited=Node]
*   Visited node type.
* @template {Parent} [Ancestor=Parent]
*   Ancestor type.
* @callback Visitor
*   Handle a node (matching `test`, if given).
*
*   Visitors are free to transform `node`.
*   They can also transform `parent`.
*
*   Replacing `node` itself, if `SKIP` is not returned, still causes its
*   descendants to be walked (which is a bug).
*
*   When adding or removing previous siblings of `node` (or next siblings, in
*   case of reverse), the `Visitor` should return a new `Index` to specify the
*   sibling to traverse after `node` is traversed.
*   Adding or removing next siblings of `node` (or previous siblings, in case
*   of reverse) is handled as expected without needing to return a new `Index`.
*
*   Removing the children property of `parent` still results in them being
*   traversed.
* @param {Visited} node
*   Found node.
* @param {Visited extends Node ? number | null : never} index
*   Index of `node` in `parent`.
* @param {Ancestor extends Node ? Ancestor | null : never} parent
*   Parent of `node`.
* @returns {VisitorResult}
*   What to do next.
*
*   An `Index` is treated as a tuple of `[CONTINUE, Index]`.
*   An `Action` is treated as a tuple of `[Action]`.
*
*   Passing a tuple back only makes sense if the `Action` is `SKIP`.
*   When the `Action` is `EXIT`, that action can be returned.
*   When the `Action` is `CONTINUE`, `Index` can be returned.
*/
/**
* Build a typed `Visitor` function from a node and all possible parents.
*
* It will infer which values are passed as `node` and which as `parent`.
*
* @template {Node} Visited
*   Node type.
* @template {Parent} Ancestor
*   Parent type.
* @typedef {Visitor<Visited, ParentsOf<Ancestor, Visited>>} BuildVisitorFromMatch
*/
/**
* Build a typed `Visitor` function from a list of descendants and a test.
*
* It will infer which values are passed as `node` and which as `parent`.
*
* @template {Node} Descendant
*   Node type.
* @template {Test} Check
*   Test type.
* @typedef {(
*   BuildVisitorFromMatch<
*     import('unist-util-visit-parents/complex-types.js').Matches<Descendant, Check>,
*     Extract<Descendant, Parent>
*   >
* )} BuildVisitorFromDescendants
*/
/**
* Build a typed `Visitor` function from a tree and a test.
*
* It will infer which values are passed as `node` and which as `parent`.
*
* @template {Node} [Tree=Node]
*   Node type.
* @template {Test} [Check=string]
*   Test type.
* @typedef {(
*   BuildVisitorFromDescendants<
*     import('unist-util-visit-parents/complex-types.js').InclusiveDescendant<Tree>,
*     Check
*   >
* )} BuildVisitor
*/
/**
* Visit nodes.
*
* This algorithm performs *depth-first* *tree traversal* in *preorder*
* (**NLR**) or if `reverse` is given, in *reverse preorder* (**NRL**).
*
* You can choose for which nodes `visitor` is called by passing a `test`.
* For complex tests, you should test yourself in `visitor`, as it will be
* faster and will have improved type information.
*
* Walking the tree is an intensive task.
* Make use of the return values of the visitor when possible.
* Instead of walking a tree multiple times, walk it once, use `unist-util-is`
* to check if a node matches, and then perform different operations.
*
* You can change the tree.
* See `Visitor` for more info.
*
* @param tree
*   Tree to traverse.
* @param test
*   `unist-util-is`-compatible test
* @param visitor
*   Handle each node.
* @param reverse
*   Traverse in reverse preorder (NRL) instead of the default preorder (NLR).
* @returns
*   Nothing.
*/
var visit = (function(tree, test, visitor, reverse) {
	if (typeof test === "function" && typeof visitor !== "function") {
		reverse = visitor;
		visitor = test;
		test = null;
	}
	visitParents(tree, test, overload, reverse);
	/**
	* @param {Node} node
	* @param {Array<Parent>} parents
	*/
	function overload(node, parents) {
		const parent = parents[parents.length - 1];
		return visitor(node, parent ? parent.children.indexOf(node) : null, parent);
	}
});
//#endregion
//#region node_modules/mdast-util-to-string/lib/index.js
/**
* @typedef {import('mdast').Root|import('mdast').Content} Node
*
* @typedef Options
*   Configuration (optional).
* @property {boolean | null | undefined} [includeImageAlt=true]
*   Whether to use `alt` for `image`s.
* @property {boolean | null | undefined} [includeHtml=true]
*   Whether to use `value` of HTML.
*/
/** @type {Options} */
var emptyOptions = {};
/**
* Get the text content of a node or list of nodes.
*
* Prefers the node’s plain-text fields, otherwise serializes its children,
* and if the given value is an array, serialize the nodes in it.
*
* @param {unknown} value
*   Thing to serialize, typically `Node`.
* @param {Options | null | undefined} [options]
*   Configuration (optional).
* @returns {string}
*   Serialized `value`.
*/
function toString(value, options) {
	const settings = options || emptyOptions;
	return one(value, typeof settings.includeImageAlt === "boolean" ? settings.includeImageAlt : true, typeof settings.includeHtml === "boolean" ? settings.includeHtml : true);
}
/**
* One node or several nodes.
*
* @param {unknown} value
*   Thing to serialize.
* @param {boolean} includeImageAlt
*   Include image `alt`s.
* @param {boolean} includeHtml
*   Include HTML.
* @returns {string}
*   Serialized node.
*/
function one(value, includeImageAlt, includeHtml) {
	if (node(value)) {
		if ("value" in value) return value.type === "html" && !includeHtml ? "" : value.value;
		if (includeImageAlt && "alt" in value && value.alt) return value.alt;
		if ("children" in value) return all(value.children, includeImageAlt, includeHtml);
	}
	if (Array.isArray(value)) return all(value, includeImageAlt, includeHtml);
	return "";
}
/**
* Serialize a list of nodes.
*
* @param {Array<unknown>} values
*   Thing to serialize.
* @param {boolean} includeImageAlt
*   Include image `alt`s.
* @param {boolean} includeHtml
*   Include HTML.
* @returns {string}
*   Serialized nodes.
*/
function all(values, includeImageAlt, includeHtml) {
	/** @type {Array<string>} */
	const result = [];
	let index = -1;
	while (++index < values.length) result[index] = one(values[index], includeImageAlt, includeHtml);
	return result.join("");
}
/**
* Check if `value` looks like a node.
*
* @param {unknown} value
*   Thing.
* @returns {value is Node}
*   Whether `value` is a node.
*/
function node(value) {
	return Boolean(value && typeof value === "object");
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/format-heading-as-setext.js
/**
* @typedef {import('mdast').Heading} Heading
* @typedef {import('../types.js').State} State
*/
/**
* @param {Heading} node
* @param {State} state
* @returns {boolean}
*/
function formatHeadingAsSetext(node, state) {
	let literalWithBreak = false;
	visit(node, (node) => {
		if ("value" in node && /\r?\n|\r/.test(node.value) || node.type === "break") {
			literalWithBreak = true;
			return false;
		}
	});
	return Boolean((!node.depth || node.depth < 3) && toString(node) && (state.options.setext || literalWithBreak));
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/heading.js
/**
* @typedef {import('mdast').Heading} Heading
* @typedef {import('../types.js').Parent} Parent
* @typedef {import('../types.js').State} State
* @typedef {import('../types.js').Info} Info
*/
/**
* @param {Heading} node
* @param {Parent | undefined} _
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function heading(node, _, state, info) {
	const rank = Math.max(Math.min(6, node.depth || 1), 1);
	const tracker = state.createTracker(info);
	if (formatHeadingAsSetext(node, state)) {
		const exit = state.enter("headingSetext");
		const subexit = state.enter("phrasing");
		const value = state.containerPhrasing(node, {
			...tracker.current(),
			before: "\n",
			after: "\n"
		});
		subexit();
		exit();
		return value + "\n" + (rank === 1 ? "=" : "-").repeat(value.length - (Math.max(value.lastIndexOf("\r"), value.lastIndexOf("\n")) + 1));
	}
	const sequence = "#".repeat(rank);
	const exit = state.enter("headingAtx");
	const subexit = state.enter("phrasing");
	tracker.move(sequence + " ");
	let value = state.containerPhrasing(node, {
		before: "# ",
		after: "\n",
		...tracker.current()
	});
	if (/^[\t ]/.test(value)) value = "&#x" + value.charCodeAt(0).toString(16).toUpperCase() + ";" + value.slice(1);
	value = value ? sequence + " " + value : sequence;
	if (state.options.closeAtx) value += " " + sequence;
	subexit();
	exit();
	return value;
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/html.js
/**
* @typedef {import('mdast').HTML} HTML
*/
html.peek = htmlPeek;
/**
* @param {HTML} node
* @returns {string}
*/
function html(node) {
	return node.value || "";
}
/**
* @returns {string}
*/
function htmlPeek() {
	return "<";
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/image.js
/**
* @typedef {import('mdast').Image} Image
* @typedef {import('../types.js').Parent} Parent
* @typedef {import('../types.js').State} State
* @typedef {import('../types.js').Info} Info
*/
image.peek = imagePeek;
/**
* @param {Image} node
* @param {Parent | undefined} _
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function image(node, _, state, info) {
	const quote = checkQuote(state);
	const suffix = quote === "\"" ? "Quote" : "Apostrophe";
	const exit = state.enter("image");
	let subexit = state.enter("label");
	const tracker = state.createTracker(info);
	let value = tracker.move("![");
	value += tracker.move(state.safe(node.alt, {
		before: value,
		after: "]",
		...tracker.current()
	}));
	value += tracker.move("](");
	subexit();
	if (!node.url && node.title || /[\0- \u007F]/.test(node.url)) {
		subexit = state.enter("destinationLiteral");
		value += tracker.move("<");
		value += tracker.move(state.safe(node.url, {
			before: value,
			after: ">",
			...tracker.current()
		}));
		value += tracker.move(">");
	} else {
		subexit = state.enter("destinationRaw");
		value += tracker.move(state.safe(node.url, {
			before: value,
			after: node.title ? " " : ")",
			...tracker.current()
		}));
	}
	subexit();
	if (node.title) {
		subexit = state.enter(`title${suffix}`);
		value += tracker.move(" " + quote);
		value += tracker.move(state.safe(node.title, {
			before: value,
			after: quote,
			...tracker.current()
		}));
		value += tracker.move(quote);
		subexit();
	}
	value += tracker.move(")");
	exit();
	return value;
}
/**
* @returns {string}
*/
function imagePeek() {
	return "!";
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/image-reference.js
/**
* @typedef {import('mdast').ImageReference} ImageReference
* @typedef {import('../types.js').Parent} Parent
* @typedef {import('../types.js').State} State
* @typedef {import('../types.js').Info} Info
*/
imageReference.peek = imageReferencePeek;
/**
* @param {ImageReference} node
* @param {Parent | undefined} _
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function imageReference(node, _, state, info) {
	const type = node.referenceType;
	const exit = state.enter("imageReference");
	let subexit = state.enter("label");
	const tracker = state.createTracker(info);
	let value = tracker.move("![");
	const alt = state.safe(node.alt, {
		before: value,
		after: "]",
		...tracker.current()
	});
	value += tracker.move(alt + "][");
	subexit();
	const stack = state.stack;
	state.stack = [];
	subexit = state.enter("reference");
	const reference = state.safe(state.associationId(node), {
		before: value,
		after: "]",
		...tracker.current()
	});
	subexit();
	state.stack = stack;
	exit();
	if (type === "full" || !alt || alt !== reference) value += tracker.move(reference + "]");
	else if (type === "shortcut") value = value.slice(0, -1);
	else value += tracker.move("]");
	return value;
}
/**
* @returns {string}
*/
function imageReferencePeek() {
	return "!";
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/pattern-compile.js
/**
* @typedef {import('../types.js').Unsafe} Unsafe
*/
/**
* @param {Unsafe} pattern
* @returns {RegExp}
*/
function patternCompile(pattern) {
	if (!pattern._compiled) {
		const before = (pattern.atBreak ? "[\\r\\n][\\t ]*" : "") + (pattern.before ? "(?:" + pattern.before + ")" : "");
		pattern._compiled = new RegExp((before ? "(" + before + ")" : "") + (/[|\\{}()[\]^$+*?.-]/.test(pattern.character) ? "\\" : "") + pattern.character + (pattern.after ? "(?:" + pattern.after + ")" : ""), "g");
	}
	return pattern._compiled;
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/inline-code.js
/**
* @typedef {import('mdast').InlineCode} InlineCode
* @typedef {import('../types.js').Parent} Parent
* @typedef {import('../types.js').State} State
*/
inlineCode.peek = inlineCodePeek;
/**
* @param {InlineCode} node
* @param {Parent | undefined} _
* @param {State} state
* @returns {string}
*/
function inlineCode(node, _, state) {
	let value = node.value || "";
	let sequence = "`";
	let index = -1;
	while (new RegExp("(^|[^`])" + sequence + "([^`]|$)").test(value)) sequence += "`";
	if (/[^ \r\n]/.test(value) && (/^[ \r\n]/.test(value) && /[ \r\n]$/.test(value) || /^`|`$/.test(value))) value = " " + value + " ";
	while (++index < state.unsafe.length) {
		const pattern = state.unsafe[index];
		const expression = patternCompile(pattern);
		/** @type {RegExpExecArray | null} */
		let match;
		if (!pattern.atBreak) continue;
		while (match = expression.exec(value)) {
			let position = match.index;
			if (value.charCodeAt(position) === 10 && value.charCodeAt(position - 1) === 13) position--;
			value = value.slice(0, position) + " " + value.slice(match.index + 1);
		}
	}
	return sequence + value + sequence;
}
/**
* @returns {string}
*/
function inlineCodePeek() {
	return "`";
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/format-link-as-autolink.js
/**
* @typedef {import('mdast').Link} Link
* @typedef {import('../types.js').State} State
*/
/**
* @param {Link} node
* @param {State} state
* @returns {boolean}
*/
function formatLinkAsAutolink(node, state) {
	const raw = toString(node);
	return Boolean(!state.options.resourceLink && node.url && !node.title && node.children && node.children.length === 1 && node.children[0].type === "text" && (raw === node.url || "mailto:" + raw === node.url) && /^[a-z][a-z+.-]+:/i.test(node.url) && !/[\0- <>\u007F]/.test(node.url));
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/link.js
/**
* @typedef {import('mdast').Link} Link
* @typedef {import('../types.js').Parent} Parent
* @typedef {import('../types.js').State} State
* @typedef {import('../types.js').Info} Info
* @typedef {import('../types.js').Exit} Exit
*/
link.peek = linkPeek;
/**
* @param {Link} node
* @param {Parent | undefined} _
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function link(node, _, state, info) {
	const quote = checkQuote(state);
	const suffix = quote === "\"" ? "Quote" : "Apostrophe";
	const tracker = state.createTracker(info);
	/** @type {Exit} */
	let exit;
	/** @type {Exit} */
	let subexit;
	if (formatLinkAsAutolink(node, state)) {
		const stack = state.stack;
		state.stack = [];
		exit = state.enter("autolink");
		let value = tracker.move("<");
		value += tracker.move(state.containerPhrasing(node, {
			before: value,
			after: ">",
			...tracker.current()
		}));
		value += tracker.move(">");
		exit();
		state.stack = stack;
		return value;
	}
	exit = state.enter("link");
	subexit = state.enter("label");
	let value = tracker.move("[");
	value += tracker.move(state.containerPhrasing(node, {
		before: value,
		after: "](",
		...tracker.current()
	}));
	value += tracker.move("](");
	subexit();
	if (!node.url && node.title || /[\0- \u007F]/.test(node.url)) {
		subexit = state.enter("destinationLiteral");
		value += tracker.move("<");
		value += tracker.move(state.safe(node.url, {
			before: value,
			after: ">",
			...tracker.current()
		}));
		value += tracker.move(">");
	} else {
		subexit = state.enter("destinationRaw");
		value += tracker.move(state.safe(node.url, {
			before: value,
			after: node.title ? " " : ")",
			...tracker.current()
		}));
	}
	subexit();
	if (node.title) {
		subexit = state.enter(`title${suffix}`);
		value += tracker.move(" " + quote);
		value += tracker.move(state.safe(node.title, {
			before: value,
			after: quote,
			...tracker.current()
		}));
		value += tracker.move(quote);
		subexit();
	}
	value += tracker.move(")");
	exit();
	return value;
}
/**
* @param {Link} node
* @param {Parent | undefined} _
* @param {State} state
* @returns {string}
*/
function linkPeek(node, _, state) {
	return formatLinkAsAutolink(node, state) ? "<" : "[";
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/link-reference.js
/**
* @typedef {import('mdast').LinkReference} LinkReference
* @typedef {import('../types.js').Parent} Parent
* @typedef {import('../types.js').State} State
* @typedef {import('../types.js').Info} Info
*/
linkReference.peek = linkReferencePeek;
/**
* @param {LinkReference} node
* @param {Parent | undefined} _
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function linkReference(node, _, state, info) {
	const type = node.referenceType;
	const exit = state.enter("linkReference");
	let subexit = state.enter("label");
	const tracker = state.createTracker(info);
	let value = tracker.move("[");
	const text = state.containerPhrasing(node, {
		before: value,
		after: "]",
		...tracker.current()
	});
	value += tracker.move(text + "][");
	subexit();
	const stack = state.stack;
	state.stack = [];
	subexit = state.enter("reference");
	const reference = state.safe(state.associationId(node), {
		before: value,
		after: "]",
		...tracker.current()
	});
	subexit();
	state.stack = stack;
	exit();
	if (type === "full" || !text || text !== reference) value += tracker.move(reference + "]");
	else if (type === "shortcut") value = value.slice(0, -1);
	else value += tracker.move("]");
	return value;
}
/**
* @returns {string}
*/
function linkReferencePeek() {
	return "[";
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/check-bullet.js
/**
* @typedef {import('../types.js').State} State
* @typedef {import('../types.js').Options} Options
*/
/**
* @param {State} state
* @returns {Exclude<Options['bullet'], null | undefined>}
*/
function checkBullet(state) {
	const marker = state.options.bullet || "*";
	if (marker !== "*" && marker !== "+" && marker !== "-") throw new Error("Cannot serialize items with `" + marker + "` for `options.bullet`, expected `*`, `+`, or `-`");
	return marker;
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/check-bullet-other.js
/**
* @typedef {import('../types.js').State} State
* @typedef {import('../types.js').Options} Options
*/
/**
* @param {State} state
* @returns {Exclude<Options['bullet'], null | undefined>}
*/
function checkBulletOther(state) {
	const bullet = checkBullet(state);
	const bulletOther = state.options.bulletOther;
	if (!bulletOther) return bullet === "*" ? "-" : "*";
	if (bulletOther !== "*" && bulletOther !== "+" && bulletOther !== "-") throw new Error("Cannot serialize items with `" + bulletOther + "` for `options.bulletOther`, expected `*`, `+`, or `-`");
	if (bulletOther === bullet) throw new Error("Expected `bullet` (`" + bullet + "`) and `bulletOther` (`" + bulletOther + "`) to be different");
	return bulletOther;
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/check-bullet-ordered.js
/**
* @typedef {import('../types.js').State} State
* @typedef {import('../types.js').Options} Options
*/
/**
* @param {State} state
* @returns {Exclude<Options['bulletOrdered'], null | undefined>}
*/
function checkBulletOrdered(state) {
	const marker = state.options.bulletOrdered || ".";
	if (marker !== "." && marker !== ")") throw new Error("Cannot serialize items with `" + marker + "` for `options.bulletOrdered`, expected `.` or `)`");
	return marker;
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/check-bullet-ordered-other.js
/**
* @typedef {import('../types.js').State} State
* @typedef {import('../types.js').Options} Options
*/
/**
* @param {State} state
* @returns {Exclude<Options['bulletOrdered'], null | undefined>}
*/
function checkBulletOrderedOther(state) {
	const bulletOrdered = checkBulletOrdered(state);
	const bulletOrderedOther = state.options.bulletOrderedOther;
	if (!bulletOrderedOther) return bulletOrdered === "." ? ")" : ".";
	if (bulletOrderedOther !== "." && bulletOrderedOther !== ")") throw new Error("Cannot serialize items with `" + bulletOrderedOther + "` for `options.bulletOrderedOther`, expected `*`, `+`, or `-`");
	if (bulletOrderedOther === bulletOrdered) throw new Error("Expected `bulletOrdered` (`" + bulletOrdered + "`) and `bulletOrderedOther` (`" + bulletOrderedOther + "`) to be different");
	return bulletOrderedOther;
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/check-rule.js
/**
* @typedef {import('../types.js').State} State
* @typedef {import('../types.js').Options} Options
*/
/**
* @param {State} state
* @returns {Exclude<Options['rule'], null | undefined>}
*/
function checkRule(state) {
	const marker = state.options.rule || "*";
	if (marker !== "*" && marker !== "-" && marker !== "_") throw new Error("Cannot serialize rules with `" + marker + "` for `options.rule`, expected `*`, `-`, or `_`");
	return marker;
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/list.js
/**
* @typedef {import('mdast').List} List
* @typedef {import('../types.js').Parent} Parent
* @typedef {import('../types.js').State} State
* @typedef {import('../types.js').Info} Info
*/
/**
* @param {List} node
* @param {Parent | undefined} parent
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function list(node, parent, state, info) {
	const exit = state.enter("list");
	const bulletCurrent = state.bulletCurrent;
	/** @type {string} */
	let bullet = node.ordered ? checkBulletOrdered(state) : checkBullet(state);
	/** @type {string} */
	const bulletOther = node.ordered ? checkBulletOrderedOther(state) : checkBulletOther(state);
	const bulletLastUsed = state.bulletLastUsed;
	let useDifferentMarker = false;
	if (parent && (node.ordered ? state.options.bulletOrderedOther : state.options.bulletOther) && bulletLastUsed && bullet === bulletLastUsed) useDifferentMarker = true;
	if (!node.ordered) {
		const firstListItem = node.children ? node.children[0] : void 0;
		if ((bullet === "*" || bullet === "-") && firstListItem && (!firstListItem.children || !firstListItem.children[0]) && state.stack[state.stack.length - 1] === "list" && state.stack[state.stack.length - 2] === "listItem" && state.stack[state.stack.length - 3] === "list" && state.stack[state.stack.length - 4] === "listItem" && state.indexStack[state.indexStack.length - 1] === 0 && state.indexStack[state.indexStack.length - 2] === 0 && state.indexStack[state.indexStack.length - 3] === 0) useDifferentMarker = true;
		if (checkRule(state) === bullet && firstListItem) {
			let index = -1;
			while (++index < node.children.length) {
				const item = node.children[index];
				if (item && item.type === "listItem" && item.children && item.children[0] && item.children[0].type === "thematicBreak") {
					useDifferentMarker = true;
					break;
				}
			}
		}
	}
	if (useDifferentMarker) bullet = bulletOther;
	state.bulletCurrent = bullet;
	const value = state.containerFlow(node, info);
	state.bulletLastUsed = bullet;
	state.bulletCurrent = bulletCurrent;
	exit();
	return value;
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/check-list-item-indent.js
/**
* @typedef {import('../types.js').State} State
* @typedef {import('../types.js').Options} Options
*/
/**
* @param {State} state
* @returns {Exclude<Options['listItemIndent'], null | undefined>}
*/
function checkListItemIndent(state) {
	const style = state.options.listItemIndent || "tab";
	if (style === 1 || style === "1") return "one";
	if (style !== "tab" && style !== "one" && style !== "mixed") throw new Error("Cannot serialize items with `" + style + "` for `options.listItemIndent`, expected `tab`, `one`, or `mixed`");
	return style;
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/list-item.js
/**
* @typedef {import('mdast').ListItem} ListItem
* @typedef {import('../types.js').Map} Map
* @typedef {import('../types.js').Parent} Parent
* @typedef {import('../types.js').State} State
* @typedef {import('../types.js').Info} Info
*/
/**
* @param {ListItem} node
* @param {Parent | undefined} parent
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function listItem(node, parent, state, info) {
	const listItemIndent = checkListItemIndent(state);
	let bullet = state.bulletCurrent || checkBullet(state);
	if (parent && parent.type === "list" && parent.ordered) bullet = (typeof parent.start === "number" && parent.start > -1 ? parent.start : 1) + (state.options.incrementListMarker === false ? 0 : parent.children.indexOf(node)) + bullet;
	let size = bullet.length + 1;
	if (listItemIndent === "tab" || listItemIndent === "mixed" && (parent && parent.type === "list" && parent.spread || node.spread)) size = Math.ceil(size / 4) * 4;
	const tracker = state.createTracker(info);
	tracker.move(bullet + " ".repeat(size - bullet.length));
	tracker.shift(size);
	const exit = state.enter("listItem");
	const value = state.indentLines(state.containerFlow(node, tracker.current()), map);
	exit();
	return value;
	/** @type {Map} */
	function map(line, index, blank) {
		if (index) return (blank ? "" : " ".repeat(size)) + line;
		return (blank ? bullet : bullet + " ".repeat(size - bullet.length)) + line;
	}
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/paragraph.js
/**
* @typedef {import('mdast').Paragraph} Paragraph
* @typedef {import('../types.js').Parent} Parent
* @typedef {import('../types.js').State} State
* @typedef {import('../types.js').Info} Info
*/
/**
* @param {Paragraph} node
* @param {Parent | undefined} _
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function paragraph(node, _, state, info) {
	const exit = state.enter("paragraph");
	const subexit = state.enter("phrasing");
	const value = state.containerPhrasing(node, info);
	subexit();
	exit();
	return value;
}
//#endregion
//#region node_modules/unist-util-is/lib/index.js
/**
* Generate an assertion from a test.
*
* Useful if you’re going to test many nodes, for example when creating a
* utility where something else passes a compatible test.
*
* The created function is a bit faster because it expects valid input only:
* a `node`, `index`, and `parent`.
*
* @param test
*   *   when nullish, checks if `node` is a `Node`.
*   *   when `string`, works like passing `(node) => node.type === test`.
*   *   when `function` checks if function passed the node is true.
*   *   when `object`, checks that all keys in test are in node, and that they have (strictly) equal values.
*   *   when `array`, checks if any one of the subtests pass.
* @returns
*   An assertion.
*/
var convert = (function(test) {
	if (test === void 0 || test === null) return ok;
	if (typeof test === "string") return typeFactory(test);
	if (typeof test === "object") return Array.isArray(test) ? anyFactory(test) : propsFactory(test);
	if (typeof test === "function") return castFactory(test);
	throw new Error("Expected function, string, or object as test");
});
/**
* @param {Array<string | Props | TestFunctionAnything>} tests
* @returns {AssertAnything}
*/
function anyFactory(tests) {
	/** @type {Array<AssertAnything>} */
	const checks = [];
	let index = -1;
	while (++index < tests.length) checks[index] = convert(tests[index]);
	return castFactory(any);
	/**
	* @this {unknown}
	* @param {Array<unknown>} parameters
	* @returns {boolean}
	*/
	function any(...parameters) {
		let index = -1;
		while (++index < checks.length) if (checks[index].call(this, ...parameters)) return true;
		return false;
	}
}
/**
* Turn an object into a test for a node with a certain fields.
*
* @param {Props} check
* @returns {AssertAnything}
*/
function propsFactory(check) {
	return castFactory(all);
	/**
	* @param {Node} node
	* @returns {boolean}
	*/
	function all(node) {
		/** @type {string} */
		let key;
		for (key in check) if (node[key] !== check[key]) return false;
		return true;
	}
}
/**
* Turn a string into a test for a node with a certain type.
*
* @param {string} check
* @returns {AssertAnything}
*/
function typeFactory(check) {
	return castFactory(type);
	/**
	* @param {Node} node
	*/
	function type(node) {
		return node && node.type === check;
	}
}
/**
* Turn a custom test into a test for a node that passes that test.
*
* @param {TestFunctionAnything} check
* @returns {AssertAnything}
*/
function castFactory(check) {
	return assertion;
	/**
	* @this {unknown}
	* @param {unknown} node
	* @param {Array<unknown>} parameters
	* @returns {boolean}
	*/
	function assertion(node, ...parameters) {
		return Boolean(node && typeof node === "object" && "type" in node && Boolean(check.call(this, node, ...parameters)));
	}
}
function ok() {
	return true;
}
//#endregion
//#region node_modules/mdast-util-phrasing/lib/index.js
/**
* @typedef {import('mdast').PhrasingContent} PhrasingContent
* @typedef {import('unist-util-is').AssertPredicate<PhrasingContent>} AssertPredicatePhrasing
*/
/**
* Check if the given value is *phrasing content*.
*
* @param
*   Thing to check, typically `Node`.
* @returns
*   Whether `value` is phrasing content.
*/
var phrasing = convert([
	"break",
	"delete",
	"emphasis",
	"footnote",
	"footnoteReference",
	"image",
	"imageReference",
	"inlineCode",
	"link",
	"linkReference",
	"strong",
	"text"
]);
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/root.js
/**
* @typedef {import('mdast').Root} Root
* @typedef {import('../types.js').Parent} Parent
* @typedef {import('../types.js').State} State
* @typedef {import('../types.js').Info} Info
*/
/**
* @param {Root} node
* @param {Parent | undefined} _
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function root(node, _, state, info) {
	return (node.children.some((d) => phrasing(d)) ? state.containerPhrasing : state.containerFlow).call(state, node, info);
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/check-strong.js
/**
* @typedef {import('../types.js').State} State
* @typedef {import('../types.js').Options} Options
*/
/**
* @param {State} state
* @returns {Exclude<Options['strong'], null | undefined>}
*/
function checkStrong(state) {
	const marker = state.options.strong || "*";
	if (marker !== "*" && marker !== "_") throw new Error("Cannot serialize strong with `" + marker + "` for `options.strong`, expected `*`, or `_`");
	return marker;
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/strong.js
/**
* @typedef {import('mdast').Strong} Strong
* @typedef {import('../types.js').Parent} Parent
* @typedef {import('../types.js').State} State
* @typedef {import('../types.js').Info} Info
*/
strong.peek = strongPeek;
/**
* @param {Strong} node
* @param {Parent | undefined} _
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function strong(node, _, state, info) {
	const marker = checkStrong(state);
	const exit = state.enter("strong");
	const tracker = state.createTracker(info);
	let value = tracker.move(marker + marker);
	value += tracker.move(state.containerPhrasing(node, {
		before: value,
		after: marker,
		...tracker.current()
	}));
	value += tracker.move(marker + marker);
	exit();
	return value;
}
/**
* @param {Strong} _
* @param {Parent | undefined} _1
* @param {State} state
* @returns {string}
*/
function strongPeek(_, _1, state) {
	return state.options.strong || "*";
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/text.js
/**
* @typedef {import('mdast').Text} Text
* @typedef {import('../types.js').Parent} Parent
* @typedef {import('../types.js').State} State
* @typedef {import('../types.js').Info} Info
*/
/**
* @param {Text} node
* @param {Parent | undefined} _
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function text(node, _, state, info) {
	return state.safe(node.value, info);
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/check-rule-repetition.js
/**
* @typedef {import('../types.js').State} State
* @typedef {import('../types.js').Options} Options
*/
/**
* @param {State} state
* @returns {Exclude<Options['ruleRepetition'], null | undefined>}
*/
function checkRuleRepetition(state) {
	const repetition = state.options.ruleRepetition || 3;
	if (repetition < 3) throw new Error("Cannot serialize rules with repetition `" + repetition + "` for `options.ruleRepetition`, expected `3` or more");
	return repetition;
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/thematic-break.js
/**
* @typedef {import('mdast').ThematicBreak} ThematicBreak
* @typedef {import('../types.js').Parent} Parent
* @typedef {import('../types.js').State} State
*/
/**
* @param {ThematicBreak} _
* @param {Parent | undefined} _1
* @param {State} state
* @returns {string}
*/
function thematicBreak(_, _1, state) {
	const value = (checkRule(state) + (state.options.ruleSpaces ? " " : "")).repeat(checkRuleRepetition(state));
	return state.options.ruleSpaces ? value.slice(0, -1) : value;
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/index.js
/**
* Default (CommonMark) handlers.
*/
var handle = {
	blockquote,
	break: hardBreak,
	code,
	definition,
	emphasis,
	hardBreak,
	heading,
	html,
	image,
	imageReference,
	inlineCode,
	link,
	linkReference,
	list,
	listItem,
	paragraph,
	root,
	strong,
	text,
	thematicBreak
};
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/join.js
/**
* @typedef {import('./types.js').Join} Join
*/
/** @type {Array<Join>} */
var join = [joinDefaults];
/** @type {Join} */
function joinDefaults(left, right, parent, state) {
	if (right.type === "code" && formatCodeAsIndented(right, state) && (left.type === "list" || left.type === right.type && formatCodeAsIndented(left, state))) return false;
	if (left.type === "list" && left.type === right.type && Boolean(left.ordered) === Boolean(right.ordered) && !(left.ordered ? state.options.bulletOrderedOther : state.options.bulletOther)) return false;
	if ("spread" in parent && typeof parent.spread === "boolean") {
		if (left.type === "paragraph" && (left.type === right.type || right.type === "definition" || right.type === "heading" && formatHeadingAsSetext(right, state))) return;
		return parent.spread ? 1 : 0;
	}
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/unsafe.js
/**
* @typedef {import('./types.js').Unsafe} Unsafe
* @typedef {import('./types.js').ConstructName} ConstructName
*/
/**
* List of constructs that occur in phrasing (paragraphs, headings), but cannot
* contain things like attention (emphasis, strong), images, or links.
* So they sort of cancel each other out.
* Note: could use a better name.
*
* @type {Array<ConstructName>}
*/
var fullPhrasingSpans = [
	"autolink",
	"destinationLiteral",
	"destinationRaw",
	"reference",
	"titleQuote",
	"titleApostrophe"
];
/** @type {Array<Unsafe>} */
var unsafe = [
	{
		character: "	",
		after: "[\\r\\n]",
		inConstruct: "phrasing"
	},
	{
		character: "	",
		before: "[\\r\\n]",
		inConstruct: "phrasing"
	},
	{
		character: "	",
		inConstruct: ["codeFencedLangGraveAccent", "codeFencedLangTilde"]
	},
	{
		character: "\r",
		inConstruct: [
			"codeFencedLangGraveAccent",
			"codeFencedLangTilde",
			"codeFencedMetaGraveAccent",
			"codeFencedMetaTilde",
			"destinationLiteral",
			"headingAtx"
		]
	},
	{
		character: "\n",
		inConstruct: [
			"codeFencedLangGraveAccent",
			"codeFencedLangTilde",
			"codeFencedMetaGraveAccent",
			"codeFencedMetaTilde",
			"destinationLiteral",
			"headingAtx"
		]
	},
	{
		character: " ",
		after: "[\\r\\n]",
		inConstruct: "phrasing"
	},
	{
		character: " ",
		before: "[\\r\\n]",
		inConstruct: "phrasing"
	},
	{
		character: " ",
		inConstruct: ["codeFencedLangGraveAccent", "codeFencedLangTilde"]
	},
	{
		character: "!",
		after: "\\[",
		inConstruct: "phrasing",
		notInConstruct: fullPhrasingSpans
	},
	{
		character: "\"",
		inConstruct: "titleQuote"
	},
	{
		atBreak: true,
		character: "#"
	},
	{
		character: "#",
		inConstruct: "headingAtx",
		after: "(?:[\r\n]|$)"
	},
	{
		character: "&",
		after: "[#A-Za-z]",
		inConstruct: "phrasing"
	},
	{
		character: "'",
		inConstruct: "titleApostrophe"
	},
	{
		character: "(",
		inConstruct: "destinationRaw"
	},
	{
		before: "\\]",
		character: "(",
		inConstruct: "phrasing",
		notInConstruct: fullPhrasingSpans
	},
	{
		atBreak: true,
		before: "\\d+",
		character: ")"
	},
	{
		character: ")",
		inConstruct: "destinationRaw"
	},
	{
		atBreak: true,
		character: "*",
		after: "(?:[ 	\r\n*])"
	},
	{
		character: "*",
		inConstruct: "phrasing",
		notInConstruct: fullPhrasingSpans
	},
	{
		atBreak: true,
		character: "+",
		after: "(?:[ 	\r\n])"
	},
	{
		atBreak: true,
		character: "-",
		after: "(?:[ 	\r\n-])"
	},
	{
		atBreak: true,
		before: "\\d+",
		character: ".",
		after: "(?:[ 	\r\n]|$)"
	},
	{
		atBreak: true,
		character: "<",
		after: "[!/?A-Za-z]"
	},
	{
		character: "<",
		after: "[!/?A-Za-z]",
		inConstruct: "phrasing",
		notInConstruct: fullPhrasingSpans
	},
	{
		character: "<",
		inConstruct: "destinationLiteral"
	},
	{
		atBreak: true,
		character: "="
	},
	{
		atBreak: true,
		character: ">"
	},
	{
		character: ">",
		inConstruct: "destinationLiteral"
	},
	{
		atBreak: true,
		character: "["
	},
	{
		character: "[",
		inConstruct: "phrasing",
		notInConstruct: fullPhrasingSpans
	},
	{
		character: "[",
		inConstruct: ["label", "reference"]
	},
	{
		character: "\\",
		after: "[\\r\\n]",
		inConstruct: "phrasing"
	},
	{
		character: "]",
		inConstruct: ["label", "reference"]
	},
	{
		atBreak: true,
		character: "_"
	},
	{
		character: "_",
		inConstruct: "phrasing",
		notInConstruct: fullPhrasingSpans
	},
	{
		atBreak: true,
		character: "`"
	},
	{
		character: "`",
		inConstruct: ["codeFencedLangGraveAccent", "codeFencedMetaGraveAccent"]
	},
	{
		character: "`",
		inConstruct: "phrasing",
		notInConstruct: fullPhrasingSpans
	},
	{
		atBreak: true,
		character: "~"
	}
];
//#endregion
//#region ../../node_modules/decode-named-character-reference/index.dom.js
var element = document.createElement("i");
/**
* @param {string} value
* @returns {string|false}
*/
function decodeNamedCharacterReference(value) {
	const characterReference = "&" + value + ";";
	element.innerHTML = characterReference;
	const char = element.textContent;
	if (char.charCodeAt(char.length - 1) === 59 && value !== "semi") return false;
	return char === characterReference ? false : char;
}
//#endregion
//#region node_modules/micromark-util-decode-numeric-character-reference/index.js
/**
* Turn the number (in string form as either hexa- or plain decimal) coming from
* a numeric character reference into a character.
*
* Sort of like `String.fromCharCode(Number.parseInt(value, base))`, but makes
* non-characters and control characters safe.
*
* @param {string} value
*   Value to decode.
* @param {number} base
*   Numeric base.
* @returns {string}
*   Character.
*/
function decodeNumericCharacterReference(value, base) {
	const code = Number.parseInt(value, base);
	if (code < 9 || code === 11 || code > 13 && code < 32 || code > 126 && code < 160 || code > 55295 && code < 57344 || code > 64975 && code < 65008 || (code & 65535) === 65535 || (code & 65535) === 65534 || code > 1114111) return "�";
	return String.fromCharCode(code);
}
//#endregion
//#region node_modules/micromark-util-decode-string/index.js
var characterEscapeOrReference = /\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;
/**
* Decode markdown strings (which occur in places such as fenced code info
* strings, destinations, labels, and titles).
*
* The “string” content type allows character escapes and -references.
* This decodes those.
*
* @param {string} value
*   Value to decode.
* @returns {string}
*   Decoded value.
*/
function decodeString(value) {
	return value.replace(characterEscapeOrReference, decode);
}
/**
* @param {string} $0
* @param {string} $1
* @param {string} $2
* @returns {string}
*/
function decode($0, $1, $2) {
	if ($1) return $1;
	if ($2.charCodeAt(0) === 35) {
		const head = $2.charCodeAt(1);
		const hex = head === 120 || head === 88;
		return decodeNumericCharacterReference($2.slice(hex ? 2 : 1), hex ? 16 : 10);
	}
	return decodeNamedCharacterReference($2) || $0;
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/association.js
/**
* @typedef {import('../types.js').AssociationId} AssociationId
*/
/**
* Get an identifier from an association to match it to others.
*
* Associations are nodes that match to something else through an ID:
* <https://github.com/syntax-tree/mdast#association>.
*
* The `label` of an association is the string value: character escapes and
* references work, and casing is intact.
* The `identifier` is used to match one association to another:
* controversially, character escapes and references don’t work in this
* matching: `&copy;` does not match `©`, and `\+` does not match `+`.
*
* But casing is ignored (and whitespace) is trimmed and collapsed: ` A\nb`
* matches `a b`.
* So, we do prefer the label when figuring out how we’re going to serialize:
* it has whitespace, casing, and we can ignore most useless character
* escapes and all character references.
*
* @type {AssociationId}
*/
function association(node) {
	if (node.label || !node.identifier) return node.label || "";
	return decodeString(node.identifier);
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/container-phrasing.js
/**
* @typedef {import('../types.js').Handle} Handle
* @typedef {import('../types.js').Info} Info
* @typedef {import('../types.js').Parent} Parent
* @typedef {import('../types.js').PhrasingContent} PhrasingContent
* @typedef {import('../types.js').State} State
*/
/**
* Serialize the children of a parent that contains phrasing children.
*
* These children will be joined flush together.
*
* @param {Parent & {children: Array<PhrasingContent>}} parent
*   Parent of flow nodes.
* @param {State} state
*   Info passed around about the current state.
* @param {Info} info
*   Info on where we are in the document we are generating.
* @returns {string}
*   Serialized children, joined together.
*/
function containerPhrasing(parent, state, info) {
	const indexStack = state.indexStack;
	const children = parent.children || [];
	/** @type {Array<string>} */
	const results = [];
	let index = -1;
	let before = info.before;
	indexStack.push(-1);
	let tracker = state.createTracker(info);
	while (++index < children.length) {
		const child = children[index];
		/** @type {string} */
		let after;
		indexStack[indexStack.length - 1] = index;
		if (index + 1 < children.length) {
			/** @type {Handle} */
			let handle = state.handle.handlers[children[index + 1].type];
			/** @type {Handle} */
			if (handle && handle.peek) handle = handle.peek;
			after = handle ? handle(children[index + 1], parent, state, {
				before: "",
				after: "",
				...tracker.current()
			}).charAt(0) : "";
		} else after = info.after;
		if (results.length > 0 && (before === "\r" || before === "\n") && child.type === "html") {
			results[results.length - 1] = results[results.length - 1].replace(/(\r?\n|\r)$/, " ");
			before = " ";
			tracker = state.createTracker(info);
			tracker.move(results.join(""));
		}
		results.push(tracker.move(state.handle(child, parent, state, {
			...tracker.current(),
			before,
			after
		})));
		before = results[results.length - 1].slice(-1);
	}
	indexStack.pop();
	return results.join("");
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/container-flow.js
/**
* @typedef {import('../types.js').FlowContent} FlowContent
* @typedef {import('../types.js').Node} Node
* @typedef {import('../types.js').Parent} Parent
* @typedef {import('../types.js').State} State
* @typedef {import('../types.js').TrackFields} TrackFields
*/
/**
* @param {Parent & {children: Array<FlowContent>}} parent
*   Parent of flow nodes.
* @param {State} state
*   Info passed around about the current state.
* @param {TrackFields} info
*   Info on where we are in the document we are generating.
* @returns {string}
*   Serialized children, joined by (blank) lines.
*/
function containerFlow(parent, state, info) {
	const indexStack = state.indexStack;
	const children = parent.children || [];
	const tracker = state.createTracker(info);
	/** @type {Array<string>} */
	const results = [];
	let index = -1;
	indexStack.push(-1);
	while (++index < children.length) {
		const child = children[index];
		indexStack[indexStack.length - 1] = index;
		results.push(tracker.move(state.handle(child, parent, state, {
			before: "\n",
			after: "\n",
			...tracker.current()
		})));
		if (child.type !== "list") state.bulletLastUsed = void 0;
		if (index < children.length - 1) results.push(tracker.move(between(child, children[index + 1], parent, state)));
	}
	indexStack.pop();
	return results.join("");
}
/**
* @param {Node} left
* @param {Node} right
* @param {Parent} parent
* @param {State} state
* @returns {string}
*/
function between(left, right, parent, state) {
	let index = state.join.length;
	while (index--) {
		const result = state.join[index](left, right, parent, state);
		if (result === true || result === 1) break;
		if (typeof result === "number") return "\n".repeat(1 + result);
		if (result === false) return "\n\n<!---->\n\n";
	}
	return "\n\n";
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/indent-lines.js
/**
* @typedef {import('../types.js').IndentLines} IndentLines
*/
var eol = /\r?\n|\r/g;
/**
* @type {IndentLines}
*/
function indentLines(value, map) {
	/** @type {Array<string>} */
	const result = [];
	let start = 0;
	let line = 0;
	/** @type {RegExpExecArray | null} */
	let match;
	while (match = eol.exec(value)) {
		one(value.slice(start, match.index));
		result.push(match[0]);
		start = match.index + match[0].length;
		line++;
	}
	one(value.slice(start));
	return result.join("");
	/**
	* @param {string} value
	*/
	function one(value) {
		result.push(map(value, line, !value));
	}
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/safe.js
/**
* @typedef {import('../types.js').State} State
* @typedef {import('../types.js').SafeConfig} SafeConfig
*/
/**
* Make a string safe for embedding in markdown constructs.
*
* In markdown, almost all punctuation characters can, in certain cases,
* result in something.
* Whether they do is highly subjective to where they happen and in what
* they happen.
*
* To solve this, `mdast-util-to-markdown` tracks:
*
* * Characters before and after something;
* * What “constructs” we are in.
*
* This information is then used by this function to escape or encode
* special characters.
*
* @param {State} state
*   Info passed around about the current state.
* @param {string | null | undefined} input
*   Raw value to make safe.
* @param {SafeConfig} config
*   Configuration.
* @returns {string}
*   Serialized markdown safe for embedding.
*/
function safe(state, input, config) {
	const value = (config.before || "") + (input || "") + (config.after || "");
	/** @type {Array<number>} */
	const positions = [];
	/** @type {Array<string>} */
	const result = [];
	/** @type {Record<number, {before: boolean, after: boolean}>} */
	const infos = {};
	let index = -1;
	while (++index < state.unsafe.length) {
		const pattern = state.unsafe[index];
		if (!patternInScope(state.stack, pattern)) continue;
		const expression = patternCompile(pattern);
		/** @type {RegExpExecArray | null} */
		let match;
		while (match = expression.exec(value)) {
			const before = "before" in pattern || Boolean(pattern.atBreak);
			const after = "after" in pattern;
			const position = match.index + (before ? match[1].length : 0);
			if (positions.includes(position)) {
				if (infos[position].before && !before) infos[position].before = false;
				if (infos[position].after && !after) infos[position].after = false;
			} else {
				positions.push(position);
				infos[position] = {
					before,
					after
				};
			}
		}
	}
	positions.sort(numerical);
	let start = config.before ? config.before.length : 0;
	const end = value.length - (config.after ? config.after.length : 0);
	index = -1;
	while (++index < positions.length) {
		const position = positions[index];
		if (position < start || position >= end) continue;
		if (position + 1 < end && positions[index + 1] === position + 1 && infos[position].after && !infos[position + 1].before && !infos[position + 1].after || positions[index - 1] === position - 1 && infos[position].before && !infos[position - 1].before && !infos[position - 1].after) continue;
		if (start !== position) result.push(escapeBackslashes(value.slice(start, position), "\\"));
		start = position;
		if (/[!-/:-@[-`{-~]/.test(value.charAt(position)) && (!config.encode || !config.encode.includes(value.charAt(position)))) result.push("\\");
		else {
			result.push("&#x" + value.charCodeAt(position).toString(16).toUpperCase() + ";");
			start++;
		}
	}
	result.push(escapeBackslashes(value.slice(start, end), config.after));
	return result.join("");
}
/**
* @param {number} a
* @param {number} b
* @returns {number}
*/
function numerical(a, b) {
	return a - b;
}
/**
* @param {string} value
* @param {string} after
* @returns {string}
*/
function escapeBackslashes(value, after) {
	const expression = /\\(?=[!-/:-@[-`{-~])/g;
	/** @type {Array<number>} */
	const positions = [];
	/** @type {Array<string>} */
	const results = [];
	const whole = value + after;
	let index = -1;
	let start = 0;
	/** @type {RegExpExecArray | null} */
	let match;
	while (match = expression.exec(whole)) positions.push(match.index);
	while (++index < positions.length) {
		if (start !== positions[index]) results.push(value.slice(start, positions[index]));
		results.push("\\");
		start = positions[index];
	}
	results.push(value.slice(start));
	return results.join("");
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/track.js
/**
* @typedef {import('../types.js').CreateTracker} CreateTracker
* @typedef {import('../types.js').TrackCurrent} TrackCurrent
* @typedef {import('../types.js').TrackMove} TrackMove
* @typedef {import('../types.js').TrackShift} TrackShift
*/
/**
* Track positional info in the output.
*
* @type {CreateTracker}
*/
function track(config) {
	/* c8 ignore next 5 */
	const options = config || {};
	const now = options.now || {};
	let lineShift = options.lineShift || 0;
	let line = now.line || 1;
	let column = now.column || 1;
	return {
		move,
		current,
		shift
	};
	/**
	* Get the current tracked info.
	*
	* @type {TrackCurrent}
	*/
	function current() {
		return {
			now: {
				line,
				column
			},
			lineShift
		};
	}
	/**
	* Define an increased line shift (the typical indent for lines).
	*
	* @type {TrackShift}
	*/
	function shift(value) {
		lineShift += value;
	}
	/**
	* Move past some generated markdown.
	*
	* @type {TrackMove}
	*/
	function move(input) {
		const value = input || "";
		const chunks = value.split(/\r?\n|\r/g);
		const tail = chunks[chunks.length - 1];
		line += chunks.length - 1;
		column = chunks.length === 1 ? column + tail.length : 1 + tail.length + lineShift;
		return value;
	}
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/index.js
/**
* @typedef {import('./types.js').Enter} Enter
* @typedef {import('./types.js').Info} Info
* @typedef {import('./types.js').Join} Join
* @typedef {import('./types.js').FlowContent} FlowContent
* @typedef {import('./types.js').Node} Node
* @typedef {import('./types.js').Options} Options
* @typedef {import('./types.js').Parent} Parent
* @typedef {import('./types.js').PhrasingContent} PhrasingContent
* @typedef {import('./types.js').SafeConfig} SafeConfig
* @typedef {import('./types.js').State} State
* @typedef {import('./types.js').TrackFields} TrackFields
*/
/**
* Turn an mdast syntax tree into markdown.
*
* @param {Node} tree
*   Tree to serialize.
* @param {Options} [options]
*   Configuration (optional).
* @returns {string}
*   Serialized markdown representing `tree`.
*/
function toMarkdown(tree, options = {}) {
	/** @type {State} */
	const state = {
		enter,
		indentLines,
		associationId: association,
		containerPhrasing: containerPhrasingBound,
		containerFlow: containerFlowBound,
		createTracker: track,
		safe: safeBound,
		stack: [],
		unsafe: [],
		join: [],
		handlers: {},
		options: {},
		indexStack: [],
		handle: void 0
	};
	configure(state, {
		unsafe,
		join,
		handlers: handle
	});
	configure(state, options);
	if (state.options.tightDefinitions) configure(state, { join: [joinDefinition] });
	state.handle = zwitch("type", {
		invalid,
		unknown,
		handlers: state.handlers
	});
	let result = state.handle(tree, void 0, state, {
		before: "\n",
		after: "\n",
		now: {
			line: 1,
			column: 1
		},
		lineShift: 0
	});
	if (result && result.charCodeAt(result.length - 1) !== 10 && result.charCodeAt(result.length - 1) !== 13) result += "\n";
	return result;
	/** @type {Enter} */
	function enter(name) {
		state.stack.push(name);
		return exit;
		function exit() {
			state.stack.pop();
		}
	}
}
/**
* @param {unknown} value
* @returns {never}
*/
function invalid(value) {
	throw new Error("Cannot handle value `" + value + "`, expected node");
}
/**
* @param {unknown} node
* @returns {never}
*/
function unknown(node) {
	throw new Error("Cannot handle unknown node `" + node.type + "`");
}
/** @type {Join} */
function joinDefinition(left, right) {
	if (left.type === "definition" && left.type === right.type) return 0;
}
/**
* Serialize the children of a parent that contains phrasing children.
*
* These children will be joined flush together.
*
* @this {State}
*   Info passed around about the current state.
* @param {Parent & {children: Array<PhrasingContent>}} parent
*   Parent of flow nodes.
* @param {Info} info
*   Info on where we are in the document we are generating.
* @returns {string}
*   Serialized children, joined together.
*/
function containerPhrasingBound(parent, info) {
	return containerPhrasing(parent, this, info);
}
/**
* Serialize the children of a parent that contains flow children.
*
* These children will typically be joined by blank lines.
* What they are joined by exactly is defined by `Join` functions.
*
* @this {State}
*   Info passed around about the current state.
* @param {Parent & {children: Array<FlowContent>}} parent
*   Parent of flow nodes.
* @param {TrackFields} info
*   Info on where we are in the document we are generating.
* @returns {string}
*   Serialized children, joined by (blank) lines.
*/
function containerFlowBound(parent, info) {
	return containerFlow(parent, this, info);
}
/**
* Make a string safe for embedding in markdown constructs.
*
* In markdown, almost all punctuation characters can, in certain cases,
* result in something.
* Whether they do is highly subjective to where they happen and in what
* they happen.
*
* To solve this, `mdast-util-to-markdown` tracks:
*
* * Characters before and after something;
* * What “constructs” we are in.
*
* This information is then used by this function to escape or encode
* special characters.
*
* @this {State}
*   Info passed around about the current state.
* @param {string | null | undefined} value
*   Raw value to make safe.
* @param {SafeConfig} config
*   Configuration.
* @returns {string}
*   Serialized markdown safe for embedding.
*/
function safeBound(value, config) {
	return safe(this, value, config);
}
//#endregion
//#region node_modules/remark-stringify/lib/index.js
/**
* @typedef {import('mdast').Root|import('mdast').Content} Node
* @typedef {import('mdast-util-to-markdown').Options} ToMarkdownOptions
* @typedef {Omit<ToMarkdownOptions, 'extensions'>} Options
*/
/**
* @this {import('unified').Processor}
* @type {import('unified').Plugin<[Options?]|void[], Node, string>}
*/
function remarkStringify(options) {
	/** @type {import('unified').CompilerFunction<Node, string>} */
	const compiler = (tree) => {
		const settings = this.data("settings");
		return toMarkdown(tree, Object.assign({}, settings, options, { extensions: this.data("toMarkdownExtensions") || [] }));
	};
	Object.assign(this, { Compiler: compiler });
}
//#endregion
//#region libs/convert-to-markdown.ts
var _processor = (0, _unified_latex_unified_latex.processLatexViaUnified)().use(unifiedLatexToMdast).use(remarkStringify);
/**
* Convert the `unified-latex` AST `tree` into a Markdown string. If you need
* more precise control or further processing, consider using `unified`
* directly with the `unifiedLatexToMdast` plugin.
*
* For example,
* ```
* unified()
*      .use(unifiedLatexFromString)
*      .use(unifiedLatexToMdast)
*      .use(remarkStringify)
*      .processSync("\\LaTeX to convert")
* ```
*/
function convertToMarkdown(tree, options) {
	let processor = _processor;
	if (!Array.isArray(tree) && tree.type !== "root") tree = {
		type: "root",
		content: [tree]
	};
	if (Array.isArray(tree)) tree = {
		type: "root",
		content: tree
	};
	if (options) processor = _processor.use(unifiedLatexToMdast, options);
	const mdast = processor.runSync(tree);
	return processor.stringify(mdast);
}
//#endregion
//#region index.ts
/**
* ## What is this?
*
* Functions to convert `unified-latex` Abstract Syntax Tree (AST) to a MDAST (Markdown-like)
* tree.
*
* ## When should I use this?
*
* If you want to convert LaTeX to Markdown.
*
*/
//#endregion
exports.convertToMarkdown = convertToMarkdown;
exports.unifiedLatexToMdast = unifiedLatexToMdast;

//# sourceMappingURL=index.cjs.map