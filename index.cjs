Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
let _unified_latex_unified_latex_builder = require("@unified-latex/unified-latex-builder");
let _unified_latex_unified_latex_util_match = require("@unified-latex/unified-latex-util-match");
let _unified_latex_unified_latex_util_print_raw = require("@unified-latex/unified-latex-util-print-raw");
//#region libs/mangle.ts
/**
* Convert `tag` into an escaped macro name.
*/
function tagName(tag) {
	return `html-tag:${tag}`;
}
/**
* Convert `attribute` into an escaped macro name.
*/
function attributeName(attribute) {
	return `html-attr:${attribute}`;
}
/**
* Extract a tag name from an escaped macro name.
*/
function getTagNameFromString(tagName) {
	const match = tagName.match(/:.*/);
	if (match) return match[0].slice(1);
	throw new Error(`Could not find tag name in ${tagName}`);
}
/**
* Extract an attribute name from an escaped macro name.
*/
function getAttributeNameFromString(tagName) {
	const match = tagName.match(/:.*/);
	if (match) return match[0].slice(1);
	throw new Error(`Could not find attribute name in ${tagName}`);
}
//#endregion
//#region libs/builders.ts
/**
* Make an html-like node storing `content`. The node is a macro and `content` as well
* as any attributes can be extracted or further processed. Collisions are avoided with existing
* macros because all macros are prefixed with `html-tag:` or `html-attribute:`, which contain
* special characters that normal macros cannot have.
*/
function htmlLike({ tag, content, attributes }) {
	if (!content) content = [];
	if (content && !Array.isArray(content)) content = [content];
	attributes = attributes || {};
	const attrs = Object.entries(attributes).map(([name, value]) => {
		value = JSON.stringify(value);
		return (0, _unified_latex_unified_latex_builder.m)(attributeName(name), (0, _unified_latex_unified_latex_builder.arg)(value));
	});
	return (0, _unified_latex_unified_latex_builder.m)(tagName(tag), (0, _unified_latex_unified_latex_builder.arg)(attrs.concat(content)));
}
//#endregion
//#region libs/extractors.ts
/**
* Extract the contents/attributes/tag from an html-like macro.
*/
function extractFromHtmlLike(macro) {
	if (!isHtmlLikeTag(macro)) throw new Error("Attempting to extract html contents from a node that is not html-like.");
	const args = macro.args || [];
	if (args.length > 1) throw new Error(`html-like macros should have 0 or 1 args, but ${args.length} found`);
	const argContent = args.length > 0 ? args[0].content : [];
	const tag = getTagNameFromString(macro.content);
	const attributes = {};
	let i = 0;
	for (; i < argContent.length; i++) {
		const node = argContent[i];
		if (isHtmlLikeAttribute(node)) {
			const attrName = getAttributeNameFromString(node.content);
			let attrValue = true;
			if (node.args && node.args.length > 0) attrValue = JSON.parse((0, _unified_latex_unified_latex_util_print_raw.printRaw)(node.args[0].content));
			attributes[attrName] = attrValue;
			continue;
		}
		break;
	}
	return {
		tag,
		attributes,
		content: argContent.slice(i)
	};
}
/**
* Determine whether the node is an html-like macro.
*/
function isHtmlLike(node) {
	return _unified_latex_unified_latex_util_match.match.macro(node) && node.content.startsWith("html-");
}
/**
* Determine whether the node is an html-like macro for a tag.
*/
function isHtmlLikeTag(node) {
	return _unified_latex_unified_latex_util_match.match.macro(node) && node.content.startsWith("html-tag:");
}
/**
* Determine whether the node is an html-like macro for an attribute.
*/
function isHtmlLikeAttribute(node) {
	return _unified_latex_unified_latex_util_match.match.macro(node) && node.content.startsWith("html-attr:");
}
//#endregion
//#region index.ts
/**
* ## What is this?
*
* Functions to help with making html-like nodes in a `unified-latex` Abstract Syntax Tree (AST).
*
* For example, `<p>foo</p>` can be stored as `\html-tag:p{foo}` in `unified-latex`. Because `-` and `:`
* are special characters, they cannot appear in a macro name, so there is no risk of name conflicts.
* These macros are created programmatically, so special characters can be inserted.
*
* ## When should I use this?
*
* If you are converting LaTeX to HTML, these functions may be used as an intermediate format.
*
* ## Using with `unified-latex-to-hast`
*
* `unified-latex-to-hast` first processes a document into html-like nodes and then
* converts the resulting document to HAST/HTML. Any html-like macros that are created
* will be transparently converted to HAST/HTML. For example, if you wanted to convert
* all `\foo` macros into `<br />` tags, you could first preprocess your unified-latex AST
* and replace all occurrences of `\foo` with `htmlLike({ tag: "br" })`. When the AST is converted
* to HTML, the html-like macros will be rendered as `<br />` tags.
*
*/
//#endregion
exports.extractFromHtmlLike = extractFromHtmlLike;
exports.htmlLike = htmlLike;
exports.isHtmlLike = isHtmlLike;
exports.isHtmlLikeAttribute = isHtmlLikeAttribute;
exports.isHtmlLikeTag = isHtmlLikeTag;

//# sourceMappingURL=index.cjs.map