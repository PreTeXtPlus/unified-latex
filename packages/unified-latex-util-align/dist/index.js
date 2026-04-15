import { match } from "@unified-latex/unified-latex-util-match";
import { AlignEnvironmentPegParser, decorateArrayForPegjs } from "@unified-latex/unified-latex-util-pegjs";
//#region libs/parse-align-environment.ts
function createMatchers(rowSepMacros, colSep) {
	return {
		isRowSep: match.createMacroMatcher(rowSepMacros),
		isColSep: (node) => colSep.some((sep) => match.string(node, sep)),
		isWhitespace: (node) => match.whitespace(node),
		isSameLineComment: (node) => match.comment(node) && node.sameline,
		isOwnLineComment: (node) => match.comment(node) && !node.sameline
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
	ast = decorateArrayForPegjs([...ast]);
	return AlignEnvironmentPegParser.parse(ast, createMatchers(rowSepMacros, colSep));
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
export { createMatchers, parseAlignEnvironment };

//# sourceMappingURL=index.js.map