import { unified } from "unified";
import { unifiedLatexAstComplier, unifiedLatexFromString } from "@unified-latex/unified-latex-util-parse";
import { unifiedLatexStringCompiler } from "@unified-latex/unified-latex-util-to-string";
//#region libs/unified-latex.ts
/**
* Use `unified()` to a string to an `Ast.Ast` and then pretty-print it.
*/
var processLatexViaUnified = (options) => {
	return unified().use(unifiedLatexFromString, options).use(unifiedLatexStringCompiler, Object.assign({ pretty: true }, options));
};
/**
* Use `unified()` to a string to an `Ast.Ast` and then return it. This function
* will not print/pretty-print the `Ast.Ast` back to a string.
*/
var processLatexToAstViaUnified = () => {
	return unified().use(unifiedLatexFromString).use(unifiedLatexAstComplier);
};
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
export { processLatexToAstViaUnified, processLatexViaUnified };

//# sourceMappingURL=index.js.map