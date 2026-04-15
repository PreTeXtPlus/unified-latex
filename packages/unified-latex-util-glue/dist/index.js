import { match } from "@unified-latex/unified-latex-util-match";
import { GluePegParser } from "@unified-latex/unified-latex-util-pegjs";
//#region libs/parse.ts
/**
* Parse a string that starts with TeX glue (e.g. `1pt` or `1pt plus 2em`).
* It is assumed that all whitespace and comments have been stripped from the glue
*/
function parseTexGlue(source) {
	try {
		return GluePegParser.parse(source);
	} catch {}
	return null;
}
//#endregion
//#region libs/print-glue.ts
/**
* Prints a `Glue` object to an AST. After printing, `glue`
* is turned into a sequence of string and whitespace nodes.
* All structural information about the glue is lost.
*/
function printGlue(glue) {
	const ret = [{
		type: "string",
		content: `${glue.fixed.value}${glue.fixed.unit}`
	}];
	if (glue.stretchable) {
		ret.push({ type: "whitespace" });
		ret.push({
			type: "string",
			content: "plus"
		});
		ret.push({ type: "whitespace" });
		ret.push({
			type: "string",
			content: `${glue.stretchable.value}${glue.stretchable.unit}`
		});
	}
	if (glue.shrinkable) {
		ret.push({ type: "whitespace" });
		ret.push({
			type: "string",
			content: "minus"
		});
		ret.push({ type: "whitespace" });
		ret.push({
			type: "string",
			content: `${glue.shrinkable.value}${glue.shrinkable.unit}`
		});
	}
	return ret;
}
//#endregion
//#region libs/find-glue.ts
/**
* Finds patterns matching TeX glue in `nodes`. A pretty-formatted version
* of the glue is returned along with information about how many nodes were consumed.
*
* The return object consists of
*   * `printedGlue` - the pretty-printed version of the glue
*   * `endIndex` - the index in `nodes` where the glue string terminates
*   * `partialSliceLen` - how far into the `Ast.String` node the glue string finished. For example `1ptXX` would parse as `1pt`, and the parsing would terminate partway through the string node.
*/
function findGlue(nodes, startIndex) {
	let searchString = "";
	const sourceIndices = [];
	for (let i = startIndex; i < nodes.length; i++) {
		const node = nodes[i];
		if (match.whitespace(node) || match.comment(node)) continue;
		if (!match.anyString(node)) break;
		searchString += node.content;
		node.content.split("").forEach(() => sourceIndices.push(i));
	}
	const glue = parseTexGlue(searchString);
	if (!glue) return null;
	const printedGlue = printGlue(glue);
	const glueLen = glue.position.end.offset;
	const firstInstanceOfNodeIndex = sourceIndices.indexOf(sourceIndices[glueLen]);
	return {
		printedGlue,
		endIndex: sourceIndices[glueLen - 1],
		partialSliceLen: glueLen - firstInstanceOfNodeIndex
	};
}
/**
* Extract glue from a list of nodes returning a node array with
* properly formatted glue as well as start/end indices where the glue was
* "sliced out" of `nodes`.
*
* Sometimes glue may end in the middle of a string node. If this happens, the
* string node is split and the second half is returned in the `trailingStrings` array.
*/
function extractFormattedGlue(nodes, startIndex) {
	const glue = findGlue(nodes, startIndex);
	if (!glue) return null;
	let trailingStrings = [];
	const retNodes = glue.printedGlue;
	const lastString = nodes[glue.endIndex];
	if (lastString.type !== "string") throw new Error(`Expect string node, but found "${lastString.type}"`);
	if (lastString.content.length > glue.partialSliceLen) trailingStrings.push({
		type: "string",
		content: lastString.content.slice(glue.partialSliceLen)
	});
	return {
		glue: retNodes,
		span: {
			start: startIndex,
			end: glue.endIndex
		},
		trailingStrings
	};
}
//#endregion
//#region index.ts
/**
* ## What is this?
*
* Functions to parse TeX glue (e.g. `1in plus 3cm minus .2pt`).
*
* ## When should I use this?
*
* If you need access to the values of glue to analyze `\setlength` commands or write
* linters.
*/
//#endregion
export { extractFormattedGlue, findGlue, parseTexGlue, printGlue };

//# sourceMappingURL=index.js.map