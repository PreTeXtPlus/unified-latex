Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
let _unified_latex_unified_latex_util_match = require("@unified-latex/unified-latex-util-match");
let _unified_latex_unified_latex_util_pegjs = require("@unified-latex/unified-latex-util-pegjs");
//#region libs/parse-align-environment.ts
function createMatchers(rowSepMacros, colSep) {
	return {
		isRowSep: _unified_latex_unified_latex_util_match.match.createMacroMatcher(rowSepMacros),
		isColSep: (node) => colSep.some((sep) => _unified_latex_unified_latex_util_match.match.string(node, sep)),
		isWhitespace: (node) => _unified_latex_unified_latex_util_match.match.whitespace(node),
		isSameLineComment: (node) => _unified_latex_unified_latex_util_match.match.comment(node) && node.sameline,
		isOwnLineComment: (node) => _unified_latex_unified_latex_util_match.match.comment(node) && !node.sameline
	};
}
/**
* Parse the content of an align environment into an array of row objects.
* Each row object looks like
* ```
*  {
*    cells: [...],
*    colSeps: [...],
*    rowSep: ...,
*    trailingComment: ...
*  }
* ```
* `...` may be an ast node or `null`.
*
* @export
* @param {[object]} ast
* @param {string} [colSep=["&"]]
* @param {string} [rowSepMacros=["\\", "hline", "cr"]]
* @returns
*/
function parseAlignEnvironment(ast, colSep = ["&"], rowSepMacros = [
	"\\",
	"hline",
	"cr"
]) {
	if (!Array.isArray(ast)) throw new Error("You must pass an array of nodes");
	ast = (0, _unified_latex_unified_latex_util_pegjs.decorateArrayForPegjs)([...ast]);
	return _unified_latex_unified_latex_util_pegjs.AlignEnvironmentPegParser.parse(ast, createMatchers(rowSepMacros, colSep));
}
//#endregion
//#region index.ts
/**
* ## What is this?
*
* Functions to parse an analyze "align" environments like `\begin{align}...\end{align}` or
* `\begin{bmatrix}...\end{bmatrix}`.
*
* ## When should I use this?
*
* If you need to process the contents of an align environment for, e.g., pretty-printing.
*/
//#endregion
exports.createMatchers = createMatchers;
exports.parseAlignEnvironment = parseAlignEnvironment;

//# sourceMappingURL=index.cjs.map