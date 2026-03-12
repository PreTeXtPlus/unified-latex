import { x } from "xastscript";
import { unified } from "unified";
import { expandUnicodeLigatures } from "@unified-latex/unified-latex-util-ligatures";
import { match, anyMacro, anyEnvironment } from "@unified-latex/unified-latex-util-match";
import { visit, EXIT, SKIP } from "@unified-latex/unified-latex-util-visit";
import { getNamedArgsContent, getArgsContent, attachMacroArgs } from "@unified-latex/unified-latex-util-arguments";
import { isHtmlLikeTag, extractFromHtmlLike, htmlLike } from "@unified-latex/unified-latex-util-html-like";
import { printRaw } from "@unified-latex/unified-latex-util-print-raw";
import { s, arg, env, m } from "@unified-latex/unified-latex-builder";
import { replaceNode, unifiedLatexReplaceStreamingCommands } from "@unified-latex/unified-latex-util-replace";
import { splitOnMacro, unsplitOnMacro } from "@unified-latex/unified-latex-util-split";
import { VFileMessage } from "vfile-message";
import { unifiedLatexLintNoTexFontShapingCommands } from "@unified-latex/unified-latex-lint/rules/unified-latex-lint-no-tex-font-shaping-commands";
import { deleteComments } from "@unified-latex/unified-latex-util-comments";
import { trim } from "@unified-latex/unified-latex-util-trim";
import { parseTabularSpec } from "@unified-latex/unified-latex-ctan/package/tabularx";
import { parseAlignEnvironment } from "@unified-latex/unified-latex-util-align";
import { systemeContentsToArray, attachSystemeSettingsAsRenderInfo } from "@unified-latex/unified-latex-ctan/package/systeme";
import { colorToTextcolorMacro } from "@unified-latex/unified-latex-ctan/package/xcolor";
import { listNewcommands, expandMacrosExcludingDefinitions } from "@unified-latex/unified-latex-util-macros";
import { toXml } from "xast-util-to-xml";
import { processLatexViaUnified } from "@unified-latex/unified-latex";
import "@unified-latex/unified-latex-types";
function makeWarningMessage(node, message, warningType) {
  const newMessage = new VFileMessage(message, node);
  newMessage.source = `unified-latex-to-pretext:${warningType}`;
  return newMessage;
}
function emptyStringWithWarningFactory(warningMessage) {
  return (node, info, file) => {
    if (file) {
      const message = makeWarningMessage(
        node,
        warningMessage,
        "macro-subs"
      );
      file.message(
        message,
        message.place,
        `unified-latex-to-pretext:macro-subs`
      );
    }
    return s("");
  };
}
function sanitizeXmlId(str) {
  return str.replace(/["'<>&:\s]/g, (match2) => {
    switch (match2) {
      case "&":
      case ":":
        return "-";
      case " ":
      case "	":
        return "_";
      default:
        return "";
    }
  });
}
const divisions = [
  { division: "part", mappedEnviron: "_part" },
  { division: "chapter", mappedEnviron: "_chapter" },
  { division: "section", mappedEnviron: "_section" },
  { division: "subsection", mappedEnviron: "_subsection" },
  { division: "subsubsection", mappedEnviron: "_subsubsection" },
  { division: "paragraph", mappedEnviron: "_paragraph" },
  { division: "subparagraph", mappedEnviron: "_subparagraph" }
];
const isDivisionMacro = match.createMacroMatcher(
  divisions.map((x2) => x2.division)
);
const isMappedEnviron = match.createEnvironmentMatcher(
  divisions.map((x2) => x2.mappedEnviron)
);
function breakOnBoundaries(ast) {
  const messagesLst = { messages: [] };
  replaceNode(ast, (node) => {
    if (match.group(node)) {
      if (node.content.some((child) => {
        return anyMacro(child) && isDivisionMacro(child);
      })) {
        messagesLst.messages.push(
          makeWarningMessage(
            node,
            "Warning: hoisted out of a group, which might break the LaTeX code.",
            "break-on-boundaries"
          )
        );
        return node.content;
      }
    }
  });
  visit(ast, (node, info) => {
    if (!(anyEnvironment(node) || node.type === "root" || match.group(node)) || // skip math mode
    info.context.hasMathModeAncestor) {
      return;
    } else if (anyEnvironment(node) && isMappedEnviron(node)) {
      return;
    }
    node.content = breakUp(node.content, 0);
  });
  replaceNode(ast, (node) => {
    if (anyMacro(node) && isDivisionMacro(node)) {
      return null;
    }
  });
  return messagesLst;
}
function breakUp(content, depth) {
  if (depth > 6) {
    return content;
  }
  const splits = splitOnMacro(content, divisions[depth].division);
  for (let i = 0; i < splits.segments.length; i++) {
    splits.segments[i] = breakUp(splits.segments[i], depth + 1);
  }
  createEnvironments(splits, divisions[depth].mappedEnviron);
  return unsplitOnMacro(splits);
}
function createEnvironments(splits, newEnviron) {
  for (let i = 1; i < splits.segments.length; i++) {
    const title = getNamedArgsContent(splits.macros[i - 1])["title"];
    const titleArg = [];
    if (title) {
      titleArg.push(arg(title, { braces: "[]" }));
    }
    splits.segments[i] = [env(newEnviron, splits.segments[i], titleArg)];
  }
}
function formatNodeForError(node) {
  try {
    return printRaw(node);
  } catch {
  }
  return JSON.stringify(node);
}
function toPretextWithLoggerFactory(logger) {
  return function toPretext2(node) {
    var _a, _b;
    const htmlNode = node;
    if (isHtmlLikeTag(htmlNode)) {
      const extracted = extractFromHtmlLike(htmlNode);
      const attributes = extracted.attributes;
      return x(
        extracted.tag,
        attributes,
        extracted.content.flatMap(toPretext2)
      );
    }
    switch (node.type) {
      case "string":
        return {
          type: "text",
          value: node.content,
          position: node.position
        };
      case "comment":
        return {
          type: "comment",
          value: node.content,
          position: node.position
        };
      case "inlinemath":
        return x("m", printRaw(node.content));
      case "mathenv":
      case "displaymath":
        return x("md", printRaw(node.content));
      case "verb":
      case "verbatim":
        return x("pre", node.content);
      case "whitespace":
        return { type: "text", value: " ", position: node.position };
      case "parbreak":
        logger(
          `There is no equivalent for parbreak, so it was replaced with an empty string.`,
          node
        );
        return {
          type: "text",
          value: "",
          position: node.position
        };
      case "group":
        return node.content.flatMap(toPretext2);
      case "environment":
        if (isMappedEnviron(node)) {
          let divisionName = (_a = divisions.find(
            (x2) => x2.mappedEnviron === node.env
          )) == null ? void 0 : _a.division;
          if (divisionName === "subparagraph") {
            logger(
              `Warning: There is no equivalent tag for "subparagraph", "paragraphs" was used as a replacement.`,
              node
            );
          }
          if (divisionName === "paragraph" || divisionName === "subparagraph") {
            divisionName = "paragraphs";
          }
          const attributes = {};
          if ((_b = node._renderInfo) == null ? void 0 : _b.additionalAttributes) {
            Object.assign(attributes, node._renderInfo.additionalAttributes);
          }
          const title = getArgsContent(node)[0];
          if (!title) {
            logger(
              `Warning: No title was given, so an empty title tag was used.`,
              node
            );
          }
          const titleTag = x("title", title == null ? void 0 : title.flatMap(toPretext2));
          if (divisionName) {
            return x(
              divisionName,
              attributes,
              [
                titleTag,
                ...node.content.flatMap(toPretext2)
              ]
            );
          }
        }
        logger(
          `Unknown environment when converting to XML \`${formatNodeForError(
            node.env
          )}\``,
          node
        );
        return node.content.flatMap(toPretext2);
      // just remove the environment
      case "macro":
        logger(
          `Unknown macro when converting to XML \`${formatNodeForError(
            node
          )}\``,
          node
        );
        return (node.args || []).map(toPretext2).flat();
      case "argument":
        logger(
          `Unknown argument when converting to XML \`${formatNodeForError(
            node
          )}\``,
          node
        );
        return {
          type: "text",
          value: printRaw(node.content),
          position: node.position
        };
      case "root":
        return node.content.flatMap(toPretext2);
      default: {
        throw new Error(
          `Unknown node type; cannot convert to XAST ${JSON.stringify(
            node
          )}`
        );
      }
    }
  };
}
function splitForPars(nodes, options) {
  const ret = [];
  let currBody = [];
  trim(nodes);
  const isParBreakingMacro = match.createMacroMatcher(
    options.macrosThatBreakPars
  );
  const isEnvThatShouldNotBreakPar = match.createEnvironmentMatcher(
    options.environmentsThatDontBreakPars
  );
  function pushBody() {
    if (currBody.length > 0) {
      trim(currBody);
      ret.push({ content: currBody, wrapInPar: true });
      currBody = [];
    }
  }
  for (const node of nodes) {
    if (isParBreakingMacro(node)) {
      pushBody();
      ret.push({ content: [node], wrapInPar: false });
      continue;
    }
    if (match.anyEnvironment(node) && !isEnvThatShouldNotBreakPar(node)) {
      pushBody();
      ret.push({ content: [node], wrapInPar: false });
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
function wrapPars(nodes, options) {
  const {
    macrosThatBreakPars = [
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
    ],
    environmentsThatDontBreakPars = [
      "index",
      "itemize",
      "enumerate"
    ]
  } = options || {};
  const parSplits = splitForPars(nodes, {
    macrosThatBreakPars,
    environmentsThatDontBreakPars
  });
  return parSplits.flatMap((part) => {
    if (part.wrapInPar) {
      return htmlLike({ tag: "p", content: part.content });
    } else {
      return part.content;
    }
  });
}
function createTableFromTabular(env2) {
  const tabularBody = parseAlignEnvironment(env2.content);
  const args = getArgsContent(env2);
  let columnSpecs = [];
  try {
    columnSpecs = parseTabularSpec(args[1] || []);
  } catch (e) {
  }
  const attributes = {};
  let notLeftAligned = false;
  const columnRightBorder = {};
  const tableBody = tabularBody.map((row) => {
    const content = row.cells.map((cell, i) => {
      const columnSpec = columnSpecs[i];
      if (columnSpec) {
        const { alignment } = columnSpec;
        if (columnSpec.pre_dividers.some(
          (div) => div.type === "vert_divider"
        )) {
          attributes["left"] = "minor";
        }
        if (columnSpec.post_dividers.some(
          (div) => div.type === "vert_divider"
        )) {
          columnRightBorder[i] = true;
        }
        if (alignment.alignment !== "left") {
          notLeftAligned = true;
        }
      }
      trim(cell);
      return htmlLike({
        tag: "cell",
        content: cell
      });
    });
    return htmlLike({ tag: "row", content });
  });
  if (notLeftAligned || Object.values(columnRightBorder).some((b) => b)) {
    for (let i = columnSpecs.length; i >= 0; i--) {
      const columnSpec = columnSpecs[i];
      if (!columnSpec) {
        continue;
      }
      const colAttributes = {};
      const { alignment } = columnSpec;
      if (alignment.alignment !== "left") {
        colAttributes["halign"] = alignment.alignment;
      }
      if (columnRightBorder[i] === true) {
        colAttributes["right"] = "minor";
      }
      tableBody.unshift(
        htmlLike({ tag: "col", attributes: colAttributes })
      );
    }
  }
  return htmlLike({
    tag: "tabular",
    content: tableBody,
    attributes
  });
}
const ITEM_ARG_NAMES_REG = ["label"];
const ITEM_ARG_NAMES_BEAMER = [null, "label", null];
function getItemArgs(node) {
  if (!Array.isArray(node.args)) {
    throw new Error(
      `Cannot find \\item macros arguments; you must attach the \\item body to the macro before calling this function ${JSON.stringify(
        node
      )}`
    );
  }
  const argNames = node.args.length - 1 === ITEM_ARG_NAMES_BEAMER.length ? ITEM_ARG_NAMES_BEAMER : ITEM_ARG_NAMES_REG;
  const ret = Object.assign(
    { body: node.args[node.args.length - 1].content },
    getNamedArgsContent(node, argNames)
  );
  return ret;
}
function enumerateFactory(parentTag = "ol") {
  return function enumerateToHtml(env2) {
    const items = env2.content.filter((node) => match.macro(node, "item"));
    let isDescriptionList = false;
    const content = items.flatMap((node) => {
      if (!match.macro(node) || !node.args) {
        return [];
      }
      const namedArgs = getItemArgs(node);
      namedArgs.body = wrapPars(namedArgs.body);
      if (namedArgs.label != null) {
        isDescriptionList = true;
        namedArgs.body.unshift(
          htmlLike({
            tag: "title",
            content: namedArgs.label
          })
        );
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
function envFactory(tag, options = {}) {
  const {
    requiresStatementTag = false,
    wrapContentInPars = true,
    extractTitleFromArgs = true,
    warningMessage = ""
  } = options;
  return (env2, info, file) => {
    var _a;
    if (warningMessage && file) {
      const message = makeWarningMessage(env2, warningMessage, "env-subs");
      file.message(message, message.place, message.source);
    }
    let content = wrapContentInPars ? wrapPars(env2.content) : env2.content;
    if (requiresStatementTag) {
      content = [
        htmlLike({
          tag: "statement",
          content
        })
      ];
    }
    if (extractTitleFromArgs) {
      const args = getArgsContent(env2);
      if (args[0]) {
        content.unshift(
          htmlLike({
            tag: "title",
            content: args[0] || []
          })
        );
      }
    }
    const attributes = {};
    if ((_a = env2._renderInfo) == null ? void 0 : _a.additionalAttributes) {
      Object.assign(attributes, env2._renderInfo.additionalAttributes);
    }
    return htmlLike({
      tag,
      content,
      attributes
    });
  };
}
const environmentReplacements = {
  // TODO: add additional envs like theorem, etc.
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
  ...genEnvironmentReplacements()
};
function genEnvironmentReplacements() {
  const envAliases = {
    abstract: { requiresStatement: false, aliases: ["abs", "abstr"] },
    acknowledgement: { requiresStatement: false, aliases: ["ack"] },
    algorithm: { requiresStatement: true, aliases: ["algo", "alg"] },
    answer: { requiresStatement: false, aliases: ["ans"] },
    assumption: { requiresStatement: true, aliases: ["assu", "ass"] },
    axiom: { requiresStatement: true, aliases: ["axm"] },
    claim: { requiresStatement: true, aliases: ["cla"] },
    conjecture: {
      requiresStatement: true,
      aliases: ["con", "conj", "conjec"]
    },
    construction: { requiresStatement: false, aliases: [] },
    convention: { requiresStatement: false, aliases: ["conv"] },
    corollary: {
      requiresStatement: true,
      aliases: ["cor", "corr", "coro", "corol", "corss"]
    },
    definition: {
      requiresStatement: true,
      aliases: ["def", "defn", "dfn", "defi", "defin", "de"]
    },
    example: {
      requiresStatement: true,
      aliases: ["exam", "exa", "eg", "exmp", "expl", "exm"]
    },
    exercise: { requiresStatement: true, aliases: ["exer", "exers"] },
    exploration: { requiresStatement: false, aliases: [] },
    fact: { requiresStatement: true, aliases: [] },
    heuristic: { requiresStatement: true, aliases: [] },
    hint: { requiresStatement: false, aliases: [] },
    hypothesis: { requiresStatement: true, aliases: ["hyp"] },
    identity: { requiresStatement: true, aliases: ["idnty"] },
    insight: { requiresStatement: false, aliases: [] },
    investigation: { requiresStatement: false, aliases: [] },
    lemma: {
      requiresStatement: true,
      aliases: ["lem", "lma", "lemm", "lm"]
    },
    notation: {
      requiresStatement: false,
      aliases: ["no", "nota", "ntn", "nt", "notn", "notat"]
    },
    note: { requiresStatement: false, aliases: ["notes"] },
    observation: { requiresStatement: false, aliases: ["obs"] },
    principle: { requiresStatement: true, aliases: [] },
    problem: { requiresStatement: true, aliases: ["prob", "prb"] },
    project: { requiresStatement: false, aliases: [] },
    proof: { requiresStatement: false, aliases: ["pf", "prf", "demo"] },
    proposition: {
      requiresStatement: true,
      aliases: ["prop", "pro", "prp", "props"]
    },
    question: {
      requiresStatement: true,
      aliases: ["qu", "ques", "quest", "qsn"]
    },
    remark: {
      requiresStatement: false,
      aliases: ["rem", "rmk", "rema", "bem", "subrem"]
    },
    task: { requiresStatement: true, aliases: [] },
    theorem: {
      requiresStatement: true,
      aliases: ["thm", "theo", "theor", "thmss", "thrm"]
    },
    solution: { requiresStatement: false, aliases: ["sol"] },
    warning: { requiresStatement: false, aliases: ["warn", "wrn"] }
  };
  const exapandedEnvAliases = Object.entries(envAliases).flatMap(
    ([env2, spec]) => [
      [
        env2,
        envFactory(env2, {
          requiresStatementTag: spec.requiresStatement
        })
      ],
      ...spec.aliases.map((name) => [
        name,
        envFactory(env2, {
          requiresStatementTag: spec.requiresStatement
        })
      ])
    ]
  );
  return Object.fromEntries(exapandedEnvAliases);
}
const KATEX_MACROS = /* @__PURE__ */ JSON.parse('[" ","!","\\"","#","&","\'","*",",",".",":",";","=",">","AA","AE","Alpha","And","Arrowvert","Bbb","Bbbk","Beta","Big","Bigg","Biggl","Biggm","Biggr","Bigl","Bigm","Bigr","Box","Bra","Bumpeq","C","Cap","Chi","Colonapprox","Coloneq","Coloneqq","Colonsim","Complex","Coppa","Cup","Dagger","Darr","DeclareMathOperator","Delta","Diamond","Digamma","Doteq","Downarrow","Epsilon","Eqcolon","Eqqcolon","Eta","Finv","Game","Gamma","H","Harr","Huge","Im","Iota","Join","KaTeX","Kappa","Ket","Koppa","L","LARGE","LaTeX","Lambda","Large","Larr","LeftArrow","Leftarrow","Leftrightarrow","Lleftarrow","Longleftarrow","Longleftrightarrow","Longrightarrow","Lrarr","Lsh","Mu","N","Newextarrow","Nu","O","OE","Omega","Omicron","Overrightarrow","P","Phi","Pi","Pr","Psi","Q","R","Rarr","Re","Reals","Rho","Rightarrow","Rrightarrow","Rsh","Rule","S","Sampi","Sigma","Space","Stigma","Subset","Supset","Tau","TeX","Theta","Tiny","Uarr","Uparrow","Updownarrow","Upsilon","Vdash","Vert","Vvdash","Xi","Z","Zeta","\\\\","^","_","`","aa","above","abovewithdelims","acute","add","ae","alef","alefsym","aleph","allowbreak","alpha","amalg","and","ang","angl","angle","angln","approx","approxcolon","approxcoloncolon","approxeq","arccos","arcctg","arcsin","arctan","arctg","arg","argmax","argmin","array","arraystretch","arrowvert","ast","asymp","atop","atopwithdelims","backepsilon","backprime","backsim","backsimeq","backslash","bar","barwedge","bbox","bcancel","because","begin","begingroup","beta","beth","between","bf","bfseries","big","bigcap","bigcirc","bigcup","bigg","biggl","biggm","biggr","bigl","bigm","bigodot","bigominus","bigoplus","bigoslash","bigotimes","bigr","bigsqcap","bigsqcup","bigstar","bigtriangledown","bigtriangleup","biguplus","bigvee","bigwedge","binom","blacklozenge","blacksquare","blacktriangle","blacktriangledown","blacktriangleleft","blacktriangleright","bm","bmod","bold","boldsymbol","bot","bowtie","boxdot","boxed","boxminus","boxplus","boxtimes","bra","brace","bracevert","brack","braket","breve","buildrel","bull","bullet","bumpeq","cal","cancel","cancelto","cap","cases","cdot","cdotp","cdots","ce","cee","centerdot","cf","cfrac","ch","char","check","checkmark","chi","chk","choose","circ","circeq","circlearrowleft","circlearrowright","circledR","circledS","circledast","circledcirc","circleddash","class","cline","clubs","clubsuit","cnums","colon","colonapprox","coloncolon","coloncolonapprox","coloncolonequals","coloncolonminus","coloncolonsim","coloneq","coloneqq","colonequals","colonminus","colonsim","color","colorbox","complement","cong","coppa","coprod","copyright","cos","cosec","cosh","cot","cotg","coth","cr","csc","cssId","ctg","cth","cup","curlyeqprec","curlyeqsucc","curlyvee","curlywedge","curvearrowleft","curvearrowright","dArr","dag","dagger","daleth","darr","dashleftarrow","dashrightarrow","dashv","dbinom","dblcolon","ddag","ddagger","ddddot","dddot","ddot","ddots","def","definecolor","deg","degree","delta","det","dfrac","diagdown","diagup","diamond","diamonds","diamondsuit","digamma","dim","displaylines","displaystyle","div","divideontimes","dot","doteq","doteqdot","dotplus","dots","dotsb","dotsc","dotsi","dotsm","dotso","doublebarwedge","doublecap","doublecup","downarrow","downdownarrows","downharpoonleft","downharpoonright","edef","ell","else","em","emph","empty","emptyset","enclose","end","endgroup","enspace","epsilon","eqalign","eqalignno","eqcirc","eqcolon","eqqcolon","eqref","eqsim","eqslantgtr","eqslantless","equalscolon","equalscoloncolon","equiv","eta","eth","euro","exist","exists","exp","expandafter","fallingdotseq","fbox","fcolorbox","fi","flat","foo","footnotesize","forall","frac","frak","frown","futurelet","gamma","gcd","gdef","ge","geneuro","geneuronarrow","geneurowide","genfrac","geq","geqq","geqslant","gets","gg","ggg","gggtr","gimel","global","gnapprox","gneq","gneqq","gnsim","grave","greet","gt","gtrapprox","gtrdot","gtreqless","gtreqqless","gtrless","gtrsim","gvertneqq","hArr","hail","harr","hat","hbar","hbox","hdashline","hearts","heartsuit","hfil","hfill","hline","hom","hookleftarrow","hookrightarrow","hphantom","href","hskip","hslash","hspace","htmlClass","htmlData","htmlId","htmlStyle","huge","i","iddots","idotsint","if","iff","ifmode","ifx","iiiint","iiint","iint","image","imageof","imath","impliedby","implies","in","includegraphics","inf","infin","infty","injlim","int","intercal","intop","iota","isin","it","itshape","j","jmath","kappa","ker","kern","ket","koppa","l","lArr","lBrace","lVert","label","lambda","land","lang","langle","large","larr","lbrace","lbrack","lceil","ldotp","ldots","le","leadsto","left","leftarrow","leftarrowtail","leftharpoondown","leftharpoonup","leftleftarrows","leftrightarrow","leftrightarrows","leftrightharpoons","leftrightsquigarrow","leftroot","leftthreetimes","leq","leqalignno","leqq","leqslant","lessapprox","lessdot","lesseqgtr","lesseqqgtr","lessgtr","lesssim","let","lfloor","lg","lgroup","lhd","lim","liminf","limits","limsup","ll","llap","llbracket","llcorner","lll","llless","lmoustache","ln","lnapprox","lneq","lneqq","lnot","lnsim","log","long","longleftarrow","longleftrightarrow","longmapsto","longrightarrow","looparrowleft","looparrowright","lor","lower","lozenge","lparen","lq","lrArr","lrarr","lrcorner","lt","ltimes","lvert","lvertneqq","maltese","mapsto","mathbb","mathbf","mathbin","mathcal","mathchoice","mathclap","mathclose","mathellipsis","mathfrak","mathinner","mathit","mathllap","mathnormal","mathop","mathopen","mathord","mathpunct","mathrel","mathring","mathrlap","mathrm","mathscr","mathsf","mathsterling","mathstrut","mathtip","mathtt","matrix","max","mbox","md","mdseries","measuredangle","medspace","mho","mid","middle","min","minuscolon","minuscoloncolon","minuso","mit","mkern","mmlToken","mod","models","moveleft","moveright","mp","mskip","mspace","mu","multicolumn","multimap","nLeftarrow","nLeftrightarrow","nRightarrow","nVDash","nVdash","nabla","natnums","natural","ncong","ne","nearrow","neg","negmedspace","negthickspace","negthinspace","neq","newcommand","newenvironment","newline","nexists","ngeq","ngeqq","ngeqslant","ngtr","ni","nleftarrow","nleftrightarrow","nleq","nleqq","nleqslant","nless","nmid","nobreak","nobreakspace","noexpand","nolimits","nonumber","normalfont","normalsize","not","notag","notin","notni","nparallel","nprec","npreceq","nrightarrow","nshortmid","nshortparallel","nsim","nsubseteq","nsubseteqq","nsucc","nsucceq","nsupseteq","nsupseteqq","ntriangleleft","ntrianglelefteq","ntriangleright","ntrianglerighteq","nu","nvDash","nvdash","nwarrow","o","odot","oe","officialeuro","oiiint","oiint","oint","oldstyle","omega","omicron","ominus","operatorname","operatornamewithlimits","oplus","or","origof","oslash","otimes","over","overbrace","overbracket","overgroup","overleftarrow","overleftharpoon","overleftrightarrow","overline","overlinesegment","overparen","overrightarrow","overrightharpoon","overset","overwithdelims","owns","pagecolor","parallel","part","partial","perp","phantom","phase","phi","pi","pitchfork","plim","plusmn","pm","pmatrix","pmb","pmod","pod","pounds","prec","precapprox","preccurlyeq","preceq","precnapprox","precneqq","precnsim","precsim","prime","prod","projlim","propto","providecommand","psi","pu","qquad","quad","r","rArr","rBrace","rVert","raise","raisebox","rang","rangle","rarr","ratio","rbrace","rbrack","rceil","real","reals","ref","relax","renewcommand","renewenvironment","require","restriction","rfloor","rgroup","rhd","rho","right","rightarrow","rightarrowtail","rightharpoondown","rightharpoonup","rightleftarrows","rightleftharpoons","rightrightarrows","rightsquigarrow","rightthreetimes","risingdotseq","rlap","rm","rmoustache","root","rotatebox","rparen","rq","rrbracket","rtimes","rule","rvert","sampi","sc","scalebox","scr","scriptscriptstyle","scriptsize","scriptstyle","sdot","searrow","sec","sect","setlength","setminus","sf","sh","sharp","shortmid","shortparallel","shoveleft","shoveright","sideset","sigma","sim","simcolon","simcoloncolon","simeq","sin","sinh","sixptsize","skew","skip","sl","small","smallfrown","smallint","smallsetminus","smallsmile","smash","smile","smiley","sout","space","spades","spadesuit","sphericalangle","sqcap","sqcup","sqrt","sqsubset","sqsubseteq","sqsupset","sqsupseteq","square","ss","stackrel","star","stigma","strut","style","sub","sube","subset","subseteq","subseteqq","subsetneq","subsetneqq","substack","succ","succapprox","succcurlyeq","succeq","succnapprox","succneqq","succnsim","succsim","sum","sup","supe","supset","supseteq","supseteqq","supsetneq","supsetneqq","surd","swarrow","tag","tan","tanh","tau","tbinom","text","textasciicircum","textasciitilde","textbackslash","textbar","textbardbl","textbf","textbraceleft","textbraceright","textcircled","textcolor","textdagger","textdaggerdbl","textdegree","textdollar","textellipsis","textemdash","textendash","textgreater","textit","textless","textmd","textnormal","textquotedblleft","textquotedblright","textquoteleft","textquoteright","textregistered","textrm","textsc","textsf","textsl","textsterling","textstyle","texttip","texttt","textunderscore","textup","textvisiblespace","tfrac","tg","th","therefore","theta","thetasym","thickapprox","thicksim","thickspace","thinspace","tilde","times","tiny","to","toggle","top","triangle","triangledown","triangleleft","trianglelefteq","triangleq","triangleright","trianglerighteq","tt","twoheadleftarrow","twoheadrightarrow","u","uArr","uarr","ulcorner","underbar","underbrace","underbracket","undergroup","underleftarrow","underleftrightarrow","underline","underlinesegment","underparen","underrightarrow","underset","unicode","unlhd","unrhd","up","uparrow","updownarrow","upharpoonleft","upharpoonright","uplus","uproot","upshape","upsilon","upuparrows","urcorner","url","utilde","v","vDash","varDelta","varGamma","varLambda","varOmega","varPhi","varPi","varPsi","varSigma","varTheta","varUpsilon","varXi","varcoppa","varepsilon","varinjlim","varkappa","varliminf","varlimsup","varnothing","varphi","varpi","varprojlim","varpropto","varrho","varsigma","varstigma","varsubsetneq","varsubsetneqq","varsupsetneq","varsupsetneqq","vartheta","vartriangle","vartriangleleft","vartriangleright","vcentcolon","vcenter","vdash","vdots","vec","vee","veebar","vert","vfil","vfill","vline","vphantom","wedge","weierp","widecheck","widehat","wideparen","widetilde","wp","wr","xLeftarrow","xLeftrightarrow","xRightarrow","xcancel","xdef","xhookleftarrow","xhookrightarrow","xi","xleftarrow","xleftharpoondown","xleftharpoonup","xleftrightarrow","xleftrightharpoons","xlongequal","xmapsto","xrightarrow","xrightharpoondown","xrightharpoonup","xrightleftharpoons","xtofrom","xtwoheadleftarrow","xtwoheadrightarrow","yen","zeta","{","|","}","~"]');
const KATEX_ENVIRONMENTS = ["align", "align*", "alignat", "alignat*", "aligned", "alignedat", "array", "Bmatrix", "bmatrix", "Bmatrix*", "bmatrix*", "cases", "CD", "darray", "dcases", "drcases", "equation", "equation*", "gather", "gathered", "matrix", "matrix*", "pmatrix", "pmatrix*", "rcases", "smallmatrix", "split", "Vmatrix", "vmatrix", "Vmatrix*", "vmatrix*"];
const KATEX_SUPPORT_LIST = {
  KATEX_MACROS,
  KATEX_ENVIRONMENTS
};
const LEFT = { type: "macro", content: "left" };
const RIGHT = { type: "macro", content: "right" };
const DEFAULT_LEFT_DELIM = { type: "macro", content: "{" };
const DEFAULT_RIGHT_DELIM = { type: "string", content: "." };
const mathjaxSpecificMacroReplacements = {
  systeme: (node) => {
    var _a, _b;
    try {
      const args = getArgsContent(node);
      const whitelistedVariables = args[1] || void 0;
      const equations = args[3] || [];
      const ret = systemeContentsToArray(equations, {
        properSpacing: false,
        whitelistedVariables
      });
      if ((_a = node == null ? void 0 : node._renderInfo) == null ? void 0 : _a.sysdelims) {
        const [frontDelim, backDelim] = (_b = node._renderInfo) == null ? void 0 : _b.sysdelims;
        return [
          LEFT,
          ...frontDelim || [],
          ret,
          RIGHT,
          ...backDelim || []
        ];
      }
      return [LEFT, DEFAULT_LEFT_DELIM, ret, RIGHT, DEFAULT_RIGHT_DELIM];
    } catch (e) {
      return node;
    }
  },
  sysdelim: () => []
};
const mathjaxSpecificEnvironmentReplacements = {
  // Currently nothing here; but keeping this function in case there are specific environments for latex we want to handle differently in pretext.
};
function attachNeededRenderInfo(ast) {
  attachSystemeSettingsAsRenderInfo(ast);
}
const KATEX_SUPPORT = {
  macros: KATEX_SUPPORT_LIST["KATEX_MACROS"],
  environments: KATEX_SUPPORT_LIST["KATEX_ENVIRONMENTS"]
};
function factory$1(tag, warningMessage = "", attributes) {
  return (macro, info, file) => {
    if (!macro.args) {
      throw new Error(
        `Found macro to replace but couldn't find content ${printRaw(
          macro
        )}`
      );
    }
    if (warningMessage && file) {
      const message = makeWarningMessage(
        macro,
        `Warning: There is no equivalent tag for "${macro.content}", "${tag}" was used as a replacement.`,
        "macro-subs"
      );
      file.message(message, message.place, message.source);
    }
    const args = getArgsContent(macro);
    const content = args[args.length - 1] || [];
    return htmlLike({ tag, content, attributes });
  };
}
function createHeading(tag, attrs = {}) {
  return (macro) => {
    const args = getArgsContent(macro);
    const attributes = {};
    if (attrs) {
      Object.assign(attributes, attrs);
    }
    return htmlLike({
      tag,
      content: args[args.length - 1] || [],
      attributes
    });
  };
}
const macroReplacements = {
  emph: factory$1("em"),
  textrm: factory$1(
    "em",
    `Warning: There is no equivalent tag for "textrm", "em" was used as a replacement.`
  ),
  textsf: factory$1(
    "em",
    `Warning: There is no equivalent tag for "textsf", "em" was used as a replacement.`
  ),
  texttt: factory$1(
    "em",
    `Warning: There is no equivalent tag for "textsf", "em" was used as a replacement.`
  ),
  textsl: factory$1(
    "em",
    `Warning: There is no equivalent tag for "textsl", "em" was used as a replacement.`
  ),
  textit: factory$1("em"),
  textbf: factory$1("alert"),
  term: factory$1("term"),
  underline: factory$1(
    "em",
    `Warning: There is no equivalent tag for "underline", "em" was used as a replacement.`
  ),
  mbox: emptyStringWithWarningFactory(
    `Warning: There is no equivalent tag for "mbox", an empty Ast.String was used as a replacement.`
  ),
  phantom: emptyStringWithWarningFactory(
    `Warning: There is no equivalent tag for "phantom", an empty Ast.String was used as a replacement.`
  ),
  appendix: createHeading("appendix"),
  url: (node) => {
    const args = getArgsContent(node);
    const url = printRaw(args[0] || "#");
    return htmlLike({
      tag: "url",
      attributes: {
        href: url
      },
      content: [{ type: "string", content: url }]
    });
  },
  href: (node) => {
    const args = getArgsContent(node);
    const url = printRaw(args[1] || "#");
    return htmlLike({
      tag: "url",
      attributes: {
        href: url
      },
      content: args[2] || []
    });
  },
  hyperref: (node) => {
    const args = getArgsContent(node);
    const url = "#" + printRaw(args[0] || "");
    return htmlLike({
      tag: "url",
      attributes: {
        href: url
      },
      content: args[1] || []
    });
  },
  ref: (node) => {
    const args = getArgsContent(node);
    const ref = sanitizeXmlId(printRaw(args[1] || ""));
    return htmlLike({
      tag: "xref",
      attributes: {
        ref: ref || ""
      }
    });
  },
  eqref: (node) => {
    const args = getArgsContent(node);
    const ref = sanitizeXmlId(printRaw(args[0] || ""));
    return htmlLike({
      tag: "xref",
      attributes: {
        ref: ref || ""
      }
    });
  },
  cref: (node) => {
    const args = getArgsContent(node);
    const ref = sanitizeXmlId(printRaw(args[1] || ""));
    return htmlLike({
      tag: "xref",
      attributes: {
        ref: ref || ""
      }
    });
  },
  Cref: (node) => {
    const args = getArgsContent(node);
    const ref = sanitizeXmlId(printRaw(args[1] || ""));
    return htmlLike({
      tag: "xref",
      attributes: {
        ref: ref || ""
      }
    });
  },
  cite: (node) => {
    const args = getArgsContent(node);
    const ref = sanitizeXmlId(printRaw(args[1] || ""));
    return htmlLike({
      tag: "xref",
      attributes: {
        ref: ref || ""
      }
    });
  },
  index: (node) => {
    const args = getArgsContent(node);
    const term = args[0] || [];
    return htmlLike({
      tag: "idx",
      content: htmlLike({
        tag: "h",
        content: term
      })
    });
  },
  "\\": emptyStringWithWarningFactory(
    `Warning: There is no equivalent tag for "\\", an empty Ast.String was used as a replacement.`
  ),
  vspace: emptyStringWithWarningFactory(
    `Warning: There is no equivalent tag for "vspace", an empty Ast.String was used as a replacement.`
  ),
  hspace: emptyStringWithWarningFactory(
    `Warning: There is no equivalent tag for "hspace", an empty Ast.String was used as a replacement.`
  ),
  textcolor: factory$1(
    "em",
    `Warning: There is no equivalent tag for "textcolor", "em" was used as a replacement.`
  ),
  textsize: emptyStringWithWarningFactory(
    `Warning: There is no equivalent tag for "textsize", an empty Ast.String was used as a replacement.`
  ),
  makebox: emptyStringWithWarningFactory(
    `Warning: There is no equivalent tag for "makebox", an empty Ast.String was used as a replacement.`
  ),
  noindent: emptyStringWithWarningFactory(
    `Warning: There is no equivalent tag for "noindent", an empty Ast.String was used as a replacement.`
  ),
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
  //tex: factory("tex"),
  includegraphics: (node) => {
    const args = getArgsContent(node);
    const source = printRaw(args[args.length - 1] || []);
    return htmlLike({
      tag: "image",
      attributes: {
        source
      },
      content: []
    });
  },
  caption: (node, parent) => {
    var _a;
    const args = getArgsContent(node);
    const namedArgs = getNamedArgsContent(node);
    const captionText = namedArgs["captionText"] || args[args.length - 1] || [];
    const isInTable = ((_a = parent == null ? void 0 : parent.parents) == null ? void 0 : _a.some(
      (ancestor) => ancestor.type === "macro" && ancestor.content === "html-tag:table"
    )) ?? false;
    let ret = htmlLike({
      tag: isInTable ? "title" : "caption",
      content: captionText
    });
    return ret;
  }
};
function factory(macroName, ...boundArgs) {
  return (content, originalCommand) => {
    return m(macroName, boundArgs.map((a) => arg(a)).concat(arg(content)));
  };
}
const streamingMacroReplacements = {
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
const unifiedLatexWrapPars = function unifiedLatexWrapPars2(options) {
  const { macrosThatBreakPars, environmentsThatDontBreakPars } = options || {};
  return (tree) => {
    let hasDocumentEnv = false;
    visit(
      tree,
      (env2) => {
        if (match.environment(env2, "document") || isMappedEnviron(env2)) {
          if (match.environment(env2, "document")) {
            hasDocumentEnv = true;
          }
          env2.content = wrapPars(env2.content, {
            macrosThatBreakPars,
            environmentsThatDontBreakPars
          });
        }
      },
      { test: match.anyEnvironment }
    );
    if (!hasDocumentEnv) {
      tree.content = wrapPars(tree.content, {
        macrosThatBreakPars,
        environmentsThatDontBreakPars
      });
    }
  };
};
function reportMacrosUnsupportedByMathjax(ast) {
  const unsupported = { messages: [] };
  const isSupported = match.createMacroMatcher(KATEX_SUPPORT.macros);
  visit(ast, (node, info) => {
    if (anyMacro(node) && info.context.hasMathModeAncestor) {
      if (!isSupported(node)) {
        unsupported.messages.push(
          makeWarningMessage(
            node,
            `Warning: "${node.content}" is unsupported by Katex.`,
            "report-unsupported-macro-katex"
          )
        );
      }
    }
  });
  return unsupported;
}
const unifiedLatexToPretextLike = function unifiedLatexToHtmlLike(options) {
  const macroReplacements$1 = Object.assign(
    {},
    macroReplacements,
    (options == null ? void 0 : options.macroReplacements) || {}
  );
  const environmentReplacements$1 = Object.assign(
    {},
    environmentReplacements,
    (options == null ? void 0 : options.environmentReplacements) || {}
  );
  const producePretextFragment = (options == null ? void 0 : options.producePretextFragment) ? options == null ? void 0 : options.producePretextFragment : false;
  const isReplaceableMacro = match.createMacroMatcher(macroReplacements$1);
  const isReplaceableEnvironment = match.createEnvironmentMatcher(
    environmentReplacements$1
  );
  const isMathjaxMacro = match.createMacroMatcher(
    mathjaxSpecificMacroReplacements
  );
  const isMathjaxEnvironment = match.createEnvironmentMatcher(
    mathjaxSpecificEnvironmentReplacements
  );
  return (tree, file) => {
    const originalTree = tree;
    deleteComments(tree);
    let processor = unified().use(unifiedLatexLintNoTexFontShapingCommands, { fix: true }).use(unifiedLatexReplaceStreamingCommands, {
      replacers: streamingMacroReplacements
    });
    const warningMessages = breakOnBoundaries(tree);
    for (const warningMessage of warningMessages.messages) {
      file.message(
        warningMessage,
        warningMessage.place,
        "unified-latex-to-pretext:break-on-boundaries"
      );
    }
    attachAdditionalAttributes(tree);
    if (shouldBeWrappedInPars(tree)) {
      processor = processor.use(unifiedLatexWrapPars);
    }
    tree = processor.runSync(tree, file);
    replaceNode(tree, (node, info) => {
      if (info.context.hasMathModeAncestor) {
        return;
      }
      if (isReplaceableEnvironment(node)) {
        return environmentReplacements$1[printRaw(node.env)](
          node,
          info,
          file
        );
      }
    });
    replaceNode(tree, (node, info) => {
      if (info.context.hasMathModeAncestor) {
        return;
      }
      if (isReplaceableMacro(node)) {
        const replacement = macroReplacements$1[node.content](
          node,
          info,
          file
        );
        return replacement;
      }
    });
    const unsupportedByMathjax = reportMacrosUnsupportedByMathjax(tree);
    for (const warningMessage of unsupportedByMathjax.messages) {
      file.message(
        warningMessage,
        warningMessage.place,
        "unified-latex-to-pretext:report-unsupported-macro-mathjax"
      );
    }
    attachNeededRenderInfo(tree);
    replaceNode(tree, (node) => {
      if (isMathjaxMacro(node)) {
        return mathjaxSpecificMacroReplacements[node.content](node);
      }
      if (isMathjaxEnvironment(node)) {
        return mathjaxSpecificEnvironmentReplacements[printRaw(node.env)](node);
      }
    });
    if (!producePretextFragment) {
      createValidPretextDoc(tree);
      tree.content = [
        htmlLike({ tag: "pretext", content: tree.content })
      ];
    }
    originalTree.content = tree.content;
  };
};
function shouldBeWrappedInPars(tree) {
  let content = tree.content;
  visit(
    tree,
    (env2) => {
      if (match.anyEnvironment(env2)) {
        content = env2.content;
        return EXIT;
      }
    },
    { test: (node) => match.environment(node, "document") }
  );
  return containsPar(content);
}
function containsPar(content) {
  return content.some((node) => {
    if (isMappedEnviron(node)) {
      return containsPar(node.content);
    }
    return match.parbreak(node) || match.macro(node, "par");
  });
}
function createValidPretextDoc(tree) {
  let isBook = false;
  const docClass = findMacro(tree, "documentclass");
  if (docClass) {
    const docClassArg = getArgsContent(docClass)[0];
    if (docClassArg) {
      const docClassTitle = docClassArg[0];
      if (docClassTitle.content == "book" || docClassTitle.content == "memoir") {
        isBook = true;
      }
    }
  }
  if (!isBook) {
    visit(tree, (node) => {
      if (anyEnvironment(node) && node.env == "_chapter") {
        isBook = true;
        return EXIT;
      }
    });
  }
  const title = findMacro(tree, "title");
  if (title) {
    const titleArg = getArgsContent(title)[1];
    if (titleArg) {
      tree.content.unshift(htmlLike({ tag: "title", content: titleArg }));
      replaceNode(tree, (node) => {
        if (node === title) {
          return [];
        }
      });
    } else {
      tree.content.unshift(htmlLike({ tag: "title", content: s("") }));
    }
  } else {
    tree.content.unshift(htmlLike({ tag: "title", content: s("") }));
  }
  if (isBook) {
    tree.content = [htmlLike({ tag: "book", content: tree.content })];
  } else {
    tree.content = [htmlLike({ tag: "article", content: tree.content })];
  }
}
function attachAdditionalAttributes(tree) {
  replaceNode(tree, (node, info) => {
    var _a;
    if (match.macro(node, "label")) {
      const args = getArgsContent(node);
      const labelContent = args[args.length - 1];
      if (labelContent) {
        const renderInfo = ((_a = info.parents[0]) == null ? void 0 : _a._renderInfo) ?? {};
        if (renderInfo) {
          renderInfo.additionalAttributes = renderInfo.additionalAttributes ?? {};
          renderInfo.additionalAttributes["xml:id"] = sanitizeXmlId(
            printRaw(labelContent)
          );
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
    if (anyEnvironment(node)) {
      return SKIP;
    }
    if (anyMacro(node) && node.content === content) {
      macro = node;
      return EXIT;
    }
  });
  return macro;
}
function expandUserDefinedMacros(ast) {
  const newcommands = listNewcommands(ast);
  const macrosToExpand = new Set(newcommands.map((command) => command.name));
  const macroInfo = Object.fromEntries(
    newcommands.map((m2) => [m2.name, { signature: m2.signature }])
  );
  for (let i = 0; i < 100; i++) {
    if (!needToExpand(ast, macrosToExpand)) {
      break;
    }
    attachMacroArgs(ast, macroInfo);
    expandMacrosExcludingDefinitions(ast, newcommands);
  }
}
function needToExpand(ast, macros2) {
  let needExpand = false;
  visit(ast, (node) => {
    if (anyMacro(node) && macros2.has(node.content)) {
      needExpand = true;
    }
  });
  return needExpand;
}
const macros = {
  // PreTeXt-specific macro
  term: { signature: "m" }
};
const environments = {};
const unifiedLatexToPretext = function unifiedLatexAttachMacroArguments(options) {
  return (tree, file) => {
    const producePretextFragment = (options == null ? void 0 : options.producePretextFragment) ? options == null ? void 0 : options.producePretextFragment : false;
    expandUserDefinedMacros(tree);
    attachMacroArgs(tree, macros);
    let content = tree.content;
    visit(
      tree,
      (env2) => {
        content = env2.content;
        return EXIT;
      },
      {
        test: (node) => match.environment(
          node,
          "document"
        )
      }
    );
    tree.content = content;
    unified().use(unifiedLatexToPretextLike, options).run(tree, file);
    expandUnicodeLigatures(tree);
    content = tree.content;
    const toXast = toPretextWithLoggerFactory(file.message.bind(file));
    let converted = toXast({ type: "root", content });
    if (!Array.isArray(converted)) {
      converted = [converted];
    }
    let ret = x();
    ret.children = converted;
    if (!producePretextFragment) {
      ret.children.unshift({
        type: "instruction",
        name: "xml",
        value: "version='1.0' encoding='utf-8'"
      });
    }
    return ret;
  };
};
const xmlCompilePlugin = function() {
  this.Compiler = (tree) => toXml(tree, { closeEmptyElements: true });
};
const _processor = processLatexViaUnified().use(unifiedLatexToPretext).use(xmlCompilePlugin);
function convertToPretext(tree, options) {
  let processor = _processor;
  if (!Array.isArray(tree) && tree.type !== "root") {
    tree = { type: "root", content: [tree] };
  }
  if (Array.isArray(tree)) {
    tree = { type: "root", content: tree };
  }
  if (options) {
    processor = _processor.use(unifiedLatexToPretext, options);
  }
  const hast = processor.runSync(tree);
  return processor.stringify(hast);
}
export {
  KATEX_SUPPORT,
  attachNeededRenderInfo,
  convertToPretext,
  environments,
  macros,
  mathjaxSpecificEnvironmentReplacements,
  mathjaxSpecificMacroReplacements,
  unifiedLatexToPretext,
  unifiedLatexWrapPars,
  wrapPars,
  xmlCompilePlugin
};
//# sourceMappingURL=index.js.map
