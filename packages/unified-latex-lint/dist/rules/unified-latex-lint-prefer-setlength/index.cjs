Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_lib = require("../../lib-D0DHAas_.cjs");
let _unified_latex_unified_latex_builder = require("@unified-latex/unified-latex-builder");
let _unified_latex_unified_latex_util_print_raw = require("@unified-latex/unified-latex-util-print-raw");
let _unified_latex_unified_latex_util_match = require("@unified-latex/unified-latex-util-match");
let _unified_latex_unified_latex_util_visit = require("@unified-latex/unified-latex-util-visit");
let _unified_latex_unified_latex_util_scan = require("@unified-latex/unified-latex-util-scan");
let _unified_latex_unified_latex_util_glue = require("@unified-latex/unified-latex-util-glue");
//#region rules/unified-latex-lint-prefer-setlength/index.ts
var isLengthMacro = _unified_latex_unified_latex_util_match.match.createMacroMatcher([
	"abovecaptionskip",
	"arraycolsep",
	"arrayrulewidth",
	"belowcaptionskip",
	"captionindent",
	"columnsep",
	"columnseprule",
	"doublerulsep",
	"fboxrule",
	"fboxsep",
	"itemsep",
	"itemindent",
	"labelsep",
	"labelwidth",
	"leftmargin",
	"leftmargini",
	"leftmarginii",
	"leftmarginiii",
	"leftmarginiv",
	"leftmarginv",
	"leftmarginvi",
	"lineskip",
	"linewidth",
	"listparindent",
	"marginparsep",
	"marginparwidth",
	"@mpfootins",
	"normallineskip",
	"overfullrule",
	"paperwidth",
	"paperheight",
	"parsep",
	"partopsep",
	"parskip",
	"parindent",
	"parfillskip",
	"tabbingsep",
	"tabcolsep"
]);
var DESCRIPTION = `## Lint Rule

Avoid using TeX-style \`\\parskip=1em\` length assignments and instead
use LaTeX-style \`\\setlength{\\parskip}{1em}\`.

### See

CTAN l2tabuen Section 1.5
`;
var unifiedLatexLintPreferSetlength = require_lib.lintRule({ origin: "unified-latex-lint:prefer-setlength" }, (tree, file, options) => {
	(0, _unified_latex_unified_latex_util_visit.visit)(tree, (node, info) => {
		if (info.index == null) return;
		const containingArray = info.containingArray;
		if (!containingArray) return;
		const equalsIndex = (0, _unified_latex_unified_latex_util_scan.scan)(containingArray, "=", {
			startIndex: info.index + 1,
			onlySkipWhitespaceAndComments: true
		});
		if (equalsIndex == null) return;
		file.message(`TeX-style assignment to length \`${(0, _unified_latex_unified_latex_util_print_raw.printRaw)(node)}\`; prefer LaTeX \`\\setlength{${(0, _unified_latex_unified_latex_util_print_raw.printRaw)(node)}}{...}\``, node);
		if (options?.fix) {
			const glue = (0, _unified_latex_unified_latex_util_glue.extractFormattedGlue)(containingArray, equalsIndex + 1);
			if (!glue) {
				console.warn("Expected to find glue following `=` but couldn't");
				return;
			}
			const numReplacements = glue.span.end - info.index + 1;
			containingArray.splice(info.index, numReplacements, ...[(0, _unified_latex_unified_latex_builder.m)("setlength", [(0, _unified_latex_unified_latex_builder.arg)(node), (0, _unified_latex_unified_latex_builder.arg)(glue.glue)]), ...glue.trailingStrings]);
			return info.index + 1;
		}
	}, { test: isLengthMacro });
});
//#endregion
exports.DESCRIPTION = DESCRIPTION;
exports.unifiedLatexLintPreferSetlength = unifiedLatexLintPreferSetlength;

//# sourceMappingURL=index.cjs.map