import { unifiedLatexLintArgumentColorCommands } from "./rules/unified-latex-lint-argument-color-commands/index.js";
import { n as unifiedLatexLintArgumentFontShapingCommands } from "./unified-latex-lint-argument-font-shaping-commands-C-mEuoby.js";
import { unifiedLatexLintConsistentInlineMath } from "./rules/unified-latex-lint-consistent-inline-math/index.js";
import { unifiedLatexLintNoDef } from "./rules/unified-latex-lint-no-def/index.js";
import { unifiedLatexLintNoPlaintextOperators } from "./rules/unified-latex-lint-no-plaintext-operators/index.js";
import { unifiedLatexLintNoTexDisplayMath } from "./rules/unified-latex-lint-no-tex-display-math/index.js";
import { unifiedLatexLintNoTexFontShapingCommands } from "./rules/unified-latex-lint-no-tex-font-shaping-commands/index.js";
import { unifiedLatexLintObsoletePackages } from "./rules/unified-latex-lint-obsolete-packages/index.js";
import { unifiedLatexLintPreferSetlength } from "./rules/unified-latex-lint-prefer-setlength/index.js";
//#region index.ts
/**
* Object exporting all available lints.
*/
var lints = {
	unifiedLatexLintArgumentColorCommands,
	unifiedLatexLintArgumentFontShapingCommands,
	unifiedLatexLintConsistentInlineMath,
	unifiedLatexLintNoDef,
	unifiedLatexLintNoPlaintextOperators,
	unifiedLatexLintNoTexDisplayMath,
	unifiedLatexLintNoTexFontShapingCommands,
	unifiedLatexLintObsoletePackages,
	unifiedLatexLintPreferSetlength
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
export { lints };

//# sourceMappingURL=index.js.map