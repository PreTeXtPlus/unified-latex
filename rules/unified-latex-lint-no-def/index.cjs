Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_lib = require("../../lib-D0DHAas_.cjs");
let _unified_latex_unified_latex_util_match = require("@unified-latex/unified-latex-util-match");
let _unified_latex_unified_latex_util_visit = require("@unified-latex/unified-latex-util-visit");
//#region rules/unified-latex-lint-no-def/index.ts
var isDefMacro = _unified_latex_unified_latex_util_match.match.createMacroMatcher(["def"]);
var DESCRIPTION = `## Lint Rule

Avoid using \`\\def\\macro{val}\` to define a macro. Use \`\\newcommand{\\macro}{val}\` or
\`\\NewDocumentCommand{\\macro}{}{val}\` from the \`xparse\` package.

### See

CTAN l2tabuen Section 1.7
`;
var unifiedLatexLintNoDef = require_lib.lintRule({ origin: "unified-latex-lint:no-def" }, (tree, file) => {
	(0, _unified_latex_unified_latex_util_visit.visit)(tree, (node) => {
		file.message(`Do not use \`\\def\\macro{val}\` to define a macro. Use \`\\newcommand{\\macro}{val}\` or \`\\NewDocumentCommand{\\macro}{}{val}\` from the \`xparse\` package.`, node);
	}, { test: isDefMacro });
});
//#endregion
exports.DESCRIPTION = DESCRIPTION;
exports.unifiedLatexLintNoDef = unifiedLatexLintNoDef;

//# sourceMappingURL=index.cjs.map