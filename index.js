import { match } from "@unified-latex/unified-latex-util-match";
import { visit } from "@unified-latex/unified-latex-util-visit";
import { printRaw } from "@unified-latex/unified-latex-util-print-raw";
import { trim } from "@unified-latex/unified-latex-util-trim";
//#region libs/arguments.ts
function stripComments(nodes) {
	return nodes.filter((node) => node.type !== "comment");
}
function trimWithReturn(nodes) {
	trim(nodes);
	return nodes;
}
/**
* Split a list of nodes on a comma
*/
function splitOnComma(nodes) {
	const ret = [];
	let curr = [];
	for (const node of stripComments(nodes)) if (node.type === "string" && node.content === ",") {
		ret.push(curr);
		curr = [];
	} else curr.push(node);
	if (curr.length > 0) ret.push(curr);
	return ret.map(trimWithReturn);
}
/**
* Convert a list of nodes to string node, taking care to preserve the start and end
* position of those nodes.
*/
function nodesToString(nodes) {
	if (nodes.length === 0) return {
		type: "string",
		content: ""
	};
	if (nodes.length === 1 && nodes[0].type === "string") return nodes[0];
	const start = nodes[0].position?.start;
	const end = nodes[nodes.length - 1].position?.end;
	const ret = {
		type: "string",
		content: printRaw(nodes)
	};
	if (start && end) Object.assign(ret, { position: {
		start,
		end
	} });
	return ret;
}
/**
* Process a list of nodes that should be comma-separated. The result
* will be a list of `Ast.String` nodes. The start/end position of
* these nodes is preserved.
*/
function processCommaSeparatedList(nodes) {
	return splitOnComma(nodes).map(nodesToString);
}
//#endregion
//#region libs/list-packages.ts
var isUseOrRequirePackageMacro = match.createMacroMatcher(["usepackage", "RequirePackage"]);
/**
* List all packages referenced via `\includepackage{...}` or `\RequirePackage{...}`
*
* @param {Ast.Ast} tree
* @returns {string[]}
*/
function listPackages(tree) {
	const ret = [];
	visit(tree, (node) => {
		if (node.content === "usepackage") {
			const packages = processCommaSeparatedList(node.args ? node.args[1].content : []);
			ret.push(...packages);
		}
		if (node.content === "RequirePackage") {
			const packages = processCommaSeparatedList(node.args ? node.args[1].content : []);
			ret.push(...packages);
		}
	}, { test: isUseOrRequirePackageMacro });
	return ret;
}
//#endregion
//#region index.ts
/**
* ## What is this?
*
* Functions for reporting on imported packages in a `unified-latex` Abstract Syntax Tree (AST).
*
* ## When should I use this?
*
* If you are building a linter or some other system that needs to know which packages have been included
* via `\usepackage{...}` or `\RequirePackage{...}`.
*/
//#endregion
export { listPackages };

//# sourceMappingURL=index.js.map