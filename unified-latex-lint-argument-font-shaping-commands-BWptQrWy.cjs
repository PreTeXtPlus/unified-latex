const require_lib = require("./lib-D0DHAas_.cjs");
const require_has_parbreak = require("./has-parbreak-BVWIw5ma.cjs");
let _unified_latex_unified_latex_builder = require("@unified-latex/unified-latex-builder");
let _unified_latex_unified_latex_util_print_raw = require("@unified-latex/unified-latex-util-print-raw");
let _unified_latex_unified_latex_util_match = require("@unified-latex/unified-latex-util-match");
let _unified_latex_unified_latex_util_visit = require("@unified-latex/unified-latex-util-visit");
let _unified_latex_unified_latex_util_trim = require("@unified-latex/unified-latex-util-trim");
let _unified_latex_unified_latex_util_replace = require("@unified-latex/unified-latex-util-replace");
//#region utils/macro-factory.ts
/**
* Factory function that returns a wrapper which wraps the passed in `content`
* as an arg to a macro named `macroName`.
*
* E.g.
* ```
* f = singleArgumentMacroFactory("foo");
*
* // Gives "\\foo{bar}"
* printRaw(f("bar"));
* ```
*/
function singleArgMacroFactory(macroName) {
	return (content) => {
		if (!Array.isArray(content)) content = [content];
		return {
			type: "macro",
			content: macroName,
			args: [{
				type: "argument",
				openMark: "{",
				closeMark: "}",
				content
			}],
			_renderInfo: { inParMode: true }
		};
	};
}
//#endregion
//#region rules/unified-latex-lint-argument-font-shaping-commands/index.ts
var REPLACEMENTS = {
	bfseries: singleArgMacroFactory("textbf"),
	itshape: singleArgMacroFactory("textit"),
	rmfamily: singleArgMacroFactory("textrm"),
	scshape: singleArgMacroFactory("textsc"),
	sffamily: singleArgMacroFactory("textsf"),
	slshape: singleArgMacroFactory("textsl"),
	ttfamily: singleArgMacroFactory("texttt"),
	em: singleArgMacroFactory("emph")
};
var isReplaceable = _unified_latex_unified_latex_util_match.match.createMacroMatcher(REPLACEMENTS);
/**
* Returns true if the `group` is a group that starts with one of the `REPLACEMENT` macros.
*/
function groupStartsWithMacroAndHasNoParbreak(group) {
	if (!_unified_latex_unified_latex_util_match.match.group(group)) return false;
	return isReplaceable((0, _unified_latex_unified_latex_util_replace.firstSignificantNode)(group.content)) && !require_has_parbreak.hasBreakingNode(group.content);
}
var DESCRIPTION = `## Lint Rule

Prefer using text shaping commands with arguments (e.g. \`\\textbf{foo bar}\`) over in-stream text shaping commands
(e.g. \`{\\bfseries foo bar}\`) if the style does not apply for multiple paragraphs.
This rule is useful when parsing LaTeX into other tree structures (e.g., when converting from LaTeX to HTML). 


This rule flags any usage of \`${Object.keys(REPLACEMENTS).map((r) => (0, _unified_latex_unified_latex_util_print_raw.printRaw)((0, _unified_latex_unified_latex_builder.m)(r))).join("` `")}\`
`;
var unifiedLatexLintArgumentFontShapingCommands = require_lib.lintRule({ origin: "unified-latex-lint:argument-font-shaping-commands" }, (tree, file, options) => {
	const lintedNodes = /* @__PURE__ */ new Set();
	(0, _unified_latex_unified_latex_util_visit.visit)(tree, (group, info) => {
		const nodes = group.content;
		for (const node of nodes) if (isReplaceable(node) && !lintedNodes.has(node)) {
			lintedNodes.add(node);
			const macroName = node.content;
			file.message(`Replace "${(0, _unified_latex_unified_latex_util_print_raw.printRaw)(group)}" with "${(0, _unified_latex_unified_latex_util_print_raw.printRaw)(REPLACEMENTS[macroName]((0, _unified_latex_unified_latex_builder.s)("...")))}"`, node);
			break;
		}
		if (options?.fix) {
			let fixed = (0, _unified_latex_unified_latex_util_replace.replaceStreamingCommand)(group, isReplaceable, (content, command) => {
				return REPLACEMENTS[command.content](content);
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
		if (require_has_parbreak.hasBreakingNode(nodes)) return;
		let hasReplaceableContent = false;
		for (const node of nodes) if (isReplaceable(node) && !lintedNodes.has(node)) {
			lintedNodes.add(node);
			hasReplaceableContent = true;
			const macroName = node.content;
			file.message(`Replace "${(0, _unified_latex_unified_latex_util_print_raw.printRaw)(nodes)}" with "${(0, _unified_latex_unified_latex_util_print_raw.printRaw)(REPLACEMENTS[macroName]((0, _unified_latex_unified_latex_builder.s)("...")))}"`, node);
		}
		if (hasReplaceableContent && options?.fix) (0, _unified_latex_unified_latex_util_replace.replaceStreamingCommand)(nodes, isReplaceable, (content, command) => {
			return REPLACEMENTS[command.content](content);
		});
	}, {
		includeArrays: true,
		test: Array.isArray
	});
});
//#endregion
Object.defineProperty(exports, "DESCRIPTION", {
	enumerable: true,
	get: function() {
		return DESCRIPTION;
	}
});
Object.defineProperty(exports, "unifiedLatexLintArgumentFontShapingCommands", {
	enumerable: true,
	get: function() {
		return unifiedLatexLintArgumentFontShapingCommands;
	}
});

//# sourceMappingURL=unified-latex-lint-argument-font-shaping-commands-BWptQrWy.cjs.map