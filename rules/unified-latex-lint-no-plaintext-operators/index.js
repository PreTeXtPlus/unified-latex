import { lintRule } from "unified-lint-rule";
import { match } from "@unified-latex/unified-latex-util-match";
import { visit } from "@unified-latex/unified-latex-util-visit";
import { pointEnd, pointStart } from "unist-util-position";
import { Trie, prefixMatch } from "@unified-latex/unified-latex-util-scan";
//#region rules/unified-latex-lint-no-plaintext-operators/index.ts
var prefixTree = Trie([
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
	if (match.string(prevNode) && prevNode.content.match(/^[a-zA-Z]/)) return null;
	const matched = prefixMatch(nodes, prefixTree, {
		startIndex: index,
		assumeOneCharStrings: true
	});
	if (!matched) return null;
	const nextNode = nodes[matched.endNodeIndex + 1];
	if (match.string(nextNode) && nextNode.content.match(/^[a-zA-Z]/)) return null;
	return matched;
}
var DESCRIPTION = `## Lint Rule

Avoid writing operators in plaintext. For example, instead of \`$sin(2)$\` write \`$\\sin(2)$\`.

### See

ChkTeX Warning 35
`;
var unifiedLatexLintNoPlaintextOperators = lintRule({ origin: "unified-latex-lint:no-plaintext-operators" }, (tree, file, options) => {
	visit(tree, (nodes, info) => {
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
export { DESCRIPTION, unifiedLatexLintNoPlaintextOperators };

//# sourceMappingURL=index.js.map