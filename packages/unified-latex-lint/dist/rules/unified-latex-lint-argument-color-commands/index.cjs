Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_lib = require("../../lib-D0DHAas_.cjs");
const require_has_parbreak = require("../../has-parbreak-BVWIw5ma.cjs");
let _unified_latex_unified_latex_builder = require("@unified-latex/unified-latex-builder");
let _unified_latex_unified_latex_util_print_raw = require("@unified-latex/unified-latex-util-print-raw");
let _unified_latex_unified_latex_util_match = require("@unified-latex/unified-latex-util-match");
let _unified_latex_unified_latex_util_visit = require("@unified-latex/unified-latex-util-visit");
let _unified_latex_unified_latex_util_trim = require("@unified-latex/unified-latex-util-trim");
let _unified_latex_unified_latex_ctan_package_xcolor = require("@unified-latex/unified-latex-ctan/package/xcolor");
let _unified_latex_unified_latex_util_replace = require("@unified-latex/unified-latex-util-replace");
//#region rules/unified-latex-lint-argument-color-commands/index.ts
var REPLACEMENTS = { color: _unified_latex_unified_latex_ctan_package_xcolor.colorToTextcolorMacro };
var isReplaceable = _unified_latex_unified_latex_util_match.match.createMacroMatcher(REPLACEMENTS);
/**
* Returns true if the `group` is a group that starts with one of the `REPLACEMENT` macros.
*/
function groupStartsWithMacroAndHasNoParbreak(group) {
	if (!_unified_latex_unified_latex_util_match.match.group(group)) return false;
	return isReplaceable((0, _unified_latex_unified_latex_util_replace.firstSignificantNode)(group.content)) && !require_has_parbreak.hasParbreak(group.content);
}
var DESCRIPTION = `## Lint Rule

Prefer using fond color commands with arguments (e.g. \`\\textcolor{red}{foo bar}\`) over in-stream color commands
(e.g. \`{\\color{red} foo bar}\`) if the style does not apply for multiple paragraphs.
This rule is useful when parsing LaTeX into other tree structures (e.g., when converting from LaTeX to HTML). 


This rule flags any usage of \`${Object.keys(REPLACEMENTS).map((r) => (0, _unified_latex_unified_latex_util_print_raw.printRaw)((0, _unified_latex_unified_latex_builder.m)(r))).join("` `")}\`
`;
var unifiedLatexLintArgumentColorCommands = require_lib.lintRule({ origin: "unified-latex-lint:argument-color-commands" }, (tree, file, options) => {
	const lintedNodes = /* @__PURE__ */ new Set();
	(0, _unified_latex_unified_latex_util_visit.visit)(tree, (group, info) => {
		const nodes = group.content;
		for (const node of nodes) if (isReplaceable(node) && !lintedNodes.has(node)) {
			lintedNodes.add(node);
			const macroName = node.content;
			file.message(`Replace "${(0, _unified_latex_unified_latex_util_print_raw.printRaw)(group)}" with "${(0, _unified_latex_unified_latex_util_print_raw.printRaw)(REPLACEMENTS[macroName]((0, _unified_latex_unified_latex_builder.s)("..."), node))}"`, node);
			break;
		}
		if (options?.fix) {
			let fixed = (0, _unified_latex_unified_latex_util_replace.replaceStreamingCommand)(group, isReplaceable, (content, command) => {
				return REPLACEMENTS[command.content](content, command);
			});
			if (!info.containingArray || info.index == null) return;
			const prevToken = info.containingArray[info.index - 1];
			const nextToken = info.containingArray[info.index + 1];
			if (_unified_latex_unified_latex_util_match.match.whitespaceLike(prevToken) && _unified_latex_unified_latex_util_match.match.whitespaceLike(fixed[0])) (0, _unified_latex_unified_latex_util_trim.trimStart)(fixed);
			if (_unified_latex_unified_latex_util_match.match.whitespaceLike(nextToken) && _unified_latex_unified_latex_util_match.match.whitespaceLike(fixed[fixed.length - 1])) (0, _unified_latex_unified_latex_util_trim.trimEnd)(fixed);
			(0, _unified_latex_unified_latex_util_replace.replaceNodeDuringVisit)(fixed, info);
		}
	}, { test: groupStartsWithMacroAndHasNoParbreak });
	(0, _unified_latex_unified_latex_util_visit.visit)(tree, (nodes) => {
		if (require_has_parbreak.hasParbreak(nodes)) return;
		let hasReplaceableContent = false;
		for (const node of nodes) if (isReplaceable(node) && !lintedNodes.has(node)) {
			lintedNodes.add(node);
			hasReplaceableContent = true;
			const macroName = node.content;
			file.message(`Replace "${(0, _unified_latex_unified_latex_util_print_raw.printRaw)(nodes)}" with "${(0, _unified_latex_unified_latex_util_print_raw.printRaw)(REPLACEMENTS[macroName]((0, _unified_latex_unified_latex_builder.s)("..."), node))}"`, node);
		}
		if (hasReplaceableContent && options?.fix) (0, _unified_latex_unified_latex_util_replace.replaceStreamingCommand)(nodes, isReplaceable, (content, command) => {
			return REPLACEMENTS[command.content](content, command);
		});
	}, {
		includeArrays: true,
		test: Array.isArray
	});
});
//#endregion
exports.DESCRIPTION = DESCRIPTION;
exports.unifiedLatexLintArgumentColorCommands = unifiedLatexLintArgumentColorCommands;

//# sourceMappingURL=index.cjs.map