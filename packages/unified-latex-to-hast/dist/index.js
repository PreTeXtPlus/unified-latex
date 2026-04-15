import rehypeRaw from "rehype-raw";
import { h } from "hastscript";
import { unified } from "unified";
import { expandUnicodeLigatures } from "@unified-latex/unified-latex-util-ligatures";
import { match } from "@unified-latex/unified-latex-util-match";
import { EXIT, visit } from "@unified-latex/unified-latex-util-visit";
import { extractFromHtmlLike, htmlLike, isHtmlLikeTag } from "@unified-latex/unified-latex-util-html-like";
import { printRaw } from "@unified-latex/unified-latex-util-print-raw";
import { unifiedLatexLintNoTexFontShapingCommands } from "@unified-latex/unified-latex-lint/rules/unified-latex-lint-no-tex-font-shaping-commands";
import { deleteComments } from "@unified-latex/unified-latex-util-comments";
import { replaceNode, unifiedLatexReplaceStreamingCommands } from "@unified-latex/unified-latex-util-replace";
import cssesc from "cssesc";
import { parseTabularSpec } from "@unified-latex/unified-latex-ctan/package/tabularx";
import { parseAlignEnvironment } from "@unified-latex/unified-latex-util-align";
import { getArgsContent, getNamedArgsContent } from "@unified-latex/unified-latex-util-arguments";
import { trim } from "@unified-latex/unified-latex-util-trim";
import { attachSystemeSettingsAsRenderInfo, systemeContentsToArray } from "@unified-latex/unified-latex-ctan/package/systeme";
import { colorToTextcolorMacro, xcolorMacroToHex } from "@unified-latex/unified-latex-ctan/package/xcolor";
import { arg, m } from "@unified-latex/unified-latex-builder";
import rehypeStringify from "rehype-stringify";
import { processLatexViaUnified } from "@unified-latex/unified-latex";
//#region libs/html-subs/to-hast.ts
function formatNodeForError(node) {
	try {
		return printRaw(node);
	} catch {}
	return JSON.stringify(node);
}
/**
* Create a `toHast` function that will log by making a call to `logger`.
*/
function toHastWithLoggerFactory(logger) {
	/**
	* Convert Ast.Node to Hast nodes.
	*/
	return function toHast(node) {
		const htmlNode = node;
		if (isHtmlLikeTag(htmlNode)) {
			const extracted = extractFromHtmlLike(htmlNode);
			const attributes = extracted.attributes;
			return h(extracted.tag, attributes, extracted.content.flatMap(toHast));
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
			case "inlinemath": return h("span", { className: "inline-math" }, printRaw(node.content));
			case "mathenv":
			case "displaymath": return h("div", { className: "display-math" }, printRaw(node.content));
			case "verb": return h("code", { className: node.env }, node.content);
			case "verbatim": return h("pre", { className: node.env }, node.content);
			case "whitespace": return {
				type: "text",
				value: " ",
				position: node.position
			};
			case "parbreak": return h("br");
			case "group": return node.content.flatMap(toHast);
			case "environment":
				logger(`Unknown environment when converting to HTML \`${formatNodeForError(node.env)}\``, node);
				return h("div", { className: ["environment", printRaw(node.env)] }, node.content.flatMap(toHast));
			case "macro":
				logger(`Unknown macro when converting to HTML \`${formatNodeForError(node)}\``, node);
				return h("span", { className: ["macro", `macro-${node.content}`] }, (node.args || []).map(toHast).flat());
			case "argument": return h("span", {
				className: ["argument"],
				"data-open-mark": node.openMark,
				"data-close-mark": node.closeMark
			}, printRaw(node.content));
			case "root": return node.content.flatMap(toHast);
			default: throw new Error(`Unknown node type; cannot convert to HAST ${JSON.stringify(node)}`);
		}
	};
}
toHastWithLoggerFactory(console.warn);
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
		if (node.type === "displaymath") {
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
		"hfill"
	], environmentsThatDontBreakPars = [] } = options || {};
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
//#region libs/pre-html-subs/environment-subs.ts
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
function enumerateFactory(parentTag = "ol", className = "enumerate") {
	return function enumerateToHtml(env) {
		const content = env.content.filter((node) => match.macro(node, "item")).flatMap((node) => {
			if (!match.macro(node) || !node.args) return [];
			const attributes = {};
			const namedArgs = getItemArgs(node);
			if (namedArgs.label != null) {
				const formattedLabel = cssesc(printRaw(namedArgs.label || []));
				attributes.style = { "list-style-type": formattedLabel ? `'${formattedLabel} '` : "none" };
			}
			const body = namedArgs.body;
			return htmlLike({
				tag: "li",
				content: wrapPars(body),
				attributes
			});
		});
		return htmlLike({
			tag: parentTag,
			attributes: { className },
			content
		});
	};
}
function createCenteredElement(env) {
	return htmlLike({
		tag: "center",
		attributes: { className: "center" },
		content: env.content
	});
}
function createTableFromTabular(env) {
	const tabularBody = parseAlignEnvironment(env.content);
	const args = getArgsContent(env);
	let columnSpecs = [];
	try {
		columnSpecs = parseTabularSpec(args[1] || []);
	} catch (e) {}
	return htmlLike({
		tag: "table",
		content: [htmlLike({
			tag: "tbody",
			content: tabularBody.map((row) => {
				return htmlLike({
					tag: "tr",
					content: row.cells.map((cell, i) => {
						const columnSpec = columnSpecs[i];
						const styles = {};
						if (columnSpec) {
							const { alignment } = columnSpec;
							if (alignment.alignment === "center") styles["text-align"] = "center";
							if (alignment.alignment === "right") styles["text-align"] = "right";
							if (columnSpec.pre_dividers.some((div) => div.type === "vert_divider")) styles["border-left"] = "1px solid";
							if (columnSpec.post_dividers.some((div) => div.type === "vert_divider")) styles["border-right"] = "1px solid";
						}
						return htmlLike(Object.keys(styles).length > 0 ? {
							tag: "td",
							content: cell,
							attributes: { style: styles }
						} : {
							tag: "td",
							content: cell
						});
					})
				});
			})
		})],
		attributes: { className: "tabular" }
	});
}
/**
* Rules for replacing a macro with an html-like macro
* that will render has html when printed.
*/
var environmentReplacements = {
	enumerate: enumerateFactory("ol"),
	itemize: enumerateFactory("ul", "itemize"),
	center: createCenteredElement,
	tabular: createTableFromTabular,
	quote: (env) => {
		return htmlLike({
			tag: "blockquote",
			content: env.content,
			attributes: { className: "environment quote" }
		});
	}
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
//#region libs/pre-html-subs/katex-subs.ts
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
var katexSpecificMacroReplacements = {
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
function wrapInDisplayMath(ast) {
	return {
		type: "displaymath",
		content: Array.isArray(ast) ? ast : [ast]
	};
}
var katexSpecificEnvironmentReplacements = {
	align: wrapInDisplayMath,
	"align*": wrapInDisplayMath,
	alignat: wrapInDisplayMath,
	"alignat*": wrapInDisplayMath,
	equation: wrapInDisplayMath,
	"equation*": wrapInDisplayMath
};
/**
* Attach `renderInfo` needed for converting some macros into their
* katex equivalents.
*/
function attachNeededRenderInfo(ast) {
	attachSystemeSettingsAsRenderInfo(ast);
}
var KATEX_SUPPORT = {
	macros: katex_support_default["KATEX_MACROS"],
	environments: katex_support_default["KATEX_ENVIRONMENTS"]
};
//#endregion
//#region libs/pre-html-subs/macro-subs.ts
/**
* Factory function that generates html-like macros that wrap their contents.
*/
function factory$1(tag, attributes) {
	return (macro) => {
		if (!macro.args) throw new Error(`Found macro to replace but couldn't find content ${printRaw(macro)}`);
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
		const attributes = !!args[0] ? { className: "starred" } : {};
		if (attrs) Object.assign(attributes, attrs);
		return htmlLike({
			tag,
			content: args[args.length - 1] || [],
			attributes
		});
	};
}
var macroReplacements = {
	emph: factory$1("em", { className: "emph" }),
	textrm: factory$1("span", { className: "textrm" }),
	textsf: factory$1("span", { className: "textsf" }),
	texttt: factory$1("span", { className: "texttt" }),
	textsl: factory$1("span", { className: "textsl" }),
	textit: factory$1("i", { className: "textit" }),
	textbf: factory$1("b", { className: "textbf" }),
	sout: factory$1("del", { className: "sout" }),
	textsuperscript: factory$1("sup"),
	textsubscript: factory$1("sub"),
	underline: factory$1("u", { className: "underline" }),
	mbox: factory$1("span", { className: "mbox" }),
	phantom: factory$1("span", { className: "phantom" }),
	part: createHeading("h1"),
	chapter: createHeading("h2"),
	section: createHeading("h3"),
	subsection: createHeading("h4"),
	subsubsection: createHeading("h5"),
	paragraph: createHeading("h6", { className: "section-paragraph" }),
	subparagraph: createHeading("h6", { className: "section-subparagraph" }),
	appendix: createHeading("h2"),
	smallskip: () => htmlLike({
		tag: "br",
		attributes: { className: "smallskip" }
	}),
	medskip: () => htmlLike({
		tag: "br",
		attributes: { className: "medskip" }
	}),
	bigskip: () => htmlLike({
		tag: "br",
		attributes: { className: "bigskip" }
	}),
	"\n": () => htmlLike({
		tag: "br",
		attributes: { className: "literal-newline" }
	}),
	url: (node) => {
		const url = printRaw(getArgsContent(node)[0] || "#");
		return htmlLike({
			tag: "a",
			attributes: {
				className: "url",
				href: url
			},
			content: [{
				type: "string",
				content: url
			}]
		});
	},
	href: (node) => {
		const args = getArgsContent(node);
		return htmlLike({
			tag: "a",
			attributes: {
				className: "href",
				href: printRaw(args[1] || "#")
			},
			content: args[2] || []
		});
	},
	hyperref: (node) => {
		const args = getArgsContent(node);
		return htmlLike({
			tag: "a",
			attributes: {
				className: "href",
				href: "#" + printRaw(args[0] || "")
			},
			content: args[1] || []
		});
	},
	"\\": () => htmlLike({
		tag: "br",
		attributes: { className: "linebreak" }
	}),
	vspace: (node) => {
		return htmlLike({
			tag: "div",
			attributes: {
				className: "vspace",
				"data-amount": printRaw(getArgsContent(node)[1] || [])
			},
			content: []
		});
	},
	hspace: (node) => {
		return htmlLike({
			tag: "span",
			attributes: {
				className: "vspace",
				"data-amount": printRaw(getArgsContent(node)[1] || [])
			},
			content: []
		});
	},
	textcolor: (node) => {
		const args = getArgsContent(node);
		const computedColor = xcolorMacroToHex(node);
		const color = computedColor.hex;
		if (color) return htmlLike({
			tag: "span",
			attributes: { style: `color: ${color};` },
			content: args[2] || []
		});
		else return htmlLike({
			tag: "span",
			attributes: { style: `color: var(${computedColor.cssVarName});` },
			content: args[2] || []
		});
	},
	textsize: (node) => {
		const args = getArgsContent(node);
		return htmlLike({
			tag: "span",
			attributes: { className: `textsize-${printRaw(args[0] || [])}` },
			content: args[1] || []
		});
	},
	makebox: (node) => {
		return htmlLike({
			tag: "span",
			attributes: {
				className: `latex-box`,
				style: "display: inline-block;"
			},
			content: getArgsContent(node)[3] || []
		});
	},
	noindent: () => ({
		type: "string",
		content: ""
	}),
	includegraphics: (node) => {
		const args = getArgsContent(node);
		return htmlLike({
			tag: "img",
			attributes: {
				className: "includegraphics",
				src: printRaw(args[args.length - 1] || [])
			},
			content: []
		});
	}
};
//#endregion
//#region libs/pre-html-subs/streaming-command-subs.ts
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
			if (match.environment(env, "document")) {
				hasDocumentEnv = true;
				env.content = wrapPars(env.content, {
					macrosThatBreakPars,
					environmentsThatDontBreakPars
				});
				return EXIT;
			}
		}, { test: match.anyEnvironment });
		if (!hasDocumentEnv) tree.content = wrapPars(tree.content, {
			macrosThatBreakPars,
			environmentsThatDontBreakPars
		});
	};
};
//#endregion
//#region libs/unified-latex-plugin-to-html-like.ts
/**
* Unified plugin to convert a `unified-latex` AST into an html-like AST. This replaces nodes
* with html-like macros `\html-tag:p{...}`, etc. macros. It is a step along the way to converting to HTML.
* **It is unlikely you want to use this plugin directly**.
*
* Note: this plugin only wraps paragraphs in `p` tags if there are multiple paragraphs. Otherwise it omits the <p> tags.
*/
var unifiedLatexToHtmlLike = function unifiedLatexToHtmlLike(options) {
	const macroReplacements$1 = Object.assign({}, macroReplacements, options?.macroReplacements || {});
	const environmentReplacements$1 = Object.assign({}, environmentReplacements, options?.environmentReplacements || {});
	const isReplaceableMacro = match.createMacroMatcher(macroReplacements$1);
	const isReplaceableEnvironment = match.createEnvironmentMatcher(environmentReplacements$1);
	const isKatexMacro = match.createMacroMatcher(katexSpecificMacroReplacements);
	const isKatexEnvironment = match.createEnvironmentMatcher(katexSpecificEnvironmentReplacements);
	return (tree) => {
		const originalTree = tree;
		deleteComments(tree);
		let processor = unified().use(unifiedLatexLintNoTexFontShapingCommands, { fix: true }).use(unifiedLatexReplaceStreamingCommands, { replacers: streamingMacroReplacements });
		if (shouldBeWrappedInPars(tree)) processor = processor.use(unifiedLatexWrapPars);
		tree = processor.runSync(tree);
		replaceNode(tree, (node, info) => {
			if (info.context.hasMathModeAncestor) return;
			if (isReplaceableEnvironment(node)) return environmentReplacements$1[printRaw(node.env)](node, info);
		});
		replaceNode(tree, (node, info) => {
			if (info.context.hasMathModeAncestor) return;
			if (isReplaceableMacro(node)) return macroReplacements$1[node.content](node, info);
		});
		attachNeededRenderInfo(tree);
		replaceNode(tree, (node) => {
			if (isKatexMacro(node)) return katexSpecificMacroReplacements[node.content](node);
			if (isKatexEnvironment(node)) return katexSpecificEnvironmentReplacements[printRaw(node.env)](node);
		});
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
	return content.some((node) => match.parbreak(node) || match.macro(node, "par"));
}
//#endregion
//#region libs/unified-latex-plugin-to-hast.ts
/**
* Unified plugin to convert a `unified-latex` AST into a `hast` AST.
*/
var unifiedLatexToHast = function unifiedLatexAttachMacroArguments(options) {
	const { skipHtmlValidation = false } = options || {};
	return (tree, file) => {
		unified().use(unifiedLatexToHtmlLike, options).run(tree);
		expandUnicodeLigatures(tree);
		let content = tree.content;
		visit(tree, (env) => {
			content = env.content;
			return EXIT;
		}, { test: ((node) => match.environment(node, "document")) });
		let converted = toHastWithLoggerFactory(file.message.bind(file))({
			type: "root",
			content
		});
		if (!Array.isArray(converted)) converted = [converted];
		let ret = h();
		ret.children = converted;
		if (!skipHtmlValidation) ret = unified().use(rehypeRaw).runSync(ret);
		return ret;
	};
};
//#endregion
//#region libs/convert-to-html.ts
var _processor = processLatexViaUnified().use(unifiedLatexToHast).use(rehypeStringify);
/**
* Convert the `unified-latex` AST `tree` into an HTML string. If you need
* more precise control or further processing, consider using `unified`
* directly with the `unifiedLatexToHast` plugin.
*
* For example,
* ```
* unified()
*      .use(unifiedLatexFromString)
*      .use(unifiedLatexToHast)
*      .use(rehypeStringify)
*      .processSync("\\LaTeX to convert")
* ```
*/
function convertToHtml(tree, options) {
	let processor = _processor;
	if (!Array.isArray(tree) && tree.type !== "root") tree = {
		type: "root",
		content: [tree]
	};
	if (Array.isArray(tree)) tree = {
		type: "root",
		content: tree
	};
	if (options) processor = _processor.use(unifiedLatexToHast, options);
	const hast = processor.runSync(tree);
	return processor.stringify(hast);
}
//#endregion
//#region index.ts
/**
* ## What is this?
*
* Functions to convert `unified-latex` Abstract Syntax Tree (AST) to a HAST (html-like)
* tree.
*
* ## When should I use this?
*
* If you want to convert LaTeX to HTML.
*
* ## Controlling the HTML output
*
* This plugin comes with presets for several common LaTeX macros/environments, but you probably want to
* control how various macros evaluate yourself. For example, you may have used `\includegraphics` with `pdf`s
* in your LaTeX source by want to output HTML that manipulates the path and includes `png`s instead.
* You can accomplish this by passing `macroReplacements` (for environments, there is the similarly-named
*  `environmentReplacements`) to the plugin.
*
* For example,
* ```typescript
* import { unified } from "unified";
* import rehypeStringify from "rehype-stringify";
* import { htmlLike } from "@unified-latex/unified-latex-util-html-like";
* import { printRaw } from "@unified-latex/unified-latex-util-print-raw";
* import { unifiedLatexToHast } from "@unified-latex/unified-latex-to-hast";
* import { unifiedLatexFromString } from "@unified-latex/unified-latex-util-parse";
* import { getArgsContent } from "@unified-latex/unified-latex-util-arguments";
*
* const convert = (value) =>
*     unified()
*         .use(unifiedLatexFromString)
*         .use(unifiedLatexToHast, {
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
export { KATEX_SUPPORT, attachNeededRenderInfo, convertToHtml, katexSpecificEnvironmentReplacements, katexSpecificMacroReplacements, unifiedLatexToHast, unifiedLatexWrapPars, wrapPars };

//# sourceMappingURL=index.js.map