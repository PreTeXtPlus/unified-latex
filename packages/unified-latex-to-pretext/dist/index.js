import { x } from "xastscript";
import { unified } from "unified";
import { expandUnicodeLigatures } from "@unified-latex/unified-latex-util-ligatures";
import { anyEnvironment, anyMacro, match } from "@unified-latex/unified-latex-util-match";
import { EXIT, SKIP, visit } from "@unified-latex/unified-latex-util-visit";
import { printRaw } from "@unified-latex/unified-latex-util-print-raw";
import { attachMacroArgs, getArgsContent, getNamedArgsContent, gobbleArguments } from "@unified-latex/unified-latex-util-arguments";
import { extractFromHtmlLike, htmlLike, isHtmlLikeTag } from "@unified-latex/unified-latex-util-html-like";
import { arg, env, m, s } from "@unified-latex/unified-latex-builder";
import { replaceNode, unifiedLatexReplaceStreamingCommands } from "@unified-latex/unified-latex-util-replace";
import { splitOnMacro, unsplitOnMacro } from "@unified-latex/unified-latex-util-split";
import { VFileMessage } from "vfile-message";
import { unifiedLatexLintNoTexFontShapingCommands } from "@unified-latex/unified-latex-lint/rules/unified-latex-lint-no-tex-font-shaping-commands";
import { deleteComments } from "@unified-latex/unified-latex-util-comments";
import { trim } from "@unified-latex/unified-latex-util-trim";
import { parseTabularSpec } from "@unified-latex/unified-latex-ctan/package/tabularx";
import { parseAlignEnvironment } from "@unified-latex/unified-latex-util-align";
import { environments as environments$1 } from "@unified-latex/unified-latex-ctan/package/exam";
import { attachSystemeSettingsAsRenderInfo, systemeContentsToArray } from "@unified-latex/unified-latex-ctan/package/systeme";
import { colorToTextcolorMacro } from "@unified-latex/unified-latex-ctan/package/xcolor";
import { expandMacrosExcludingDefinitions, listNewcommands } from "@unified-latex/unified-latex-util-macros";
import { toXml } from "xast-util-to-xml";
import { processLatexViaUnified } from "@unified-latex/unified-latex";
import "@unified-latex/unified-latex-types";
//#region libs/pre-conversion-subs/utils.ts
/**
* Create a warning message about node from the given source file.
*/
function makeWarningMessage(node, message, warningType) {
	const newMessage = new VFileMessage(message, node);
	newMessage.source = `unified-latex-to-pretext:${warningType}`;
	return newMessage;
}
/**
* Create an empty Ast.String node, adding a warning message from
* the source file into the VFile.
*/
function emptyStringWithWarningFactory(warningMessage) {
	return (node, info, file) => {
		if (file) {
			const message = makeWarningMessage(node, warningMessage, "macro-subs");
			file.message(message, message.place, `unified-latex-to-pretext:macro-subs`);
		}
		return s("");
	};
}
/**
* Sanitize a string for use in xml:id attributes and corresponding refs.
*/
function sanitizeXmlId(str) {
	return str.replace(/["'<>&:\s]/g, (match) => {
		switch (match) {
			case "&":
			case ":": return "-";
			case " ":
			case "	": return "_";
			default: return "";
		}
	});
}
//#endregion
//#region libs/pre-conversion-subs/break-on-boundaries.ts
var divisionGroups = [
	[{
		division: "part",
		mappedEnviron: "_part"
	}],
	[
		{
			division: "chapter",
			mappedEnviron: "_chapter"
		},
		{
			division: "preface",
			mappedEnviron: "_preface"
		},
		{
			division: "biography",
			mappedEnviron: "_biography"
		},
		{
			division: "dedication",
			mappedEnviron: "_dedication"
		},
		{
			division: "glossary",
			mappedEnviron: "_glossary"
		}
	],
	[
		{
			division: "section",
			mappedEnviron: "_section"
		},
		{
			division: "exercises",
			mappedEnviron: "_exercises"
		},
		{
			division: "solutions",
			mappedEnviron: "_solutions"
		},
		{
			division: "worksheet",
			mappedEnviron: "_worksheet"
		},
		{
			division: "readingquestions",
			mappedEnviron: "_readingquestions",
			pretextTag: "reading-questions"
		}
	],
	[{
		division: "subsection",
		mappedEnviron: "_subsection"
	}],
	[{
		division: "subsubsection",
		mappedEnviron: "_subsubsection"
	}],
	[{
		division: "paragraph",
		mappedEnviron: "_paragraph"
	}],
	[{
		division: "subparagraph",
		mappedEnviron: "_subparagraph"
	}]
];
var isExamListEnviron = match.createEnvironmentMatcher([
	"parts",
	"subparts",
	"subsubparts"
]);
/**
* Flat view of all division entries — useful for lookups.
*/
var divisions = divisionGroups.flat();
var isDivisionMacro = match.createMacroMatcher(divisions.map((x) => x.division));
var isMappedEnviron = match.createEnvironmentMatcher(divisions.map((x) => x.mappedEnviron));
/**
* Breaks up division macros into environments. Returns an object of warning messages
* for any groups that were removed.
*/
function breakOnBoundaries(ast) {
	const messagesLst = { messages: [] };
	replaceNode(ast, (node) => {
		if (match.group(node)) {
			if (node.content.some((child) => {
				return anyMacro(child) && isDivisionMacro(child);
			})) {
				messagesLst.messages.push(makeWarningMessage(node, "Warning: hoisted out of a group, which might break the LaTeX code.", "break-on-boundaries"));
				return node.content;
			}
		}
	});
	visit(ast, (node, info) => {
		if (!(anyEnvironment(node) || node.type === "root" || match.group(node)) || info.context.hasMathModeAncestor) return;
		else if (anyEnvironment(node) && isMappedEnviron(node)) return;
		else if (anyEnvironment(node) && isExamListEnviron(node)) return;
		node.content = breakUp(node.content, 0);
	});
	replaceNode(ast, (node, info) => {
		if (anyMacro(node) && isDivisionMacro(node)) {
			if (info.parents.some((p) => anyEnvironment(p) && isExamListEnviron(p))) return;
			return null;
		}
	});
	return messagesLst;
}
/**
* Recursively breaks up the AST at the division macros.
* Each depth corresponds to a group of peer divisions in `divisionGroups`.
*/
function breakUp(content, depth) {
	if (depth >= divisionGroups.length) return content;
	const group = divisionGroups[depth];
	const splits = splitOnMacro(content, group.map((d) => d.division));
	for (let i = 0; i < splits.segments.length; i++) splits.segments[i] = breakUp(splits.segments[i], depth + 1);
	createEnvironments(splits, group);
	return unsplitOnMacro(splits);
}
/**
* Create the new environments that replace the division macros.
* Each macro in `splits.macros` is looked up in `group` to find its mapped
* environment name, allowing multiple macro types at the same depth level.
*/
function createEnvironments(splits, group) {
	const macroToEnv = new Map(group.map((d) => [d.division, d.mappedEnviron]));
	for (let i = 1; i < splits.segments.length; i++) {
		const macro = splits.macros[i - 1];
		const mappedEnv = macroToEnv.get(macro.content) ?? "_unknown";
		const title = getNamedArgsContent(macro)["title"];
		const titleArg = [];
		if (title) titleArg.push(arg(title, { braces: "[]" }));
		splits.segments[i] = [env(mappedEnv, splits.segments[i], titleArg)];
	}
}
//#endregion
//#region libs/pretext-subs/to-pretext.ts
function formatNodeForError(node) {
	try {
		return printRaw(node);
	} catch {}
	return JSON.stringify(node);
}
/**
* Create a `toPretext` function that will log by making a call to `logger`.
*/
function toPretextWithLoggerFactory(logger) {
	/**
	* Convert Ast.Node to Xast nodes.
	*/
	return function toPretext(node) {
		const htmlNode = node;
		if (isHtmlLikeTag(htmlNode)) {
			const extracted = extractFromHtmlLike(htmlNode);
			const attributes = extracted.attributes;
			return x(extracted.tag, attributes, extracted.content.flatMap(toPretext));
		}
		switch (node.type) {
			case "string": return {
				type: "text",
				value: node.content,
				position: node.position
			};
			case "comment": return {
				type: "comment",
				value: node.content,
				position: node.position
			};
			case "inlinemath": return x("m", printRaw(node.content));
			case "mathenv":
			case "displaymath": return x("md", printRaw(node.content));
			case "verb": return x("c", node.content);
			case "verbatim": return x("pre", node.content);
			case "whitespace": return {
				type: "text",
				value: " ",
				position: node.position
			};
			case "parbreak":
				logger(`There is no equivalent for parbreak, so it was replaced with an empty string.`, node);
				return {
					type: "text",
					value: "",
					position: node.position
				};
			case "group": return node.content.flatMap(toPretext);
			case "environment":
				if (isMappedEnviron(node)) {
					const divEntry = divisions.find((x) => x.mappedEnviron === node.env);
					if (divEntry?.division === "subparagraph") logger(`Warning: There is no equivalent tag for "subparagraph", "paragraphs" was used as a replacement.`, node);
					let tagName = divEntry?.pretextTag ?? divEntry?.division;
					if (tagName === "paragraph" || tagName === "subparagraph") tagName = "paragraphs";
					const attributes = {};
					if (node._renderInfo?.additionalAttributes) Object.assign(attributes, node._renderInfo.additionalAttributes);
					const title = getArgsContent(node)[0];
					if (!title) logger(`Warning: No title was given, so an empty title tag was used.`, node);
					const titleTag = x("title", title?.flatMap(toPretext));
					if (tagName) return x(tagName, attributes, [titleTag, ...node.content.flatMap(toPretext)]);
				}
				logger(`Unknown environment when converting to XML \`${formatNodeForError(node.env)}\``, node);
				return node.content.flatMap(toPretext);
			case "macro":
				logger(`Unknown macro when converting to XML \`${formatNodeForError(node)}\``, node);
				return (node.args || []).map(toPretext).flat();
			case "argument":
				logger(`Unknown argument when converting to XML \`${formatNodeForError(node)}\``, node);
				return {
					type: "text",
					value: printRaw(node.content),
					position: node.position
				};
			case "root": return node.content.flatMap(toPretext);
			default: throw new Error(`Unknown node type; cannot convert to XAST ${JSON.stringify(node)}`);
		}
	};
}
toPretextWithLoggerFactory(console.warn);
//#endregion
//#region libs/split-for-pars.ts
/**
* Takes an array of nodes and splits it into chunks that should be wrapped
* in HTML `<p>...</p>` tags, vs. not. By default environments are not wrapped
* unless they are specified, and macros are included in a par unless they are excluded.
*
*/
function splitForPars(nodes, options) {
	const ret = [];
	let currBody = [];
	trim(nodes);
	const isParBreakingMacro = match.createMacroMatcher(options.macrosThatBreakPars);
	const isEnvThatShouldNotBreakPar = match.createEnvironmentMatcher(options.environmentsThatDontBreakPars);
	/**
	* Push and clear the contents of `currBody` to the return array.
	* If there are any contents, it should be wrapped in an array.
	*/
	function pushBody() {
		if (currBody.length > 0) {
			trim(currBody);
			ret.push({
				content: currBody,
				wrapInPar: true
			});
			currBody = [];
		}
	}
	for (const node of nodes) {
		if (isParBreakingMacro(node)) {
			pushBody();
			ret.push({
				content: [node],
				wrapInPar: false
			});
			continue;
		}
		if (match.anyEnvironment(node) && !isEnvThatShouldNotBreakPar(node)) {
			pushBody();
			ret.push({
				content: [node],
				wrapInPar: false
			});
			continue;
		}
		if (match.parbreak(node) || match.macro(node, "par")) {
			pushBody();
			continue;
		}
		currBody.push(node);
	}
	pushBody();
	return ret;
}
//#endregion
//#region libs/wrap-pars.ts
/**
* Wrap paragraphs in `<p>...</p>` tags.
*
* Paragraphs are inserted at
*   * parbreak tokens
*   * macros listed in `macrosThatBreakPars`
*   * environments not listed in `environmentsThatDontBreakPars`
*/
function wrapPars(nodes, options) {
	const { macrosThatBreakPars = [
		"part",
		"chapter",
		"section",
		"subsection",
		"subsubsection",
		"paragraph",
		"subparagraph",
		"vspace",
		"smallskip",
		"medskip",
		"bigskip",
		"hfill",
		"includegraphics",
		"title"
	], environmentsThatDontBreakPars = [
		"index",
		"itemize",
		"enumerate"
	] } = options || {};
	return splitForPars(nodes, {
		macrosThatBreakPars,
		environmentsThatDontBreakPars
	}).flatMap((part) => {
		if (part.wrapInPar) return htmlLike({
			tag: "p",
			content: part.content
		});
		else return part.content;
	});
}
//#endregion
//#region libs/pre-conversion-subs/create-table-from-tabular.ts
/**
* Convert env into a tabular in PreTeXt.
*/
function createTableFromTabular(env) {
	const tabularBody = parseAlignEnvironment(env.content);
	const args = getArgsContent(env);
	let columnSpecs = [];
	try {
		columnSpecs = parseTabularSpec(args[1] || []);
	} catch (e) {}
	const attributes = {};
	let notLeftAligned = false;
	const columnRightBorder = {};
	const tableBody = tabularBody.map((row) => {
		return htmlLike({
			tag: "row",
			content: row.cells.map((cell, i) => {
				const columnSpec = columnSpecs[i];
				if (columnSpec) {
					const { alignment } = columnSpec;
					if (columnSpec.pre_dividers.some((div) => div.type === "vert_divider")) attributes["left"] = "minor";
					if (columnSpec.post_dividers.some((div) => div.type === "vert_divider")) columnRightBorder[i] = true;
					if (alignment.alignment !== "left") notLeftAligned = true;
				}
				trim(cell);
				return htmlLike({
					tag: "cell",
					content: cell
				});
			})
		});
	});
	if (notLeftAligned || Object.values(columnRightBorder).some((b) => b)) for (let i = columnSpecs.length; i >= 0; i--) {
		const columnSpec = columnSpecs[i];
		if (!columnSpec) continue;
		const colAttributes = {};
		const { alignment } = columnSpec;
		if (alignment.alignment !== "left") colAttributes["halign"] = alignment.alignment;
		if (columnRightBorder[i] === true) colAttributes["right"] = "minor";
		tableBody.unshift(htmlLike({
			tag: "col",
			attributes: colAttributes
		}));
	}
	return htmlLike({
		tag: "tabular",
		content: tableBody,
		attributes
	});
}
//#endregion
//#region libs/pre-conversion-subs/environment-subs.ts
var ITEM_ARG_NAMES_REG = ["label"];
var ITEM_ARG_NAMES_BEAMER = [
	null,
	"label",
	null
];
/**
* Extract the arguments to an `\item` macro.
*/
function getItemArgs(node) {
	if (!Array.isArray(node.args)) throw new Error(`Cannot find \\item macros arguments; you must attach the \\item body to the macro before calling this function ${JSON.stringify(node)}`);
	const argNames = node.args.length - 1 === ITEM_ARG_NAMES_BEAMER.length ? ITEM_ARG_NAMES_BEAMER : ITEM_ARG_NAMES_REG;
	return Object.assign({ body: node.args[node.args.length - 1].content }, getNamedArgsContent(node, argNames));
}
function enumerateFactory(parentTag = "ol") {
	return function enumerateToHtml(env) {
		const items = env.content.filter((node) => match.macro(node, "item"));
		let isDescriptionList = false;
		const content = items.flatMap((node) => {
			if (!match.macro(node) || !node.args) return [];
			const namedArgs = getItemArgs(node);
			namedArgs.body = wrapPars(namedArgs.body);
			if (namedArgs.label != null) {
				isDescriptionList = true;
				namedArgs.body.unshift(htmlLike({
					tag: "title",
					content: namedArgs.label
				}));
			}
			const body = namedArgs.body;
			return htmlLike({
				tag: "li",
				content: body
			});
		});
		return htmlLike({
			tag: isDescriptionList ? "dl" : parentTag,
			content
		});
	};
}
/**
* Tags that should be siblings of `<statement>` rather than children of it,
* when nested inside a theorem-like or exercise-like environment.
* For example, `<proof>` must follow `<statement>` inside `<theorem>`.
*/
var STATEMENT_SIBLING_TAGS = new Set([
	"proof",
	"hint",
	"answer",
	"solution"
]);
function envFactory(tag, options = {}) {
	const { requiresStatementTag = false, wrapContentInPars = true, extractTitleFromArgs = true, warningMessage = "" } = options;
	return (env, info, file) => {
		if (warningMessage && file) {
			const message = makeWarningMessage(env, warningMessage, "env-subs");
			file.message(message, message.place, message.source);
		}
		let content;
		if (requiresStatementTag) {
			const statementEnvContent = [];
			const statementSiblings = [];
			for (const node of env.content) if (isHtmlLikeTag(node) && STATEMENT_SIBLING_TAGS.has(node.content.slice(9))) statementSiblings.push(node);
			else statementEnvContent.push(node);
			content = [htmlLike({
				tag: "statement",
				content: wrapContentInPars ? wrapPars(statementEnvContent) : statementEnvContent
			}), ...statementSiblings];
		} else content = wrapContentInPars ? wrapPars(env.content) : env.content;
		if (extractTitleFromArgs) {
			const args = getArgsContent(env);
			if (args[0]) content.unshift(htmlLike({
				tag: "title",
				content: args[0] || []
			}));
		}
		const attributes = {};
		if (env._renderInfo?.additionalAttributes) Object.assign(attributes, env._renderInfo.additionalAttributes);
		return htmlLike({
			tag,
			content,
			attributes
		});
	};
}
/**
* Rules for replacing a macro with an html-like macro
* that will render has pretext when printed.
*/
var environmentReplacements = {
	enumerate: enumerateFactory("ol"),
	itemize: enumerateFactory("ul"),
	tabular: createTableFromTabular,
	center: envFactory("blockquote"),
	quote: envFactory("blockquote"),
	figure: envFactory("figure", {
		requiresStatementTag: false,
		wrapContentInPars: false,
		extractTitleFromArgs: false
	}),
	table: envFactory("table", {
		requiresStatementTag: false,
		wrapContentInPars: false,
		extractTitleFromArgs: false
	}),
	code: (env) => htmlLike({
		tag: "pre",
		content: [{
			type: "string",
			content: printRaw(env.content)
		}]
	}),
	poem: (env) => {
		const title = getArgsContent(env)[0];
		const raw = printRaw(env.content).trim();
		const stanzas = raw.split(/\n[ \t]*\n/).map((s) => s.trim()).filter((s) => s.length > 0).map((stanzaText) => {
			return htmlLike({
				tag: "stanza",
				content: stanzaText.split(/\\\\[ \t]*\n?/).map((l) => l.trim()).filter((l) => l.length > 0).map((lineText) => htmlLike({
					tag: "line",
					content: [{
						type: "string",
						content: lineText
					}]
				}))
			});
		});
		if (stanzas.length === 0) stanzas.push(htmlLike({
			tag: "stanza",
			content: [htmlLike({
				tag: "line",
				content: [{
					type: "string",
					content: raw
				}]
			})]
		}));
		const children = [];
		if (title) children.push(htmlLike({
			tag: "title",
			content: title
		}));
		children.push(...stanzas);
		return htmlLike({
			tag: "poem",
			content: children
		});
	},
	sidebyside: envFactory("sidebyside", {
		requiresStatementTag: false,
		extractTitleFromArgs: false
	}),
	program: (env) => {
		const args = getArgsContent(env);
		const lang = args[0] ? printRaw(args[0]).trim() : void 0;
		return htmlLike({
			tag: "program",
			content: [htmlLike({
				tag: "input",
				content: [{
					type: "string",
					content: printRaw(env.content).trim()
				}]
			})],
			attributes: lang ? { language: lang } : {}
		});
	},
	console: (env) => htmlLike({
		tag: "console",
		content: [{
			type: "string",
			content: printRaw(env.content).trim()
		}]
	}),
	sage: (env) => htmlLike({
		tag: "sage",
		content: [htmlLike({
			tag: "input",
			content: [{
				type: "string",
				content: printRaw(env.content).trim()
			}]
		})]
	}),
	webwork: envFactory("webwork", { requiresStatementTag: false }),
	preface: envFactory("preface"),
	biography: envFactory("biography"),
	dedication: envFactory("dedication"),
	glossary: envFactory("glossary"),
	biblio: envFactory("biblio"),
	gi: envFactory("gi", { requiresStatementTag: false }),
	exercises: envFactory("exercises"),
	exercisegroup: envFactory("exercisegroup"),
	subexercises: envFactory("subexercises"),
	worksheet: envFactory("worksheet"),
	"reading-questions": envFactory("reading-questions"),
	readingquestions: envFactory("reading-questions"),
	solutions: envFactory("solutions"),
	introduction: envFactory("introduction"),
	conclusion: envFactory("conclusion"),
	paragraphs: envFactory("paragraphs"),
	objectives: envFactory("objectives"),
	outcomes: envFactory("outcomes"),
	list: envFactory("list", {
		requiresStatementTag: false,
		wrapContentInPars: false,
		extractTitleFromArgs: false
	}),
	listing: envFactory("listing", {
		requiresStatementTag: false,
		wrapContentInPars: false,
		extractTitleFromArgs: false
	}),
	sbsgroup: envFactory("sbsgroup", { requiresStatementTag: false }),
	stack: envFactory("stack", { requiresStatementTag: false }),
	...genEnvironmentReplacements()
};
function genEnvironmentReplacements() {
	const exapandedEnvAliases = Object.entries({
		abstract: {
			requiresStatement: false,
			aliases: ["abs", "abstr"]
		},
		acknowledgement: {
			requiresStatement: false,
			aliases: ["ack"]
		},
		algorithm: {
			requiresStatement: true,
			aliases: ["algo", "alg"]
		},
		answer: {
			requiresStatement: false,
			aliases: ["ans"]
		},
		assumption: {
			requiresStatement: true,
			aliases: ["assu", "ass"]
		},
		axiom: {
			requiresStatement: true,
			aliases: ["axm"]
		},
		claim: {
			requiresStatement: true,
			aliases: ["cla"]
		},
		conjecture: {
			requiresStatement: true,
			aliases: [
				"con",
				"conj",
				"conjec"
			]
		},
		activity: {
			requiresStatement: false,
			aliases: []
		},
		aside: {
			requiresStatement: false,
			aliases: []
		},
		assemblage: {
			requiresStatement: false,
			aliases: []
		},
		biographical: {
			requiresStatement: false,
			aliases: []
		},
		case: {
			requiresStatement: false,
			aliases: []
		},
		computation: {
			requiresStatement: false,
			aliases: ["comp"]
		},
		construction: {
			requiresStatement: false,
			aliases: []
		},
		convention: {
			requiresStatement: false,
			aliases: ["conv"]
		},
		corollary: {
			requiresStatement: true,
			aliases: [
				"cor",
				"corr",
				"coro",
				"corol",
				"corss"
			]
		},
		definition: {
			requiresStatement: true,
			aliases: [
				"def",
				"defn",
				"dfn",
				"defi",
				"defin",
				"de"
			]
		},
		example: {
			requiresStatement: true,
			aliases: [
				"exam",
				"exa",
				"eg",
				"exmp",
				"expl",
				"exm"
			]
		},
		exercise: {
			requiresStatement: true,
			aliases: ["exer", "exers"]
		},
		data: {
			requiresStatement: false,
			aliases: []
		},
		exploration: {
			requiresStatement: false,
			aliases: []
		},
		fact: {
			requiresStatement: true,
			aliases: []
		},
		heuristic: {
			requiresStatement: true,
			aliases: []
		},
		hint: {
			requiresStatement: false,
			aliases: []
		},
		historical: {
			requiresStatement: false,
			aliases: []
		},
		hypothesis: {
			requiresStatement: true,
			aliases: ["hyp"]
		},
		identity: {
			requiresStatement: true,
			aliases: ["idnty"]
		},
		insight: {
			requiresStatement: false,
			aliases: []
		},
		investigation: {
			requiresStatement: false,
			aliases: []
		},
		lemma: {
			requiresStatement: true,
			aliases: [
				"lem",
				"lma",
				"lemm",
				"lm"
			]
		},
		notation: {
			requiresStatement: false,
			aliases: [
				"no",
				"nota",
				"ntn",
				"nt",
				"notn",
				"notat"
			]
		},
		note: {
			requiresStatement: false,
			aliases: ["notes"]
		},
		observation: {
			requiresStatement: false,
			aliases: ["obs"]
		},
		principle: {
			requiresStatement: true,
			aliases: []
		},
		problem: {
			requiresStatement: true,
			aliases: ["prob", "prb"]
		},
		project: {
			requiresStatement: false,
			aliases: []
		},
		proof: {
			requiresStatement: false,
			aliases: [
				"pf",
				"prf",
				"demo"
			]
		},
		proposition: {
			requiresStatement: true,
			aliases: [
				"prop",
				"pro",
				"prp",
				"props"
			]
		},
		question: {
			requiresStatement: true,
			aliases: [
				"qu",
				"ques",
				"quest",
				"qsn"
			]
		},
		remark: {
			requiresStatement: false,
			aliases: [
				"rem",
				"rmk",
				"rema",
				"bem",
				"subrem"
			]
		},
		task: {
			requiresStatement: true,
			aliases: []
		},
		technology: {
			requiresStatement: false,
			aliases: ["tech"]
		},
		theorem: {
			requiresStatement: true,
			aliases: [
				"thm",
				"theo",
				"theor",
				"thmss",
				"thrm"
			]
		},
		solution: {
			requiresStatement: false,
			aliases: ["sol"]
		},
		warning: {
			requiresStatement: false,
			aliases: ["warn", "wrn"]
		}
	}).flatMap(([env, spec]) => [[env, envFactory(env, { requiresStatementTag: spec.requiresStatement })], ...spec.aliases.map((name) => [name, envFactory(env, { requiresStatementTag: spec.requiresStatement })])]);
	return Object.fromEntries(exapandedEnvAliases);
}
environments$1["questions"], environments$1["parts"], environments$1["subparts"], environments$1["subsubparts"];
var EXAM_ITEM_MACROS = new Set([
	"question",
	"part",
	"subpart",
	"subsubpart"
]);
/**
* The default parser already runs `cleanEnumerateBody` on exam environments via the
* CTAN exam environment info. This means item macros like `\question[5] body` have
* their entire body (including the `[5]`) placed into `args[0]` with openMark:"".
*
* However, `\part` is also a document-division macro with signature `"s o m"` in the
* standard LaTeX2e macros. The parser attaches those args first (star, optional, mandatory),
* and then `cleanEnumerateBody` appends the remaining body as an additional arg.  So for
* `\part[3] First part`, the args are: [sArg, {openMark:"[", content:["3"]}, {openMark:"{",
* content:["First"]}, {openMark:"", content:[" part"]}].
*
* This function re-processes exam item macros to normalize them to a two-arg form:
*   args[0] = optional points arg (Argument with openMark:"[" if present, else empty)
*   args[1] = body content arg (Argument with openMark:"")
*/
function fixExamMacroArgs(tree) {
	visit(tree, (node) => {
		const macro = node;
		if (!EXAM_ITEM_MACROS.has(macro.content)) return;
		if (!macro.args || macro.args.length === 0) return;
		const lastArg = macro.args[macro.args.length - 1];
		if (macro.args.length >= 4 && macro.args[macro.args.length - 2].openMark === "{" && lastArg.openMark === "") {
			const pointsArg = macro.args[macro.args.length - 3];
			const mandatoryContent = macro.args[macro.args.length - 2].content;
			const bodyContent = lastArg.content;
			macro.args = [pointsArg, arg([...mandatoryContent, ...bodyContent], {
				openMark: "",
				closeMark: ""
			})];
			return;
		}
		if (macro.args.length !== 1 || lastArg.openMark !== "") return;
		const bodyContent = [...lastArg.content];
		const { args: parsedArgs } = gobbleArguments(bodyContent, "o");
		macro.args = [parsedArgs[0], arg(bodyContent, {
			openMark: "",
			closeMark: ""
		})];
	}, { test: match.anyMacro });
}
/**
* Extract the point value from an exam item macro's optional argument.
* Returns the trimmed string value, or undefined if no points were specified.
*/
function getPointsAttribute(node) {
	const pointsArg = getArgsContent(node)[0];
	if (pointsArg && pointsArg.length > 0) {
		const value = printRaw(pointsArg).trim();
		if (value) return { points: value };
	}
	return {};
}
/**
* Get the body content from an exam item macro (the last argument,
* attached by `cleanEnumerateBody`).
*/
function getItemBody(node) {
	if (!node.args || node.args.length === 0) return [];
	return node.args[node.args.length - 1].content;
}
function isWhitespaceLike(node) {
	return node.type === "whitespace" || node.type === "comment";
}
function isVfillMacro(node) {
	return match.macro(node, "vfill") || match.macro(node, "vfil");
}
function isVspaceMacro(node) {
	return match.macro(node, "vspace");
}
function getVspaceWorkspace(node) {
	const args = getArgsContent(node);
	for (let i = args.length - 1; i >= 0; i--) {
		const argContent = args[i];
		if (!argContent || argContent.length === 0) continue;
		const value = printRaw(argContent).trim();
		if (value) return value;
	}
}
function extractTrailingWorkspace(bodyNodes) {
	const remainingBody = [...bodyNodes];
	while (remainingBody.length > 0 && isWhitespaceLike(remainingBody[remainingBody.length - 1])) remainingBody.pop();
	const lastNode = remainingBody[remainingBody.length - 1];
	if (!lastNode) return { bodyNodes: remainingBody };
	if (isVfillMacro(lastNode)) {
		remainingBody.pop();
		trim(remainingBody);
		return {
			bodyNodes: remainingBody,
			workspace: "1in"
		};
	}
	if (isVspaceMacro(lastNode)) {
		const workspace = getVspaceWorkspace(lastNode);
		if (!workspace) return { bodyNodes: remainingBody };
		remainingBody.pop();
		trim(remainingBody);
		return {
			bodyNodes: remainingBody,
			workspace
		};
	}
	if (lastNode.type !== "string") return { bodyNodes: remainingBody };
	let index = remainingBody.length - 2;
	while (index >= 0 && isWhitespaceLike(remainingBody[index])) index--;
	const macroNode = remainingBody[index];
	if (!macroNode || !match.macro(macroNode, "vskip")) return { bodyNodes: remainingBody };
	const workspace = lastNode.content.trim();
	if (!workspace) return { bodyNodes: remainingBody };
	remainingBody.splice(index);
	trim(remainingBody);
	return {
		bodyNodes: remainingBody,
		workspace
	};
}
function getExamItemAttributes(node) {
	const pointsAttributes = getPointsAttribute(node);
	const { bodyNodes, workspace } = extractTrailingWorkspace(getItemBody(node));
	return {
		attributes: workspace ? {
			...pointsAttributes,
			workspace
		} : pointsAttributes,
		bodyNodes
	};
}
/**
* Tags that are solution-like (not part of the statement body).
* In PreTeXt, these are siblings of `<statement>`, not inside it.
*/
var SOLUTION_LIKE_TAGS = new Set([
	"html-tag:solution",
	"html-tag:answer",
	"html-tag:hint"
]);
function isSolutionLike(node) {
	return match.anyMacro(node) && SOLUTION_LIKE_TAGS.has(node.content);
}
/**
* Split body nodes into statement content (before any solution-like nodes)
* and the solution-like nodes themselves (solution, answer, hint).
*/
function splitStatementFromSolutions(bodyNodes) {
	const firstSolutionIdx = bodyNodes.findIndex(isSolutionLike);
	if (firstSolutionIdx === -1) return {
		statementNodes: bodyNodes,
		solutionNodes: []
	};
	return {
		statementNodes: bodyNodes.slice(0, firstSolutionIdx),
		solutionNodes: bodyNodes.filter(isSolutionLike)
	};
}
/**
* Check whether a node is a converted `<task>` html-like element.
*/
function isTaskNode(node) {
	return match.macro(node, "html-tag:task");
}
function isPageBreakNode(node) {
	return match.macro(node, "newpage") || match.macro(node, "clearpage");
}
/**
* Build a `<task>` element from an item macro (`\part` or `\subpart`).
* If the body contains converted sub-task nodes, the content before them
* becomes an `<introduction>` and the tasks follow directly.
* Otherwise the body is wrapped in a `<statement>`.
*/
function buildTask(itemMacro) {
	const { attributes, bodyNodes } = getExamItemAttributes(itemMacro);
	const firstTaskIndex = bodyNodes.findIndex(isTaskNode);
	if (firstTaskIndex === -1) {
		const { statementNodes, solutionNodes } = splitStatementFromSolutions(bodyNodes);
		return htmlLike({
			tag: "task",
			attributes,
			content: [htmlLike({
				tag: "statement",
				content: wrapPars(statementNodes)
			}), ...solutionNodes]
		});
	} else {
		const introNodes = bodyNodes.slice(0, firstTaskIndex);
		const taskNodes = bodyNodes.filter(isTaskNode);
		const content = [];
		trim(introNodes);
		if (introNodes.length > 0) content.push(htmlLike({
			tag: "introduction",
			content: wrapPars(introNodes)
		}));
		content.push(...taskNodes);
		return htmlLike({
			tag: "task",
			attributes,
			content
		});
	}
}
/**
* Convert a `subsubparts` environment to an array of `<task>` html-like nodes.
*/
function subsubpartsToTasks(env) {
	return env.content.filter((node) => match.macro(node, "subsubpart")).reduce((tasks, node) => {
		if (!match.macro(node) || !node.args) return tasks;
		const { attributes, bodyNodes } = getExamItemAttributes(node);
		tasks.push(htmlLike({
			tag: "task",
			attributes,
			content: [htmlLike({
				tag: "statement",
				content: wrapPars(bodyNodes)
			})]
		}));
		return tasks;
	}, []);
}
/**
* Convert a `subparts` environment to an array of `<task>` html-like nodes.
*/
function subpartsToTasks(env) {
	return env.content.filter((node) => match.macro(node, "subpart")).reduce((tasks, node) => {
		if (!match.macro(node) || !node.args) return tasks;
		tasks.push(buildTask(node));
		return tasks;
	}, []);
}
/**
* Convert a `parts` environment to an array of `<task>` html-like nodes.
*/
function partsToTasks(env) {
	return env.content.filter((node) => match.macro(node, "part")).reduce((tasks, node) => {
		if (!match.macro(node) || !node.args) return tasks;
		tasks.push(buildTask(node));
		return tasks;
	}, []);
}
/**
* Convert a `questions` environment to an `<exercises>` html-like node
* containing `<exercise>` elements.
*
* Each `\question` becomes an `<exercise>`. If the question body contains
* converted `<task>` nodes (from a nested `parts` environment), the content
* before them becomes an `<introduction>` and the tasks are placed directly
* inside the `<exercise>`. Otherwise the body is wrapped in a `<statement>`.
*/
function questionsToExercises(env, _info) {
	const titleArg = env.content.find((n) => match.macro(n, "title"))?.args?.find((a) => a.openMark === "{");
	const titleElement = titleArg && titleArg.content.length > 0 ? htmlLike({
		tag: "title",
		content: titleArg.content
	}) : void 0;
	function extractTrailingPageBreak(bodyNodes) {
		const remainingBody = [...bodyNodes];
		while (remainingBody.length > 0 && isWhitespaceLike(remainingBody[remainingBody.length - 1])) remainingBody.pop();
		const lastNode = remainingBody[remainingBody.length - 1];
		if (!lastNode || !isPageBreakNode(lastNode)) return {
			bodyNodes: remainingBody,
			breakAfter: false
		};
		remainingBody.pop();
		trim(remainingBody);
		return {
			bodyNodes: remainingBody,
			breakAfter: true
		};
	}
	function questionToExercise(node) {
		const { attributes, bodyNodes: rawBodyNodes } = getExamItemAttributes(node);
		const { bodyNodes, breakAfter } = extractTrailingPageBreak(rawBodyNodes);
		const firstTaskIndex = bodyNodes.findIndex(isTaskNode);
		let exerciseContent;
		if (firstTaskIndex === -1) {
			const { statementNodes, solutionNodes } = splitStatementFromSolutions(bodyNodes);
			exerciseContent = [htmlLike({
				tag: "statement",
				content: wrapPars(statementNodes)
			}), ...solutionNodes];
		} else {
			const introNodes = bodyNodes.slice(0, firstTaskIndex);
			const taskNodes = bodyNodes.filter(isTaskNode);
			exerciseContent = [];
			trim(introNodes);
			if (introNodes.length > 0) exerciseContent.push(htmlLike({
				tag: "introduction",
				content: wrapPars(introNodes)
			}));
			exerciseContent.push(...taskNodes);
		}
		return {
			exercise: htmlLike({
				tag: "exercise",
				attributes,
				content: exerciseContent
			}),
			breakAfter
		};
	}
	const convertedQuestions = env.content.reduce((items, node) => {
		if (!match.macro(node, "question") || !node.args) return items;
		items.push(questionToExercise(node));
		return items;
	}, []);
	if (!convertedQuestions.some((question) => question.breakAfter)) {
		const exercises = convertedQuestions.map((question) => question.exercise);
		return htmlLike({
			tag: "worksheet",
			content: titleElement ? [titleElement, ...exercises] : exercises
		});
	}
	const pages = [];
	let currentPageContent = [];
	const closePage = () => {
		pages.push(htmlLike({
			tag: "page",
			content: currentPageContent
		}));
		currentPageContent = [];
	};
	for (const question of convertedQuestions) {
		currentPageContent.push(question.exercise);
		if (question.breakAfter) closePage();
	}
	closePage();
	return htmlLike({
		tag: "worksheet",
		content: titleElement ? [titleElement, ...pages] : pages
	});
}
/**
* Environment replacement rules for the exam documentclass.
*/
var examEnvironmentReplacements = {
	questions: questionsToExercises,
	parts: partsToTasks,
	subparts: subpartsToTasks,
	subsubparts: subsubpartsToTasks
};
var katex_support_default = {
	KATEX_MACROS: [
		" ",
		"!",
		"\"",
		"#",
		"&",
		"'",
		"*",
		",",
		".",
		":",
		";",
		"=",
		">",
		"AA",
		"AE",
		"Alpha",
		"And",
		"Arrowvert",
		"Bbb",
		"Bbbk",
		"Beta",
		"Big",
		"Bigg",
		"Biggl",
		"Biggm",
		"Biggr",
		"Bigl",
		"Bigm",
		"Bigr",
		"Box",
		"Bra",
		"Bumpeq",
		"C",
		"Cap",
		"Chi",
		"Colonapprox",
		"Coloneq",
		"Coloneqq",
		"Colonsim",
		"Complex",
		"Coppa",
		"Cup",
		"Dagger",
		"Darr",
		"DeclareMathOperator",
		"Delta",
		"Diamond",
		"Digamma",
		"Doteq",
		"Downarrow",
		"Epsilon",
		"Eqcolon",
		"Eqqcolon",
		"Eta",
		"Finv",
		"Game",
		"Gamma",
		"H",
		"Harr",
		"Huge",
		"Im",
		"Iota",
		"Join",
		"KaTeX",
		"Kappa",
		"Ket",
		"Koppa",
		"L",
		"LARGE",
		"LaTeX",
		"Lambda",
		"Large",
		"Larr",
		"LeftArrow",
		"Leftarrow",
		"Leftrightarrow",
		"Lleftarrow",
		"Longleftarrow",
		"Longleftrightarrow",
		"Longrightarrow",
		"Lrarr",
		"Lsh",
		"Mu",
		"N",
		"Newextarrow",
		"Nu",
		"O",
		"OE",
		"Omega",
		"Omicron",
		"Overrightarrow",
		"P",
		"Phi",
		"Pi",
		"Pr",
		"Psi",
		"Q",
		"R",
		"Rarr",
		"Re",
		"Reals",
		"Rho",
		"Rightarrow",
		"Rrightarrow",
		"Rsh",
		"Rule",
		"S",
		"Sampi",
		"Sigma",
		"Space",
		"Stigma",
		"Subset",
		"Supset",
		"Tau",
		"TeX",
		"Theta",
		"Tiny",
		"Uarr",
		"Uparrow",
		"Updownarrow",
		"Upsilon",
		"Vdash",
		"Vert",
		"Vvdash",
		"Xi",
		"Z",
		"Zeta",
		"\\",
		"^",
		"_",
		"`",
		"aa",
		"above",
		"abovewithdelims",
		"acute",
		"add",
		"ae",
		"alef",
		"alefsym",
		"aleph",
		"allowbreak",
		"alpha",
		"amalg",
		"and",
		"ang",
		"angl",
		"angle",
		"angln",
		"approx",
		"approxcolon",
		"approxcoloncolon",
		"approxeq",
		"arccos",
		"arcctg",
		"arcsin",
		"arctan",
		"arctg",
		"arg",
		"argmax",
		"argmin",
		"array",
		"arraystretch",
		"arrowvert",
		"ast",
		"asymp",
		"atop",
		"atopwithdelims",
		"backepsilon",
		"backprime",
		"backsim",
		"backsimeq",
		"backslash",
		"bar",
		"barwedge",
		"bbox",
		"bcancel",
		"because",
		"begin",
		"begingroup",
		"beta",
		"beth",
		"between",
		"bf",
		"bfseries",
		"big",
		"bigcap",
		"bigcirc",
		"bigcup",
		"bigg",
		"biggl",
		"biggm",
		"biggr",
		"bigl",
		"bigm",
		"bigodot",
		"bigominus",
		"bigoplus",
		"bigoslash",
		"bigotimes",
		"bigr",
		"bigsqcap",
		"bigsqcup",
		"bigstar",
		"bigtriangledown",
		"bigtriangleup",
		"biguplus",
		"bigvee",
		"bigwedge",
		"binom",
		"blacklozenge",
		"blacksquare",
		"blacktriangle",
		"blacktriangledown",
		"blacktriangleleft",
		"blacktriangleright",
		"bm",
		"bmod",
		"bold",
		"boldsymbol",
		"bot",
		"bowtie",
		"boxdot",
		"boxed",
		"boxminus",
		"boxplus",
		"boxtimes",
		"bra",
		"brace",
		"bracevert",
		"brack",
		"braket",
		"breve",
		"buildrel",
		"bull",
		"bullet",
		"bumpeq",
		"cal",
		"cancel",
		"cancelto",
		"cap",
		"cases",
		"cdot",
		"cdotp",
		"cdots",
		"ce",
		"cee",
		"centerdot",
		"cf",
		"cfrac",
		"ch",
		"char",
		"check",
		"checkmark",
		"chi",
		"chk",
		"choose",
		"circ",
		"circeq",
		"circlearrowleft",
		"circlearrowright",
		"circledR",
		"circledS",
		"circledast",
		"circledcirc",
		"circleddash",
		"class",
		"cline",
		"clubs",
		"clubsuit",
		"cnums",
		"colon",
		"colonapprox",
		"coloncolon",
		"coloncolonapprox",
		"coloncolonequals",
		"coloncolonminus",
		"coloncolonsim",
		"coloneq",
		"coloneqq",
		"colonequals",
		"colonminus",
		"colonsim",
		"color",
		"colorbox",
		"complement",
		"cong",
		"coppa",
		"coprod",
		"copyright",
		"cos",
		"cosec",
		"cosh",
		"cot",
		"cotg",
		"coth",
		"cr",
		"csc",
		"cssId",
		"ctg",
		"cth",
		"cup",
		"curlyeqprec",
		"curlyeqsucc",
		"curlyvee",
		"curlywedge",
		"curvearrowleft",
		"curvearrowright",
		"dArr",
		"dag",
		"dagger",
		"daleth",
		"darr",
		"dashleftarrow",
		"dashrightarrow",
		"dashv",
		"dbinom",
		"dblcolon",
		"ddag",
		"ddagger",
		"ddddot",
		"dddot",
		"ddot",
		"ddots",
		"def",
		"definecolor",
		"deg",
		"degree",
		"delta",
		"det",
		"dfrac",
		"diagdown",
		"diagup",
		"diamond",
		"diamonds",
		"diamondsuit",
		"digamma",
		"dim",
		"displaylines",
		"displaystyle",
		"div",
		"divideontimes",
		"dot",
		"doteq",
		"doteqdot",
		"dotplus",
		"dots",
		"dotsb",
		"dotsc",
		"dotsi",
		"dotsm",
		"dotso",
		"doublebarwedge",
		"doublecap",
		"doublecup",
		"downarrow",
		"downdownarrows",
		"downharpoonleft",
		"downharpoonright",
		"edef",
		"ell",
		"else",
		"em",
		"emph",
		"empty",
		"emptyset",
		"enclose",
		"end",
		"endgroup",
		"enspace",
		"epsilon",
		"eqalign",
		"eqalignno",
		"eqcirc",
		"eqcolon",
		"eqqcolon",
		"eqref",
		"eqsim",
		"eqslantgtr",
		"eqslantless",
		"equalscolon",
		"equalscoloncolon",
		"equiv",
		"eta",
		"eth",
		"euro",
		"exist",
		"exists",
		"exp",
		"expandafter",
		"fallingdotseq",
		"fbox",
		"fcolorbox",
		"fi",
		"flat",
		"foo",
		"footnotesize",
		"forall",
		"frac",
		"frak",
		"frown",
		"futurelet",
		"gamma",
		"gcd",
		"gdef",
		"ge",
		"geneuro",
		"geneuronarrow",
		"geneurowide",
		"genfrac",
		"geq",
		"geqq",
		"geqslant",
		"gets",
		"gg",
		"ggg",
		"gggtr",
		"gimel",
		"global",
		"gnapprox",
		"gneq",
		"gneqq",
		"gnsim",
		"grave",
		"greet",
		"gt",
		"gtrapprox",
		"gtrdot",
		"gtreqless",
		"gtreqqless",
		"gtrless",
		"gtrsim",
		"gvertneqq",
		"hArr",
		"hail",
		"harr",
		"hat",
		"hbar",
		"hbox",
		"hdashline",
		"hearts",
		"heartsuit",
		"hfil",
		"hfill",
		"hline",
		"hom",
		"hookleftarrow",
		"hookrightarrow",
		"hphantom",
		"href",
		"hskip",
		"hslash",
		"hspace",
		"htmlClass",
		"htmlData",
		"htmlId",
		"htmlStyle",
		"huge",
		"i",
		"iddots",
		"idotsint",
		"if",
		"iff",
		"ifmode",
		"ifx",
		"iiiint",
		"iiint",
		"iint",
		"image",
		"imageof",
		"imath",
		"impliedby",
		"implies",
		"in",
		"includegraphics",
		"inf",
		"infin",
		"infty",
		"injlim",
		"int",
		"intercal",
		"intop",
		"iota",
		"isin",
		"it",
		"itshape",
		"j",
		"jmath",
		"kappa",
		"ker",
		"kern",
		"ket",
		"koppa",
		"l",
		"lArr",
		"lBrace",
		"lVert",
		"label",
		"lambda",
		"land",
		"lang",
		"langle",
		"large",
		"larr",
		"lbrace",
		"lbrack",
		"lceil",
		"ldotp",
		"ldots",
		"le",
		"leadsto",
		"left",
		"leftarrow",
		"leftarrowtail",
		"leftharpoondown",
		"leftharpoonup",
		"leftleftarrows",
		"leftrightarrow",
		"leftrightarrows",
		"leftrightharpoons",
		"leftrightsquigarrow",
		"leftroot",
		"leftthreetimes",
		"leq",
		"leqalignno",
		"leqq",
		"leqslant",
		"lessapprox",
		"lessdot",
		"lesseqgtr",
		"lesseqqgtr",
		"lessgtr",
		"lesssim",
		"let",
		"lfloor",
		"lg",
		"lgroup",
		"lhd",
		"lim",
		"liminf",
		"limits",
		"limsup",
		"ll",
		"llap",
		"llbracket",
		"llcorner",
		"lll",
		"llless",
		"lmoustache",
		"ln",
		"lnapprox",
		"lneq",
		"lneqq",
		"lnot",
		"lnsim",
		"log",
		"long",
		"longleftarrow",
		"longleftrightarrow",
		"longmapsto",
		"longrightarrow",
		"looparrowleft",
		"looparrowright",
		"lor",
		"lower",
		"lozenge",
		"lparen",
		"lq",
		"lrArr",
		"lrarr",
		"lrcorner",
		"lt",
		"ltimes",
		"lvert",
		"lvertneqq",
		"maltese",
		"mapsto",
		"mathbb",
		"mathbf",
		"mathbin",
		"mathcal",
		"mathchoice",
		"mathclap",
		"mathclose",
		"mathellipsis",
		"mathfrak",
		"mathinner",
		"mathit",
		"mathllap",
		"mathnormal",
		"mathop",
		"mathopen",
		"mathord",
		"mathpunct",
		"mathrel",
		"mathring",
		"mathrlap",
		"mathrm",
		"mathscr",
		"mathsf",
		"mathsterling",
		"mathstrut",
		"mathtip",
		"mathtt",
		"matrix",
		"max",
		"mbox",
		"md",
		"mdseries",
		"measuredangle",
		"medspace",
		"mho",
		"mid",
		"middle",
		"min",
		"minuscolon",
		"minuscoloncolon",
		"minuso",
		"mit",
		"mkern",
		"mmlToken",
		"mod",
		"models",
		"moveleft",
		"moveright",
		"mp",
		"mskip",
		"mspace",
		"mu",
		"multicolumn",
		"multimap",
		"nLeftarrow",
		"nLeftrightarrow",
		"nRightarrow",
		"nVDash",
		"nVdash",
		"nabla",
		"natnums",
		"natural",
		"ncong",
		"ne",
		"nearrow",
		"neg",
		"negmedspace",
		"negthickspace",
		"negthinspace",
		"neq",
		"newcommand",
		"newenvironment",
		"newline",
		"nexists",
		"ngeq",
		"ngeqq",
		"ngeqslant",
		"ngtr",
		"ni",
		"nleftarrow",
		"nleftrightarrow",
		"nleq",
		"nleqq",
		"nleqslant",
		"nless",
		"nmid",
		"nobreak",
		"nobreakspace",
		"noexpand",
		"nolimits",
		"nonumber",
		"normalfont",
		"normalsize",
		"not",
		"notag",
		"notin",
		"notni",
		"nparallel",
		"nprec",
		"npreceq",
		"nrightarrow",
		"nshortmid",
		"nshortparallel",
		"nsim",
		"nsubseteq",
		"nsubseteqq",
		"nsucc",
		"nsucceq",
		"nsupseteq",
		"nsupseteqq",
		"ntriangleleft",
		"ntrianglelefteq",
		"ntriangleright",
		"ntrianglerighteq",
		"nu",
		"nvDash",
		"nvdash",
		"nwarrow",
		"o",
		"odot",
		"oe",
		"officialeuro",
		"oiiint",
		"oiint",
		"oint",
		"oldstyle",
		"omega",
		"omicron",
		"ominus",
		"operatorname",
		"operatornamewithlimits",
		"oplus",
		"or",
		"origof",
		"oslash",
		"otimes",
		"over",
		"overbrace",
		"overbracket",
		"overgroup",
		"overleftarrow",
		"overleftharpoon",
		"overleftrightarrow",
		"overline",
		"overlinesegment",
		"overparen",
		"overrightarrow",
		"overrightharpoon",
		"overset",
		"overwithdelims",
		"owns",
		"pagecolor",
		"parallel",
		"part",
		"partial",
		"perp",
		"phantom",
		"phase",
		"phi",
		"pi",
		"pitchfork",
		"plim",
		"plusmn",
		"pm",
		"pmatrix",
		"pmb",
		"pmod",
		"pod",
		"pounds",
		"prec",
		"precapprox",
		"preccurlyeq",
		"preceq",
		"precnapprox",
		"precneqq",
		"precnsim",
		"precsim",
		"prime",
		"prod",
		"projlim",
		"propto",
		"providecommand",
		"psi",
		"pu",
		"qquad",
		"quad",
		"r",
		"rArr",
		"rBrace",
		"rVert",
		"raise",
		"raisebox",
		"rang",
		"rangle",
		"rarr",
		"ratio",
		"rbrace",
		"rbrack",
		"rceil",
		"real",
		"reals",
		"ref",
		"relax",
		"renewcommand",
		"renewenvironment",
		"require",
		"restriction",
		"rfloor",
		"rgroup",
		"rhd",
		"rho",
		"right",
		"rightarrow",
		"rightarrowtail",
		"rightharpoondown",
		"rightharpoonup",
		"rightleftarrows",
		"rightleftharpoons",
		"rightrightarrows",
		"rightsquigarrow",
		"rightthreetimes",
		"risingdotseq",
		"rlap",
		"rm",
		"rmoustache",
		"root",
		"rotatebox",
		"rparen",
		"rq",
		"rrbracket",
		"rtimes",
		"rule",
		"rvert",
		"sampi",
		"sc",
		"scalebox",
		"scr",
		"scriptscriptstyle",
		"scriptsize",
		"scriptstyle",
		"sdot",
		"searrow",
		"sec",
		"sect",
		"setlength",
		"setminus",
		"sf",
		"sh",
		"sharp",
		"shortmid",
		"shortparallel",
		"shoveleft",
		"shoveright",
		"sideset",
		"sigma",
		"sim",
		"simcolon",
		"simcoloncolon",
		"simeq",
		"sin",
		"sinh",
		"sixptsize",
		"skew",
		"skip",
		"sl",
		"small",
		"smallfrown",
		"smallint",
		"smallsetminus",
		"smallsmile",
		"smash",
		"smile",
		"smiley",
		"sout",
		"space",
		"spades",
		"spadesuit",
		"sphericalangle",
		"sqcap",
		"sqcup",
		"sqrt",
		"sqsubset",
		"sqsubseteq",
		"sqsupset",
		"sqsupseteq",
		"square",
		"ss",
		"stackrel",
		"star",
		"stigma",
		"strut",
		"style",
		"sub",
		"sube",
		"subset",
		"subseteq",
		"subseteqq",
		"subsetneq",
		"subsetneqq",
		"substack",
		"succ",
		"succapprox",
		"succcurlyeq",
		"succeq",
		"succnapprox",
		"succneqq",
		"succnsim",
		"succsim",
		"sum",
		"sup",
		"supe",
		"supset",
		"supseteq",
		"supseteqq",
		"supsetneq",
		"supsetneqq",
		"surd",
		"swarrow",
		"tag",
		"tan",
		"tanh",
		"tau",
		"tbinom",
		"text",
		"textasciicircum",
		"textasciitilde",
		"textbackslash",
		"textbar",
		"textbardbl",
		"textbf",
		"textbraceleft",
		"textbraceright",
		"textcircled",
		"textcolor",
		"textdagger",
		"textdaggerdbl",
		"textdegree",
		"textdollar",
		"textellipsis",
		"textemdash",
		"textendash",
		"textgreater",
		"textit",
		"textless",
		"textmd",
		"textnormal",
		"textquotedblleft",
		"textquotedblright",
		"textquoteleft",
		"textquoteright",
		"textregistered",
		"textrm",
		"textsc",
		"textsf",
		"textsl",
		"textsterling",
		"textstyle",
		"texttip",
		"texttt",
		"textunderscore",
		"textup",
		"textvisiblespace",
		"tfrac",
		"tg",
		"th",
		"therefore",
		"theta",
		"thetasym",
		"thickapprox",
		"thicksim",
		"thickspace",
		"thinspace",
		"tilde",
		"times",
		"tiny",
		"to",
		"toggle",
		"top",
		"triangle",
		"triangledown",
		"triangleleft",
		"trianglelefteq",
		"triangleq",
		"triangleright",
		"trianglerighteq",
		"tt",
		"twoheadleftarrow",
		"twoheadrightarrow",
		"u",
		"uArr",
		"uarr",
		"ulcorner",
		"underbar",
		"underbrace",
		"underbracket",
		"undergroup",
		"underleftarrow",
		"underleftrightarrow",
		"underline",
		"underlinesegment",
		"underparen",
		"underrightarrow",
		"underset",
		"unicode",
		"unlhd",
		"unrhd",
		"up",
		"uparrow",
		"updownarrow",
		"upharpoonleft",
		"upharpoonright",
		"uplus",
		"uproot",
		"upshape",
		"upsilon",
		"upuparrows",
		"urcorner",
		"url",
		"utilde",
		"v",
		"vDash",
		"varDelta",
		"varGamma",
		"varLambda",
		"varOmega",
		"varPhi",
		"varPi",
		"varPsi",
		"varSigma",
		"varTheta",
		"varUpsilon",
		"varXi",
		"varcoppa",
		"varepsilon",
		"varinjlim",
		"varkappa",
		"varliminf",
		"varlimsup",
		"varnothing",
		"varphi",
		"varpi",
		"varprojlim",
		"varpropto",
		"varrho",
		"varsigma",
		"varstigma",
		"varsubsetneq",
		"varsubsetneqq",
		"varsupsetneq",
		"varsupsetneqq",
		"vartheta",
		"vartriangle",
		"vartriangleleft",
		"vartriangleright",
		"vcentcolon",
		"vcenter",
		"vdash",
		"vdots",
		"vec",
		"vee",
		"veebar",
		"vert",
		"vfil",
		"vfill",
		"vline",
		"vphantom",
		"wedge",
		"weierp",
		"widecheck",
		"widehat",
		"wideparen",
		"widetilde",
		"wp",
		"wr",
		"xLeftarrow",
		"xLeftrightarrow",
		"xRightarrow",
		"xcancel",
		"xdef",
		"xhookleftarrow",
		"xhookrightarrow",
		"xi",
		"xleftarrow",
		"xleftharpoondown",
		"xleftharpoonup",
		"xleftrightarrow",
		"xleftrightharpoons",
		"xlongequal",
		"xmapsto",
		"xrightarrow",
		"xrightharpoondown",
		"xrightharpoonup",
		"xrightleftharpoons",
		"xtofrom",
		"xtwoheadleftarrow",
		"xtwoheadrightarrow",
		"yen",
		"zeta",
		"{",
		"|",
		"}",
		"~"
	],
	KATEX_ENVIRONMENTS: [
		"align",
		"align*",
		"alignat",
		"alignat*",
		"aligned",
		"alignedat",
		"array",
		"Bmatrix",
		"bmatrix",
		"Bmatrix*",
		"bmatrix*",
		"cases",
		"CD",
		"darray",
		"dcases",
		"drcases",
		"equation",
		"equation*",
		"gather",
		"gathered",
		"matrix",
		"matrix*",
		"pmatrix",
		"pmatrix*",
		"rcases",
		"smallmatrix",
		"split",
		"Vmatrix",
		"vmatrix",
		"Vmatrix*",
		"vmatrix*"
	]
};
//#endregion
//#region libs/pre-conversion-subs/katex-subs.ts
var LEFT = {
	type: "macro",
	content: "left"
};
var RIGHT = {
	type: "macro",
	content: "right"
};
var DEFAULT_LEFT_DELIM = {
	type: "macro",
	content: "{"
};
var DEFAULT_RIGHT_DELIM = {
	type: "string",
	content: "."
};
var mathjaxSpecificMacroReplacements = {
	systeme: (node) => {
		try {
			const args = getArgsContent(node);
			const whitelistedVariables = args[1] || void 0;
			const ret = systemeContentsToArray(args[3] || [], {
				properSpacing: false,
				whitelistedVariables
			});
			if (node?._renderInfo?.sysdelims) {
				const [frontDelim, backDelim] = node._renderInfo?.sysdelims;
				return [
					LEFT,
					...frontDelim || [],
					ret,
					RIGHT,
					...backDelim || []
				];
			}
			return [
				LEFT,
				DEFAULT_LEFT_DELIM,
				ret,
				RIGHT,
				DEFAULT_RIGHT_DELIM
			];
		} catch (e) {
			return node;
		}
	},
	sysdelim: () => []
};
var mathjaxSpecificEnvironmentReplacements = {};
/**
* Attach `renderInfo` needed for converting some macros into their
* mathjax equivalents.
*/
function attachNeededRenderInfo(ast) {
	attachSystemeSettingsAsRenderInfo(ast);
}
var KATEX_SUPPORT = {
	macros: katex_support_default["KATEX_MACROS"],
	environments: katex_support_default["KATEX_ENVIRONMENTS"]
};
//#endregion
//#region libs/pre-conversion-subs/macro-subs.ts
/**
* Factory function that generates html-like macros that wrap their contents.
* warningMessage is a warning for any latex macros that don't have an equivalent
* pretext tag.
*/
function factory$1(tag, warningMessage = "", attributes) {
	return (macro, info, file) => {
		if (!macro.args) throw new Error(`Found macro to replace but couldn't find content ${printRaw(macro)}`);
		if (warningMessage && file) {
			const message = makeWarningMessage(macro, `Warning: There is no equivalent tag for \"${macro.content}\", \"${tag}\" was used as a replacement.`, "macro-subs");
			file.message(message, message.place, message.source);
		}
		const args = getArgsContent(macro);
		return htmlLike({
			tag,
			content: args[args.length - 1] || [],
			attributes
		});
	};
}
function createHeading(tag, attrs = {}) {
	return (macro) => {
		const args = getArgsContent(macro);
		const attributes = {};
		if (attrs) Object.assign(attributes, attrs);
		return htmlLike({
			tag,
			content: args[args.length - 1] || [],
			attributes
		});
	};
}
var macroReplacements = {
	emph: factory$1("em"),
	textrm: factory$1("em", `Warning: There is no equivalent tag for \"textrm\", \"em\" was used as a replacement.`),
	textsf: factory$1("em", `Warning: There is no equivalent tag for \"textsf\", \"em\" was used as a replacement.`),
	texttt: factory$1("em", `Warning: There is no equivalent tag for \"textsf\", \"em\" was used as a replacement.`),
	textsl: factory$1("em", `Warning: There is no equivalent tag for \"textsl\", \"em\" was used as a replacement.`),
	textit: factory$1("em"),
	textbf: factory$1("alert"),
	term: factory$1("term"),
	underline: factory$1("em", `Warning: There is no equivalent tag for \"underline\", \"em\" was used as a replacement.`),
	mbox: emptyStringWithWarningFactory(`Warning: There is no equivalent tag for \"mbox\", an empty Ast.String was used as a replacement.`),
	phantom: emptyStringWithWarningFactory(`Warning: There is no equivalent tag for \"phantom\", an empty Ast.String was used as a replacement.`),
	appendix: createHeading("appendix"),
	url: (node) => {
		const url = printRaw(getArgsContent(node)[0] || "#");
		return htmlLike({
			tag: "url",
			attributes: { href: url },
			content: [{
				type: "string",
				content: url
			}]
		});
	},
	href: (node) => {
		const args = getArgsContent(node);
		return htmlLike({
			tag: "url",
			attributes: { href: printRaw(args[1] || "#") },
			content: args[2] || []
		});
	},
	hyperref: (node) => {
		const args = getArgsContent(node);
		return htmlLike({
			tag: "url",
			attributes: { href: "#" + printRaw(args[0] || "") },
			content: args[1] || []
		});
	},
	ref: (node) => {
		return htmlLike({
			tag: "xref",
			attributes: { ref: sanitizeXmlId(printRaw(getArgsContent(node)[1] || "")) || "" }
		});
	},
	eqref: (node) => {
		return htmlLike({
			tag: "xref",
			attributes: { ref: sanitizeXmlId(printRaw(getArgsContent(node)[0] || "")) || "" }
		});
	},
	cref: (node) => {
		return htmlLike({
			tag: "xref",
			attributes: { ref: sanitizeXmlId(printRaw(getArgsContent(node)[1] || "")) || "" }
		});
	},
	Cref: (node) => {
		return htmlLike({
			tag: "xref",
			attributes: { ref: sanitizeXmlId(printRaw(getArgsContent(node)[1] || "")) || "" }
		});
	},
	cite: (node) => {
		return htmlLike({
			tag: "xref",
			attributes: { ref: sanitizeXmlId(printRaw(getArgsContent(node)[1] || "")) || "" }
		});
	},
	index: (node) => {
		return htmlLike({
			tag: "idx",
			content: htmlLike({
				tag: "h",
				content: getArgsContent(node)[0] || []
			})
		});
	},
	"\\": emptyStringWithWarningFactory(`Warning: There is no equivalent tag for \"\\\", an empty Ast.String was used as a replacement.`),
	vspace: emptyStringWithWarningFactory(`Warning: There is no equivalent tag for \"vspace\", an empty Ast.String was used as a replacement.`),
	hspace: emptyStringWithWarningFactory(`Warning: There is no equivalent tag for \"hspace\", an empty Ast.String was used as a replacement.`),
	textcolor: factory$1("em", `Warning: There is no equivalent tag for \"textcolor\", \"em\" was used as a replacement.`),
	textsize: emptyStringWithWarningFactory(`Warning: There is no equivalent tag for \"textsize\", an empty Ast.String was used as a replacement.`),
	makebox: emptyStringWithWarningFactory(`Warning: There is no equivalent tag for \"makebox\", an empty Ast.String was used as a replacement.`),
	noindent: emptyStringWithWarningFactory(`Warning: There is no equivalent tag for \"noindent\", an empty Ast.String was used as a replacement.`),
	latex: (node) => {
		return htmlLike({ tag: "latex" });
	},
	latexe: (node) => {
		return htmlLike({ tag: "latex" });
	},
	today: (node) => {
		return htmlLike({ tag: "today" });
	},
	tex: (node) => {
		return htmlLike({ tag: "tex" });
	},
	eg: () => htmlLike({ tag: "eg" }),
	ie: () => htmlLike({ tag: "ie" }),
	etc: () => htmlLike({ tag: "etc" }),
	XeTeX: () => htmlLike({ tag: "xetex" }),
	XeLaTeX: () => htmlLike({ tag: "xelatex" }),
	LuaTeX: () => htmlLike({ tag: "luatex" }),
	PreTeXt: () => htmlLike({ tag: "pretext" }),
	PreFigure: () => htmlLike({ tag: "prefigure" }),
	AD: () => htmlLike({ tag: "ad" }),
	BC: () => htmlLike({ tag: "bc" }),
	AM: () => htmlLike({ tag: "am" }),
	PM: () => htmlLike({ tag: "pm" }),
	nb: () => htmlLike({ tag: "nb" }),
	ps: () => htmlLike({ tag: "ps" }),
	vs: () => htmlLike({ tag: "vs" }),
	viz: () => htmlLike({ tag: "viz" }),
	etal: () => htmlLike({ tag: "etal" }),
	circa: () => htmlLike({ tag: "ca" }),
	ca: () => htmlLike({ tag: "ca" }),
	timeofday: () => htmlLike({ tag: "timeofday" }),
	code: factory$1("c"),
	lstinline: factory$1("c"),
	fn: factory$1("fn"),
	footnote: factory$1("fn"),
	q: factory$1("q"),
	sq: factory$1("sq"),
	enquote: factory$1("q"),
	enquotestar: factory$1("sq"),
	abbr: factory$1("abbr"),
	ac: factory$1("acro"),
	acro: factory$1("acro"),
	init: factory$1("init"),
	foreign: factory$1("foreign"),
	foreignlanguage: factory$1("foreign"),
	booktitle: factory$1("pubtitle"),
	pubtitle: factory$1("pubtitle"),
	articletitle: factory$1("articletitle"),
	xmltag: factory$1("tag"),
	xmlattr: factory$1("attr"),
	taxon: factory$1("taxon"),
	kbd: factory$1("kbd"),
	icon: factory$1("icon"),
	fillin: () => htmlLike({ tag: "fillin" }),
	sout: factory$1("delete"),
	insert: factory$1("insert"),
	stale: factory$1("stale"),
	mdash: () => htmlLike({ tag: "mdash" }),
	ndash: () => htmlLike({ tag: "ndash" }),
	nbsp: () => htmlLike({ tag: "nbsp" }),
	P: () => htmlLike({ tag: "pilcrow" }),
	S: () => htmlLike({ tag: "section-mark" }),
	copyright: () => htmlLike({ tag: "copyright" }),
	registered: () => htmlLike({ tag: "registered" }),
	trademark: () => htmlLike({ tag: "trademark" }),
	degree: () => htmlLike({ tag: "degree" }),
	textdegree: () => htmlLike({ tag: "degree" }),
	dagger: () => htmlLike({ tag: "dagger" }),
	ddagger: () => htmlLike({ tag: "dagger" }),
	ldots: () => htmlLike({ tag: "ellipsis" }),
	dots: () => htmlLike({ tag: "ellipsis" }),
	textpm: () => htmlLike({ tag: "plusminus" }),
	textregistered: () => htmlLike({ tag: "registered" }),
	texttrademark: () => htmlLike({ tag: "trademark" }),
	textsection: () => htmlLike({ tag: "section-mark" }),
	textpilcrow: () => htmlLike({ tag: "pilcrow" }),
	textperiodcentered: () => htmlLike({ tag: "midpoint" }),
	texttildelow: () => htmlLike({ tag: "swungdash" }),
	textperthousand: () => htmlLike({ tag: "permille" }),
	includegraphics: (node) => {
		const args = getArgsContent(node);
		return htmlLike({
			tag: "image",
			attributes: { source: printRaw(args[args.length - 1] || []) },
			content: []
		});
	},
	caption: (node, parent) => {
		const args = getArgsContent(node);
		const captionText = getNamedArgsContent(node)["captionText"] || args[args.length - 1] || [];
		return htmlLike({
			tag: parent?.parents?.some((ancestor) => ancestor.type === "macro" && ancestor.content === "html-tag:table") ?? false ? "title" : "caption",
			content: captionText
		});
	}
};
//#endregion
//#region libs/pre-conversion-subs/streaming-command-subs.ts
/**
* Factory function that generates a macro with bound arguments.
*
* e.g.
* ```
* factory("foo")("bar") -> `\foo{bar}`
* ```
*
* ```
* factory("foo", "baz")("bar") -> `\foo{baz}{bar}`
* ```
*/
function factory(macroName, ...boundArgs) {
	return (content, originalCommand) => {
		return m(macroName, boundArgs.map((a) => arg(a)).concat(arg(content)));
	};
}
var streamingMacroReplacements = {
	color: colorToTextcolorMacro,
	bfseries: factory("textbf"),
	itshape: factory("textit"),
	rmfamily: factory("textrm"),
	scshape: factory("textsc"),
	sffamily: factory("textsf"),
	slshape: factory("textsl"),
	ttfamily: factory("texttt"),
	Huge: factory("textsize", "Huge"),
	huge: factory("textsize", "huge"),
	LARGE: factory("textsize", "LARGE"),
	Large: factory("textsize", "Large"),
	large: factory("textsize", "large"),
	normalsize: factory("textsize", "normalsize"),
	small: factory("textsize", "small"),
	footnotesize: factory("textsize", "footnotesize"),
	scriptsize: factory("textsize", "scriptsize"),
	tiny: factory("textsize", "tiny")
};
//#endregion
//#region libs/unified-latex-wrap-pars.ts
/**
* Unified plugin to wrap paragraphs in `\html-tag:p{...}` macros.
* Because `-` and `:` cannot occur in regular macros, there is no risk of
* a conflict.
*/
var unifiedLatexWrapPars = function unifiedLatexWrapPars(options) {
	const { macrosThatBreakPars, environmentsThatDontBreakPars } = options || {};
	return (tree) => {
		let hasDocumentEnv = false;
		visit(tree, (env) => {
			if (match.environment(env, "document") || isMappedEnviron(env)) {
				if (match.environment(env, "document")) hasDocumentEnv = true;
				env.content = wrapPars(env.content, {
					macrosThatBreakPars,
					environmentsThatDontBreakPars
				});
			}
		}, { test: match.anyEnvironment });
		if (!hasDocumentEnv) tree.content = wrapPars(tree.content, {
			macrosThatBreakPars,
			environmentsThatDontBreakPars
		});
	};
};
//#endregion
//#region libs/pre-conversion-subs/report-unsupported-macro-mathjax.ts
/**
* Return a list of macros used in ast that are unsupported by KaTeX
*/
function reportMacrosUnsupportedByMathjax(ast) {
	const unsupported = { messages: [] };
	const isSupported = match.createMacroMatcher(KATEX_SUPPORT.macros);
	visit(ast, (node, info) => {
		if (anyMacro(node) && info.context.hasMathModeAncestor) {
			if (!isSupported(node)) unsupported.messages.push(makeWarningMessage(node, `Warning: \"${node.content}\" is unsupported by Katex.`, "report-unsupported-macro-katex"));
		}
	});
	return unsupported;
}
//#endregion
//#region libs/unified-latex-plugin-to-pretext-like.ts
/**
* Unified plugin to convert a `unified-latex` AST into an html-like AST. This replaces nodes
* with html-like macros `\html-tag:p{...}`, etc. macros. It is a step along the way to converting to HTML.
* **It is unlikely you want to use this plugin directly**.
*
* Note: this plugin only wraps paragraphs in `p` tags if there are multiple paragraphs. Otherwise it omits the <p> tags.
*/
var unifiedLatexToPretextLike = function unifiedLatexToHtmlLike(options) {
	const macroReplacements$1 = Object.assign({}, macroReplacements, options?.macroReplacements || {});
	const environmentReplacements$1 = Object.assign({}, environmentReplacements, examEnvironmentReplacements, options?.environmentReplacements || {});
	const producePretextFragment = options?.producePretextFragment ? options?.producePretextFragment : false;
	const isReplaceableMacro = match.createMacroMatcher(macroReplacements$1);
	const isReplaceableEnvironment = match.createEnvironmentMatcher(environmentReplacements$1);
	const isMathjaxMacro = match.createMacroMatcher(mathjaxSpecificMacroReplacements);
	const isMathjaxEnvironment = match.createEnvironmentMatcher(mathjaxSpecificEnvironmentReplacements);
	return (tree, file) => {
		const originalTree = tree;
		deleteComments(tree);
		let processor = unified().use(unifiedLatexLintNoTexFontShapingCommands, { fix: true }).use(unifiedLatexReplaceStreamingCommands, { replacers: streamingMacroReplacements });
		const warningMessages = breakOnBoundaries(tree);
		for (const warningMessage of warningMessages.messages) file.message(warningMessage, warningMessage.place, "unified-latex-to-pretext:break-on-boundaries");
		attachAdditionalAttributes(tree);
		if (shouldBeWrappedInPars(tree)) processor = processor.use(unifiedLatexWrapPars);
		tree = processor.runSync(tree, file);
		replaceNode(tree, (node, info) => {
			if (info.context.hasMathModeAncestor) return;
			if (isReplaceableEnvironment(node)) return environmentReplacements$1[printRaw(node.env)](node, info, file);
		});
		replaceNode(tree, (node, info) => {
			if (info.context.hasMathModeAncestor) return;
			if (isReplaceableMacro(node)) return macroReplacements$1[node.content](node, info, file);
		});
		const unsupportedByMathjax = reportMacrosUnsupportedByMathjax(tree);
		for (const warningMessage of unsupportedByMathjax.messages) file.message(warningMessage, warningMessage.place, "unified-latex-to-pretext:report-unsupported-macro-mathjax");
		attachNeededRenderInfo(tree);
		replaceNode(tree, (node) => {
			if (isMathjaxMacro(node)) return mathjaxSpecificMacroReplacements[node.content](node);
			if (isMathjaxEnvironment(node)) return mathjaxSpecificEnvironmentReplacements[printRaw(node.env)](node);
		});
		if (!producePretextFragment) {
			createValidPretextDoc(tree);
			tree.content = [htmlLike({
				tag: "pretext",
				content: tree.content
			})];
		}
		originalTree.content = tree.content;
	};
};
/**
* Does the content contain multiple paragraphs? If so, it should be wrapped in `p` tags.
*/
function shouldBeWrappedInPars(tree) {
	let content = tree.content;
	visit(tree, (env) => {
		if (match.anyEnvironment(env)) {
			content = env.content;
			return EXIT;
		}
	}, { test: (node) => match.environment(node, "document") });
	return containsPar(content);
}
function containsPar(content) {
	return content.some((node) => {
		if (isMappedEnviron(node)) return containsPar(node.content);
		return match.parbreak(node) || match.macro(node, "par");
	});
}
/**
* Wrap the tree content in a book or article tag.
*/
function createValidPretextDoc(tree) {
	let isBook = false;
	const docClass = findMacro(tree, "documentclass");
	if (docClass) {
		const docClassArg = getArgsContent(docClass)[0];
		if (docClassArg) {
			const docClassTitle = docClassArg[0];
			if (docClassTitle.content == "book" || docClassTitle.content == "memoir") isBook = true;
		}
	}
	if (!isBook) visit(tree, (node) => {
		if (anyEnvironment(node) && node.env == "_chapter") {
			isBook = true;
			return EXIT;
		}
	});
	const title = findMacro(tree, "title");
	if (title) {
		const titleArg = getArgsContent(title)[1];
		if (titleArg) {
			tree.content.unshift(htmlLike({
				tag: "title",
				content: titleArg
			}));
			replaceNode(tree, (node) => {
				if (node === title) return [];
			});
		} else tree.content.unshift(htmlLike({
			tag: "title",
			content: s("")
		}));
	} else tree.content.unshift(htmlLike({
		tag: "title",
		content: s("")
	}));
	if (isBook) tree.content = [htmlLike({
		tag: "book",
		content: tree.content
	})];
	else tree.content = [htmlLike({
		tag: "article",
		content: tree.content
	})];
}
/**
* Look for nearby macros such as \label and attach their content as an additional attribute to the parent's renderInfo.
*
* @param tree
*/
function attachAdditionalAttributes(tree) {
	replaceNode(tree, (node, info) => {
		if (match.macro(node, "label")) {
			const args = getArgsContent(node);
			const labelContent = args[args.length - 1];
			if (labelContent) {
				const renderInfo = info.parents[0]?._renderInfo ?? {};
				if (renderInfo) {
					renderInfo.additionalAttributes = renderInfo.additionalAttributes ?? {};
					renderInfo.additionalAttributes["xml:id"] = sanitizeXmlId(printRaw(labelContent));
					info.parents[0]._renderInfo = renderInfo;
				}
			}
			return null;
		}
	});
}
function findMacro(tree, content) {
	let macro = null;
	visit(tree, (node) => {
		if (anyEnvironment(node)) return SKIP;
		if (anyMacro(node) && node.content === content) {
			macro = node;
			return EXIT;
		}
	});
	return macro;
}
//#endregion
//#region libs/pre-conversion-subs/expand-user-defined-macros.ts
/**
* Expands user-defined macros
*/
function expandUserDefinedMacros(ast) {
	const newcommands = listNewcommands(ast);
	const macrosToExpand = new Set(newcommands.map((command) => command.name));
	const macroInfo = Object.fromEntries(newcommands.map((m) => [m.name, { signature: m.signature }]));
	for (let i = 0; i < 100; i++) {
		if (!needToExpand(ast, macrosToExpand)) break;
		attachMacroArgs(ast, macroInfo);
		expandMacrosExcludingDefinitions(ast, newcommands);
	}
}
function needToExpand(ast, macros) {
	let needExpand = false;
	visit(ast, (node) => {
		if (anyMacro(node) && macros.has(node.content)) needExpand = true;
	});
	return needExpand;
}
//#endregion
//#region libs/pre-conversion-subs/replace-quote-ligatures.ts
function isStr(node, content) {
	return node.type === "string" && node.content === content;
}
function isLetter(node) {
	if (!node || node.type !== "string") return false;
	return /^[a-zA-Z]/.test(node.content);
}
/**
* Scan `nodes` for LaTeX quote ligatures and replace matched pairs with macros:
*   ``...''  →  \enquote{...}   (double quotes, unambiguous)
*   `...'    →  \sq{...}        (single quotes, with disambiguation)
*
* Single-quote disambiguation: a `'` is treated as a closing single-quote only
* when (a) there is an open `` ` `` on the stack AND (b) it is NOT immediately
* followed by a letter (to preserve contractions like "don't" and "it's").
*
* Nesting is handled correctly: double-quote pairs may contain single-quote
* pairs and vice-versa.
*
* Matching never spans parbreak nodes.
*/
function processQuotes(nodes) {
	const result = [];
	const stack = [];
	let i = 0;
	while (i < nodes.length) {
		const node = nodes[i];
		const next = nodes[i + 1];
		if (match.parbreak(node)) {
			while (stack.length > 0) stack.pop();
			result.push(node);
			i++;
			continue;
		}
		if (isStr(node, "`") && next && isStr(next, "`")) {
			stack.push({
				kind: "double",
				startIndex: result.length
			});
			result.push(node, next);
			i += 2;
			continue;
		}
		if (isStr(node, "'") && next && isStr(next, "'")) {
			const idx = findLastOf(stack, "double");
			if (idx !== -1) {
				const entry = stack.splice(idx, 1)[0];
				const inner = result.splice(entry.startIndex);
				inner.splice(0, 2);
				const processedInner = processQuotes(inner);
				result.push(m("enquote", [arg(processedInner, { braces: "{}" })]));
				i += 2;
				continue;
			}
			result.push(node, next);
			i += 2;
			continue;
		}
		if (isStr(node, "`") && !(next && isStr(next, "`"))) {
			stack.push({
				kind: "single",
				startIndex: result.length
			});
			result.push(node);
			i++;
			continue;
		}
		if (isStr(node, "'") && !(next && isStr(next, "'"))) {
			const idx = findLastOf(stack, "single");
			if (idx !== -1 && !isLetter(nodes[i + 1])) {
				const entry = stack.splice(idx, 1)[0];
				const inner = result.splice(entry.startIndex);
				inner.splice(0, 1);
				const processedInner = processQuotes(inner);
				result.push(m("sq", [arg(processedInner, { braces: "{}" })]));
				i++;
				continue;
			}
			result.push(node);
			i++;
			continue;
		}
		result.push(node);
		i++;
	}
	return result;
}
function findLastOf(stack, kind) {
	for (let i = stack.length - 1; i >= 0; i--) if (stack[i].kind === kind) return i;
	return -1;
}
/**
* After quote matching, convert any remaining raw ligature string nodes
* (dashes, tilde, unmatched quotes) directly to ASCII string nodes so that
* `expandUnicodeLigatures` never has a chance to emit non-ASCII Unicode characters.
*/
function cleanupLigatures(nodes) {
	const result = [];
	let i = 0;
	while (i < nodes.length) {
		const node = nodes[i];
		const next = nodes[i + 1];
		const next2 = nodes[i + 2];
		if (isStr(node, "-") && isStr(next, "-") && isStr(next2, "-")) {
			result.push(m("mdash"));
			i += 3;
			continue;
		}
		if (isStr(node, "-") && isStr(next, "-")) {
			result.push(m("ndash"));
			i += 2;
			continue;
		}
		if (isStr(node, "~")) {
			result.push(m("nbsp"));
			i++;
			continue;
		}
		if (isStr(node, "'") || isStr(node, "`")) {
			result.push(node);
			i++;
			continue;
		}
		result.push(node);
		i++;
	}
	return result;
}
/**
* Replace LaTeX quote ligatures (`` `` ``...``''`` and `` ` ``...``'``) with
* `\enquote{...}` and `\sq{...}` macros, and convert dash/tilde ligatures to
* their PreTeXt macro equivalents, throughout the AST (text mode only).
*
* This must run BEFORE the main macro-replacement pass so that the resulting
* macros are converted to PreTeXt elements by the normal pipeline, preventing
* `expandUnicodeLigatures` from emitting non-ASCII Unicode characters.
*/
function replaceQuoteLigatures(ast) {
	visit(ast, (nodes, info) => {
		if (info.context.inMathMode || info.context.hasMathModeAncestor) return;
		const replaced = cleanupLigatures(processQuotes(nodes));
		nodes.length = 0;
		nodes.push(...replaced);
	}, {
		includeArrays: true,
		test: Array.isArray
	});
}
//#endregion
//#region libs/provides.ts
/**
* Register macro signatures for PreTeXt-specific macros.
* Add new macro names here when they are handled in macro-subs.ts
* but not already defined in the unified-latex-ctan packages.
*/
var macros = {
	term: { signature: "m" },
	code: { signature: "m" },
	lstinline: { signature: "m" },
	preface: {
		signature: "s o m",
		renderInfo: {
			breakAround: true,
			inParMode: true,
			namedArguments: [
				"starred",
				"tocTitle",
				"title"
			]
		}
	},
	biography: {
		signature: "s o m",
		renderInfo: {
			breakAround: true,
			inParMode: true,
			namedArguments: [
				"starred",
				"tocTitle",
				"title"
			]
		}
	},
	dedication: {
		signature: "s o m",
		renderInfo: {
			breakAround: true,
			inParMode: true,
			namedArguments: [
				"starred",
				"tocTitle",
				"title"
			]
		}
	},
	glossary: {
		signature: "s o m",
		renderInfo: {
			breakAround: true,
			inParMode: true,
			namedArguments: [
				"starred",
				"tocTitle",
				"title"
			]
		}
	},
	exercises: {
		signature: "s o m",
		renderInfo: {
			breakAround: true,
			inParMode: true,
			namedArguments: [
				"starred",
				"tocTitle",
				"title"
			]
		}
	},
	worksheet: {
		signature: "s o m",
		renderInfo: {
			breakAround: true,
			inParMode: true,
			namedArguments: [
				"starred",
				"tocTitle",
				"title"
			]
		}
	},
	readingquestions: {
		signature: "s o m",
		renderInfo: {
			breakAround: true,
			inParMode: true,
			namedArguments: [
				"starred",
				"tocTitle",
				"title"
			]
		}
	},
	solutions: {
		signature: "s o m",
		renderInfo: {
			breakAround: true,
			inParMode: true,
			namedArguments: [
				"starred",
				"tocTitle",
				"title"
			]
		}
	},
	fn: { signature: "m" },
	q: { signature: "m" },
	sq: { signature: "m" },
	enquote: { signature: "m" },
	enquotestar: { signature: "m" },
	abbr: { signature: "m" },
	ac: { signature: "m" },
	acro: { signature: "m" },
	init: { signature: "m" },
	foreign: { signature: "m" },
	foreignlanguage: { signature: "m m" },
	booktitle: { signature: "m" },
	pubtitle: { signature: "m" },
	articletitle: { signature: "m" },
	xmltag: { signature: "m" },
	xmlattr: { signature: "m" },
	taxon: { signature: "m" },
	kbd: { signature: "m" },
	icon: { signature: "m" },
	nb: { signature: "" },
	ps: { signature: "" },
	vs: { signature: "" },
	viz: { signature: "" },
	etal: { signature: "" },
	circa: { signature: "" },
	ca: { signature: "" },
	PreFigure: { signature: "" },
	XeLaTeX: { signature: "" },
	timeofday: { signature: "" },
	mdash: { signature: "" },
	ndash: { signature: "" },
	nbsp: { signature: "" },
	sout: { signature: "m" },
	insert: { signature: "m" },
	stale: { signature: "m" }
};
/**
* Register environment signatures for PreTeXt-specific environments.
* These are environments whose names don't exist in any CTAN package, so
* the parser needs to be told to consume an optional `[title]` argument.
* Add new environment names here when they are handled in environment-subs.ts
* but not already defined in the unified-latex-ctan packages.
*/
var environments = {
	aside: { signature: "o" },
	biographical: { signature: "o" },
	historical: { signature: "o" },
	assemblage: { signature: "o" },
	activity: { signature: "o" },
	exploration: { signature: "o" },
	investigation: { signature: "o" },
	project: { signature: "o" },
	computation: { signature: "o" },
	technology: { signature: "o" },
	data: { signature: "o" },
	case: { signature: "o" },
	poem: { signature: "o" },
	sidebyside: { signature: "o" },
	program: { signature: "o" },
	console: { signature: "" },
	sage: { signature: "" },
	webwork: { signature: "o" },
	task: { signature: "o" },
	preface: { signature: "o" },
	biography: { signature: "o" },
	dedication: { signature: "o" },
	glossary: { signature: "o" },
	exercises: { signature: "o" },
	exercisegroup: { signature: "o" },
	subexercises: { signature: "o" },
	worksheet: { signature: "o" },
	readingquestions: { signature: "o" },
	"reading-questions": { signature: "o" },
	introduction: { signature: "o" },
	conclusion: { signature: "o" },
	paragraphs: { signature: "o" },
	objectives: { signature: "o" },
	outcomes: { signature: "o" },
	solutions: { signature: "o" },
	gi: { signature: "o" },
	sbsgroup: { signature: "o" },
	stack: { signature: "o" },
	list: { signature: "o" },
	listing: { signature: "o" }
};
//#endregion
//#region libs/unified-latex-plugin-to-pretext.ts
/** Replace Unicode characters produced by ligature expansion with plain ASCII. */
function unicodeToAscii(str) {
	return str.replace(/\u2014/g, "---").replace(/\u2013/g, "--").replace(/\u00A0/g, " ").replace(/\u201C/g, "``").replace(/\u201D/g, "''").replace(/\u2018/g, "`").replace(/\u2019/g, "'").replace(/\u00AB/g, "<<").replace(/\u00BB/g, ">>").replace(/\u2026/g, "...").replace(/\u2009/g, " ").replace(/\u2005/g, " ").replace(/\u2002/g, " ").replace(/\u2003/g, " ");
}
/**
* Unified plugin to convert a `unified-latex` AST into a `xast` AST representation of PreTeXt source.
*/
var unifiedLatexToPretext = function unifiedLatexAttachMacroArguments(options) {
	return (tree, file) => {
		const producePretextFragment = options?.producePretextFragment ? options?.producePretextFragment : false;
		expandUserDefinedMacros(tree);
		replaceQuoteLigatures(tree);
		attachMacroArgs(tree, macros);
		visit(tree, (node) => {
			if (!match.environment(node)) return;
			const envInfo = environments[printRaw(node.env)];
			if (envInfo?.signature && node.args == null) {
				const { args } = gobbleArguments(node.content, envInfo.signature);
				node.args = args;
			}
		});
		fixExamMacroArgs(tree);
		let content = tree.content;
		visit(tree, (env) => {
			content = env.content;
			return EXIT;
		}, { test: ((node) => match.environment(node, "document")) });
		tree.content = content;
		unified().use(unifiedLatexToPretextLike, options).run(tree, file);
		expandUnicodeLigatures(tree);
		content = tree.content;
		let converted = toPretextWithLoggerFactory(file.message.bind(file))({
			type: "root",
			content
		});
		if (!Array.isArray(converted)) converted = [converted];
		let ret = x();
		ret.children = converted;
		if (!producePretextFragment) ret.children.unshift({
			type: "instruction",
			name: "xml",
			value: "version='1.0' encoding='utf-8'"
		});
		(function normalizeToAscii(nodes) {
			for (const node of nodes) if (node.type === "text") node.value = unicodeToAscii(node.value);
			else if ("children" in node) normalizeToAscii(node.children);
		})(ret.children);
		return ret;
	};
};
//#endregion
//#region libs/convert-to-pretext.ts
/**
* Unified plugin to convert a `XAST` AST to a string.
*/
var xmlCompilePlugin = function() {
	this.Compiler = (tree) => toXml(tree, { closeEmptyElements: true });
};
var _processor = processLatexViaUnified().use(unifiedLatexToPretext).use(xmlCompilePlugin);
/**
* Convert the `unified-latex` AST `tree` into an HTML string. If you need
* more precise control or further processing, consider using `unified`
* directly with the `unifiedLatexToPretext` plugin.
*
* For example,
* ```
* unified()
*      .use(unifiedLatexFromString)
*      .use(unifiedLatexToPretext)
*      .use(rehypeStringify)
*      .processSync("\\LaTeX to convert")
* ```
*/
function convertToPretext(tree, options) {
	let processor = _processor;
	if (!Array.isArray(tree) && tree.type !== "root") tree = {
		type: "root",
		content: [tree]
	};
	if (Array.isArray(tree)) tree = {
		type: "root",
		content: tree
	};
	if (options) processor = _processor.use(unifiedLatexToPretext, options);
	const hast = processor.runSync(tree);
	return processor.stringify(hast);
}
//#endregion
//#region index.ts
/**
* ## What is this?
*
* Functions to convert `unified-latex` Abstract Syntax Tree (AST) to a XAST (xml-like)
* tree in the [PreTeXt](https://pretextbook.org/) format.
*
* ## When should I use this?
*
* If you want to convert LaTeX to PreTeXt for further processing with the PreTeXt compiler.
*
* ## Controlling the PreTeXt output
*
* This plugin comes with presets for several common LaTeX macros/environments, but you probably want to
* control how various macros evaluate yourself. For example, you may have used `\includegraphics` with `pdf`s
* in your LaTeX source by want the output to reference different files.
* You can accomplish this by passing `macroReplacements` (for environments, there is the similarly-named
*  `environmentReplacements`) to the plugin.
*
* For example,
* ```typescript
* import { unified } from "unified";
* import rehypeStringify from "rehype-stringify";
* import { htmlLike } from "@unified-latex/unified-latex-util-html-like";
* import { printRaw } from "@unified-latex/unified-latex-util-print-raw";
* import { unifiedLatexToPretext } from "@unified-latex/unified-latex-to-pretext";
* import { unifiedLatexFromString } from "@unified-latex/unified-latex-util-parse";
* import { getArgsContent } from "@unified-latex/unified-latex-util-arguments";
*
* const convert = (value) =>
*     unified()
*         .use(unifiedLatexFromString)
*         .use(unifiedLatexToPretext, {
*             macroReplacements: {
*                 includegraphics: (node) => {
*                     const args = getArgsContent(node);
*                     const path = printRaw(
*                         args[args.length - 1] || []
*                     ).replace(/\.pdf$/, ".png");
*                     return htmlLike({
*                         tag: "img",
*                         attributes: { src: path },
*                     });
*                 },
*             },
*         })
*         .use(rehypeStringify)
*         .processSync(value).value;
*
* console.log(convert(`\\includegraphics{foo.pdf}`));
* ```
*
* `macroReplacements` and `environmentReplacements` functions can return any unified-latex `Node`, but
* using the `htmlLike` utility function will return nodes that get converted to specific HTML. See `htmlLike`'s
* documentation for more details.
*/
//#endregion
export { KATEX_SUPPORT, attachNeededRenderInfo, convertToPretext, environments, macros, mathjaxSpecificEnvironmentReplacements, mathjaxSpecificMacroReplacements, unifiedLatexToPretext, unifiedLatexWrapPars, wrapPars, xmlCompilePlugin };

//# sourceMappingURL=index.js.map