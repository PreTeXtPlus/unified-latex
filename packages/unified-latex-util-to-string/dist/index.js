import Prettier from "prettier/standalone.js";
import { printLatexAst } from "@unified-latex/unified-latex-prettier";
import { printRaw } from "@unified-latex/unified-latex-util-print-raw";
import { unified } from "unified";
//#region libs/compiler-string.ts
/**
* Unified complier plugin that prints a LaTeX AST as a string.
*/
var unifiedLatexStringCompiler = function unifiedLatexStringCompiler(options) {
	const { pretty = false, printWidth = 80, useTabs = true, forceNewlineEnding = false } = options || {};
	const prettyPrinter = (ast) => {
		let formatted = Prettier.format("_", {
			useTabs,
			printWidth,
			parser: "latex-dummy-parser",
			plugins: [{
				languages: [{
					name: "latex",
					extensions: [".tex"],
					parsers: ["latex-dummy-parser"]
				}],
				parsers: { "latex-dummy-parser": {
					parse: () => ast,
					astFormat: "latex-ast",
					locStart: () => 0,
					locEnd: () => 1
				} },
				printers: { "latex-ast": { print: printLatexAst } }
			}],
			...options || {}
		});
		if (forceNewlineEnding && !formatted.endsWith("\n")) formatted += "\n";
		return formatted;
	};
	Object.assign(this, { Compiler: (ast) => {
		if (!pretty) return printRaw(ast);
		return prettyPrinter(ast);
	} });
};
//#endregion
//#region libs/to-string.ts
var processor = unified().use(unifiedLatexStringCompiler, { pretty: true }).freeze();
/**
* Convert an AST into a string, pretty-printing the result. If you want more control
* over the formatting (e.g. spaces/tabs, etc.) use `unified().use(unifiedLatexStringCompiler, options)`
* directly.
*/
function toString(ast) {
	if (Array.isArray(ast)) ast = {
		type: "root",
		content: ast
	};
	if (ast.type !== "root") ast = {
		type: "root",
		content: [ast]
	};
	return processor.stringify(ast);
}
//#endregion
//#region index.ts
/**
* ## What is this?
*
* Functions parse strings to a `unified-latex` Abstract Syntax Tree (AST).
*
* ## When should I use this?
*
* If you have a string that you would like to parse to a `unified-latex` `Ast.Ast`, or
* if you are building a plugin for `unified()` that manipulates LaTeX.
*/
//#endregion
export { toString, unifiedLatexStringCompiler };

//# sourceMappingURL=index.js.map