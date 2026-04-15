Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_index = require("./rules/unified-latex-lint-argument-color-commands/index.cjs");
const require_unified_latex_lint_argument_font_shaping_commands = require("./unified-latex-lint-argument-font-shaping-commands-BWptQrWy.cjs");
const require_index$1 = require("./rules/unified-latex-lint-consistent-inline-math/index.cjs");
const require_index$2 = require("./rules/unified-latex-lint-no-def/index.cjs");
const require_unified_latex_lint_no_plaintext_operators = require("./unified-latex-lint-no-plaintext-operators-kYMASAa4.cjs");
const require_index$3 = require("./rules/unified-latex-lint-no-tex-display-math/index.cjs");
const require_index$4 = require("./rules/unified-latex-lint-no-tex-font-shaping-commands/index.cjs");
const require_index$5 = require("./rules/unified-latex-lint-obsolete-packages/index.cjs");
const require_index$6 = require("./rules/unified-latex-lint-prefer-setlength/index.cjs");
//#region index.ts
/**
* Object exporting all available lints.
*/
var lints = {
	unifiedLatexLintArgumentColorCommands: require_index.unifiedLatexLintArgumentColorCommands,
	unifiedLatexLintArgumentFontShapingCommands: require_unified_latex_lint_argument_font_shaping_commands.unifiedLatexLintArgumentFontShapingCommands,
	unifiedLatexLintConsistentInlineMath: require_index$1.unifiedLatexLintConsistentInlineMath,
	unifiedLatexLintNoDef: require_index$2.unifiedLatexLintNoDef,
	unifiedLatexLintNoPlaintextOperators: require_unified_latex_lint_no_plaintext_operators.unifiedLatexLintNoPlaintextOperators,
	unifiedLatexLintNoTexDisplayMath: require_index$3.unifiedLatexLintNoTexDisplayMath,
	unifiedLatexLintNoTexFontShapingCommands: require_index$4.unifiedLatexLintNoTexFontShapingCommands,
	unifiedLatexLintObsoletePackages: require_index$5.unifiedLatexLintObsoletePackages,
	unifiedLatexLintPreferSetlength: require_index$6.unifiedLatexLintPreferSetlength
};
/**
* ## What is this?
*
* Linting functions for `unified-latex` ASTs. Lints are found in the `rules/` subdirectory. Lints
* that can be fixed accept an optional `{fix: boolean}` argument.
*
* ## When should I use this?
*
* If you are building a linter for LaTeX code.
*
*/
//#endregion
exports.lints = lints;

//# sourceMappingURL=index.cjs.map