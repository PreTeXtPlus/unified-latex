import { unified } from "unified";
import { unifiedLatexToHast } from "@unified-latex/unified-latex-to-hast";
import rehypeRemark from "rehype-remark";
import { toString } from "hast-util-to-string";
import remarkStringify from "remark-stringify";
import { processLatexViaUnified } from "@unified-latex/unified-latex";
//#region libs/remark-handlers-defaults.ts
var defaultHandlers = {
	span(state, node, parent) {
		if ((node.properties.className || []).includes("inline-math")) return {
			type: "html",
			value: `$${toString(node)}$`
		};
		return state.all(node);
	},
	div(state, node, parent) {
		if ((node.properties.className || []).includes("display-math")) return {
			type: "code",
			lang: "math",
			value: toString(node)
		};
		return state.all(node);
	}
};
//#endregion
//#region libs/unified-latex-plugin-to-mdast.ts
/**
* Unified plugin to convert a `unified-latex` AST into a `mdast` AST.
*/
var unifiedLatexToMdast = function unifiedLatexToMdast(options) {
	const handlers = Object.assign({}, defaultHandlers, options?.handlers);
	options = Object.assign({}, options, { handlers });
	return (tree, file) => {
		return unified().use(unifiedLatexToHast, options).use(rehypeRemark, options).runSync(tree, file);
	};
};
//#endregion
//#region libs/convert-to-markdown.ts
var _processor = processLatexViaUnified().use(unifiedLatexToMdast).use(remarkStringify);
/**
* Convert the `unified-latex` AST `tree` into a Markdown string. If you need
* more precise control or further processing, consider using `unified`
* directly with the `unifiedLatexToMdast` plugin.
*
* For example,
* ```
* unified()
*      .use(unifiedLatexFromString)
*      .use(unifiedLatexToMdast)
*      .use(remarkStringify)
*      .processSync("\\LaTeX to convert")
* ```
*/
function convertToMarkdown(tree, options) {
	let processor = _processor;
	if (!Array.isArray(tree) && tree.type !== "root") tree = {
		type: "root",
		content: [tree]
	};
	if (Array.isArray(tree)) tree = {
		type: "root",
		content: tree
	};
	if (options) processor = _processor.use(unifiedLatexToMdast, options);
	const mdast = processor.runSync(tree);
	return processor.stringify(mdast);
}
//#endregion
//#region index.ts
/**
* ## What is this?
*
* Functions to convert `unified-latex` Abstract Syntax Tree (AST) to a MDAST (Markdown-like)
* tree.
*
* ## When should I use this?
*
* If you want to convert LaTeX to Markdown.
*
*/
//#endregion
export { convertToMarkdown, unifiedLatexToMdast };

//# sourceMappingURL=index.js.map