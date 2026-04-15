const require_lib = require("./lib-D0DHAas_.cjs");
let _unified_latex_unified_latex_util_match = require("@unified-latex/unified-latex-util-match");
let _unified_latex_unified_latex_util_visit = require("@unified-latex/unified-latex-util-visit");
let _unified_latex_unified_latex_util_scan = require("@unified-latex/unified-latex-util-scan");
//#region node_modules/unist-util-position/lib/index.js
/**
* @typedef {import('unist').Position} Position
* @typedef {import('unist').Node} Node
* @typedef {import('unist').Point} Point
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
* Get the starting point of `node`.
*
* @param node
*   Node.
* @returns
*   Point.
*/
var pointStart = point("start");
/**
* Get the ending point of `node`.
*
* @param node
*   Node.
* @returns
*   Point.
*/
var pointEnd = point("end");
/**
* Get the positional info of `node`.
*
* @param {'start' | 'end'} type
*   Side.
* @returns
*   Getter.
*/
function point(type) {
	return point;
	/**
	* Get the point info of `node` at a bound side.
	*
	* @param {NodeLike | Node | null | undefined} [node]
	* @returns {Point}
	*/
	function point(node) {
		const point = node && node.position && node.position[type] || {};
		return {
			line: point.line || null,
			column: point.column || null,
			offset: point.offset > -1 ? point.offset : null
		};
	}
}
//#endregion
//#region rules/unified-latex-lint-no-plaintext-operators/index.ts
var prefixTree = (0, _unified_latex_unified_latex_util_scan.Trie)([
	"Pr",
	"arccos",
	"arcctg",
	"arcsin",
	"arctan",
	"arctg",
	"arg",
	"argmax",
	"argmin",
	"ch",
	"cos",
	"cosec",
	"cosh",
	"cot",
	"cotg",
	"coth",
	"csc",
	"ctg",
	"cth",
	"deg",
	"det",
	"dim",
	"exp",
	"gcd",
	"hom",
	"inf",
	"injlim",
	"ker",
	"lg",
	"lim",
	"liminf",
	"limsup",
	"ln",
	"log",
	"max",
	"min",
	"plim",
	"projlim",
	"sec",
	"sh",
	"sin",
	"sinh",
	"sup",
	"tan",
	"tanh",
	"tg",
	"th",
	"varinjlim",
	"varliminf",
	"varlimsup",
	"varprojlim"
]);
/**
* If the sequence starting at `pos` is a sequence of single character strings
* matching one of the `OPERATOR_NAMES`, then the matching operator name is returned.
* Otherwise `null` is returned.
*/
function matchesAtPos(nodes, index) {
	const prevNode = nodes[index - 1];
	if (_unified_latex_unified_latex_util_match.match.string(prevNode) && prevNode.content.match(/^[a-zA-Z]/)) return null;
	const matched = (0, _unified_latex_unified_latex_util_scan.prefixMatch)(nodes, prefixTree, {
		startIndex: index,
		assumeOneCharStrings: true
	});
	if (!matched) return null;
	const nextNode = nodes[matched.endNodeIndex + 1];
	if (_unified_latex_unified_latex_util_match.match.string(nextNode) && nextNode.content.match(/^[a-zA-Z]/)) return null;
	return matched;
}
var DESCRIPTION = `## Lint Rule

Avoid writing operators in plaintext. For example, instead of \`$sin(2)$\` write \`$\\sin(2)$\`.

### See

ChkTeX Warning 35
`;
var unifiedLatexLintNoPlaintextOperators = require_lib.lintRule({ origin: "unified-latex-lint:no-plaintext-operators" }, (tree, file, options) => {
	(0, _unified_latex_unified_latex_util_visit.visit)(tree, (nodes, info) => {
		if (!info.context.inMathMode) return;
		for (let i = 0; i < nodes.length; i++) {
			const matched = matchesAtPos(nodes, i);
			if (matched) {
				file.message(`Use "\\${matched.match}" instead of the string "${matched.match}" to specify an operator name in math mode`, {
					start: pointStart(nodes[i]),
					end: pointEnd(nodes[matched.endNodeIndex])
				});
				if (options?.fix) {
					nodes.splice(i, matched.endNodeIndex - i + 1, {
						type: "macro",
						content: matched.match
					});
					i++;
				}
			}
		}
	}, {
		test: Array.isArray,
		includeArrays: true
	});
});
//#endregion
Object.defineProperty(exports, "DESCRIPTION", {
	enumerable: true,
	get: function() {
		return DESCRIPTION;
	}
});
Object.defineProperty(exports, "unifiedLatexLintNoPlaintextOperators", {
	enumerable: true,
	get: function() {
		return unifiedLatexLintNoPlaintextOperators;
	}
});

//# sourceMappingURL=unified-latex-lint-no-plaintext-operators-kYMASAa4.cjs.map