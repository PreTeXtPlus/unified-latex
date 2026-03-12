#!/usr/bin/env node
import { unified } from "unified";
import { unifiedLatexFromString, parse } from "@unified-latex/unified-latex-util-parse";
import { unifiedLatexStringCompiler } from "@unified-latex/unified-latex-util-to-string";
import process from "node:process";
import stream from "node:stream";
import chalk from "chalk";
import chokidar from "chokidar";
import { engine } from "unified-engine";
import { unifiedLatexToHast } from "@unified-latex/unified-latex-to-hast";
import { unifiedLatexToMdast } from "@unified-latex/unified-latex-to-mdast";
import { unifiedLatexToPretext } from "@unified-latex/unified-latex-to-pretext";
import table from "text-table";
import camelcase from "camelcase";
import minimist from "minimist";
import json5 from "json5";
import { fault } from "fault";
import { lints } from "@unified-latex/unified-latex-lint";
import { newcommandMacroToName, newcommandMacroToSpec, newcommandMacroToSubstitutionAst, listNewcommands, expandMacros, expandMacrosExcludingDefinitions } from "@unified-latex/unified-latex-util-macros";
import { listPackages } from "@unified-latex/unified-latex-util-packages";
import { printRaw } from "@unified-latex/unified-latex-util-print-raw";
import { attachMacroArgs } from "@unified-latex/unified-latex-util-arguments";
import rehypeStringify from "rehype-stringify";
import Prettier from "prettier";
import remarkStringify from "remark-stringify";
import fs from "node:fs";
const processLatexViaUnified = (options2) => {
  return unified().use(
    unifiedLatexFromString,
    Object.assign({ environments: {}, macros: {} }, options2)
  ).use(
    unifiedLatexStringCompiler,
    Object.assign({ pretty: true, forceNewlineEnding: true }, options2)
  );
};
const availableLints = Object.fromEntries(
  Object.values(lints).map((lint) => [
    lint.name.replace(/^unified-latex-lint:/, ""),
    lint
  ])
);
const schema = [
  {
    long: "help",
    description: "Output usage information",
    short: "h",
    type: "boolean",
    default: false
  },
  {
    long: "version",
    description: "Output version number",
    short: "v",
    type: "boolean",
    default: false
  },
  {
    long: "output",
    description: "Specify output location",
    short: "o",
    value: "[path]"
  },
  {
    long: "rc-path",
    description: "Specify configuration file",
    short: "r",
    type: "string",
    value: "<path>"
  },
  {
    long: "ignore-path",
    description: "Specify ignore file",
    short: "i",
    type: "string",
    value: "<path>"
  },
  {
    long: "ext",
    description: "Specify extensions",
    type: "string",
    value: "<extensions>"
  },
  {
    long: "lint",
    description: `Lint rules to apply. Use multiple times to specify multiple lints. Available rules: ${Object.keys(
      availableLints
    ).join(", ")}`,
    short: "l",
    type: "string",
    value: "<rule>"
  },
  {
    long: "lint-all",
    description: `Apply all available lint rules`,
    type: "boolean",
    default: false
  },
  {
    long: "fix-all",
    description: "Apply fixes for all applied lints",
    type: "boolean",
    default: false
  },
  {
    long: "watch",
    description: "Watch for changes and reprocess",
    short: "w",
    type: "boolean",
    default: false
  },
  {
    long: "macro",
    description: "Attach arguments of the specified macro (by default, unrecognized macros are parsed as having no arguments). Accepts a string of the form `\\newcommand{<name>}[<num args>]{<body>}` or a JSON string `{name: <name>, signature: <xparse argument signature>, body: <macro body>}`",
    short: "m",
    type: "string",
    value: "<rule>"
  },
  {
    long: "expand-macro",
    description: "Expand the specified macro. Accepts a string of the form `\\newcommand{<name>}[<num args>]{<body>}` or a JSON string `{name: <name>, signature: <xparse argument signature>, body: <macro body>}`",
    short: "e",
    type: "string",
    value: "<rule>"
  },
  {
    long: "expand-document-macro",
    description: "Expand the specified macro which is defined in the document. You can use --stats to list all macros defined in the document.",
    short: "d",
    type: "string",
    value: "<name>"
  },
  {
    long: "frail",
    description: "Exit with 1 on warnings",
    type: "boolean",
    default: false
  },
  {
    long: "tree",
    description: "Specify input and output as syntax tree",
    type: "boolean",
    default: false
  },
  {
    long: "report",
    description: "Specify reporter",
    type: "string",
    value: "<reporter>"
  },
  {
    long: "file-path",
    description: "Specify path to process as",
    type: "string",
    value: "<path>"
  },
  {
    long: "ignore-path-resolve-from",
    description: "Resolve patterns in `ignore-path` from its directory or cwd",
    type: "string",
    value: "dir|cwd",
    default: "dir"
  },
  {
    long: "ignore-pattern",
    description: "Specify ignore patterns",
    type: "string",
    value: "<globs>"
  },
  {
    long: "silently-ignore",
    description: "Do not fail when given ignored files",
    type: "boolean"
  },
  {
    long: "tree-in",
    description: "Specify input as syntax tree",
    type: "boolean"
  },
  {
    long: "tree-out",
    description: "Output syntax tree",
    type: "boolean"
  },
  {
    long: "inspect",
    description: "Output formatted syntax tree",
    type: "boolean"
  },
  {
    long: "stats",
    description: "Show information about the processed file",
    type: "boolean",
    default: false
  },
  {
    long: "stats-json",
    description: "Show information about the processed file and output the information as JSON",
    type: "boolean",
    default: false
  },
  {
    long: "html",
    description: "Convert the output to HTML. Note, for math to render properly, you will need to add a library like MathJax or KaTeX to your HTMl source; you should also expand/replace any macros not recognized by the converter",
    type: "boolean",
    default: false
  },
  {
    long: "markdown",
    description: "Convert the output to Markdown. Markdown output uses Github-flavored Markdown to support math",
    type: "boolean",
    default: false
  },
  {
    long: "pretext",
    description: "Convert the output to PreTeXt. Note, you should expand/replace any macros not recognized by the converter",
    type: "boolean",
    default: false
  },
  {
    long: "stdout",
    description: "[Don't] write the processed file's contents to stdout",
    type: "boolean",
    truelike: true
  },
  {
    long: "color",
    description: "Specify color in report",
    type: "boolean",
    default: true
  },
  {
    long: "config",
    description: "Search for configuration files",
    type: "boolean",
    default: true
  },
  {
    long: "ignore",
    description: "Search for ignore files",
    type: "boolean",
    default: true
  }
];
function parseMacroExpansion(def) {
  if (def.startsWith("\\")) {
    const macro = parse(def).content[0];
    const name = newcommandMacroToName(macro);
    if (!name) {
      throw new Error(
        `Could extract macro definition from "${def}"; expected the macro to be defined via \\newcommand or similar syntax`
      );
    }
    const signature = newcommandMacroToSpec(macro);
    const body = newcommandMacroToSubstitutionAst(macro);
    return { name, signature, body };
  }
  const parsedSpec = json5.parse(def);
  if (parsedSpec.name == null || parsedSpec.body == null) {
    throw new Error(
      `Expected a "name" field and a "body" field to be defined on ${def}`
    );
  }
  parsedSpec.signature = parsedSpec.signature || "";
  return {
    name: parsedSpec.name,
    signature: parsedSpec.signature,
    body: parse(parsedSpec.body).content
  };
}
const own = {}.hasOwnProperty;
const minischema = {
  unknown: handleUnknownArgument,
  default: {},
  alias: {},
  string: [],
  boolean: []
};
let index = -1;
while (++index < schema.length) {
  addEach(schema[index]);
}
function options(flags, configuration) {
  const extension = configuration.extensions[0];
  const name = configuration.name;
  const config = toCamelCase(minimist(flags, minischema));
  let index2 = -1;
  while (++index2 < schema.length) {
    const option = schema[index2];
    if (option.type === "string" && config[option.long] === "") {
      throw fault("Missing value:%s", inspect(option).join(" "));
    }
  }
  const ext = commaSeparated(config.ext);
  const report = reporter(config.report);
  const help = [
    inspectAll(schema),
    "",
    "Examples:",
    "",
    "  # Process `input." + extension + "`",
    "  $ " + name + " input." + extension + " -o output." + extension,
    "",
    "  # Pipe",
    "  $ " + name + " < input." + extension + " > output." + extension,
    "",
    "  # Rewrite all applicable files",
    "  $ " + name + " . -o",
    "",
    "  # Lint files and display the lint output (but not the processed file)",
    "  $ " + name + " . --lint-all --no-stdout"
  ].join("\n");
  const settings = parseSettings(config.setting);
  if (config.html && config.statsJson) {
    throw new Error(
      "Both --html and --stats-json were specified; only one may be used at a time."
    );
  }
  return {
    helpMessage: help,
    cwd: configuration.cwd,
    processor: configuration.processor,
    help: config.help,
    version: config.version,
    // XXX I have no idea why `minimist` is not assigning unknown arguments to "_"
    // but it appears unknown arguments are being assigned to "" instead...
    files: config._ || config[""],
    filePath: config.filePath,
    watch: config.watch,
    extensions: ext.length === 0 ? configuration.extensions : ext,
    output: config.output,
    out: config.stdout,
    tree: config.tree,
    treeIn: config.treeIn,
    treeOut: config.treeOut,
    inspect: config.inspect,
    rcName: configuration.rcName,
    packageField: configuration.packageField,
    rcPath: config.rcPath,
    detectConfig: config.config,
    settings,
    ignoreName: configuration.ignoreName,
    ignorePath: config.ignorePath,
    ignorePathResolveFrom: config.ignorePathResolveFrom,
    ignorePatterns: commaSeparated(config.ignorePattern),
    silentlyIgnore: config.silentlyIgnore,
    detectIgnore: config.ignore,
    pluginPrefix: configuration.pluginPrefix,
    plugins: [],
    lints: normalizeLints(config.lint, config),
    reporter: report[0],
    reporterOptions: report[1],
    color: config.color,
    silent: config.silent,
    quiet: config.quiet,
    frail: config.frail,
    stats: config.stats,
    statsJson: config.statsJson,
    expandMacro: normalizeToArray(config.expandMacro).map(
      parseMacroExpansion
    ),
    expandDocumentMacro: normalizeToArray(
      config.expandDocumentMacro
    ),
    macro: normalizeToArray(config.macro).map(
      parseMacroExpansion
    ),
    html: config.html,
    markdown: config.markdown,
    pretext: config.pretext
  };
}
function addEach(option) {
  const value = option.default;
  minischema.default[option.long] = value === void 0 ? null : value;
  if (option.type && option.type in minischema) {
    minischema[option.type].push(option.long);
  }
  if (option.short) {
    minischema.alias[option.short] = option.long;
  }
}
function commaSeparated(value) {
  return normalizeToArray(value).flatMap((d) => splitOnComma(d));
}
function normalizeLints(value, config) {
  const normalized = normalizeToArray(value).map(splitOnEquals);
  validateLintNames(normalized);
  if (config.lintAll) {
    normalized.push(...Object.keys(availableLints).map((v) => [v]));
  }
  const result = Object.fromEntries(
    normalized.map((value2) => {
      let params = value2[1] ? parseConfig(value2[1], {}) : void 0;
      if (config.fixAll) {
        if (params) {
          Object.assign(params, { fix: true });
        } else {
          params = { fix: true };
        }
      }
      return [value2[0], params];
    })
  );
  return result;
}
function reporter(value) {
  const all = normalizeToArray(value).map(splitOnEquals).map((value2) => [
    value2[0],
    value2[1] ? parseConfig(value2[1], {}) : void 0
  ]);
  return all[all.length - 1] || [];
}
function parseSettings(value) {
  const normalized = normalizeToArray(value);
  const cache = {};
  for (const value2 of normalized) {
    parseConfig(value2, cache);
  }
  return cache;
}
function parseConfig(value, cache) {
  let flags;
  let flag;
  try {
    flags = toCamelCase(parseJSON(value));
  } catch (error) {
    const exception = error;
    throw fault(
      "Cannot parse `%s` as JSON: %s",
      value,
      // Fix position
      exception.message.replace(/at(?= position)/, "around")
    );
  }
  for (flag in flags) {
    if (own.call(flags, flag)) {
      cache[flag] = flags[flag];
    }
  }
  return cache;
}
function validateLintNames(lints2) {
  for (const lint of lints2) {
    const name = lint[0];
    if (!availableLints[name]) {
      const known = Object.keys(availableLints);
      throw fault(
        "Unknown lint rule `%s`, available rules are:\n%s",
        name,
        "	" + known.join("\n	")
      );
    }
  }
  return true;
}
function handleUnknownArgument(flag) {
  if (flag.charAt(0) === "-") {
    if (flag.charAt(1) === "-") {
      throw fault(
        "Unknown option `%s`, expected:\n%s",
        flag,
        inspectAll(schema)
      );
    }
    const found = flag.slice(1).split("");
    const known = schema.filter((d) => d.short);
    const knownKeys = new Set(known.map((d) => d.short));
    let index2 = -1;
    while (++index2 < found.length) {
      const key = found[index2];
      if (!knownKeys.has(key)) {
        throw fault(
          "Unknown short option `-%s`, expected:\n%s",
          key,
          inspectAll(known)
        );
      }
    }
  }
  return true;
}
function inspectAll(options2) {
  return table(options2.map((d) => inspect(d)));
}
function inspect(option) {
  let description = option.description;
  let long = option.long;
  if (option.default === true || option.truelike) {
    description += " (on by default)";
    long = "[no-]" + long;
  }
  return [
    "",
    option.short ? "-" + option.short : "",
    "--" + long + (option.value ? " " + option.value : ""),
    description
  ];
}
function normalizeToArray(value) {
  if (!value) {
    return [];
  }
  if (typeof value === "string") {
    return [value];
  }
  return value;
}
function splitOnEquals(value) {
  return value.split("=");
}
function splitOnComma(value) {
  return value.split(",");
}
function toCamelCase(object) {
  const result = {};
  let key;
  for (key in object) {
    if (own.call(object, key)) {
      let value = object[key];
      if (value && typeof value === "object" && !Array.isArray(value)) {
        value = toCamelCase(value);
      }
      result[camelcase(key)] = value;
    }
  }
  return result;
}
function parseJSON(value) {
  return json5.parse("{" + value + "}");
}
function enclosingPosition(nodes) {
  var _a, _b, _c, _d;
  let start = { line: 1, column: 1, offset: 0 };
  let end = { line: 1, column: 1, offset: 0 };
  for (const node of nodes) {
    if (Number((_a = node.position) == null ? void 0 : _a.start.offset) < Number(start.offset)) {
      start = (_b = node.position) == null ? void 0 : _b.start;
    }
    if (Number((_c = node.position) == null ? void 0 : _c.end.offset) > Number(end.offset)) {
      end = (_d = node.position) == null ? void 0 : _d.end;
    }
  }
  return { start, end };
}
const statsPlugin = function() {
  return (tree, file) => {
    const packages = listPackages(tree);
    const packageNames = packages.map((s) => printRaw(s));
    if (packages.length > 0) {
      file.info(
        `Found ${packages.length} imported packages: ${packageNames.join(", ")}`
      );
    }
    const newcommands = listNewcommands(tree);
    if (newcommands.length > 0) {
      file.info(
        `Found ${newcommands.length} defined commands: ${newcommands.map((c) => `\\${c.name}`).join(", ")}`,
        enclosingPosition(newcommands.map((c) => c.definition))
      );
    }
  };
};
const statsJsonPlugin = function() {
  this.Compiler = (tree, file) => {
    file.extname = ".json";
    file.basename += "-stats";
    const packages = listPackages(tree).map((s) => printRaw(s));
    const newcommands = listNewcommands(tree).map((c) => ({
      name: c.name,
      signature: c.signature,
      body: printRaw(c.body),
      definition: printRaw(c.definition)
    }));
    return JSON.stringify({ packages, newcommands }, null, 4) + "\n";
  };
};
const expandMacrosPlugin = function(options2) {
  const { macros = [] } = options2 || {};
  const macroInfo = Object.fromEntries(
    macros.map((m) => [m.name, { signature: m.signature }])
  );
  return (tree) => {
    attachMacroArgs(tree, macroInfo);
    expandMacros(tree, macros);
  };
};
const attachMacroArgsPlugin = function(options2) {
  const { macros = [] } = options2 || {};
  const macroInfo = Object.fromEntries(
    macros.map((m) => [m.name, { signature: m.signature }])
  );
  return (tree) => {
    attachMacroArgs(tree, macroInfo);
  };
};
const prettyPrintHtmlPlugin = function() {
  const processor = unified().use(rehypeStringify);
  this.Compiler = (tree, file) => {
    file.extname = ".html";
    const html = processor.stringify(tree, file);
    try {
      return Prettier.format(html, { parser: "html", useTabs: true });
    } catch {
    }
    return html;
  };
};
const expandDocumentMacrosPlugin = function(options2) {
  const { macros = [] } = options2 || {};
  const macrosSet = new Set(macros);
  return (tree) => {
    const newcommands = listNewcommands(tree);
    const macros2 = newcommands.filter((s) => macrosSet.has(s.name));
    const macroInfo = Object.fromEntries(
      macros2.map((m) => [m.name, { signature: m.signature }])
    );
    attachMacroArgs(tree, macroInfo);
    expandMacrosExcludingDefinitions(tree, macros2);
  };
};
const ttyStream = Object.assign(new stream.Readable(), { isTTY: true });
let exitStatus = 0;
process.on("exit", onexit);
process.on("uncaughtException", fail);
function unifiedArgs(cliConfig) {
  let config;
  let watcher;
  let output;
  try {
    config = options(process.argv.slice(2), cliConfig);
  } catch (error) {
    const exception = error;
    return fail(exception, true);
  }
  const processorOptions = { macros: {}, environments: {} };
  const originalProcessor = config.processor;
  config.processor = () => originalProcessor(processorOptions);
  if (config.help) {
    process.stdout.write(
      [
        "Usage: " + cliConfig.name + " [options] [path | glob ...]",
        "",
        "  " + cliConfig.description,
        "",
        "Options:",
        "",
        config.helpMessage,
        ""
      ].join("\n"),
      noop
    );
    return;
  }
  if (config.version) {
    process.stdout.write(cliConfig.version + "\n", noop);
    return;
  }
  if (config.watch) {
    output = config.output;
    config.streamIn = ttyStream;
    config.out = false;
    process.stderr.write(
      chalk.bold("Watching...") + " (press CTRL+C to exit)\n",
      noop
    );
    if (output === true) {
      config.output = false;
      process.stderr.write(
        chalk.yellow("Note") + ": Ignoring `--output` until exit.\n",
        noop
      );
    }
  }
  if (config.lints) {
    for (const [lintName, lintArgs] of Object.entries(config.lints)) {
      const lint = availableLints[lintName];
      if (!lint) {
        throw new Error(
          `Could not find lint named "${lintName}"; available lints are ${Object.keys(
            availableLints
          ).join(", ")}`
        );
      }
      config.plugins.push([lint, lintArgs]);
    }
  }
  if (config.stats) {
    config.plugins.push([statsPlugin]);
  }
  if (config.macro.length > 0) {
    config.plugins.push([attachMacroArgsPlugin, { macros: config.macro }]);
  }
  if (config.expandMacro.length > 0) {
    processorOptions.macros = Object.assign(
      processorOptions.macros || {},
      Object.fromEntries(
        config.expandMacro.map((m) => [
          m.name,
          { signature: m.signature }
        ])
      )
    );
    config.plugins.push([
      expandMacrosPlugin,
      { macros: config.expandMacro }
    ]);
  }
  if (config.expandDocumentMacro.length > 0) {
    config.plugins.push([
      expandDocumentMacrosPlugin,
      { macros: config.expandDocumentMacro }
    ]);
  }
  if (config.statsJson) {
    config.plugins.push([statsJsonPlugin]);
  }
  if (config.html) {
    config.plugins.push([unifiedLatexToHast]);
    config.plugins.push([prettyPrintHtmlPlugin]);
  }
  if (config.markdown) {
    config.plugins.push([unifiedLatexToMdast]);
    config.plugins.push([remarkStringify]);
  }
  if (config.pretext) {
    config.plugins.push([unifiedLatexToPretext]);
    config.plugins.push([prettyPrintHtmlPlugin]);
  }
  const done = function done2(error, code, context) {
    if (error) {
      clean();
      fail(error);
    } else {
      exitStatus = code || 0;
      if (config.watch && !watcher && context) {
        subscribe(context);
      }
    }
  };
  function clean() {
    if (watcher) {
      watcher.close();
      watcher = void 0;
    }
  }
  function subscribe(context) {
    var _a;
    watcher = chokidar.watch(((_a = context.fileSet) == null ? void 0 : _a.origins) || [], {
      cwd: config.cwd != null ? "" + config.cwd : config.cwd,
      ignoreInitial: true
    }).on("error", done).on("change", (filePath) => {
      config.files = [filePath];
      engine(config, done);
    });
    process.on("SIGINT", onsigint);
    function onsigint() {
      process.stderr.write("\n", noop);
      clean();
      if (output === true) {
        config.output = output;
        config.watch = false;
        engine(config, done);
      }
    }
  }
  engine(config, done);
}
function fail(error, pretty) {
  const message = String((pretty ? error : error.stack) || error);
  exitStatus = 1;
  process.stderr.write(message.trim() + "\n", noop);
}
function onexit() {
  process.exit(exitStatus);
}
function noop() {
}
let version = "unknown (could not read version from package.json)";
try {
  const packageJson = JSON.parse(
    fs.readFileSync(new URL("data:application/json;base64,ewogICAgIm5hbWUiOiAiQHVuaWZpZWQtbGF0ZXgvdW5pZmllZC1sYXRleC1jbGkiLAogICAgInZlcnNpb24iOiAiMS44LjMiLAogICAgImRlc2NyaXB0aW9uIjogIkNvbW1hbmQgbGluZSBpbnRlcmZhY2UgdG8gY29tbW9uIHVuaWZpZWQtbGF0ZXggb3B0aW9ucyIsCiAgICAibWFpbiI6ICJkaXN0L2luZGV4LmpzIiwKICAgICJ0eXBlIjogIm1vZHVsZSIsCiAgICAiYmluIjogewogICAgICAgICJ1bmlmaWVkLWxhdGV4IjogIi4vdW5pZmllZC1sYXRleC1jbGkubWpzIgogICAgfSwKICAgICJkZXBlbmRlbmNpZXMiOiB7CiAgICAgICAgIkB0eXBlcy9oYXN0IjogIl4yLjMuOSIsCiAgICAgICAgIkB1bmlmaWVkLWxhdGV4L3VuaWZpZWQtbGF0ZXgtbGludCI6ICJeMS44LjMiLAogICAgICAgICJAdW5pZmllZC1sYXRleC91bmlmaWVkLWxhdGV4LXRvLWhhc3QiOiAiXjEuOC4zIiwKICAgICAgICAiQHVuaWZpZWQtbGF0ZXgvdW5pZmllZC1sYXRleC10by1tZGFzdCI6ICJeMS44LjMiLAogICAgICAgICJAdW5pZmllZC1sYXRleC91bmlmaWVkLWxhdGV4LXRvLXByZXRleHQiOiAiXjEuOC4zIiwKICAgICAgICAiQHVuaWZpZWQtbGF0ZXgvdW5pZmllZC1sYXRleC10eXBlcyI6ICJeMS44LjAiLAogICAgICAgICJAdW5pZmllZC1sYXRleC91bmlmaWVkLWxhdGV4LXV0aWwtYXJndW1lbnRzIjogIl4xLjguMyIsCiAgICAgICAgIkB1bmlmaWVkLWxhdGV4L3VuaWZpZWQtbGF0ZXgtdXRpbC1tYWNyb3MiOiAiXjEuOC4zIiwKICAgICAgICAiQHVuaWZpZWQtbGF0ZXgvdW5pZmllZC1sYXRleC11dGlsLXBhY2thZ2VzIjogIl4xLjguMyIsCiAgICAgICAgIkB1bmlmaWVkLWxhdGV4L3VuaWZpZWQtbGF0ZXgtdXRpbC1wYXJzZSI6ICJeMS44LjMiLAogICAgICAgICJAdW5pZmllZC1sYXRleC91bmlmaWVkLWxhdGV4LXV0aWwtcHJpbnQtcmF3IjogIl4xLjguMCIsCiAgICAgICAgIkB1bmlmaWVkLWxhdGV4L3VuaWZpZWQtbGF0ZXgtdXRpbC10by1zdHJpbmciOiAiXjEuOC4zIiwKICAgICAgICAiY2FtZWxjYXNlIjogIl43LjAuMSIsCiAgICAgICAgImNoYWxrIjogIl41LjIuMCIsCiAgICAgICAgImNob2tpZGFyIjogIl4zLjUuMyIsCiAgICAgICAgImZhdWx0IjogIl4yLjAuMSIsCiAgICAgICAgImhhc3RzY3JpcHQiOiAiXjcuMi4wIiwKICAgICAgICAianNvbjUiOiAiXjIuMi4zIiwKICAgICAgICAibWluaW1pc3QiOiAiXjEuMi43IiwKICAgICAgICAicHJldHRpZXIiOiAiXjIuOC44IiwKICAgICAgICAicmVoeXBlLXN0cmluZ2lmeSI6ICJeOS4wLjQiLAogICAgICAgICJyZW1hcmstc3RyaW5naWZ5IjogIl4xMC4wLjMiLAogICAgICAgICJ0ZXh0LXRhYmxlIjogIl4wLjIuMCIsCiAgICAgICAgInVuaWZpZWQiOiAiXjEwLjEuMiIsCiAgICAgICAgInVuaWZpZWQtZW5naW5lIjogIl4xMC4xLjAiCiAgICB9LAogICAgImZpbGVzIjogWwogICAgICAgICJkaXN0LyoqLyoudHMiLAogICAgICAgICJkaXN0LyoqLyouanMiLAogICAgICAgICJkaXN0LyoqLyoubWFwIiwKICAgICAgICAiZGlzdC8qKi8qLmpzb24iCiAgICBdLAogICAgImV4cG9ydHMiOiB7CiAgICAgICAgIi4iOiB7CiAgICAgICAgICAgICJwcmVidWlsdCI6ICIuL2Rpc3QvaW5kZXguanMiLAogICAgICAgICAgICAiaW1wb3J0IjogIi4vaW5kZXgudHMiLAogICAgICAgICAgICAicmVxdWlyZSI6ICIuL2Rpc3QvaW5kZXguY2pzIgogICAgICAgIH0sCiAgICAgICAgIi4vKmpzIjogIi4vZGlzdC8qanMiLAogICAgICAgICIuLyoiOiB7CiAgICAgICAgICAgICJwcmVidWlsdCI6ICIuL2Rpc3QvKi5qcyIsCiAgICAgICAgICAgICJpbXBvcnQiOiAiLi8qLnRzIiwKICAgICAgICAgICAgInJlcXVpcmUiOiAiLi9kaXN0LyouY2pzIgogICAgICAgIH0KICAgIH0sCiAgICAic2NyaXB0cyI6IHsKICAgICAgICAiYnVpbGQiOiAibnBtIHJ1biBjbGVhbiAmJiBta2RpcnAgLi9kaXN0ICYmIG5wbSBydW4gY29tcGlsZSIsCiAgICAgICAgImNsZWFuIjogInJpbXJhZiAuL2Rpc3QiLAogICAgICAgICJjb21waWxlIjogIndpcmVpdCIsCiAgICAgICAgImNvbXBpbGU6Y2pzIjogIndpcmVpdCIsCiAgICAgICAgImNvbXBpbGU6ZXNtIjogIndpcmVpdCIsCiAgICAgICAgImNvbXBpbGU6ZXhlY3V0YWJsZSI6ICJlY2hvICcjIS91c3IvYmluL2VudiBub2RlJyA+IGRpc3QvdW5pZmllZC1sYXRleC1jbGkubWpzICYmIGNhdCBkaXN0L2luZGV4LmpzID4+IGRpc3QvdW5pZmllZC1sYXRleC1jbGkubWpzIiwKICAgICAgICAicGFja2FnZSI6ICJub2RlIC4uLy4uL3NjcmlwdHMvbWFrZS1wYWNrYWdlLm1qcyIsCiAgICAgICAgInB1Ymxpc2giOiAiY2QgZGlzdCAmJiBucG0gcHVibGlzaCIsCiAgICAgICAgInRlc3QiOiAidml0ZXN0IgogICAgfSwKICAgICJ3aXJlaXQiOiB7CiAgICAgICAgImNvbXBpbGUiOiB7CiAgICAgICAgICAgICJjb21tYW5kIjogIm5wbSBydW4gY29tcGlsZTpleGVjdXRhYmxlIiwKICAgICAgICAgICAgImRlcGVuZGVuY2llcyI6IFsKICAgICAgICAgICAgICAgICJjb21waWxlOmNqcyIsCiAgICAgICAgICAgICAgICAiY29tcGlsZTplc20iCiAgICAgICAgICAgIF0KICAgICAgICB9LAogICAgICAgICJjb21waWxlOmNqcyI6IHsKICAgICAgICAgICAgImNvbW1hbmQiOiAidml0ZSBidWlsZCAtLW1vZGUgY29tbW9uanMiLAogICAgICAgICAgICAiZmlsZXMiOiBbCiAgICAgICAgICAgICAgICAiaW5kZXgudHMiLAogICAgICAgICAgICAgICAgImxpYnMvKiovKi50cyIsCiAgICAgICAgICAgICAgICAibGlicy8qKi8qLmpzb24iLAogICAgICAgICAgICAgICAgInRzY29uZmlnLmpzb24iLAogICAgICAgICAgICAgICAgInZpdGUuY29uZmlnLnRzIgogICAgICAgICAgICBdLAogICAgICAgICAgICAib3V0cHV0IjogWwogICAgICAgICAgICAgICAgImRpc3QvKiovKi5janMqIgogICAgICAgICAgICBdLAogICAgICAgICAgICAiZGVwZW5kZW5jaWVzIjogWwogICAgICAgICAgICAgICAgImRlcHMiCiAgICAgICAgICAgIF0KICAgICAgICB9LAogICAgICAgICJjb21waWxlOmVzbSI6IHsKICAgICAgICAgICAgImNvbW1hbmQiOiAidml0ZSBidWlsZCIsCiAgICAgICAgICAgICJmaWxlcyI6IFsKICAgICAgICAgICAgICAgICJpbmRleC50cyIsCiAgICAgICAgICAgICAgICAibGlicy8qKi8qLnRzIiwKICAgICAgICAgICAgICAgICJsaWJzLyoqLyouanNvbiIsCiAgICAgICAgICAgICAgICAidHNjb25maWcuanNvbiIsCiAgICAgICAgICAgICAgICAidml0ZS5jb25maWcudHMiCiAgICAgICAgICAgIF0sCiAgICAgICAgICAgICJvdXRwdXQiOiBbCiAgICAgICAgICAgICAgICAiZGlzdC8qKi8qLmpzKiIsCiAgICAgICAgICAgICAgICAiZGlzdC8qKi8qLmpzb24iLAogICAgICAgICAgICAgICAgImRpc3QvKiovKi5kLnRzIiwKICAgICAgICAgICAgICAgICJkaXN0LyoqLyoubWQiCiAgICAgICAgICAgIF0sCiAgICAgICAgICAgICJkZXBlbmRlbmNpZXMiOiBbCiAgICAgICAgICAgICAgICAiZGVwcyIKICAgICAgICAgICAgXQogICAgICAgIH0sCiAgICAgICAgImRlcHMiOiB7CiAgICAgICAgICAgICJkZXBlbmRlbmNpZXMiOiBbCiAgICAgICAgICAgICAgICAiLi4vdW5pZmllZC1sYXRleC1saW50OmNvbXBpbGUiLAogICAgICAgICAgICAgICAgIi4uL3VuaWZpZWQtbGF0ZXgtdG8taGFzdDpjb21waWxlIiwKICAgICAgICAgICAgICAgICIuLi91bmlmaWVkLWxhdGV4LXRvLW1kYXN0OmNvbXBpbGUiLAogICAgICAgICAgICAgICAgIi4uL3VuaWZpZWQtbGF0ZXgtdHlwZXM6Y29tcGlsZSIsCiAgICAgICAgICAgICAgICAiLi4vdW5pZmllZC1sYXRleC11dGlsLWFyZ3VtZW50czpjb21waWxlIiwKICAgICAgICAgICAgICAgICIuLi91bmlmaWVkLWxhdGV4LXV0aWwtbWFjcm9zOmNvbXBpbGUiLAogICAgICAgICAgICAgICAgIi4uL3VuaWZpZWQtbGF0ZXgtdXRpbC1wYWNrYWdlczpjb21waWxlIiwKICAgICAgICAgICAgICAgICIuLi91bmlmaWVkLWxhdGV4LXV0aWwtcGFyc2U6Y29tcGlsZSIsCiAgICAgICAgICAgICAgICAiLi4vdW5pZmllZC1sYXRleC11dGlsLXByaW50LXJhdzpjb21waWxlIiwKICAgICAgICAgICAgICAgICIuLi91bmlmaWVkLWxhdGV4LXV0aWwtdG8tc3RyaW5nOmNvbXBpbGUiCiAgICAgICAgICAgIF0KICAgICAgICB9CiAgICB9LAogICAgInJlcG9zaXRvcnkiOiB7CiAgICAgICAgInR5cGUiOiAiZ2l0IiwKICAgICAgICAidXJsIjogImdpdCtodHRwczovL2dpdGh1Yi5jb20vc2llZmtlbmovdW5pZmllZC1sYXRleC5naXQiCiAgICB9LAogICAgImtleXdvcmRzIjogWwogICAgICAgICJwZWdqcyIsCiAgICAgICAgImxhdGV4IiwKICAgICAgICAicGFyc2VyIiwKICAgICAgICAicHJldHRpZXIiLAogICAgICAgICJ1bmlmaWVkLWxhdGV4IiwKICAgICAgICAidW5pZmllZCIKICAgIF0sCiAgICAiYXV0aG9yIjogIkphc29uIFNpZWZrZW4iLAogICAgImxpY2Vuc2UiOiAiTUlUIiwKICAgICJidWdzIjogewogICAgICAgICJ1cmwiOiAiaHR0cHM6Ly9naXRodWIuY29tL3NpZWZrZW5qL3VuaWZpZWQtbGF0ZXgvaXNzdWVzIgogICAgfSwKICAgICJob21lcGFnZSI6ICJodHRwczovL2dpdGh1Yi5jb20vc2llZmtlbmovdW5pZmllZC1sYXRleCNyZWFkbWUiLAogICAgInByaXZhdGUiOiB0cnVlLAogICAgImRldkRlcGVuZGVuY2llcyI6IHsKICAgICAgICAiQHR5cGVzL2Nyb3NzLXNwYXduIjogIl42LjAuNiIsCiAgICAgICAgImNyb3NzLXNwYXduIjogIl43LjAuMyIsCiAgICAgICAgInNvdXJjZS1tYXAtc3VwcG9ydCI6ICJeMC41LjIxIgogICAgfQp9Cg==", import.meta.url), {
      encoding: "utf8"
    })
  );
  version = packageJson.version;
} catch {
}
unifiedArgs({
  processor: processLatexViaUnified,
  name: "unified-latex",
  description: "LaTeX processor powered by unified-latex",
  version,
  extensions: ["tex"],
  ignoreName: ".unifiedlatexignore",
  packageField: "unifiedLatexConfig",
  rcName: ".unifiedlatexrc",
  pluginPrefix: "@unified-latex/"
});
//# sourceMappingURL=index.js.map
