Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_lib = require("../../lib-D0DHAas_.cjs");
let _unified_latex_unified_latex_util_match = require("@unified-latex/unified-latex-util-match");
let _unified_latex_unified_latex_util_visit = require("@unified-latex/unified-latex-util-visit");
//#region rules/unified-latex-lint-no-tex-display-math/index.ts
var DESCRIPTION = `## Lint Rule

Avoid using TeX display math command \`$$...$$\`. Instead prefer \`\\[...\\] \`.

When printing processed latex, \`$$...$$\` is automatically replaced with \`\\[...\\] \`.

### See

CTAN l2tabuen Section 1.7`;
var unifiedLatexLintNoTexDisplayMath = require_lib.lintRule({ origin: "unified-latex-lint:no-tex-display-math" }, (tree, file, options) => {
	(0, _unified_latex_unified_latex_util_visit.visit)(tree, (node) => {
		if (node.type !== "displaymath" || node.position == null) return;
		if (file.value && file.value.slice(node.position.start.offset, node.position.start.offset + 2) === "$$") file.message(`Avoid using $$...$$ for display math; prefer \\[...\\]`, node);
	}, { test: _unified_latex_unified_latex_util_match.match.math });
});
//#endregion
exports.DESCRIPTION = DESCRIPTION;
exports.unifiedLatexLintNoTexDisplayMath = unifiedLatexLintNoTexDisplayMath;

//# sourceMappingURL=index.cjs.map