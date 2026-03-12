"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const unifiedLatexUtilLigatures = require("@unified-latex/unified-latex-util-ligatures");
const unifiedLatexUtilMatch = require("@unified-latex/unified-latex-util-match");
const unifiedLatexUtilVisit = require("@unified-latex/unified-latex-util-visit");
const unifiedLatexUtilArguments = require("@unified-latex/unified-latex-util-arguments");
const unifiedLatexUtilHtmlLike = require("@unified-latex/unified-latex-util-html-like");
const unifiedLatexUtilPrintRaw = require("@unified-latex/unified-latex-util-print-raw");
const unifiedLatexBuilder = require("@unified-latex/unified-latex-builder");
const unifiedLatexUtilReplace = require("@unified-latex/unified-latex-util-replace");
const unifiedLatexUtilSplit = require("@unified-latex/unified-latex-util-split");
const unifiedLatexLintNoTexFontShapingCommands = require("@unified-latex/unified-latex-lint/rules/unified-latex-lint-no-tex-font-shaping-commands");
const unifiedLatexUtilComments = require("@unified-latex/unified-latex-util-comments");
const unifiedLatexUtilTrim = require("@unified-latex/unified-latex-util-trim");
const tabularx = require("@unified-latex/unified-latex-ctan/package/tabularx");
const unifiedLatexUtilAlign = require("@unified-latex/unified-latex-util-align");
const systeme = require("@unified-latex/unified-latex-ctan/package/systeme");
const xcolor = require("@unified-latex/unified-latex-ctan/package/xcolor");
const unifiedLatexUtilMacros = require("@unified-latex/unified-latex-util-macros");
const unifiedLatex = require("@unified-latex/unified-latex");
require("@unified-latex/unified-latex-types");
const x = (
  // Note: not yet possible to use the spread `...children` in JSDoc overloads.
  /**
   * @type {{
   *   (): Root
   *   (name: null | undefined, ...children: Array<Child>): Root
   *   (name: string, attributes?: Attributes, ...children: Array<Child>): Element
   *   (name: string, ...children: Array<Child>): Element
   * }}
   */
  /**
   * @param {string | null | undefined} [name]
   * @param {Attributes | Child | null | undefined} [attributes]
   * @param {Array<Child>} children
   * @returns {Result}
   */
  function(name2, attributes, ...children) {
    let index2 = -1;
    let node;
    if (name2 === void 0 || name2 === null) {
      node = { type: "root", children: [] };
      children.unshift(attributes);
    } else if (typeof name2 === "string") {
      node = { type: "element", name: name2, attributes: {}, children: [] };
      if (isAttributes(attributes)) {
        let key;
        for (key in attributes) {
          if (attributes[key] !== void 0 && attributes[key] !== null && (typeof attributes[key] !== "number" || !Number.isNaN(attributes[key]))) {
            node.attributes[key] = String(attributes[key]);
          }
        }
      } else {
        children.unshift(attributes);
      }
    } else {
      throw new TypeError("Expected element name, got `" + name2 + "`");
    }
    while (++index2 < children.length) {
      addChild(node.children, children[index2]);
    }
    return node;
  }
);
function addChild(nodes, value2) {
  let index2 = -1;
  if (value2 === void 0 || value2 === null) ;
  else if (typeof value2 === "string" || typeof value2 === "number") {
    nodes.push({ type: "text", value: String(value2) });
  } else if (Array.isArray(value2)) {
    while (++index2 < value2.length) {
      addChild(nodes, value2[index2]);
    }
  } else if (typeof value2 === "object" && "type" in value2) {
    if (value2.type === "root") {
      addChild(nodes, value2.children);
    } else {
      nodes.push(value2);
    }
  } else {
    throw new TypeError("Expected node, nodes, string, got `" + value2 + "`");
  }
}
function isAttributes(value2) {
  if (value2 === null || value2 === void 0 || typeof value2 !== "object" || Array.isArray(value2)) {
    return false;
  }
  return true;
}
function bail(error) {
  if (error) {
    throw error;
  }
}
function getDefaultExportFromCjs(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
var isBuffer$1;
var hasRequiredIsBuffer;
function requireIsBuffer() {
  if (hasRequiredIsBuffer) return isBuffer$1;
  hasRequiredIsBuffer = 1;
  isBuffer$1 = function isBuffer2(obj) {
    return obj != null && obj.constructor != null && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
  };
  return isBuffer$1;
}
var isBufferExports = requireIsBuffer();
const isBuffer = /* @__PURE__ */ getDefaultExportFromCjs(isBufferExports);
var extend$1;
var hasRequiredExtend;
function requireExtend() {
  if (hasRequiredExtend) return extend$1;
  hasRequiredExtend = 1;
  var hasOwn = Object.prototype.hasOwnProperty;
  var toStr = Object.prototype.toString;
  var defineProperty = Object.defineProperty;
  var gOPD = Object.getOwnPropertyDescriptor;
  var isArray = function isArray2(arr) {
    if (typeof Array.isArray === "function") {
      return Array.isArray(arr);
    }
    return toStr.call(arr) === "[object Array]";
  };
  var isPlainObject2 = function isPlainObject3(obj) {
    if (!obj || toStr.call(obj) !== "[object Object]") {
      return false;
    }
    var hasOwnConstructor = hasOwn.call(obj, "constructor");
    var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, "isPrototypeOf");
    if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
      return false;
    }
    var key;
    for (key in obj) {
    }
    return typeof key === "undefined" || hasOwn.call(obj, key);
  };
  var setProperty = function setProperty2(target, options) {
    if (defineProperty && options.name === "__proto__") {
      defineProperty(target, options.name, {
        enumerable: true,
        configurable: true,
        value: options.newValue,
        writable: true
      });
    } else {
      target[options.name] = options.newValue;
    }
  };
  var getProperty = function getProperty2(obj, name2) {
    if (name2 === "__proto__") {
      if (!hasOwn.call(obj, name2)) {
        return void 0;
      } else if (gOPD) {
        return gOPD(obj, name2).value;
      }
    }
    return obj[name2];
  };
  extend$1 = function extend2() {
    var options, name2, src, copy, copyIsArray, clone;
    var target = arguments[0];
    var i = 1;
    var length = arguments.length;
    var deep = false;
    if (typeof target === "boolean") {
      deep = target;
      target = arguments[1] || {};
      i = 2;
    }
    if (target == null || typeof target !== "object" && typeof target !== "function") {
      target = {};
    }
    for (; i < length; ++i) {
      options = arguments[i];
      if (options != null) {
        for (name2 in options) {
          src = getProperty(target, name2);
          copy = getProperty(options, name2);
          if (target !== copy) {
            if (deep && copy && (isPlainObject2(copy) || (copyIsArray = isArray(copy)))) {
              if (copyIsArray) {
                copyIsArray = false;
                clone = src && isArray(src) ? src : [];
              } else {
                clone = src && isPlainObject2(src) ? src : {};
              }
              setProperty(target, { name: name2, newValue: extend2(deep, clone, copy) });
            } else if (typeof copy !== "undefined") {
              setProperty(target, { name: name2, newValue: copy });
            }
          }
        }
      }
    }
    return target;
  };
  return extend$1;
}
var extendExports = requireExtend();
const extend = /* @__PURE__ */ getDefaultExportFromCjs(extendExports);
function isPlainObject(value2) {
  if (typeof value2 !== "object" || value2 === null) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value2);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in value2) && !(Symbol.iterator in value2);
}
function trough() {
  const fns = [];
  const pipeline = { run, use };
  return pipeline;
  function run(...values) {
    let middlewareIndex = -1;
    const callback = values.pop();
    if (typeof callback !== "function") {
      throw new TypeError("Expected function as last argument, not " + callback);
    }
    next(null, ...values);
    function next(error, ...output) {
      const fn = fns[++middlewareIndex];
      let index2 = -1;
      if (error) {
        callback(error);
        return;
      }
      while (++index2 < values.length) {
        if (output[index2] === null || output[index2] === void 0) {
          output[index2] = values[index2];
        }
      }
      values = output;
      if (fn) {
        wrap(fn, next)(...output);
      } else {
        callback(null, ...output);
      }
    }
  }
  function use(middelware) {
    if (typeof middelware !== "function") {
      throw new TypeError(
        "Expected `middelware` to be a function, not " + middelware
      );
    }
    fns.push(middelware);
    return pipeline;
  }
}
function wrap(middleware, callback) {
  let called;
  return wrapped;
  function wrapped(...parameters) {
    const fnExpectsCallback = middleware.length > parameters.length;
    let result;
    if (fnExpectsCallback) {
      parameters.push(done);
    }
    try {
      result = middleware.apply(this, parameters);
    } catch (error) {
      const exception = (
        /** @type {Error} */
        error
      );
      if (fnExpectsCallback && called) {
        throw exception;
      }
      return done(exception);
    }
    if (!fnExpectsCallback) {
      if (result && result.then && typeof result.then === "function") {
        result.then(then, done);
      } else if (result instanceof Error) {
        done(result);
      } else {
        then(result);
      }
    }
  }
  function done(error, ...output) {
    if (!called) {
      called = true;
      callback(error, ...output);
    }
  }
  function then(value2) {
    done(null, value2);
  }
}
function stringifyPosition$1(value2) {
  if (!value2 || typeof value2 !== "object") {
    return "";
  }
  if ("position" in value2 || "type" in value2) {
    return position$1(value2.position);
  }
  if ("start" in value2 || "end" in value2) {
    return position$1(value2);
  }
  if ("line" in value2 || "column" in value2) {
    return point$1(value2);
  }
  return "";
}
function point$1(point2) {
  return index$1(point2 && point2.line) + ":" + index$1(point2 && point2.column);
}
function position$1(pos) {
  return point$1(pos && pos.start) + "-" + point$1(pos && pos.end);
}
function index$1(value2) {
  return value2 && typeof value2 === "number" ? value2 : 1;
}
let VFileMessage$1 = class VFileMessage extends Error {
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
  // To do: next major: expose `undefined` everywhere instead of `null`.
  constructor(reason, place, origin) {
    const parts = [null, null];
    let position2 = {
      // @ts-expect-error: we always follows the structure of `position`.
      start: { line: null, column: null },
      // @ts-expect-error: "
      end: { line: null, column: null }
    };
    super();
    if (typeof place === "string") {
      origin = place;
      place = void 0;
    }
    if (typeof origin === "string") {
      const index2 = origin.indexOf(":");
      if (index2 === -1) {
        parts[1] = origin;
      } else {
        parts[0] = origin.slice(0, index2);
        parts[1] = origin.slice(index2 + 1);
      }
    }
    if (place) {
      if ("type" in place || "position" in place) {
        if (place.position) {
          position2 = place.position;
        }
      } else if ("start" in place || "end" in place) {
        position2 = place;
      } else if ("line" in place || "column" in place) {
        position2.start = place;
      }
    }
    this.name = stringifyPosition$1(place) || "1:1";
    this.message = typeof reason === "object" ? reason.message : reason;
    this.stack = "";
    if (typeof reason === "object" && reason.stack) {
      this.stack = reason.stack;
    }
    this.reason = this.message;
    this.fatal;
    this.line = position2.start.line;
    this.column = position2.start.column;
    this.position = position2;
    this.source = parts[0];
    this.ruleId = parts[1];
    this.file;
    this.actual;
    this.expected;
    this.url;
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
const path = { basename, dirname, extname, join, sep: "/" };
function basename(path2, ext) {
  if (ext !== void 0 && typeof ext !== "string") {
    throw new TypeError('"ext" argument must be a string');
  }
  assertPath$1(path2);
  let start = 0;
  let end = -1;
  let index2 = path2.length;
  let seenNonSlash;
  if (ext === void 0 || ext.length === 0 || ext.length > path2.length) {
    while (index2--) {
      if (path2.charCodeAt(index2) === 47) {
        if (seenNonSlash) {
          start = index2 + 1;
          break;
        }
      } else if (end < 0) {
        seenNonSlash = true;
        end = index2 + 1;
      }
    }
    return end < 0 ? "" : path2.slice(start, end);
  }
  if (ext === path2) {
    return "";
  }
  let firstNonSlashEnd = -1;
  let extIndex = ext.length - 1;
  while (index2--) {
    if (path2.charCodeAt(index2) === 47) {
      if (seenNonSlash) {
        start = index2 + 1;
        break;
      }
    } else {
      if (firstNonSlashEnd < 0) {
        seenNonSlash = true;
        firstNonSlashEnd = index2 + 1;
      }
      if (extIndex > -1) {
        if (path2.charCodeAt(index2) === ext.charCodeAt(extIndex--)) {
          if (extIndex < 0) {
            end = index2;
          }
        } else {
          extIndex = -1;
          end = firstNonSlashEnd;
        }
      }
    }
  }
  if (start === end) {
    end = firstNonSlashEnd;
  } else if (end < 0) {
    end = path2.length;
  }
  return path2.slice(start, end);
}
function dirname(path2) {
  assertPath$1(path2);
  if (path2.length === 0) {
    return ".";
  }
  let end = -1;
  let index2 = path2.length;
  let unmatchedSlash;
  while (--index2) {
    if (path2.charCodeAt(index2) === 47) {
      if (unmatchedSlash) {
        end = index2;
        break;
      }
    } else if (!unmatchedSlash) {
      unmatchedSlash = true;
    }
  }
  return end < 0 ? path2.charCodeAt(0) === 47 ? "/" : "." : end === 1 && path2.charCodeAt(0) === 47 ? "//" : path2.slice(0, end);
}
function extname(path2) {
  assertPath$1(path2);
  let index2 = path2.length;
  let end = -1;
  let startPart = 0;
  let startDot = -1;
  let preDotState = 0;
  let unmatchedSlash;
  while (index2--) {
    const code = path2.charCodeAt(index2);
    if (code === 47) {
      if (unmatchedSlash) {
        startPart = index2 + 1;
        break;
      }
      continue;
    }
    if (end < 0) {
      unmatchedSlash = true;
      end = index2 + 1;
    }
    if (code === 46) {
      if (startDot < 0) {
        startDot = index2;
      } else if (preDotState !== 1) {
        preDotState = 1;
      }
    } else if (startDot > -1) {
      preDotState = -1;
    }
  }
  if (startDot < 0 || end < 0 || // We saw a non-dot character immediately before the dot.
  preDotState === 0 || // The (right-most) trimmed path component is exactly `..`.
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return "";
  }
  return path2.slice(startDot, end);
}
function join(...segments) {
  let index2 = -1;
  let joined;
  while (++index2 < segments.length) {
    assertPath$1(segments[index2]);
    if (segments[index2]) {
      joined = joined === void 0 ? segments[index2] : joined + "/" + segments[index2];
    }
  }
  return joined === void 0 ? "." : normalize(joined);
}
function normalize(path2) {
  assertPath$1(path2);
  const absolute = path2.charCodeAt(0) === 47;
  let value2 = normalizeString(path2, !absolute);
  if (value2.length === 0 && !absolute) {
    value2 = ".";
  }
  if (value2.length > 0 && path2.charCodeAt(path2.length - 1) === 47) {
    value2 += "/";
  }
  return absolute ? "/" + value2 : value2;
}
function normalizeString(path2, allowAboveRoot) {
  let result = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let index2 = -1;
  let code;
  let lastSlashIndex;
  while (++index2 <= path2.length) {
    if (index2 < path2.length) {
      code = path2.charCodeAt(index2);
    } else if (code === 47) {
      break;
    } else {
      code = 47;
    }
    if (code === 47) {
      if (lastSlash === index2 - 1 || dots === 1) ;
      else if (lastSlash !== index2 - 1 && dots === 2) {
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
              lastSlash = index2;
              dots = 0;
              continue;
            }
          } else if (result.length > 0) {
            result = "";
            lastSegmentLength = 0;
            lastSlash = index2;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          result = result.length > 0 ? result + "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (result.length > 0) {
          result += "/" + path2.slice(lastSlash + 1, index2);
        } else {
          result = path2.slice(lastSlash + 1, index2);
        }
        lastSegmentLength = index2 - lastSlash - 1;
      }
      lastSlash = index2;
      dots = 0;
    } else if (code === 46 && dots > -1) {
      dots++;
    } else {
      dots = -1;
    }
  }
  return result;
}
function assertPath$1(path2) {
  if (typeof path2 !== "string") {
    throw new TypeError(
      "Path must be a string. Received " + JSON.stringify(path2)
    );
  }
}
const proc = { cwd };
function cwd() {
  return "/";
}
function isUrl(fileUrlOrPath) {
  return fileUrlOrPath !== null && typeof fileUrlOrPath === "object" && // @ts-expect-error: indexable.
  fileUrlOrPath.href && // @ts-expect-error: indexable.
  fileUrlOrPath.origin;
}
function urlToPath(path2) {
  if (typeof path2 === "string") {
    path2 = new URL(path2);
  } else if (!isUrl(path2)) {
    const error = new TypeError(
      'The "path" argument must be of type string or an instance of URL. Received `' + path2 + "`"
    );
    error.code = "ERR_INVALID_ARG_TYPE";
    throw error;
  }
  if (path2.protocol !== "file:") {
    const error = new TypeError("The URL must be of scheme file");
    error.code = "ERR_INVALID_URL_SCHEME";
    throw error;
  }
  return getPathFromURLPosix(path2);
}
function getPathFromURLPosix(url) {
  if (url.hostname !== "") {
    const error = new TypeError(
      'File URL host must be "localhost" or empty on darwin'
    );
    error.code = "ERR_INVALID_FILE_URL_HOST";
    throw error;
  }
  const pathname = url.pathname;
  let index2 = -1;
  while (++index2 < pathname.length) {
    if (pathname.charCodeAt(index2) === 37 && pathname.charCodeAt(index2 + 1) === 50) {
      const third = pathname.charCodeAt(index2 + 2);
      if (third === 70 || third === 102) {
        const error = new TypeError(
          "File URL path must not include encoded / characters"
        );
        error.code = "ERR_INVALID_FILE_URL_PATH";
        throw error;
      }
    }
  }
  return decodeURIComponent(pathname);
}
const order = ["history", "path", "basename", "stem", "extname", "dirname"];
class VFile {
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
  constructor(value2) {
    let options;
    if (!value2) {
      options = {};
    } else if (typeof value2 === "string" || buffer(value2)) {
      options = { value: value2 };
    } else if (isUrl(value2)) {
      options = { path: value2 };
    } else {
      options = value2;
    }
    this.data = {};
    this.messages = [];
    this.history = [];
    this.cwd = proc.cwd();
    this.value;
    this.stored;
    this.result;
    this.map;
    let index2 = -1;
    while (++index2 < order.length) {
      const prop2 = order[index2];
      if (prop2 in options && options[prop2] !== void 0 && options[prop2] !== null) {
        this[prop2] = prop2 === "history" ? [...options[prop2]] : options[prop2];
      }
    }
    let prop;
    for (prop in options) {
      if (!order.includes(prop)) {
        this[prop] = options[prop];
      }
    }
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
  set path(path2) {
    if (isUrl(path2)) {
      path2 = urlToPath(path2);
    }
    assertNonEmpty(path2, "path");
    if (this.path !== path2) {
      this.history.push(path2);
    }
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
  set dirname(dirname2) {
    assertPath(this.basename, "dirname");
    this.path = path.join(dirname2 || "", this.basename);
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
  set basename(basename2) {
    assertNonEmpty(basename2, "basename");
    assertPart(basename2, "basename");
    this.path = path.join(this.dirname || "", basename2);
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
  set extname(extname2) {
    assertPart(extname2, "extname");
    assertPath(this.dirname, "extname");
    if (extname2) {
      if (extname2.charCodeAt(0) !== 46) {
        throw new Error("`extname` must start with `.`");
      }
      if (extname2.includes(".", 1)) {
        throw new Error("`extname` cannot contain multiple dots");
      }
    }
    this.path = path.join(this.dirname, this.stem + (extname2 || ""));
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
}
function assertPart(part, name2) {
  if (part && part.includes(path.sep)) {
    throw new Error(
      "`" + name2 + "` cannot be a path: did not expect `" + path.sep + "`"
    );
  }
}
function assertNonEmpty(part, name2) {
  if (!part) {
    throw new Error("`" + name2 + "` cannot be empty");
  }
}
function assertPath(path2, name2) {
  if (!path2) {
    throw new Error("Setting `" + name2 + "` requires `path` to be set too");
  }
}
function buffer(value2) {
  return isBuffer(value2);
}
const unified = base().freeze();
const own$2 = {}.hasOwnProperty;
function base() {
  const transformers = trough();
  const attachers = [];
  let namespace = {};
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
  function processor() {
    const destination = base();
    let index2 = -1;
    while (++index2 < attachers.length) {
      destination.use(...attachers[index2]);
    }
    destination.data(extend(true, {}, namespace));
    return destination;
  }
  function data(key, value2) {
    if (typeof key === "string") {
      if (arguments.length === 2) {
        assertUnfrozen("data", frozen);
        namespace[key] = value2;
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
  function freeze() {
    if (frozen) {
      return processor;
    }
    while (++freezeIndex < attachers.length) {
      const [attacher, ...options] = attachers[freezeIndex];
      if (options[0] === false) {
        continue;
      }
      if (options[0] === true) {
        options[0] = void 0;
      }
      const transformer = attacher.call(processor, ...options);
      if (typeof transformer === "function") {
        transformers.use(transformer);
      }
    }
    frozen = true;
    freezeIndex = Number.POSITIVE_INFINITY;
    return processor;
  }
  function use(value2, ...options) {
    let settings;
    assertUnfrozen("use", frozen);
    if (value2 === null || value2 === void 0) ;
    else if (typeof value2 === "function") {
      addPlugin(value2, ...options);
    } else if (typeof value2 === "object") {
      if (Array.isArray(value2)) {
        addList(value2);
      } else {
        addPreset(value2);
      }
    } else {
      throw new TypeError("Expected usable value, not `" + value2 + "`");
    }
    if (settings) {
      namespace.settings = Object.assign(namespace.settings || {}, settings);
    }
    return processor;
    function add(value3) {
      if (typeof value3 === "function") {
        addPlugin(value3);
      } else if (typeof value3 === "object") {
        if (Array.isArray(value3)) {
          const [plugin, ...options2] = value3;
          addPlugin(plugin, ...options2);
        } else {
          addPreset(value3);
        }
      } else {
        throw new TypeError("Expected usable value, not `" + value3 + "`");
      }
    }
    function addPreset(result) {
      addList(result.plugins);
      if (result.settings) {
        settings = Object.assign(settings || {}, result.settings);
      }
    }
    function addList(plugins) {
      let index2 = -1;
      if (plugins === null || plugins === void 0) ;
      else if (Array.isArray(plugins)) {
        while (++index2 < plugins.length) {
          const thing = plugins[index2];
          add(thing);
        }
      } else {
        throw new TypeError("Expected a list of plugins, not `" + plugins + "`");
      }
    }
    function addPlugin(plugin, value3) {
      let index2 = -1;
      let entry;
      while (++index2 < attachers.length) {
        if (attachers[index2][0] === plugin) {
          entry = attachers[index2];
          break;
        }
      }
      if (entry) {
        if (isPlainObject(entry[1]) && isPlainObject(value3)) {
          value3 = extend(true, entry[1], value3);
        }
        entry[1] = value3;
      } else {
        attachers.push([...arguments]);
      }
    }
  }
  function parse(doc) {
    processor.freeze();
    const file = vfile(doc);
    const Parser = processor.Parser;
    assertParser("parse", Parser);
    if (newable(Parser, "parse")) {
      return new Parser(String(file), file).parse();
    }
    return Parser(String(file), file);
  }
  function stringify(node, doc) {
    processor.freeze();
    const file = vfile(doc);
    const Compiler = processor.Compiler;
    assertCompiler("stringify", Compiler);
    assertNode(node);
    if (newable(Compiler, "compile")) {
      return new Compiler(node, file).compile();
    }
    return Compiler(node, file);
  }
  function run(node, doc, callback) {
    assertNode(node);
    processor.freeze();
    if (!callback && typeof doc === "function") {
      callback = doc;
      doc = void 0;
    }
    if (!callback) {
      return new Promise(executor);
    }
    executor(null, callback);
    function executor(resolve, reject) {
      transformers.run(node, vfile(doc), done);
      function done(error, tree, file) {
        tree = tree || node;
        if (error) {
          reject(error);
        } else if (resolve) {
          resolve(tree);
        } else {
          callback(null, tree, file);
        }
      }
    }
  }
  function runSync(node, file) {
    let result;
    let complete;
    processor.run(node, file, done);
    assertDone("runSync", "run", complete);
    return result;
    function done(error, tree) {
      bail(error);
      result = tree;
      complete = true;
    }
  }
  function process(doc, callback) {
    processor.freeze();
    assertParser("process", processor.Parser);
    assertCompiler("process", processor.Compiler);
    if (!callback) {
      return new Promise(executor);
    }
    executor(null, callback);
    function executor(resolve, reject) {
      const file = vfile(doc);
      processor.run(processor.parse(file), file, (error, tree, file2) => {
        if (error || !tree || !file2) {
          done(error);
        } else {
          const result = processor.stringify(tree, file2);
          if (result === void 0 || result === null) ;
          else if (looksLikeAVFileValue(result)) {
            file2.value = result;
          } else {
            file2.result = result;
          }
          done(error, file2);
        }
      });
      function done(error, file2) {
        if (error || !file2) {
          reject(error);
        } else if (resolve) {
          resolve(file2);
        } else {
          callback(null, file2);
        }
      }
    }
  }
  function processSync(doc) {
    let complete;
    processor.freeze();
    assertParser("processSync", processor.Parser);
    assertCompiler("processSync", processor.Compiler);
    const file = vfile(doc);
    processor.process(file, done);
    assertDone("processSync", "process", complete);
    return file;
    function done(error) {
      complete = true;
      bail(error);
    }
  }
}
function newable(value2, name2) {
  return typeof value2 === "function" && // Prototypes do exist.
  // type-coverage:ignore-next-line
  value2.prototype && // A function with keys in its prototype is probably a constructor.
  // Classes’ prototype methods are not enumerable, so we check if some value
  // exists in the prototype.
  // type-coverage:ignore-next-line
  (keys(value2.prototype) || name2 in value2.prototype);
}
function keys(value2) {
  let key;
  for (key in value2) {
    if (own$2.call(value2, key)) {
      return true;
    }
  }
  return false;
}
function assertParser(name2, value2) {
  if (typeof value2 !== "function") {
    throw new TypeError("Cannot `" + name2 + "` without `Parser`");
  }
}
function assertCompiler(name2, value2) {
  if (typeof value2 !== "function") {
    throw new TypeError("Cannot `" + name2 + "` without `Compiler`");
  }
}
function assertUnfrozen(name2, frozen) {
  if (frozen) {
    throw new Error(
      "Cannot call `" + name2 + "` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`."
    );
  }
}
function assertNode(node) {
  if (!isPlainObject(node) || typeof node.type !== "string") {
    throw new TypeError("Expected node, got `" + node + "`");
  }
}
function assertDone(name2, asyncName, complete) {
  if (!complete) {
    throw new Error(
      "`" + name2 + "` finished async. Use `" + asyncName + "` instead"
    );
  }
}
function vfile(value2) {
  return looksLikeAVFile(value2) ? value2 : new VFile(value2);
}
function looksLikeAVFile(value2) {
  return Boolean(
    value2 && typeof value2 === "object" && "message" in value2 && "messages" in value2
  );
}
function looksLikeAVFileValue(value2) {
  return typeof value2 === "string" || isBuffer(value2);
}
function stringifyPosition(value2) {
  if (!value2 || typeof value2 !== "object") {
    return "";
  }
  if ("position" in value2 || "type" in value2) {
    return position(value2.position);
  }
  if ("start" in value2 || "end" in value2) {
    return position(value2);
  }
  if ("line" in value2 || "column" in value2) {
    return point(value2);
  }
  return "";
}
function point(point2) {
  return index(point2 && point2.line) + ":" + index(point2 && point2.column);
}
function position(pos) {
  return point(pos && pos.start) + "-" + point(pos && pos.end);
}
function index(value2) {
  return value2 && typeof value2 === "number" ? value2 : 1;
}
class VFileMessage2 extends Error {
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
  // eslint-disable-next-line complexity
  constructor(causeOrReason, optionsOrParentOrPlace, origin) {
    super();
    if (typeof optionsOrParentOrPlace === "string") {
      origin = optionsOrParentOrPlace;
      optionsOrParentOrPlace = void 0;
    }
    let reason = "";
    let options = {};
    let legacyCause = false;
    if (optionsOrParentOrPlace) {
      if ("line" in optionsOrParentOrPlace && "column" in optionsOrParentOrPlace) {
        options = { place: optionsOrParentOrPlace };
      } else if ("start" in optionsOrParentOrPlace && "end" in optionsOrParentOrPlace) {
        options = { place: optionsOrParentOrPlace };
      } else if ("type" in optionsOrParentOrPlace) {
        options = {
          ancestors: [optionsOrParentOrPlace],
          place: optionsOrParentOrPlace.position
        };
      } else {
        options = { ...optionsOrParentOrPlace };
      }
    }
    if (typeof causeOrReason === "string") {
      reason = causeOrReason;
    } else if (!options.cause && causeOrReason) {
      legacyCause = true;
      reason = causeOrReason.message;
      options.cause = causeOrReason;
    }
    if (!options.ruleId && !options.source && typeof origin === "string") {
      const index2 = origin.indexOf(":");
      if (index2 === -1) {
        options.ruleId = origin;
      } else {
        options.source = origin.slice(0, index2);
        options.ruleId = origin.slice(index2 + 1);
      }
    }
    if (!options.place && options.ancestors && options.ancestors) {
      const parent = options.ancestors[options.ancestors.length - 1];
      if (parent) {
        options.place = parent.position;
      }
    }
    const start = options.place && "start" in options.place ? options.place.start : options.place;
    this.ancestors = options.ancestors || void 0;
    this.cause = options.cause || void 0;
    this.column = start ? start.column : void 0;
    this.fatal = void 0;
    this.file;
    this.message = reason;
    this.line = start ? start.line : void 0;
    this.name = stringifyPosition(options.place) || "1:1";
    this.place = options.place || void 0;
    this.reason = this.message;
    this.ruleId = options.ruleId || void 0;
    this.source = options.source || void 0;
    this.stack = legacyCause && options.cause && typeof options.cause.stack === "string" ? options.cause.stack : "";
    this.actual;
    this.expected;
    this.note;
    this.url;
  }
}
VFileMessage2.prototype.file = "";
VFileMessage2.prototype.name = "";
VFileMessage2.prototype.reason = "";
VFileMessage2.prototype.message = "";
VFileMessage2.prototype.stack = "";
VFileMessage2.prototype.column = void 0;
VFileMessage2.prototype.line = void 0;
VFileMessage2.prototype.ancestors = void 0;
VFileMessage2.prototype.cause = void 0;
VFileMessage2.prototype.fatal = void 0;
VFileMessage2.prototype.place = void 0;
VFileMessage2.prototype.ruleId = void 0;
VFileMessage2.prototype.source = void 0;
function makeWarningMessage(node, message, warningType) {
  const newMessage = new VFileMessage2(message, node);
  newMessage.source = `unified-latex-to-pretext:${warningType}`;
  return newMessage;
}
function emptyStringWithWarningFactory(warningMessage) {
  return (node, info, file) => {
    if (file) {
      const message = makeWarningMessage(
        node,
        warningMessage,
        "macro-subs"
      );
      file.message(
        message,
        message.place,
        `unified-latex-to-pretext:macro-subs`
      );
    }
    return unifiedLatexBuilder.s("");
  };
}
function sanitizeXmlId(str) {
  return str.replace(/["'<>&:\s]/g, (match) => {
    switch (match) {
      case "&":
      case ":":
        return "-";
      case " ":
      case "	":
        return "_";
      default:
        return "";
    }
  });
}
const divisions = [
  { division: "part", mappedEnviron: "_part" },
  { division: "chapter", mappedEnviron: "_chapter" },
  { division: "section", mappedEnviron: "_section" },
  { division: "subsection", mappedEnviron: "_subsection" },
  { division: "subsubsection", mappedEnviron: "_subsubsection" },
  { division: "paragraph", mappedEnviron: "_paragraph" },
  { division: "subparagraph", mappedEnviron: "_subparagraph" }
];
const isDivisionMacro = unifiedLatexUtilMatch.match.createMacroMatcher(
  divisions.map((x2) => x2.division)
);
const isMappedEnviron = unifiedLatexUtilMatch.match.createEnvironmentMatcher(
  divisions.map((x2) => x2.mappedEnviron)
);
function breakOnBoundaries(ast) {
  const messagesLst = { messages: [] };
  unifiedLatexUtilReplace.replaceNode(ast, (node) => {
    if (unifiedLatexUtilMatch.match.group(node)) {
      if (node.content.some((child) => {
        return unifiedLatexUtilMatch.anyMacro(child) && isDivisionMacro(child);
      })) {
        messagesLst.messages.push(
          makeWarningMessage(
            node,
            "Warning: hoisted out of a group, which might break the LaTeX code.",
            "break-on-boundaries"
          )
        );
        return node.content;
      }
    }
  });
  unifiedLatexUtilVisit.visit(ast, (node, info) => {
    if (!(unifiedLatexUtilMatch.anyEnvironment(node) || node.type === "root" || unifiedLatexUtilMatch.match.group(node)) || // skip math mode
    info.context.hasMathModeAncestor) {
      return;
    } else if (unifiedLatexUtilMatch.anyEnvironment(node) && isMappedEnviron(node)) {
      return;
    }
    node.content = breakUp(node.content, 0);
  });
  unifiedLatexUtilReplace.replaceNode(ast, (node) => {
    if (unifiedLatexUtilMatch.anyMacro(node) && isDivisionMacro(node)) {
      return null;
    }
  });
  return messagesLst;
}
function breakUp(content, depth) {
  if (depth > 6) {
    return content;
  }
  const splits = unifiedLatexUtilSplit.splitOnMacro(content, divisions[depth].division);
  for (let i = 0; i < splits.segments.length; i++) {
    splits.segments[i] = breakUp(splits.segments[i], depth + 1);
  }
  createEnvironments(splits, divisions[depth].mappedEnviron);
  return unifiedLatexUtilSplit.unsplitOnMacro(splits);
}
function createEnvironments(splits, newEnviron) {
  for (let i = 1; i < splits.segments.length; i++) {
    const title = unifiedLatexUtilArguments.getNamedArgsContent(splits.macros[i - 1])["title"];
    const titleArg = [];
    if (title) {
      titleArg.push(unifiedLatexBuilder.arg(title, { braces: "[]" }));
    }
    splits.segments[i] = [unifiedLatexBuilder.env(newEnviron, splits.segments[i], titleArg)];
  }
}
function formatNodeForError(node) {
  try {
    return unifiedLatexUtilPrintRaw.printRaw(node);
  } catch {
  }
  return JSON.stringify(node);
}
function toPretextWithLoggerFactory(logger) {
  return function toPretext2(node) {
    var _a, _b;
    const htmlNode = node;
    if (unifiedLatexUtilHtmlLike.isHtmlLikeTag(htmlNode)) {
      const extracted = unifiedLatexUtilHtmlLike.extractFromHtmlLike(htmlNode);
      const attributes = extracted.attributes;
      return x(
        extracted.tag,
        attributes,
        extracted.content.flatMap(toPretext2)
      );
    }
    switch (node.type) {
      case "string":
        return {
          type: "text",
          value: node.content,
          position: node.position
        };
      case "comment":
        return {
          type: "comment",
          value: node.content,
          position: node.position
        };
      case "inlinemath":
        return x("m", unifiedLatexUtilPrintRaw.printRaw(node.content));
      case "mathenv":
      case "displaymath":
        return x("md", unifiedLatexUtilPrintRaw.printRaw(node.content));
      case "verb":
      case "verbatim":
        return x("pre", node.content);
      case "whitespace":
        return { type: "text", value: " ", position: node.position };
      case "parbreak":
        logger(
          `There is no equivalent for parbreak, so it was replaced with an empty string.`,
          node
        );
        return {
          type: "text",
          value: "",
          position: node.position
        };
      case "group":
        return node.content.flatMap(toPretext2);
      case "environment":
        if (isMappedEnviron(node)) {
          let divisionName = (_a = divisions.find(
            (x2) => x2.mappedEnviron === node.env
          )) == null ? void 0 : _a.division;
          if (divisionName === "subparagraph") {
            logger(
              `Warning: There is no equivalent tag for "subparagraph", "paragraphs" was used as a replacement.`,
              node
            );
          }
          if (divisionName === "paragraph" || divisionName === "subparagraph") {
            divisionName = "paragraphs";
          }
          const attributes = {};
          if ((_b = node._renderInfo) == null ? void 0 : _b.additionalAttributes) {
            Object.assign(attributes, node._renderInfo.additionalAttributes);
          }
          const title = unifiedLatexUtilArguments.getArgsContent(node)[0];
          if (!title) {
            logger(
              `Warning: No title was given, so an empty title tag was used.`,
              node
            );
          }
          const titleTag = x("title", title == null ? void 0 : title.flatMap(toPretext2));
          if (divisionName) {
            return x(
              divisionName,
              attributes,
              [
                titleTag,
                ...node.content.flatMap(toPretext2)
              ]
            );
          }
        }
        logger(
          `Unknown environment when converting to XML \`${formatNodeForError(
            node.env
          )}\``,
          node
        );
        return node.content.flatMap(toPretext2);
      // just remove the environment
      case "macro":
        logger(
          `Unknown macro when converting to XML \`${formatNodeForError(
            node
          )}\``,
          node
        );
        return (node.args || []).map(toPretext2).flat();
      case "argument":
        logger(
          `Unknown argument when converting to XML \`${formatNodeForError(
            node
          )}\``,
          node
        );
        return {
          type: "text",
          value: unifiedLatexUtilPrintRaw.printRaw(node.content),
          position: node.position
        };
      case "root":
        return node.content.flatMap(toPretext2);
      default: {
        throw new Error(
          `Unknown node type; cannot convert to XAST ${JSON.stringify(
            node
          )}`
        );
      }
    }
  };
}
function splitForPars(nodes, options) {
  const ret = [];
  let currBody = [];
  unifiedLatexUtilTrim.trim(nodes);
  const isParBreakingMacro = unifiedLatexUtilMatch.match.createMacroMatcher(
    options.macrosThatBreakPars
  );
  const isEnvThatShouldNotBreakPar = unifiedLatexUtilMatch.match.createEnvironmentMatcher(
    options.environmentsThatDontBreakPars
  );
  function pushBody() {
    if (currBody.length > 0) {
      unifiedLatexUtilTrim.trim(currBody);
      ret.push({ content: currBody, wrapInPar: true });
      currBody = [];
    }
  }
  for (const node of nodes) {
    if (isParBreakingMacro(node)) {
      pushBody();
      ret.push({ content: [node], wrapInPar: false });
      continue;
    }
    if (unifiedLatexUtilMatch.match.anyEnvironment(node) && !isEnvThatShouldNotBreakPar(node)) {
      pushBody();
      ret.push({ content: [node], wrapInPar: false });
      continue;
    }
    if (unifiedLatexUtilMatch.match.parbreak(node) || unifiedLatexUtilMatch.match.macro(node, "par")) {
      pushBody();
      continue;
    }
    currBody.push(node);
  }
  pushBody();
  return ret;
}
function wrapPars(nodes, options) {
  const {
    macrosThatBreakPars = [
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
    ],
    environmentsThatDontBreakPars = [
      "index",
      "itemize",
      "enumerate"
    ]
  } = options || {};
  const parSplits = splitForPars(nodes, {
    macrosThatBreakPars,
    environmentsThatDontBreakPars
  });
  return parSplits.flatMap((part) => {
    if (part.wrapInPar) {
      return unifiedLatexUtilHtmlLike.htmlLike({ tag: "p", content: part.content });
    } else {
      return part.content;
    }
  });
}
function createTableFromTabular(env) {
  const tabularBody = unifiedLatexUtilAlign.parseAlignEnvironment(env.content);
  const args = unifiedLatexUtilArguments.getArgsContent(env);
  let columnSpecs = [];
  try {
    columnSpecs = tabularx.parseTabularSpec(args[1] || []);
  } catch (e) {
  }
  const attributes = {};
  let notLeftAligned = false;
  const columnRightBorder = {};
  const tableBody = tabularBody.map((row) => {
    const content = row.cells.map((cell, i) => {
      const columnSpec = columnSpecs[i];
      if (columnSpec) {
        const { alignment } = columnSpec;
        if (columnSpec.pre_dividers.some(
          (div) => div.type === "vert_divider"
        )) {
          attributes["left"] = "minor";
        }
        if (columnSpec.post_dividers.some(
          (div) => div.type === "vert_divider"
        )) {
          columnRightBorder[i] = true;
        }
        if (alignment.alignment !== "left") {
          notLeftAligned = true;
        }
      }
      unifiedLatexUtilTrim.trim(cell);
      return unifiedLatexUtilHtmlLike.htmlLike({
        tag: "cell",
        content: cell
      });
    });
    return unifiedLatexUtilHtmlLike.htmlLike({ tag: "row", content });
  });
  if (notLeftAligned || Object.values(columnRightBorder).some((b) => b)) {
    for (let i = columnSpecs.length; i >= 0; i--) {
      const columnSpec = columnSpecs[i];
      if (!columnSpec) {
        continue;
      }
      const colAttributes = {};
      const { alignment } = columnSpec;
      if (alignment.alignment !== "left") {
        colAttributes["halign"] = alignment.alignment;
      }
      if (columnRightBorder[i] === true) {
        colAttributes["right"] = "minor";
      }
      tableBody.unshift(
        unifiedLatexUtilHtmlLike.htmlLike({ tag: "col", attributes: colAttributes })
      );
    }
  }
  return unifiedLatexUtilHtmlLike.htmlLike({
    tag: "tabular",
    content: tableBody,
    attributes
  });
}
const ITEM_ARG_NAMES_REG = ["label"];
const ITEM_ARG_NAMES_BEAMER = [null, "label", null];
function getItemArgs(node) {
  if (!Array.isArray(node.args)) {
    throw new Error(
      `Cannot find \\item macros arguments; you must attach the \\item body to the macro before calling this function ${JSON.stringify(
        node
      )}`
    );
  }
  const argNames = node.args.length - 1 === ITEM_ARG_NAMES_BEAMER.length ? ITEM_ARG_NAMES_BEAMER : ITEM_ARG_NAMES_REG;
  const ret = Object.assign(
    { body: node.args[node.args.length - 1].content },
    unifiedLatexUtilArguments.getNamedArgsContent(node, argNames)
  );
  return ret;
}
function enumerateFactory(parentTag = "ol") {
  return function enumerateToHtml(env) {
    const items = env.content.filter((node) => unifiedLatexUtilMatch.match.macro(node, "item"));
    let isDescriptionList = false;
    const content = items.flatMap((node) => {
      if (!unifiedLatexUtilMatch.match.macro(node) || !node.args) {
        return [];
      }
      const namedArgs = getItemArgs(node);
      namedArgs.body = wrapPars(namedArgs.body);
      if (namedArgs.label != null) {
        isDescriptionList = true;
        namedArgs.body.unshift(
          unifiedLatexUtilHtmlLike.htmlLike({
            tag: "title",
            content: namedArgs.label
          })
        );
      }
      const body = namedArgs.body;
      return unifiedLatexUtilHtmlLike.htmlLike({
        tag: "li",
        content: body
      });
    });
    return unifiedLatexUtilHtmlLike.htmlLike({
      tag: isDescriptionList ? "dl" : parentTag,
      content
    });
  };
}
function envFactory(tag, options = {}) {
  const {
    requiresStatementTag = false,
    wrapContentInPars = true,
    extractTitleFromArgs = true,
    warningMessage = ""
  } = options;
  return (env, info, file) => {
    var _a;
    if (warningMessage && file) {
      const message = makeWarningMessage(env, warningMessage, "env-subs");
      file.message(message, message.place, message.source);
    }
    let content = wrapContentInPars ? wrapPars(env.content) : env.content;
    if (requiresStatementTag) {
      content = [
        unifiedLatexUtilHtmlLike.htmlLike({
          tag: "statement",
          content
        })
      ];
    }
    if (extractTitleFromArgs) {
      const args = unifiedLatexUtilArguments.getArgsContent(env);
      if (args[0]) {
        content.unshift(
          unifiedLatexUtilHtmlLike.htmlLike({
            tag: "title",
            content: args[0] || []
          })
        );
      }
    }
    const attributes = {};
    if ((_a = env._renderInfo) == null ? void 0 : _a.additionalAttributes) {
      Object.assign(attributes, env._renderInfo.additionalAttributes);
    }
    return unifiedLatexUtilHtmlLike.htmlLike({
      tag,
      content,
      attributes
    });
  };
}
const environmentReplacements = {
  // TODO: add additional envs like theorem, etc.
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
  ...genEnvironmentReplacements()
};
function genEnvironmentReplacements() {
  const envAliases = {
    abstract: { requiresStatement: false, aliases: ["abs", "abstr"] },
    acknowledgement: { requiresStatement: false, aliases: ["ack"] },
    algorithm: { requiresStatement: true, aliases: ["algo", "alg"] },
    answer: { requiresStatement: false, aliases: ["ans"] },
    assumption: { requiresStatement: true, aliases: ["assu", "ass"] },
    axiom: { requiresStatement: true, aliases: ["axm"] },
    claim: { requiresStatement: true, aliases: ["cla"] },
    conjecture: {
      requiresStatement: true,
      aliases: ["con", "conj", "conjec"]
    },
    construction: { requiresStatement: false, aliases: [] },
    convention: { requiresStatement: false, aliases: ["conv"] },
    corollary: {
      requiresStatement: true,
      aliases: ["cor", "corr", "coro", "corol", "corss"]
    },
    definition: {
      requiresStatement: true,
      aliases: ["def", "defn", "dfn", "defi", "defin", "de"]
    },
    example: {
      requiresStatement: true,
      aliases: ["exam", "exa", "eg", "exmp", "expl", "exm"]
    },
    exercise: { requiresStatement: true, aliases: ["exer", "exers"] },
    exploration: { requiresStatement: false, aliases: [] },
    fact: { requiresStatement: true, aliases: [] },
    heuristic: { requiresStatement: true, aliases: [] },
    hint: { requiresStatement: false, aliases: [] },
    hypothesis: { requiresStatement: true, aliases: ["hyp"] },
    identity: { requiresStatement: true, aliases: ["idnty"] },
    insight: { requiresStatement: false, aliases: [] },
    investigation: { requiresStatement: false, aliases: [] },
    lemma: {
      requiresStatement: true,
      aliases: ["lem", "lma", "lemm", "lm"]
    },
    notation: {
      requiresStatement: false,
      aliases: ["no", "nota", "ntn", "nt", "notn", "notat"]
    },
    note: { requiresStatement: false, aliases: ["notes"] },
    observation: { requiresStatement: false, aliases: ["obs"] },
    principle: { requiresStatement: true, aliases: [] },
    problem: { requiresStatement: true, aliases: ["prob", "prb"] },
    project: { requiresStatement: false, aliases: [] },
    proof: { requiresStatement: false, aliases: ["pf", "prf", "demo"] },
    proposition: {
      requiresStatement: true,
      aliases: ["prop", "pro", "prp", "props"]
    },
    question: {
      requiresStatement: true,
      aliases: ["qu", "ques", "quest", "qsn"]
    },
    remark: {
      requiresStatement: false,
      aliases: ["rem", "rmk", "rema", "bem", "subrem"]
    },
    task: { requiresStatement: true, aliases: [] },
    theorem: {
      requiresStatement: true,
      aliases: ["thm", "theo", "theor", "thmss", "thrm"]
    },
    solution: { requiresStatement: false, aliases: ["sol"] },
    warning: { requiresStatement: false, aliases: ["warn", "wrn"] }
  };
  const exapandedEnvAliases = Object.entries(envAliases).flatMap(
    ([env, spec]) => [
      [
        env,
        envFactory(env, {
          requiresStatementTag: spec.requiresStatement
        })
      ],
      ...spec.aliases.map((name2) => [
        name2,
        envFactory(env, {
          requiresStatementTag: spec.requiresStatement
        })
      ])
    ]
  );
  return Object.fromEntries(exapandedEnvAliases);
}
const KATEX_MACROS = /* @__PURE__ */ JSON.parse('[" ","!","\\"","#","&","\'","*",",",".",":",";","=",">","AA","AE","Alpha","And","Arrowvert","Bbb","Bbbk","Beta","Big","Bigg","Biggl","Biggm","Biggr","Bigl","Bigm","Bigr","Box","Bra","Bumpeq","C","Cap","Chi","Colonapprox","Coloneq","Coloneqq","Colonsim","Complex","Coppa","Cup","Dagger","Darr","DeclareMathOperator","Delta","Diamond","Digamma","Doteq","Downarrow","Epsilon","Eqcolon","Eqqcolon","Eta","Finv","Game","Gamma","H","Harr","Huge","Im","Iota","Join","KaTeX","Kappa","Ket","Koppa","L","LARGE","LaTeX","Lambda","Large","Larr","LeftArrow","Leftarrow","Leftrightarrow","Lleftarrow","Longleftarrow","Longleftrightarrow","Longrightarrow","Lrarr","Lsh","Mu","N","Newextarrow","Nu","O","OE","Omega","Omicron","Overrightarrow","P","Phi","Pi","Pr","Psi","Q","R","Rarr","Re","Reals","Rho","Rightarrow","Rrightarrow","Rsh","Rule","S","Sampi","Sigma","Space","Stigma","Subset","Supset","Tau","TeX","Theta","Tiny","Uarr","Uparrow","Updownarrow","Upsilon","Vdash","Vert","Vvdash","Xi","Z","Zeta","\\\\","^","_","`","aa","above","abovewithdelims","acute","add","ae","alef","alefsym","aleph","allowbreak","alpha","amalg","and","ang","angl","angle","angln","approx","approxcolon","approxcoloncolon","approxeq","arccos","arcctg","arcsin","arctan","arctg","arg","argmax","argmin","array","arraystretch","arrowvert","ast","asymp","atop","atopwithdelims","backepsilon","backprime","backsim","backsimeq","backslash","bar","barwedge","bbox","bcancel","because","begin","begingroup","beta","beth","between","bf","bfseries","big","bigcap","bigcirc","bigcup","bigg","biggl","biggm","biggr","bigl","bigm","bigodot","bigominus","bigoplus","bigoslash","bigotimes","bigr","bigsqcap","bigsqcup","bigstar","bigtriangledown","bigtriangleup","biguplus","bigvee","bigwedge","binom","blacklozenge","blacksquare","blacktriangle","blacktriangledown","blacktriangleleft","blacktriangleright","bm","bmod","bold","boldsymbol","bot","bowtie","boxdot","boxed","boxminus","boxplus","boxtimes","bra","brace","bracevert","brack","braket","breve","buildrel","bull","bullet","bumpeq","cal","cancel","cancelto","cap","cases","cdot","cdotp","cdots","ce","cee","centerdot","cf","cfrac","ch","char","check","checkmark","chi","chk","choose","circ","circeq","circlearrowleft","circlearrowright","circledR","circledS","circledast","circledcirc","circleddash","class","cline","clubs","clubsuit","cnums","colon","colonapprox","coloncolon","coloncolonapprox","coloncolonequals","coloncolonminus","coloncolonsim","coloneq","coloneqq","colonequals","colonminus","colonsim","color","colorbox","complement","cong","coppa","coprod","copyright","cos","cosec","cosh","cot","cotg","coth","cr","csc","cssId","ctg","cth","cup","curlyeqprec","curlyeqsucc","curlyvee","curlywedge","curvearrowleft","curvearrowright","dArr","dag","dagger","daleth","darr","dashleftarrow","dashrightarrow","dashv","dbinom","dblcolon","ddag","ddagger","ddddot","dddot","ddot","ddots","def","definecolor","deg","degree","delta","det","dfrac","diagdown","diagup","diamond","diamonds","diamondsuit","digamma","dim","displaylines","displaystyle","div","divideontimes","dot","doteq","doteqdot","dotplus","dots","dotsb","dotsc","dotsi","dotsm","dotso","doublebarwedge","doublecap","doublecup","downarrow","downdownarrows","downharpoonleft","downharpoonright","edef","ell","else","em","emph","empty","emptyset","enclose","end","endgroup","enspace","epsilon","eqalign","eqalignno","eqcirc","eqcolon","eqqcolon","eqref","eqsim","eqslantgtr","eqslantless","equalscolon","equalscoloncolon","equiv","eta","eth","euro","exist","exists","exp","expandafter","fallingdotseq","fbox","fcolorbox","fi","flat","foo","footnotesize","forall","frac","frak","frown","futurelet","gamma","gcd","gdef","ge","geneuro","geneuronarrow","geneurowide","genfrac","geq","geqq","geqslant","gets","gg","ggg","gggtr","gimel","global","gnapprox","gneq","gneqq","gnsim","grave","greet","gt","gtrapprox","gtrdot","gtreqless","gtreqqless","gtrless","gtrsim","gvertneqq","hArr","hail","harr","hat","hbar","hbox","hdashline","hearts","heartsuit","hfil","hfill","hline","hom","hookleftarrow","hookrightarrow","hphantom","href","hskip","hslash","hspace","htmlClass","htmlData","htmlId","htmlStyle","huge","i","iddots","idotsint","if","iff","ifmode","ifx","iiiint","iiint","iint","image","imageof","imath","impliedby","implies","in","includegraphics","inf","infin","infty","injlim","int","intercal","intop","iota","isin","it","itshape","j","jmath","kappa","ker","kern","ket","koppa","l","lArr","lBrace","lVert","label","lambda","land","lang","langle","large","larr","lbrace","lbrack","lceil","ldotp","ldots","le","leadsto","left","leftarrow","leftarrowtail","leftharpoondown","leftharpoonup","leftleftarrows","leftrightarrow","leftrightarrows","leftrightharpoons","leftrightsquigarrow","leftroot","leftthreetimes","leq","leqalignno","leqq","leqslant","lessapprox","lessdot","lesseqgtr","lesseqqgtr","lessgtr","lesssim","let","lfloor","lg","lgroup","lhd","lim","liminf","limits","limsup","ll","llap","llbracket","llcorner","lll","llless","lmoustache","ln","lnapprox","lneq","lneqq","lnot","lnsim","log","long","longleftarrow","longleftrightarrow","longmapsto","longrightarrow","looparrowleft","looparrowright","lor","lower","lozenge","lparen","lq","lrArr","lrarr","lrcorner","lt","ltimes","lvert","lvertneqq","maltese","mapsto","mathbb","mathbf","mathbin","mathcal","mathchoice","mathclap","mathclose","mathellipsis","mathfrak","mathinner","mathit","mathllap","mathnormal","mathop","mathopen","mathord","mathpunct","mathrel","mathring","mathrlap","mathrm","mathscr","mathsf","mathsterling","mathstrut","mathtip","mathtt","matrix","max","mbox","md","mdseries","measuredangle","medspace","mho","mid","middle","min","minuscolon","minuscoloncolon","minuso","mit","mkern","mmlToken","mod","models","moveleft","moveright","mp","mskip","mspace","mu","multicolumn","multimap","nLeftarrow","nLeftrightarrow","nRightarrow","nVDash","nVdash","nabla","natnums","natural","ncong","ne","nearrow","neg","negmedspace","negthickspace","negthinspace","neq","newcommand","newenvironment","newline","nexists","ngeq","ngeqq","ngeqslant","ngtr","ni","nleftarrow","nleftrightarrow","nleq","nleqq","nleqslant","nless","nmid","nobreak","nobreakspace","noexpand","nolimits","nonumber","normalfont","normalsize","not","notag","notin","notni","nparallel","nprec","npreceq","nrightarrow","nshortmid","nshortparallel","nsim","nsubseteq","nsubseteqq","nsucc","nsucceq","nsupseteq","nsupseteqq","ntriangleleft","ntrianglelefteq","ntriangleright","ntrianglerighteq","nu","nvDash","nvdash","nwarrow","o","odot","oe","officialeuro","oiiint","oiint","oint","oldstyle","omega","omicron","ominus","operatorname","operatornamewithlimits","oplus","or","origof","oslash","otimes","over","overbrace","overbracket","overgroup","overleftarrow","overleftharpoon","overleftrightarrow","overline","overlinesegment","overparen","overrightarrow","overrightharpoon","overset","overwithdelims","owns","pagecolor","parallel","part","partial","perp","phantom","phase","phi","pi","pitchfork","plim","plusmn","pm","pmatrix","pmb","pmod","pod","pounds","prec","precapprox","preccurlyeq","preceq","precnapprox","precneqq","precnsim","precsim","prime","prod","projlim","propto","providecommand","psi","pu","qquad","quad","r","rArr","rBrace","rVert","raise","raisebox","rang","rangle","rarr","ratio","rbrace","rbrack","rceil","real","reals","ref","relax","renewcommand","renewenvironment","require","restriction","rfloor","rgroup","rhd","rho","right","rightarrow","rightarrowtail","rightharpoondown","rightharpoonup","rightleftarrows","rightleftharpoons","rightrightarrows","rightsquigarrow","rightthreetimes","risingdotseq","rlap","rm","rmoustache","root","rotatebox","rparen","rq","rrbracket","rtimes","rule","rvert","sampi","sc","scalebox","scr","scriptscriptstyle","scriptsize","scriptstyle","sdot","searrow","sec","sect","setlength","setminus","sf","sh","sharp","shortmid","shortparallel","shoveleft","shoveright","sideset","sigma","sim","simcolon","simcoloncolon","simeq","sin","sinh","sixptsize","skew","skip","sl","small","smallfrown","smallint","smallsetminus","smallsmile","smash","smile","smiley","sout","space","spades","spadesuit","sphericalangle","sqcap","sqcup","sqrt","sqsubset","sqsubseteq","sqsupset","sqsupseteq","square","ss","stackrel","star","stigma","strut","style","sub","sube","subset","subseteq","subseteqq","subsetneq","subsetneqq","substack","succ","succapprox","succcurlyeq","succeq","succnapprox","succneqq","succnsim","succsim","sum","sup","supe","supset","supseteq","supseteqq","supsetneq","supsetneqq","surd","swarrow","tag","tan","tanh","tau","tbinom","text","textasciicircum","textasciitilde","textbackslash","textbar","textbardbl","textbf","textbraceleft","textbraceright","textcircled","textcolor","textdagger","textdaggerdbl","textdegree","textdollar","textellipsis","textemdash","textendash","textgreater","textit","textless","textmd","textnormal","textquotedblleft","textquotedblright","textquoteleft","textquoteright","textregistered","textrm","textsc","textsf","textsl","textsterling","textstyle","texttip","texttt","textunderscore","textup","textvisiblespace","tfrac","tg","th","therefore","theta","thetasym","thickapprox","thicksim","thickspace","thinspace","tilde","times","tiny","to","toggle","top","triangle","triangledown","triangleleft","trianglelefteq","triangleq","triangleright","trianglerighteq","tt","twoheadleftarrow","twoheadrightarrow","u","uArr","uarr","ulcorner","underbar","underbrace","underbracket","undergroup","underleftarrow","underleftrightarrow","underline","underlinesegment","underparen","underrightarrow","underset","unicode","unlhd","unrhd","up","uparrow","updownarrow","upharpoonleft","upharpoonright","uplus","uproot","upshape","upsilon","upuparrows","urcorner","url","utilde","v","vDash","varDelta","varGamma","varLambda","varOmega","varPhi","varPi","varPsi","varSigma","varTheta","varUpsilon","varXi","varcoppa","varepsilon","varinjlim","varkappa","varliminf","varlimsup","varnothing","varphi","varpi","varprojlim","varpropto","varrho","varsigma","varstigma","varsubsetneq","varsubsetneqq","varsupsetneq","varsupsetneqq","vartheta","vartriangle","vartriangleleft","vartriangleright","vcentcolon","vcenter","vdash","vdots","vec","vee","veebar","vert","vfil","vfill","vline","vphantom","wedge","weierp","widecheck","widehat","wideparen","widetilde","wp","wr","xLeftarrow","xLeftrightarrow","xRightarrow","xcancel","xdef","xhookleftarrow","xhookrightarrow","xi","xleftarrow","xleftharpoondown","xleftharpoonup","xleftrightarrow","xleftrightharpoons","xlongequal","xmapsto","xrightarrow","xrightharpoondown","xrightharpoonup","xrightleftharpoons","xtofrom","xtwoheadleftarrow","xtwoheadrightarrow","yen","zeta","{","|","}","~"]');
const KATEX_ENVIRONMENTS = ["align", "align*", "alignat", "alignat*", "aligned", "alignedat", "array", "Bmatrix", "bmatrix", "Bmatrix*", "bmatrix*", "cases", "CD", "darray", "dcases", "drcases", "equation", "equation*", "gather", "gathered", "matrix", "matrix*", "pmatrix", "pmatrix*", "rcases", "smallmatrix", "split", "Vmatrix", "vmatrix", "Vmatrix*", "vmatrix*"];
const KATEX_SUPPORT_LIST = {
  KATEX_MACROS,
  KATEX_ENVIRONMENTS
};
const LEFT = { type: "macro", content: "left" };
const RIGHT = { type: "macro", content: "right" };
const DEFAULT_LEFT_DELIM = { type: "macro", content: "{" };
const DEFAULT_RIGHT_DELIM = { type: "string", content: "." };
const mathjaxSpecificMacroReplacements = {
  systeme: (node) => {
    var _a, _b;
    try {
      const args = unifiedLatexUtilArguments.getArgsContent(node);
      const whitelistedVariables = args[1] || void 0;
      const equations = args[3] || [];
      const ret = systeme.systemeContentsToArray(equations, {
        properSpacing: false,
        whitelistedVariables
      });
      if ((_a = node == null ? void 0 : node._renderInfo) == null ? void 0 : _a.sysdelims) {
        const [frontDelim, backDelim] = (_b = node._renderInfo) == null ? void 0 : _b.sysdelims;
        return [
          LEFT,
          ...frontDelim || [],
          ret,
          RIGHT,
          ...backDelim || []
        ];
      }
      return [LEFT, DEFAULT_LEFT_DELIM, ret, RIGHT, DEFAULT_RIGHT_DELIM];
    } catch (e) {
      return node;
    }
  },
  sysdelim: () => []
};
const mathjaxSpecificEnvironmentReplacements = {
  // Currently nothing here; but keeping this function in case there are specific environments for latex we want to handle differently in pretext.
};
function attachNeededRenderInfo(ast) {
  systeme.attachSystemeSettingsAsRenderInfo(ast);
}
const KATEX_SUPPORT = {
  macros: KATEX_SUPPORT_LIST["KATEX_MACROS"],
  environments: KATEX_SUPPORT_LIST["KATEX_ENVIRONMENTS"]
};
function factory$1(tag, warningMessage = "", attributes) {
  return (macro, info, file) => {
    if (!macro.args) {
      throw new Error(
        `Found macro to replace but couldn't find content ${unifiedLatexUtilPrintRaw.printRaw(
          macro
        )}`
      );
    }
    if (warningMessage && file) {
      const message = makeWarningMessage(
        macro,
        `Warning: There is no equivalent tag for "${macro.content}", "${tag}" was used as a replacement.`,
        "macro-subs"
      );
      file.message(message, message.place, message.source);
    }
    const args = unifiedLatexUtilArguments.getArgsContent(macro);
    const content = args[args.length - 1] || [];
    return unifiedLatexUtilHtmlLike.htmlLike({ tag, content, attributes });
  };
}
function createHeading(tag, attrs = {}) {
  return (macro) => {
    const args = unifiedLatexUtilArguments.getArgsContent(macro);
    const attributes = {};
    if (attrs) {
      Object.assign(attributes, attrs);
    }
    return unifiedLatexUtilHtmlLike.htmlLike({
      tag,
      content: args[args.length - 1] || [],
      attributes
    });
  };
}
const macroReplacements = {
  emph: factory$1("em"),
  textrm: factory$1(
    "em",
    `Warning: There is no equivalent tag for "textrm", "em" was used as a replacement.`
  ),
  textsf: factory$1(
    "em",
    `Warning: There is no equivalent tag for "textsf", "em" was used as a replacement.`
  ),
  texttt: factory$1(
    "em",
    `Warning: There is no equivalent tag for "textsf", "em" was used as a replacement.`
  ),
  textsl: factory$1(
    "em",
    `Warning: There is no equivalent tag for "textsl", "em" was used as a replacement.`
  ),
  textit: factory$1("em"),
  textbf: factory$1("alert"),
  term: factory$1("term"),
  underline: factory$1(
    "em",
    `Warning: There is no equivalent tag for "underline", "em" was used as a replacement.`
  ),
  mbox: emptyStringWithWarningFactory(
    `Warning: There is no equivalent tag for "mbox", an empty Ast.String was used as a replacement.`
  ),
  phantom: emptyStringWithWarningFactory(
    `Warning: There is no equivalent tag for "phantom", an empty Ast.String was used as a replacement.`
  ),
  appendix: createHeading("appendix"),
  url: (node) => {
    const args = unifiedLatexUtilArguments.getArgsContent(node);
    const url = unifiedLatexUtilPrintRaw.printRaw(args[0] || "#");
    return unifiedLatexUtilHtmlLike.htmlLike({
      tag: "url",
      attributes: {
        href: url
      },
      content: [{ type: "string", content: url }]
    });
  },
  href: (node) => {
    const args = unifiedLatexUtilArguments.getArgsContent(node);
    const url = unifiedLatexUtilPrintRaw.printRaw(args[1] || "#");
    return unifiedLatexUtilHtmlLike.htmlLike({
      tag: "url",
      attributes: {
        href: url
      },
      content: args[2] || []
    });
  },
  hyperref: (node) => {
    const args = unifiedLatexUtilArguments.getArgsContent(node);
    const url = "#" + unifiedLatexUtilPrintRaw.printRaw(args[0] || "");
    return unifiedLatexUtilHtmlLike.htmlLike({
      tag: "url",
      attributes: {
        href: url
      },
      content: args[1] || []
    });
  },
  ref: (node) => {
    const args = unifiedLatexUtilArguments.getArgsContent(node);
    const ref = sanitizeXmlId(unifiedLatexUtilPrintRaw.printRaw(args[1] || ""));
    return unifiedLatexUtilHtmlLike.htmlLike({
      tag: "xref",
      attributes: {
        ref: ref || ""
      }
    });
  },
  eqref: (node) => {
    const args = unifiedLatexUtilArguments.getArgsContent(node);
    const ref = sanitizeXmlId(unifiedLatexUtilPrintRaw.printRaw(args[0] || ""));
    return unifiedLatexUtilHtmlLike.htmlLike({
      tag: "xref",
      attributes: {
        ref: ref || ""
      }
    });
  },
  cref: (node) => {
    const args = unifiedLatexUtilArguments.getArgsContent(node);
    const ref = sanitizeXmlId(unifiedLatexUtilPrintRaw.printRaw(args[1] || ""));
    return unifiedLatexUtilHtmlLike.htmlLike({
      tag: "xref",
      attributes: {
        ref: ref || ""
      }
    });
  },
  Cref: (node) => {
    const args = unifiedLatexUtilArguments.getArgsContent(node);
    const ref = sanitizeXmlId(unifiedLatexUtilPrintRaw.printRaw(args[1] || ""));
    return unifiedLatexUtilHtmlLike.htmlLike({
      tag: "xref",
      attributes: {
        ref: ref || ""
      }
    });
  },
  cite: (node) => {
    const args = unifiedLatexUtilArguments.getArgsContent(node);
    const ref = sanitizeXmlId(unifiedLatexUtilPrintRaw.printRaw(args[1] || ""));
    return unifiedLatexUtilHtmlLike.htmlLike({
      tag: "xref",
      attributes: {
        ref: ref || ""
      }
    });
  },
  index: (node) => {
    const args = unifiedLatexUtilArguments.getArgsContent(node);
    const term = args[0] || [];
    return unifiedLatexUtilHtmlLike.htmlLike({
      tag: "idx",
      content: unifiedLatexUtilHtmlLike.htmlLike({
        tag: "h",
        content: term
      })
    });
  },
  "\\": emptyStringWithWarningFactory(
    `Warning: There is no equivalent tag for "\\", an empty Ast.String was used as a replacement.`
  ),
  vspace: emptyStringWithWarningFactory(
    `Warning: There is no equivalent tag for "vspace", an empty Ast.String was used as a replacement.`
  ),
  hspace: emptyStringWithWarningFactory(
    `Warning: There is no equivalent tag for "hspace", an empty Ast.String was used as a replacement.`
  ),
  textcolor: factory$1(
    "em",
    `Warning: There is no equivalent tag for "textcolor", "em" was used as a replacement.`
  ),
  textsize: emptyStringWithWarningFactory(
    `Warning: There is no equivalent tag for "textsize", an empty Ast.String was used as a replacement.`
  ),
  makebox: emptyStringWithWarningFactory(
    `Warning: There is no equivalent tag for "makebox", an empty Ast.String was used as a replacement.`
  ),
  noindent: emptyStringWithWarningFactory(
    `Warning: There is no equivalent tag for "noindent", an empty Ast.String was used as a replacement.`
  ),
  latex: (node) => {
    return unifiedLatexUtilHtmlLike.htmlLike({ tag: "latex" });
  },
  latexe: (node) => {
    return unifiedLatexUtilHtmlLike.htmlLike({ tag: "latex" });
  },
  today: (node) => {
    return unifiedLatexUtilHtmlLike.htmlLike({ tag: "today" });
  },
  tex: (node) => {
    return unifiedLatexUtilHtmlLike.htmlLike({ tag: "tex" });
  },
  //tex: factory("tex"),
  includegraphics: (node) => {
    const args = unifiedLatexUtilArguments.getArgsContent(node);
    const source = unifiedLatexUtilPrintRaw.printRaw(args[args.length - 1] || []);
    return unifiedLatexUtilHtmlLike.htmlLike({
      tag: "image",
      attributes: {
        source
      },
      content: []
    });
  },
  caption: (node, parent) => {
    var _a;
    const args = unifiedLatexUtilArguments.getArgsContent(node);
    const namedArgs = unifiedLatexUtilArguments.getNamedArgsContent(node);
    const captionText = namedArgs["captionText"] || args[args.length - 1] || [];
    const isInTable = ((_a = parent == null ? void 0 : parent.parents) == null ? void 0 : _a.some(
      (ancestor) => ancestor.type === "macro" && ancestor.content === "html-tag:table"
    )) ?? false;
    let ret = unifiedLatexUtilHtmlLike.htmlLike({
      tag: isInTable ? "title" : "caption",
      content: captionText
    });
    return ret;
  }
};
function factory(macroName, ...boundArgs) {
  return (content, originalCommand) => {
    return unifiedLatexBuilder.m(macroName, boundArgs.map((a) => unifiedLatexBuilder.arg(a)).concat(unifiedLatexBuilder.arg(content)));
  };
}
const streamingMacroReplacements = {
  color: xcolor.colorToTextcolorMacro,
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
const unifiedLatexWrapPars = function unifiedLatexWrapPars2(options) {
  const { macrosThatBreakPars, environmentsThatDontBreakPars } = options || {};
  return (tree) => {
    let hasDocumentEnv = false;
    unifiedLatexUtilVisit.visit(
      tree,
      (env) => {
        if (unifiedLatexUtilMatch.match.environment(env, "document") || isMappedEnviron(env)) {
          if (unifiedLatexUtilMatch.match.environment(env, "document")) {
            hasDocumentEnv = true;
          }
          env.content = wrapPars(env.content, {
            macrosThatBreakPars,
            environmentsThatDontBreakPars
          });
        }
      },
      { test: unifiedLatexUtilMatch.match.anyEnvironment }
    );
    if (!hasDocumentEnv) {
      tree.content = wrapPars(tree.content, {
        macrosThatBreakPars,
        environmentsThatDontBreakPars
      });
    }
  };
};
function reportMacrosUnsupportedByMathjax(ast) {
  const unsupported = { messages: [] };
  const isSupported = unifiedLatexUtilMatch.match.createMacroMatcher(KATEX_SUPPORT.macros);
  unifiedLatexUtilVisit.visit(ast, (node, info) => {
    if (unifiedLatexUtilMatch.anyMacro(node) && info.context.hasMathModeAncestor) {
      if (!isSupported(node)) {
        unsupported.messages.push(
          makeWarningMessage(
            node,
            `Warning: "${node.content}" is unsupported by Katex.`,
            "report-unsupported-macro-katex"
          )
        );
      }
    }
  });
  return unsupported;
}
const unifiedLatexToPretextLike = function unifiedLatexToHtmlLike(options) {
  const macroReplacements$1 = Object.assign(
    {},
    macroReplacements,
    (options == null ? void 0 : options.macroReplacements) || {}
  );
  const environmentReplacements$1 = Object.assign(
    {},
    environmentReplacements,
    (options == null ? void 0 : options.environmentReplacements) || {}
  );
  const producePretextFragment = (options == null ? void 0 : options.producePretextFragment) ? options == null ? void 0 : options.producePretextFragment : false;
  const isReplaceableMacro = unifiedLatexUtilMatch.match.createMacroMatcher(macroReplacements$1);
  const isReplaceableEnvironment = unifiedLatexUtilMatch.match.createEnvironmentMatcher(
    environmentReplacements$1
  );
  const isMathjaxMacro = unifiedLatexUtilMatch.match.createMacroMatcher(
    mathjaxSpecificMacroReplacements
  );
  const isMathjaxEnvironment = unifiedLatexUtilMatch.match.createEnvironmentMatcher(
    mathjaxSpecificEnvironmentReplacements
  );
  return (tree, file) => {
    const originalTree = tree;
    unifiedLatexUtilComments.deleteComments(tree);
    let processor = unified().use(unifiedLatexLintNoTexFontShapingCommands.unifiedLatexLintNoTexFontShapingCommands, { fix: true }).use(unifiedLatexUtilReplace.unifiedLatexReplaceStreamingCommands, {
      replacers: streamingMacroReplacements
    });
    const warningMessages = breakOnBoundaries(tree);
    for (const warningMessage of warningMessages.messages) {
      file.message(
        warningMessage,
        warningMessage.place,
        "unified-latex-to-pretext:break-on-boundaries"
      );
    }
    attachAdditionalAttributes(tree);
    if (shouldBeWrappedInPars(tree)) {
      processor = processor.use(unifiedLatexWrapPars);
    }
    tree = processor.runSync(tree, file);
    unifiedLatexUtilReplace.replaceNode(tree, (node, info) => {
      if (info.context.hasMathModeAncestor) {
        return;
      }
      if (isReplaceableEnvironment(node)) {
        return environmentReplacements$1[unifiedLatexUtilPrintRaw.printRaw(node.env)](
          node,
          info,
          file
        );
      }
    });
    unifiedLatexUtilReplace.replaceNode(tree, (node, info) => {
      if (info.context.hasMathModeAncestor) {
        return;
      }
      if (isReplaceableMacro(node)) {
        const replacement = macroReplacements$1[node.content](
          node,
          info,
          file
        );
        return replacement;
      }
    });
    const unsupportedByMathjax = reportMacrosUnsupportedByMathjax(tree);
    for (const warningMessage of unsupportedByMathjax.messages) {
      file.message(
        warningMessage,
        warningMessage.place,
        "unified-latex-to-pretext:report-unsupported-macro-mathjax"
      );
    }
    attachNeededRenderInfo(tree);
    unifiedLatexUtilReplace.replaceNode(tree, (node) => {
      if (isMathjaxMacro(node)) {
        return mathjaxSpecificMacroReplacements[node.content](node);
      }
      if (isMathjaxEnvironment(node)) {
        return mathjaxSpecificEnvironmentReplacements[unifiedLatexUtilPrintRaw.printRaw(node.env)](node);
      }
    });
    if (!producePretextFragment) {
      createValidPretextDoc(tree);
      tree.content = [
        unifiedLatexUtilHtmlLike.htmlLike({ tag: "pretext", content: tree.content })
      ];
    }
    originalTree.content = tree.content;
  };
};
function shouldBeWrappedInPars(tree) {
  let content = tree.content;
  unifiedLatexUtilVisit.visit(
    tree,
    (env) => {
      if (unifiedLatexUtilMatch.match.anyEnvironment(env)) {
        content = env.content;
        return unifiedLatexUtilVisit.EXIT;
      }
    },
    { test: (node) => unifiedLatexUtilMatch.match.environment(node, "document") }
  );
  return containsPar(content);
}
function containsPar(content) {
  return content.some((node) => {
    if (isMappedEnviron(node)) {
      return containsPar(node.content);
    }
    return unifiedLatexUtilMatch.match.parbreak(node) || unifiedLatexUtilMatch.match.macro(node, "par");
  });
}
function createValidPretextDoc(tree) {
  let isBook = false;
  const docClass = findMacro(tree, "documentclass");
  if (docClass) {
    const docClassArg = unifiedLatexUtilArguments.getArgsContent(docClass)[0];
    if (docClassArg) {
      const docClassTitle = docClassArg[0];
      if (docClassTitle.content == "book" || docClassTitle.content == "memoir") {
        isBook = true;
      }
    }
  }
  if (!isBook) {
    unifiedLatexUtilVisit.visit(tree, (node) => {
      if (unifiedLatexUtilMatch.anyEnvironment(node) && node.env == "_chapter") {
        isBook = true;
        return unifiedLatexUtilVisit.EXIT;
      }
    });
  }
  const title = findMacro(tree, "title");
  if (title) {
    const titleArg = unifiedLatexUtilArguments.getArgsContent(title)[1];
    if (titleArg) {
      tree.content.unshift(unifiedLatexUtilHtmlLike.htmlLike({ tag: "title", content: titleArg }));
      unifiedLatexUtilReplace.replaceNode(tree, (node) => {
        if (node === title) {
          return [];
        }
      });
    } else {
      tree.content.unshift(unifiedLatexUtilHtmlLike.htmlLike({ tag: "title", content: unifiedLatexBuilder.s("") }));
    }
  } else {
    tree.content.unshift(unifiedLatexUtilHtmlLike.htmlLike({ tag: "title", content: unifiedLatexBuilder.s("") }));
  }
  if (isBook) {
    tree.content = [unifiedLatexUtilHtmlLike.htmlLike({ tag: "book", content: tree.content })];
  } else {
    tree.content = [unifiedLatexUtilHtmlLike.htmlLike({ tag: "article", content: tree.content })];
  }
}
function attachAdditionalAttributes(tree) {
  unifiedLatexUtilReplace.replaceNode(tree, (node, info) => {
    var _a;
    if (unifiedLatexUtilMatch.match.macro(node, "label")) {
      const args = unifiedLatexUtilArguments.getArgsContent(node);
      const labelContent = args[args.length - 1];
      if (labelContent) {
        const renderInfo = ((_a = info.parents[0]) == null ? void 0 : _a._renderInfo) ?? {};
        if (renderInfo) {
          renderInfo.additionalAttributes = renderInfo.additionalAttributes ?? {};
          renderInfo.additionalAttributes["xml:id"] = sanitizeXmlId(
            unifiedLatexUtilPrintRaw.printRaw(labelContent)
          );
          info.parents[0]._renderInfo = renderInfo;
        }
      }
      return null;
    }
  });
}
function findMacro(tree, content) {
  let macro = null;
  unifiedLatexUtilVisit.visit(tree, (node) => {
    if (unifiedLatexUtilMatch.anyEnvironment(node)) {
      return unifiedLatexUtilVisit.SKIP;
    }
    if (unifiedLatexUtilMatch.anyMacro(node) && node.content === content) {
      macro = node;
      return unifiedLatexUtilVisit.EXIT;
    }
  });
  return macro;
}
function expandUserDefinedMacros(ast) {
  const newcommands = unifiedLatexUtilMacros.listNewcommands(ast);
  const macrosToExpand = new Set(newcommands.map((command) => command.name));
  const macroInfo = Object.fromEntries(
    newcommands.map((m) => [m.name, { signature: m.signature }])
  );
  for (let i = 0; i < 100; i++) {
    if (!needToExpand(ast, macrosToExpand)) {
      break;
    }
    unifiedLatexUtilArguments.attachMacroArgs(ast, macroInfo);
    unifiedLatexUtilMacros.expandMacrosExcludingDefinitions(ast, newcommands);
  }
}
function needToExpand(ast, macros2) {
  let needExpand = false;
  unifiedLatexUtilVisit.visit(ast, (node) => {
    if (unifiedLatexUtilMatch.anyMacro(node) && macros2.has(node.content)) {
      needExpand = true;
    }
  });
  return needExpand;
}
const macros = {
  // PreTeXt-specific macro
  term: { signature: "m" }
};
const environments = {};
const unifiedLatexToPretext = function unifiedLatexAttachMacroArguments(options) {
  return (tree, file) => {
    const producePretextFragment = (options == null ? void 0 : options.producePretextFragment) ? options == null ? void 0 : options.producePretextFragment : false;
    expandUserDefinedMacros(tree);
    unifiedLatexUtilArguments.attachMacroArgs(tree, macros);
    let content = tree.content;
    unifiedLatexUtilVisit.visit(
      tree,
      (env) => {
        content = env.content;
        return unifiedLatexUtilVisit.EXIT;
      },
      {
        test: (node) => unifiedLatexUtilMatch.match.environment(
          node,
          "document"
        )
      }
    );
    tree.content = content;
    unified().use(unifiedLatexToPretextLike, options).run(tree, file);
    unifiedLatexUtilLigatures.expandUnicodeLigatures(tree);
    content = tree.content;
    const toXast = toPretextWithLoggerFactory(file.message.bind(file));
    let converted = toXast({ type: "root", content });
    if (!Array.isArray(converted)) {
      converted = [converted];
    }
    let ret = x();
    ret.children = converted;
    if (!producePretextFragment) {
      ret.children.unshift({
        type: "instruction",
        name: "xml",
        value: "version='1.0' encoding='utf-8'"
      });
    }
    return ret;
  };
};
const defaultSubsetRegex = /["&'<>`]/g;
const surrogatePairsRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
const controlCharactersRegex = (
  // eslint-disable-next-line no-control-regex, unicorn/no-hex-escape
  /[\x01-\t\v\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g
);
const regexEscapeRegex = /[|\\{}()[\]^$+*?.]/g;
const subsetToRegexCache = /* @__PURE__ */ new WeakMap();
function core(value2, options) {
  value2 = value2.replace(
    options.subset ? charactersToExpressionCached(options.subset) : defaultSubsetRegex,
    basic
  );
  if (options.subset || options.escapeOnly) {
    return value2;
  }
  return value2.replace(surrogatePairsRegex, surrogate).replace(controlCharactersRegex, basic);
  function surrogate(pair, index2, all2) {
    return options.format(
      (pair.charCodeAt(0) - 55296) * 1024 + pair.charCodeAt(1) - 56320 + 65536,
      all2.charCodeAt(index2 + 2),
      options
    );
  }
  function basic(character, index2, all2) {
    return options.format(
      character.charCodeAt(0),
      all2.charCodeAt(index2 + 1),
      options
    );
  }
}
function charactersToExpressionCached(subset2) {
  let cached = subsetToRegexCache.get(subset2);
  if (!cached) {
    cached = charactersToExpression(subset2);
    subsetToRegexCache.set(subset2, cached);
  }
  return cached;
}
function charactersToExpression(subset2) {
  const groups = [];
  let index2 = -1;
  while (++index2 < subset2.length) {
    groups.push(subset2[index2].replace(regexEscapeRegex, "\\$&"));
  }
  return new RegExp("(?:" + groups.join("|") + ")", "g");
}
function formatBasic(code) {
  return "&#x" + code.toString(16).toUpperCase() + ";";
}
function stringifyEntitiesLight(value2, options) {
  return core(value2, Object.assign({ format: formatBasic }, options));
}
const noncharacter = /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g;
function escape(value2, subset2, unsafe2) {
  const result = clean(value2);
  return unsafe2 ? result.replace(unsafe2, encode) : encode(result);
  function encode(value3) {
    return stringifyEntitiesLight(value3, { subset: subset2 });
  }
}
function clean(value2) {
  return String(value2 || "").replace(noncharacter, "");
}
const unsafe$1 = /]]>/g;
const subset$3 = [">"];
function cdata(node) {
  return "<![CDATA[" + escape(node.value, subset$3, unsafe$1) + "]]>";
}
function comment(node) {
  return "<!--" + escape(node.value, ["-"]) + "-->";
}
const subset$2 = ["	", "\n", " ", '"', "&", "'", "/", "<", "=", ">"];
function name(value2) {
  return escape(value2, subset$2);
}
function ccount(value2, character) {
  const source = String(value2);
  if (typeof character !== "string") {
    throw new TypeError("Expected character");
  }
  let count = 0;
  let index2 = source.indexOf(character);
  while (index2 !== -1) {
    count++;
    index2 = source.indexOf(character, index2 + character.length);
  }
  return count;
}
function value(value2, state) {
  const result = String(value2);
  let quote = state.options.quote || '"';
  if (state.options.quoteSmart) {
    const other = quote === '"' ? "'" : '"';
    if (ccount(result, quote) > ccount(result, other)) {
      quote = other;
    }
  }
  return quote + escape(result, ["<", "&", quote]) + quote;
}
function doctype(node, state) {
  const nodeName = name(node.name);
  const pub = node.public;
  const sys = node.system;
  let result = "<!DOCTYPE";
  if (nodeName !== "") {
    result += " " + nodeName;
  }
  if (pub) {
    result += " PUBLIC " + value(pub, state);
  } else if (sys) {
    result += " SYSTEM";
  }
  if (sys) {
    result += " " + value(sys, state);
  }
  return result + ">";
}
const own$1 = {}.hasOwnProperty;
function element(node, state) {
  const nodeName = name(node.name);
  const content = all(node, state);
  const attributes = node.attributes || {};
  const close = content ? false : state.options.closeEmptyElements;
  const attrs = [];
  let key;
  for (key in attributes) {
    if (own$1.call(attributes, key)) {
      const result = attributes[key];
      if (result !== null && result !== void 0) {
        attrs.push(name(key) + "=" + value(result, state));
      }
    }
  }
  return "<" + nodeName + (attrs.length === 0 ? "" : " " + attrs.join(" ")) + (close ? (state.options.tightClose ? "" : " ") + "/" : "") + ">" + content + (close ? "" : "</" + nodeName + ">");
}
const unsafe = /\?>/g;
const subset$1 = [">"];
function instruction(node) {
  const nodeName = name(node.name) || "x";
  const result = escape(node.value, subset$1, unsafe);
  return "<?" + nodeName + (result ? " " + result : "") + "?>";
}
const subset = ["&", "<"];
function text(node) {
  return escape(node.value, subset);
}
function raw(node, state) {
  return state.options.allowDangerousXml ? node.value : text(node);
}
const own = {}.hasOwnProperty;
const handlers = {
  cdata,
  comment,
  doctype,
  element,
  instruction,
  raw,
  root: all,
  text
};
function one(node, state) {
  const type = node && node.type;
  if (!type) {
    throw new Error("Expected node, not `" + node + "`");
  }
  if (!own.call(handlers, type)) {
    throw new Error("Cannot compile unknown node `" + type + "`");
  }
  const handle = handlers[type];
  const result = handle(node, state);
  return result;
}
function all(parent, state) {
  const children = parent && parent.children || [];
  let index2 = -1;
  const results = [];
  while (++index2 < children.length) {
    results[index2] = one(children[index2], state);
  }
  return results.join("");
}
function toXml(tree, options) {
  const state = { options: options || {} };
  if (typeof state.options.quote === "string" && state.options.quote !== '"' && state.options.quote !== "'") {
    throw new Error(
      "Invalid quote `" + state.options.quote + "`, expected `'` or `\"`"
    );
  }
  const node = Array.isArray(tree) ? { type: "root", children: tree } : tree;
  return one(node, state);
}
const xmlCompilePlugin = function() {
  this.Compiler = (tree) => toXml(tree, { closeEmptyElements: true });
};
const _processor = unifiedLatex.processLatexViaUnified().use(unifiedLatexToPretext).use(xmlCompilePlugin);
function convertToPretext(tree, options) {
  let processor = _processor;
  if (!Array.isArray(tree) && tree.type !== "root") {
    tree = { type: "root", content: [tree] };
  }
  if (Array.isArray(tree)) {
    tree = { type: "root", content: tree };
  }
  if (options) {
    processor = _processor.use(unifiedLatexToPretext, options);
  }
  const hast = processor.runSync(tree);
  return processor.stringify(hast);
}
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
