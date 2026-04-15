Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_lib = require("../../lib-D0DHAas_.cjs");
let _unified_latex_unified_latex_builder = require("@unified-latex/unified-latex-builder");
let _unified_latex_unified_latex_util_print_raw = require("@unified-latex/unified-latex-util-print-raw");
let _unified_latex_unified_latex_util_match = require("@unified-latex/unified-latex-util-match");
let _unified_latex_unified_latex_util_visit = require("@unified-latex/unified-latex-util-visit");
let _unified_latex_unified_latex_util_replace = require("@unified-latex/unified-latex-util-replace");
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
var isReplaceable = _unified_latex_unified_latex_util_match.match.createMacroMatcher(REPLACEMENTS);
var DESCRIPTION = `## Lint Rule

Avoid using TeX font changing commands like \\bf, \\it, etc. Prefer LaTeX \\bfseries, \\itshape, etc.. 

This rule flags any usage of \`${Object.keys(REPLACEMENTS).map((r) => (0, _unified_latex_unified_latex_util_print_raw.printRaw)((0, _unified_latex_unified_latex_builder.m)(r))).join("` `")}\`

### See

CTAN l2tabuen Section 2.`;
var unifiedLatexLintNoTexFontShapingCommands = require_lib.lintRule({ origin: "unified-latex-lint:no-tex-font-shaping-commands" }, (tree, file, options) => {
	(0, _unified_latex_unified_latex_util_visit.visit)(tree, (node, info) => {
		const macroName = node.content;
		file.message(`Replace "${(0, _unified_latex_unified_latex_util_print_raw.printRaw)(node)}" with "${(0, _unified_latex_unified_latex_util_print_raw.printRaw)((0, _unified_latex_unified_latex_builder.m)(REPLACEMENTS[macroName]))}"`, node);
		if (options?.fix) (0, _unified_latex_unified_latex_util_replace.replaceNodeDuringVisit)((0, _unified_latex_unified_latex_builder.m)(REPLACEMENTS[macroName]), info);
	}, { test: isReplaceable });
});
//#endregion
exports.DESCRIPTION = DESCRIPTION;
exports.unifiedLatexLintNoTexFontShapingCommands = unifiedLatexLintNoTexFontShapingCommands;

//# sourceMappingURL=index.cjs.map