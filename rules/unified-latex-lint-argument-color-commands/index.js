import { n as hasParbreak } from "../../has-parbreak-Bkln75vq.js";
import { lintRule } from "unified-lint-rule";
import { m, s } from "@unified-latex/unified-latex-builder";
import { printRaw } from "@unified-latex/unified-latex-util-print-raw";
import { match } from "@unified-latex/unified-latex-util-match";
import { visit } from "@unified-latex/unified-latex-util-visit";
import { trimEnd, trimStart } from "@unified-latex/unified-latex-util-trim";
import { colorToTextcolorMacro } from "@unified-latex/unified-latex-ctan/package/xcolor";
import { firstSignificantNode, replaceNodeDuringVisit, replaceStreamingCommand } from "@unified-latex/unified-latex-util-replace";
//#region rules/unified-latex-lint-argument-color-commands/index.ts
var REPLACEMENTS = { color: colorToTextcolorMacro };
var isReplaceable = match.createMacroMatcher(REPLACEMENTS);
/**
* Returns true if the `group` is a group that starts with one of the `REPLACEMENT` macros.
*/
function groupStartsWithMacroAndHasNoParbreak(group) {
	if (!match.group(group)) return false;
	return isReplaceable(firstSignificantNode(group.content)) && !hasParbreak(group.content);
}
var DESCRIPTION = `## Lint Rule

Prefer using fond color commands with arguments (e.g. \`\\textcolor{red}{foo bar}\`) over in-stream color commands
(e.g. \`{\\color{red} foo bar}\`) if the style does not apply for multiple paragraphs.
This rule is useful when parsing LaTeX into other tree structures (e.g., when converting from LaTeX to HTML). 


This rule flags any usage of \`${Object.keys(REPLACEMENTS).map((r) => printRaw(m(r))).join("` `")}\`
`;
var unifiedLatexLintArgumentColorCommands = lintRule({ origin: "unified-latex-lint:argument-color-commands" }, (tree, file, options) => {
	const lintedNodes = /* @__PURE__ */ new Set();
	visit(tree, (group, info) => {
		const nodes = group.content;
		for (const node of nodes) if (isReplaceable(node) && !lintedNodes.has(node)) {
			lintedNodes.add(node);
			const macroName = node.content;
			file.message(`Replace "${printRaw(group)}" with "${printRaw(REPLACEMENTS[macroName](s("..."), node))}"`, node);
			break;
		}
		if (options?.fix) {
			let fixed = replaceStreamingCommand(group, isReplaceable, (content, command) => {
				return REPLACEMENTS[command.content](content, command);
			});
			if (!info.containingArray || info.index == null) return;
			const prevToken = info.containingArray[info.index - 1];
			const nextToken = info.containingArray[info.index + 1];
			if (match.whitespaceLike(prevToken) && match.whitespaceLike(fixed[0])) trimStart(fixed);
			if (match.whitespaceLike(nextToken) && match.whitespaceLike(fixed[fixed.length - 1])) trimEnd(fixed);
			replaceNodeDuringVisit(fixed, info);
		}
	}, { test: groupStartsWithMacroAndHasNoParbreak });
	visit(tree, (nodes) => {
		if (hasParbreak(nodes)) return;
		let hasReplaceableContent = false;
		for (const node of nodes) if (isReplaceable(node) && !lintedNodes.has(node)) {
			lintedNodes.add(node);
			hasReplaceableContent = true;
			const macroName = node.content;
			file.message(`Replace "${printRaw(nodes)}" with "${printRaw(REPLACEMENTS[macroName](s("..."), node))}"`, node);
		}
		if (hasReplaceableContent && options?.fix) replaceStreamingCommand(nodes, isReplaceable, (content, command) => {
			return REPLACEMENTS[command.content](content, command);
		});
	}, {
		includeArrays: true,
		test: Array.isArray
	});
});
//#endregion
export { DESCRIPTION, unifiedLatexLintArgumentColorCommands };

//# sourceMappingURL=index.js.map