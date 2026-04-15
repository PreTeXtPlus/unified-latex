Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
let _unified_latex_unified_latex_util_pegjs = require("@unified-latex/unified-latex-util-pegjs");
let _unified_latex_unified_latex_util_match = require("@unified-latex/unified-latex-util-match");
let _unified_latex_unified_latex_util_print_raw = require("@unified-latex/unified-latex-util-print-raw");
//#region libs/pgfkeys-parser.ts
function createMatchers() {
	return {
		isChar: (node, char) => _unified_latex_unified_latex_util_match.match.string(node, char),
		isComma: (node) => _unified_latex_unified_latex_util_match.match.string(node, ","),
		isEquals: (node) => _unified_latex_unified_latex_util_match.match.string(node, "="),
		isWhitespace: (node) => _unified_latex_unified_latex_util_match.match.whitespace(node),
		isParbreak: (node) => _unified_latex_unified_latex_util_match.match.parbreak(node),
		isSameLineComment: (node) => _unified_latex_unified_latex_util_match.match.comment(node) && node.sameline,
		isOwnLineComment: (node) => _unified_latex_unified_latex_util_match.match.comment(node) && !node.sameline
	};
}
/**
* Parse the arguments of a Pgfkeys macro. The `ast`
* is expected to be a comma separated list of `Item`s.
* Each item can have 0 or more item parts, which are separated
* by "=". If `itemPart` is undefined,
*
* If `options.allowParenGroups === true`, then commas that occur inside groups of parenthesis
* will not be parsed as separators. This is useful for parsing tikz `\foreach` loops.
*/
function parsePgfkeys(ast, options) {
	if (!Array.isArray(ast)) throw new Error("You must pass an array of nodes");
	const { allowParenGroups = false } = options || {};
	ast = (0, _unified_latex_unified_latex_util_pegjs.decorateArrayForPegjs)([...ast]);
	return _unified_latex_unified_latex_util_pegjs.PgfkeysPegParser.parse(ast, {
		...createMatchers(),
		allowParenGroups
	});
}
//#endregion
//#region libs/pgfkeys-to-object.ts
/**
* Parse `arg` as pgfkeys and return a JavaScript object with the results.
* The keys will be normalized to strings and the values will be arrays of nodes.
*/
function pgfkeysArgToObject(arg) {
	function parseFront(nodes) {
		return (0, _unified_latex_unified_latex_util_print_raw.printRaw)(nodes);
	}
	function parseBack(nodes) {
		if (!nodes) return [];
		if (nodes.length === 1 && _unified_latex_unified_latex_util_match.match.group(nodes[0])) return nodes[0].content;
		return nodes;
	}
	let nodeList;
	if (_unified_latex_unified_latex_util_match.match.argument(arg)) nodeList = arg.content;
	else nodeList = arg;
	const parsedArgs = parsePgfkeys(nodeList);
	return Object.fromEntries(parsedArgs.filter((part) => part.itemParts).map((part) => [parseFront(part.itemParts[0]), parseBack(part.itemParts[1])]));
}
//#endregion
//#region index.ts
/**
* ## What is this?
*
* Functions to help manipulate `unified-latex` Abstract Syntax Tree (AST) that contain
* pgfkeys-style arguments. Note that pgfkeys aren't built into `Ast.Ast`. Instead, parsing
* nodes as pgfkeys will produce a new (incompatible) AST.
*
* ## When should I use this?
*
* If you want to parse or manipulate macros/environments with pgfkeys-style arguments.
*/
//#endregion
exports.createMatchers = createMatchers;
exports.parsePgfkeys = parsePgfkeys;
exports.pgfkeysArgToObject = pgfkeysArgToObject;

//# sourceMappingURL=index.cjs.map