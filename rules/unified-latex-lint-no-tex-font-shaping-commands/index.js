import { lintRule } from "unified-lint-rule";
import { m } from "@unified-latex/unified-latex-builder";
import { printRaw } from "@unified-latex/unified-latex-util-print-raw";
import { match } from "@unified-latex/unified-latex-util-match";
import { visit } from "@unified-latex/unified-latex-util-visit";
import { replaceNodeDuringVisit } from "@unified-latex/unified-latex-util-replace";
//#region rules/unified-latex-lint-no-tex-font-shaping-commands/index.ts
var REPLACEMENTS = {
	bf: "bfseries",
	it: "itshape",
	rm: "rmfamily",
	sc: "scshape",
	sf: "sffamily",
	sl: "slshape",
	tt: "ttfamily"
};
var isReplaceable = match.createMacroMatcher(REPLACEMENTS);
var DESCRIPTION = `## Lint Rule

Avoid using TeX font changing commands like \\bf, \\it, etc. Prefer LaTeX \\bfseries, \\itshape, etc.. 

This rule flags any usage of \`${Object.keys(REPLACEMENTS).map((r) => printRaw(m(r))).join("` `")}\`

### See

CTAN l2tabuen Section 2.`;
var unifiedLatexLintNoTexFontShapingCommands = lintRule({ origin: "unified-latex-lint:no-tex-font-shaping-commands" }, (tree, file, options) => {
	visit(tree, (node, info) => {
		const macroName = node.content;
		file.message(`Replace "${printRaw(node)}" with "${printRaw(m(REPLACEMENTS[macroName]))}"`, node);
		if (options?.fix) replaceNodeDuringVisit(m(REPLACEMENTS[macroName]), info);
	}, { test: isReplaceable });
});
//#endregion
export { DESCRIPTION, unifiedLatexLintNoTexFontShapingCommands };

//# sourceMappingURL=index.js.map