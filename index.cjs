"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const unifiedLatexUtilMatch = require("@unified-latex/unified-latex-util-match");
const unifiedLatexUtilReplace = require("@unified-latex/unified-latex-util-replace");
const unifiedLatexUtilVisit = require("@unified-latex/unified-latex-util-visit");
const unifiedLatexUtilPrintRaw = require("@unified-latex/unified-latex-util-print-raw");
const unifiedLatexUtilArguments = require("@unified-latex/unified-latex-util-arguments");
const unifiedLatexUtilParse = require("@unified-latex/unified-latex-util-parse");
const unifiedLatexUtilPegjs = require("@unified-latex/unified-latex-util-pegjs");
(function() {
  if (typeof globalThis === "object") {
    return;
  }
  Object.defineProperty(Object.prototype, "__magic__", {
    get: function() {
      return this;
    },
    configurable: true
    // This makes it possible to `delete` the getter later.
  });
  __magic__.globalThis = __magic__;
  delete Object.prototype.__magic__;
})();
const clone = typeof globalThis.structuredClone === "function" ? globalThis.structuredClone : (obj) => JSON.parse(JSON.stringify(obj));
function structuredClone(obj) {
  return clone(obj);
}
function createMatchers() {
  return {
    isHash: (node) => unifiedLatexUtilMatch.match.string(node, "#"),
    isNumber: (node) => unifiedLatexUtilMatch.match.string(node) && 0 < +node.content.charAt(0),
    splitNumber: (node) => {
      const number = +node.content.charAt(0);
      if (node.content.length > 1) {
        return {
          number,
          rest: { type: "string", content: node.content.slice(1) }
        };
      }
      return { number };
    }
  };
}
function parseMacroSubstitutions(ast) {
  if (!Array.isArray(ast)) {
    throw new Error("You must pass an array of nodes");
  }
  ast = unifiedLatexUtilPegjs.decorateArrayForPegjs([...ast]);
  return unifiedLatexUtilPegjs.MacroSubstitutionPegParser.parse(ast, createMatchers());
}
const LATEX_NEWCOMMAND = /* @__PURE__ */ new Set([
  "newcommand",
  "renewcommand",
  "providecommand"
]);
const XPARSE_NEWCOMMAND = /* @__PURE__ */ new Set([
  "NewDocumentCommand",
  "RenewDocumentCommand",
  "ProvideDocumentCommand",
  "DeclareDocumentCommand",
  "NewExpandableDocumentCommand",
  "RenewExpandableDocumentCommand",
  "ProvideExpandableDocumentCommand",
  "DeclareExpandableDocumentCommand"
]);
const NEWCOMMAND_ARGUMENTS_REG = [
  "starred",
  "name",
  "numArgs",
  "default",
  "body"
];
const NEWCOMMAND_ARGUMENTS_BEAMER = [
  "starred",
  null,
  "name",
  "numArgs",
  "default",
  "body"
];
function getNewcommandNamedArgs(node) {
  if (!Array.isArray(node.args)) {
    throw new Error(
      `Found a '\\newcommand' macro without any arguments "${JSON.stringify(
        node
      )}"`
    );
  }
  const argNames = node.args.length === NEWCOMMAND_ARGUMENTS_BEAMER.length ? NEWCOMMAND_ARGUMENTS_BEAMER : NEWCOMMAND_ARGUMENTS_REG;
  return unifiedLatexUtilArguments.getNamedArgsContent(node, argNames);
}
function newcommandMacroToSpec(node) {
  var _a, _b;
  if (LATEX_NEWCOMMAND.has(node.content)) {
    if (!node.args) {
      console.warn(
        String.raw`Found a '\newcommand' macro that doesn't have any args`,
        node
      );
      return "";
    }
    const namedArgs = getNewcommandNamedArgs(node);
    if (namedArgs.numArgs == null) {
      return "";
    }
    let numArgsForSig = +unifiedLatexUtilPrintRaw.printRaw(namedArgs.numArgs);
    let sigOptionalArg = [];
    if (namedArgs.default != null) {
      numArgsForSig--;
      sigOptionalArg = [`O{${unifiedLatexUtilPrintRaw.printRaw(namedArgs.default)}}`];
    }
    return [
      ...sigOptionalArg,
      ...Array.from({ length: numArgsForSig }).map((_) => "m")
    ].join(" ");
  }
  if (XPARSE_NEWCOMMAND.has(node.content)) {
    if (!((_a = node.args) == null ? void 0 : _a.length)) {
      console.warn(
        String.raw`Found a '\NewDocumentCommand' macro that doesn't have any args`,
        node
      );
      return "";
    }
    const macroSpec = unifiedLatexUtilPrintRaw.printRaw((_b = node.args[1]) == null ? void 0 : _b.content);
    return macroSpec.trim();
  }
  return "";
}
function normalizeCommandName(str) {
  str = str.trim();
  return str.startsWith("\\") ? str.slice(1) : str;
}
function newcommandMacroToName(node) {
  var _a, _b, _c;
  if (LATEX_NEWCOMMAND.has(node.content)) {
    if (!((_a = node.args) == null ? void 0 : _a.length)) {
      return "";
    }
    const namedArgs = getNewcommandNamedArgs(node);
    const definedName = namedArgs.name;
    if (!definedName) {
      console.warn("Could not find macro name defined in", node);
      return "";
    }
    return normalizeCommandName(unifiedLatexUtilPrintRaw.printRaw(definedName));
  }
  if (XPARSE_NEWCOMMAND.has(node.content)) {
    if (!((_b = node.args) == null ? void 0 : _b.length)) {
      return "";
    }
    const definedName = (_c = node.args[0]) == null ? void 0 : _c.content[0];
    if (!definedName) {
      console.warn("Could not find macro name defined in", node);
      return "";
    }
    return normalizeCommandName(unifiedLatexUtilPrintRaw.printRaw(node.args[0].content));
  }
  return "";
}
function newcommandMacroToSubstitutionAst(node) {
  var _a, _b, _c;
  if (LATEX_NEWCOMMAND.has(node.content)) {
    if (!((_a = node.args) == null ? void 0 : _a.length)) {
      return [];
    }
    const namedArgs = getNewcommandNamedArgs(node);
    const substitution = namedArgs.body;
    if (!substitution) {
      console.warn("Could not find macro name defined in", node);
      return [];
    }
    return substitution;
  }
  if (XPARSE_NEWCOMMAND.has(node.content)) {
    if (!((_b = node.args) == null ? void 0 : _b.length)) {
      return [];
    }
    return ((_c = node.args[2]) == null ? void 0 : _c.content) || [];
  }
  return [];
}
function defaultExpanderArgs() {
  return Array.from({ length: 10 }).map((_, i) => ({
    hashNumbers: [],
    content: [{ type: "string", content: `#${i + 1}` }]
  }));
}
function createMacroExpander(substitution) {
  const cachedSubstitutionTree = structuredClone(substitution);
  const hashNumbers = parseHashNumbers(cachedSubstitutionTree);
  return (macro) => {
    if (hashNumbers.length === 0) {
      return structuredClone(cachedSubstitutionTree);
    }
    const cachedSubstitutions = defaultExpanderArgs().map(
      (expanderArg, i) => {
        var _a, _b;
        const number = i + 1;
        if (!hashNumbers.includes(number)) {
          return expanderArg;
        }
        const arg = (_a = macro.args) == null ? void 0 : _a[i];
        const defaultArg = (_b = arg == null ? void 0 : arg._renderInfo) == null ? void 0 : _b.defaultArg;
        if (!arg || isEmptyArg(arg) && defaultArg != null) {
          const content = cachedParse(defaultArg);
          const hashNumbers2 = parseHashNumbers(content);
          return {
            content,
            hashNumbers: hashNumbers2
          };
        }
        return { content: arg.content, hashNumbers: [] };
      }
    );
    let numTimesExpanded = 0;
    while (expandCachedSubstitutions(cachedSubstitutions) && numTimesExpanded < cachedSubstitutions.length) {
      numTimesExpanded++;
    }
    for (const expanderArg of cachedSubstitutions) {
      if (expanderArg.hashNumbers.length > 0) {
        expanderArg.content = [
          // `xparse` seems to use `-No Value-` here.
          { type: "string", content: `-Circular-` }
        ];
      }
    }
    const retTree = structuredClone(cachedSubstitutionTree);
    unifiedLatexUtilReplace.replaceNode(retTree, (node) => {
      const hashNumOrNode = node;
      if (hashNumOrNode.type !== "hash_number") {
        return;
      }
      return cachedSubstitutions[hashNumOrNode.number - 1].content;
    });
    return retTree;
  };
}
function isEmptyArg(arg) {
  return arg.openMark === "" && arg.closeMark === "" && arg.content.length === 0;
}
function parseHashNumbers(tree) {
  let hashNumbers = /* @__PURE__ */ new Set();
  unifiedLatexUtilVisit.visit(
    tree,
    (nodes) => {
      const parsed = parseMacroSubstitutions(nodes);
      for (const node of parsed) {
        if (node.type === "hash_number") {
          hashNumbers.add(node.number);
        }
      }
      nodes.length = 0;
      nodes.push(...parsed);
    },
    {
      includeArrays: true,
      test: Array.isArray
    }
  );
  return Array.from(hashNumbers);
}
function hashNumbersReferenced(tree) {
  let hashNumbers = /* @__PURE__ */ new Set();
  unifiedLatexUtilVisit.visit(tree, (node) => {
    const n = node;
    if (n.type === "hash_number") {
      hashNumbers.add(n.number);
    }
  });
  return Array.from(hashNumbers);
}
const parseCache = /* @__PURE__ */ new Map();
function cachedParse(source) {
  const cached = parseCache.get(source);
  if (cached) {
    return structuredClone(cached);
  }
  const parsed = unifiedLatexUtilParse.parseMinimal(source).content;
  parseCache.set(source, structuredClone(parsed));
  return parsed;
}
function expandCachedSubstitutions(expanderArgs) {
  let didExpand = false;
  for (const expanderArg of expanderArgs) {
    if (expanderArg.hashNumbers.length === 0) {
      continue;
    }
    unifiedLatexUtilReplace.replaceNode(expanderArg.content, (node) => {
      const hashNumOrNode = node;
      if (hashNumOrNode.type !== "hash_number") {
        return;
      }
      didExpand = true;
      return expanderArgs[hashNumOrNode.number - 1].content;
    });
    expanderArg.hashNumbers = hashNumbersReferenced(expanderArg.content);
  }
  return didExpand;
}
const newcommandMatcher = unifiedLatexUtilMatch.match.createMacroMatcher([
  ...LATEX_NEWCOMMAND,
  ...XPARSE_NEWCOMMAND
]);
function listNewcommands(tree) {
  const ret = [];
  unifiedLatexUtilVisit.visit(
    tree,
    (node) => {
      const name = newcommandMacroToName(node);
      const signature = newcommandMacroToSpec(node);
      const body = newcommandMacroToSubstitutionAst(node);
      ret.push({ name, signature, body, definition: node });
    },
    { test: newcommandMatcher }
  );
  return ret;
}
function expandMacros(tree, macros) {
  const expanderCache = new Map(
    macros.map((spec) => [spec.name, createMacroExpander(spec.body)])
  );
  unifiedLatexUtilReplace.replaceNode(tree, (node) => {
    if (!unifiedLatexUtilMatch.match.anyMacro(node)) {
      return;
    }
    const macroName = node.content;
    const expander = expanderCache.get(macroName);
    if (!expander) {
      return;
    }
    return expander(node);
  });
}
function expandMacrosExcludingDefinitions(tree, macros) {
  const expanderCache = new Map(
    macros.map((spec) => [spec.name, createMacroExpander(spec.body)])
  );
  unifiedLatexUtilReplace.replaceNode(tree, (node, info) => {
    if (!unifiedLatexUtilMatch.match.anyMacro(node)) {
      return;
    }
    const macroName = node.content;
    const expander = expanderCache.get(macroName);
    if (!expander) {
      return;
    }
    if (info.parents.some((n) => newcommandMatcher(n))) {
      return;
    }
    return expander(node);
  });
}
exports.LATEX_NEWCOMMAND = LATEX_NEWCOMMAND;
exports.XPARSE_NEWCOMMAND = XPARSE_NEWCOMMAND;
exports.createMacroExpander = createMacroExpander;
exports.createMatchers = createMatchers;
exports.expandMacros = expandMacros;
exports.expandMacrosExcludingDefinitions = expandMacrosExcludingDefinitions;
exports.listNewcommands = listNewcommands;
exports.newcommandMacroToName = newcommandMacroToName;
exports.newcommandMacroToSpec = newcommandMacroToSpec;
exports.newcommandMacroToSubstitutionAst = newcommandMacroToSubstitutionAst;
exports.newcommandMatcher = newcommandMatcher;
exports.parseMacroSubstitutions = parseMacroSubstitutions;
//# sourceMappingURL=index.cjs.map
