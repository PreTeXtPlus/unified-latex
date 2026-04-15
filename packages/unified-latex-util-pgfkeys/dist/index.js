import { PgfkeysPegParser, decorateArrayForPegjs } from "@unified-latex/unified-latex-util-pegjs";
import { match } from "@unified-latex/unified-latex-util-match";
import { printRaw } from "@unified-latex/unified-latex-util-print-raw";
//#region libs/pgfkeys-parser.ts
function createMatchers() {
	return {
		isChar: (node, char) => match.string(node, char),
		isComma: (node) => match.string(node, ","),
		isEquals: (node) => match.string(node, "="),
		isWhitespace: (node) => match.whitespace(node),
		isParbreak: (node) => match.parbreak(node),
		isSameLineComment: (node) => match.comment(node) && node.sameline,
		isOwnLineComment: (node) => match.comment(node) && !node.sameline
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
	ast = decorateArrayForPegjs([...ast]);
	return PgfkeysPegParser.parse(ast, {
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
		return printRaw(nodes);
	}
	function parseBack(nodes) {
		if (!nodes) return [];
		if (nodes.length === 1 && match.group(nodes[0])) return nodes[0].content;
		return nodes;
	}
	let nodeList;
	if (match.argument(arg)) nodeList = arg.content;
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
export { createMatchers, parsePgfkeys, pgfkeysArgToObject };

//# sourceMappingURL=index.js.map