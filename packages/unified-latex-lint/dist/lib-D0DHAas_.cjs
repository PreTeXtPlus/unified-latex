//#region ../../node_modules/trough/lib/index.js
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
//#region node_modules/unified-lint-rule/lib/index.js
/**
* @typedef {import('unist').Node} Node
* @typedef {import('vfile').VFile} VFile
*/
/**
* @typedef {0 | 1 | 2} Severity
*   Numeric severity (`0`: `'off'`, `1`: `'on'`, `2`: `'error'`).
* @typedef {'warn' | 'on' | 'off' | 'error'} Label
*   Severity label (`'off'`: `0`, `'on'`: `1`, `'error'`: `2`).
* @typedef {[Severity, ...Array<unknown>]} SeverityTuple
*   Parsed severty and options.
*
* @typedef RuleMeta
*   Rule metadata.
* @property {string} origin
*   Name of the lint rule.
* @property {string | null | undefined} [url]
*   Link to documentation.
*/
/**
* @template {Node} [Tree=Node]
* @template {any} [Options=unknown]
* @callback Rule
* @param {Tree} tree
* @param {VFile} file
* @param {Options} options
* @returns {Promise<Tree | undefined | void> | Tree | undefined | void}
*/
/**
* @template {Node} [Tree=Node]
* @template {any} [Options=unknown]
* @param {string | RuleMeta} meta
* @param {Rule<Tree, Options>} rule
* @returns {import('unified').Plugin<Array<void> | [Options | [boolean | Label | Severity, (Options | undefined)?]], Tree>}
*/
function lintRule(meta, rule) {
	const id = typeof meta === "string" ? meta : meta.origin;
	const url = typeof meta === "string" ? void 0 : meta.url;
	const parts = id.split(":");
	/* c8 ignore next */
	const source = parts[1] ? parts[0] : void 0;
	const ruleId = parts[1];
	Object.defineProperty(plugin, "name", { value: id });
	return plugin;
	/** @type {import('unified').Plugin<[unknown] | Array<void>>} */
	function plugin(config) {
		const [severity, options] = coerce(ruleId, config);
		if (!severity) return;
		const fatal = severity === 2;
		return (tree, file, next) => {
			let index = file.messages.length - 1;
			wrap(rule, (error) => {
				const messages = file.messages;
				/* c8 ignore next 6 */
				if (error && !messages.includes(error)) try {
					file.fail(error);
				} catch {}
				while (++index < messages.length) Object.assign(messages[index], {
					ruleId,
					source,
					fatal,
					url
				});
				next();
			})(tree, file, options);
		};
	}
}
/**
* Coerce a value to a severity--options tuple.
*
* @param {string} name
* @param {unknown} config
* @returns {SeverityTuple}
*/
function coerce(name, config) {
	if (!Array.isArray(config)) return [1, config];
	/** @type {Array<unknown>} */
	const [severity, ...options] = config;
	switch (severity) {
		case false:
		case "off":
		case 0: return [0, ...options];
		case true:
		case "on":
		case "warn":
		case 1: return [1, ...options];
		case "error":
		case 2: return [2, ...options];
		default:
			if (typeof severity !== "number") return [1, config];
			throw new Error("Incorrect severity `" + severity + "` for `" + name + "`, expected 0, 1, or 2");
	}
}
//#endregion
Object.defineProperty(exports, "lintRule", {
	enumerable: true,
	get: function() {
		return lintRule;
	}
});

//# sourceMappingURL=lib-D0DHAas_.cjs.map