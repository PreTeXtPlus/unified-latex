let _unified_latex_unified_latex_util_match = require("@unified-latex/unified-latex-util-match");
//#region utils/has-parbreak.ts
/**
* Returns whether there is a parbreak in `nodes` (either a parsed parbreak,
* or the macro `\par`)
*/
function hasParbreak(nodes) {
	return nodes.some((node) => _unified_latex_unified_latex_util_match.match.parbreak(node) || _unified_latex_unified_latex_util_match.match.macro(node, "par"));
}
/**
* Is there a parbreak or a macro/environment that acts like a parbreak (e.g. \section{...})
* in the array?
*/
function hasBreakingNode(nodes, options) {
	if (hasParbreak(nodes)) return true;
	const { macrosThatBreakPars = [
		"part",
		"chapter",
		"section",
		"subsection",
		"subsubsection",
		"vspace",
		"smallskip",
		"medskip",
		"bigskip",
		"hfill"
	], environmentsThatDontBreakPars = [] } = options || {};
	const macroMatcher = _unified_latex_unified_latex_util_match.match.createMacroMatcher(macrosThatBreakPars);
	const envMatcher = _unified_latex_unified_latex_util_match.match.createEnvironmentMatcher(environmentsThatDontBreakPars);
	return nodes.some((node) => macroMatcher(node) || _unified_latex_unified_latex_util_match.match.anyEnvironment(node) && !envMatcher(node));
}
//#endregion
Object.defineProperty(exports, "hasBreakingNode", {
	enumerable: true,
	get: function() {
		return hasBreakingNode;
	}
});
Object.defineProperty(exports, "hasParbreak", {
	enumerable: true,
	get: function() {
		return hasParbreak;
	}
});

//# sourceMappingURL=has-parbreak-BVWIw5ma.cjs.map