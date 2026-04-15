import { match } from "@unified-latex/unified-latex-util-match";
import { replaceNode } from "@unified-latex/unified-latex-util-replace";
import { visit } from "@unified-latex/unified-latex-util-visit";
import { printRaw } from "@unified-latex/unified-latex-util-print-raw";
import { getNamedArgsContent } from "@unified-latex/unified-latex-util-arguments";
import { parseMinimal } from "@unified-latex/unified-latex-util-parse";
import { MacroSubstitutionPegParser, decorateArrayForPegjs } from "@unified-latex/unified-latex-util-pegjs";
//#region ../structured-clone/index.ts
(function() {
	if (typeof globalThis === "object") return;
	Object.defineProperty(Object.prototype, "__magic__", {
		get: function() {
			return this;
		},
		configurable: true
	});
	__magic__.globalThis = __magic__;
	delete Object.prototype.__magic__;
})();
var clone = typeof globalThis.structuredClone === "function" ? globalThis.structuredClone : (obj) => JSON.parse(JSON.stringify(obj));
/**
* Wrapper around the built-in structured clone. Uses `JSON.parse(JSON.stringify(...))`
* as a fallback.
*/
function structuredClone(obj) {
	return clone(obj);
}
//#endregion
//#region libs/parse-macro-substitutions.ts
function createMatchers() {
	return {
		isHash: (node) => match.string(node, "#"),
		isNumber: (node) => match.string(node) && 0 < +node.content.charAt(0),
		splitNumber: (node) => {
			const number = +node.content.charAt(0);
			if (node.content.length > 1) return {
				number,
				rest: {
					type: "string",
					content: node.content.slice(1)
				}
			};
			return { number };
		}
	};
}
/**
* Parse for macro substitutions. For example, in "\foo{#1}", the `#1`
* is recognized as a `HashNumber` (`{type: "hash_number"}`). Double hashes
* are automatically replaced with their single-hash substitutions.
*
* The resulting AST is ready for substitutions to be applied to it.
*/
function parseMacroSubstitutions(ast) {
	if (!Array.isArray(ast)) throw new Error("You must pass an array of nodes");
	ast = decorateArrayForPegjs([...ast]);
	return MacroSubstitutionPegParser.parse(ast, createMatchers());
}
//#endregion
//#region libs/newcommand.ts
var LATEX_NEWCOMMAND = new Set([
	"newcommand",
	"renewcommand",
	"providecommand"
]);
var XPARSE_NEWCOMMAND = new Set([
	"NewDocumentCommand",
	"RenewDocumentCommand",
	"ProvideDocumentCommand",
	"DeclareDocumentCommand",
	"NewExpandableDocumentCommand",
	"RenewExpandableDocumentCommand",
	"ProvideExpandableDocumentCommand",
	"DeclareExpandableDocumentCommand"
]);
var NEWCOMMAND_ARGUMENTS_REG = [
	"starred",
	"name",
	"numArgs",
	"default",
	"body"
];
var NEWCOMMAND_ARGUMENTS_BEAMER = [
	"starred",
	null,
	"name",
	"numArgs",
	"default",
	"body"
];
/**
* Get the named arguments for a `\newcommand` macro.
*/
function getNewcommandNamedArgs(node) {
	if (!Array.isArray(node.args)) throw new Error(`Found a '\\newcommand' macro without any arguments "${JSON.stringify(node)}"`);
	return getNamedArgsContent(node, node.args.length === NEWCOMMAND_ARGUMENTS_BEAMER.length ? NEWCOMMAND_ARGUMENTS_BEAMER : NEWCOMMAND_ARGUMENTS_REG);
}
/**
* Compute the xparse argument signature of the `\newcommand`/`\renewcommand`/etc. macro.
*/
function newcommandMacroToSpec(node) {
	if (LATEX_NEWCOMMAND.has(node.content)) {
		if (!node.args) {
			console.warn(String.raw`Found a '\newcommand' macro that doesn't have any args`, node);
			return "";
		}
		const namedArgs = getNewcommandNamedArgs(node);
		if (namedArgs.numArgs == null) return "";
		let numArgsForSig = +printRaw(namedArgs.numArgs);
		let sigOptionalArg = [];
		if (namedArgs.default != null) {
			numArgsForSig--;
			sigOptionalArg = [`O{${printRaw(namedArgs.default)}}`];
		}
		return [...sigOptionalArg, ...Array.from({ length: numArgsForSig }).map((_) => "m")].join(" ");
	}
	if (XPARSE_NEWCOMMAND.has(node.content)) {
		if (!node.args?.length) {
			console.warn(String.raw`Found a '\NewDocumentCommand' macro that doesn't have any args`, node);
			return "";
		}
		return printRaw(node.args[1]?.content).trim();
	}
	return "";
}
/**
* Trims whitespace and removes the leading `\` from a macro name.
*/
function normalizeCommandName(str) {
	str = str.trim();
	return str.startsWith("\\") ? str.slice(1) : str;
}
/**
* Get the name of the macro defined with `\newcommand`/`\renewcommand`/etc..
*/
function newcommandMacroToName(node) {
	if (LATEX_NEWCOMMAND.has(node.content)) {
		if (!node.args?.length) return "";
		const definedName = getNewcommandNamedArgs(node).name;
		if (!definedName) {
			console.warn("Could not find macro name defined in", node);
			return "";
		}
		return normalizeCommandName(printRaw(definedName));
	}
	if (XPARSE_NEWCOMMAND.has(node.content)) {
		if (!node.args?.length) return "";
		if (!node.args[0]?.content[0]) {
			console.warn("Could not find macro name defined in", node);
			return "";
		}
		return normalizeCommandName(printRaw(node.args[0].content));
	}
	return "";
}
/**
* Returns the AST that should be used for substitution. E.g.,
* `\newcommand{\foo}{\bar{#1}}` would return `\bar{#1}`.
*/
function newcommandMacroToSubstitutionAst(node) {
	if (LATEX_NEWCOMMAND.has(node.content)) {
		if (!node.args?.length) return [];
		const substitution = getNewcommandNamedArgs(node).body;
		if (!substitution) {
			console.warn("Could not find macro name defined in", node);
			return [];
		}
		return substitution;
	}
	if (XPARSE_NEWCOMMAND.has(node.content)) {
		if (!node.args?.length) return [];
		return node.args[2]?.content || [];
	}
	return [];
}
/**
* A macro can have arguments `#1`...`#9`. This function returns an array of
* `Ast.Node` that can be used as the default arguments for a macro if none are provided.
*/
function defaultExpanderArgs() {
	return Array.from({ length: 10 }).map((_, i) => ({
		hashNumbers: [],
		content: [{
			type: "string",
			content: `#${i + 1}`
		}]
	}));
}
/**
* A factory function. Given a macro definition, creates a function that accepts
* the macro's arguments and outputs an Ast with the contents substituted (i.e.,
* it expands the macro).
*/
function createMacroExpander(substitution) {
	const cachedSubstitutionTree = structuredClone(substitution);
	const hashNumbers = parseHashNumbers(cachedSubstitutionTree);
	return (macro) => {
		if (hashNumbers.length === 0) return structuredClone(cachedSubstitutionTree);
		const cachedSubstitutions = defaultExpanderArgs().map((expanderArg, i) => {
			const number = i + 1;
			if (!hashNumbers.includes(number)) return expanderArg;
			const arg = macro.args?.[i];
			const defaultArg = arg?._renderInfo?.defaultArg;
			if (!arg || isEmptyArg(arg) && defaultArg != null) {
				const content = cachedParse(defaultArg);
				return {
					content,
					hashNumbers: parseHashNumbers(content)
				};
			}
			return {
				content: arg.content,
				hashNumbers: []
			};
		});
		let numTimesExpanded = 0;
		while (expandCachedSubstitutions(cachedSubstitutions) && numTimesExpanded < cachedSubstitutions.length) numTimesExpanded++;
		for (const expanderArg of cachedSubstitutions) if (expanderArg.hashNumbers.length > 0) expanderArg.content = [{
			type: "string",
			content: `-Circular-`
		}];
		const retTree = structuredClone(cachedSubstitutionTree);
		replaceNode(retTree, (node) => {
			const hashNumOrNode = node;
			if (hashNumOrNode.type !== "hash_number") return;
			return cachedSubstitutions[hashNumOrNode.number - 1].content;
		});
		return retTree;
	};
}
/**
* Is the argument empty? This occurs when optional arguments are not provided.
*/
function isEmptyArg(arg) {
	return arg.openMark === "" && arg.closeMark === "" && arg.content.length === 0;
}
/**
* Parses `tree` for hash numbers (e.g. `#1` or `##`, etc.). Hash numbers are replaced
* with a `{type: "hash_number"}` node. This mutates `tree`.
* @param tree
* @returns A list containing all hash numbers that were found.
*/
function parseHashNumbers(tree) {
	let hashNumbers = /* @__PURE__ */ new Set();
	visit(tree, (nodes) => {
		const parsed = parseMacroSubstitutions(nodes);
		for (const node of parsed) if (node.type === "hash_number") hashNumbers.add(node.number);
		nodes.length = 0;
		nodes.push(...parsed);
	}, {
		includeArrays: true,
		test: Array.isArray
	});
	return Array.from(hashNumbers);
}
/**
* Get a list of all hash numbers referenced within `tree`.
*/
function hashNumbersReferenced(tree) {
	let hashNumbers = /* @__PURE__ */ new Set();
	visit(tree, (node) => {
		const n = node;
		if (n.type === "hash_number") hashNumbers.add(n.number);
	});
	return Array.from(hashNumbers);
}
var parseCache = /* @__PURE__ */ new Map();
/**
* Parse `source` and cache the result. Multiple on the same string will not reparse.
*/
function cachedParse(source) {
	const cached = parseCache.get(source);
	if (cached) return structuredClone(cached);
	const parsed = parseMinimal(source).content;
	parseCache.set(source, structuredClone(parsed));
	return parsed;
}
/**
* Perform one step in the expansion of `expanderArgs`. The result may still have `type: "hash_number"` nodes.
*/
function expandCachedSubstitutions(expanderArgs) {
	let didExpand = false;
	for (const expanderArg of expanderArgs) {
		if (expanderArg.hashNumbers.length === 0) continue;
		replaceNode(expanderArg.content, (node) => {
			const hashNumOrNode = node;
			if (hashNumOrNode.type !== "hash_number") return;
			didExpand = true;
			return expanderArgs[hashNumOrNode.number - 1].content;
		});
		expanderArg.hashNumbers = hashNumbersReferenced(expanderArg.content);
	}
	return didExpand;
}
//#endregion
//#region libs/list-newcommands.ts
var newcommandMatcher = match.createMacroMatcher([...LATEX_NEWCOMMAND, ...XPARSE_NEWCOMMAND]);
/**
* List all new commands defined in `tree`. This lists commands defined LaTeX-style with
* `\newcommand` etc., and defined with xparse-style `\NewDocumentCommand` etc. It does
* **not** find commands defined via `\def` (it is too difficult to parse the argument
* signature of commands defined with `\def`).
*/
function listNewcommands(tree) {
	const ret = [];
	visit(tree, (node) => {
		const name = newcommandMacroToName(node);
		const signature = newcommandMacroToSpec(node);
		const body = newcommandMacroToSubstitutionAst(node);
		ret.push({
			name,
			signature,
			body,
			definition: node
		});
	}, { test: newcommandMatcher });
	return ret;
}
//#endregion
//#region libs/expand-macros.ts
/**
* Expands macros in `ast` as specified by `macros`.
* Each macro in `macros` should provide the substitution AST (i.e., the AST with the #1, etc.
* in it). This function assumes that the appropriate arguments have already been attached
* to each macro specified. If the macro doesn't have it's arguments attached, its
* contents will be wholesale replaced with its substitution AST.
*/
function expandMacros(tree, macros) {
	const expanderCache = new Map(macros.map((spec) => [spec.name, createMacroExpander(spec.body)]));
	replaceNode(tree, (node) => {
		if (!match.anyMacro(node)) return;
		const macroName = node.content;
		const expander = expanderCache.get(macroName);
		if (!expander) return;
		return expander(node);
	});
}
/**
* Expands macros in `ast` as specified by `macros`, but do not expand any macros
* that appear in the context of a macro definition. For example, expanding `\foo` to `X` in
* ```
* \newcommand{\foo}{Y}
* \foo
* ```
* would result in
* ```
* \newcommand{\foo}{Y}
* X
* ```
* If `expandMacros(...)` were used, macros would be expanded in all contexts and the result
* would be
* ```
* \newcommand{X}{Y}
* X
* ```
*
* Each macro in `macros` should provide the substitution AST (i.e., the AST with the #1, etc.
* in it). This function assumes that the appropriate arguments have already been attached
* to each macro specified. If the macro doesn't have it's arguments attached, its
* contents will be wholesale replaced with its substitution AST.
*/
function expandMacrosExcludingDefinitions(tree, macros) {
	const expanderCache = new Map(macros.map((spec) => [spec.name, createMacroExpander(spec.body)]));
	replaceNode(tree, (node, info) => {
		if (!match.anyMacro(node)) return;
		const macroName = node.content;
		const expander = expanderCache.get(macroName);
		if (!expander) return;
		if (info.parents.some((n) => newcommandMatcher(n))) return;
		return expander(node);
	});
}
//#endregion
//#region index.ts
/**
* ## What is this?
*
* Functions to manipulate macros and their arguments in a `unified-latex` Abstract Syntax Tree (AST).
*
* ## When should I use this?
*
* If you want to expand macros or get a list of macros defined via `\newcommand`.
*/
//#endregion
export { LATEX_NEWCOMMAND, XPARSE_NEWCOMMAND, createMacroExpander, createMatchers, expandMacros, expandMacrosExcludingDefinitions, listNewcommands, newcommandMacroToName, newcommandMacroToSpec, newcommandMacroToSubstitutionAst, newcommandMatcher, parseMacroSubstitutions };

//# sourceMappingURL=index.js.map