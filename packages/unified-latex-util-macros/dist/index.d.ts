import * as Ast from '@unified-latex/unified-latex-types';

/**
 * A factory function. Given a macro definition, creates a function that accepts
 * the macro's arguments and outputs an Ast with the contents substituted (i.e.,
 * it expands the macro).
 */
export declare function createMacroExpander(substitution: Ast.Node[]): (macro: Ast.Macro) => Ast.Node[];

export declare function createMatchers(): {
    isHash: (node: Ast.Node) => node is Ast.String;
    isNumber: (node: Ast.Node) => boolean;
    splitNumber: (node: Ast.String) => {
        number: number;
        rest: {
            type: string;
            content: string;
        };
    } | {
        number: number;
        rest?: undefined;
    };
};

/**
 * Expands macros in `ast` as specified by `macros`.
 * Each macro in `macros` should provide the substitution AST (i.e., the AST with the #1, etc.
 * in it). This function assumes that the appropriate arguments have already been attached
 * to each macro specified. If the macro doesn't have it's arguments attached, its
 * contents will be wholesale replaced with its substitution AST.
 */
export declare function expandMacros(tree: Ast.Ast, macros: {
    name: string;
    body: Ast.Node[];
}[]): void;

/**
 * Expands macros in `ast` as specified by `macros`, but do not expand any macros
 * that appear in the context of a macro definition. For example, expanding `\foo` to `X` in
 * ```
 * \newcommand{\foo}{Y}
 * \foo
 * ```
 * would result in
 * ```
 * \newcommand{\foo}{Y}
 * X
 * ```
 * If `expandMacros(...)` were used, macros would be expanded in all contexts and the result
 * would be
 * ```
 * \newcommand{X}{Y}
 * X
 * ```
 *
 * Each macro in `macros` should provide the substitution AST (i.e., the AST with the #1, etc.
 * in it). This function assumes that the appropriate arguments have already been attached
 * to each macro specified. If the macro doesn't have it's arguments attached, its
 * contents will be wholesale replaced with its substitution AST.
 */
export declare function expandMacrosExcludingDefinitions(tree: Ast.Ast, macros: {
    name: string;
    body: Ast.Node[];
}[]): void;

export declare interface HashNumber {
    type: "hash_number";
    number: number;
}

export declare const LATEX_NEWCOMMAND: Set<string>;

/**
 * List all new commands defined in `tree`. This lists commands defined LaTeX-style with
 * `\newcommand` etc., and defined with xparse-style `\NewDocumentCommand` etc. It does
 * **not** find commands defined via `\def` (it is too difficult to parse the argument
 * signature of commands defined with `\def`).
 */
export declare function listNewcommands(tree: Ast.Ast): NewCommandSpec[];

/**
 * Get the name of the macro defined with `\newcommand`/`\renewcommand`/etc..
 */
export declare function newcommandMacroToName(node: Ast.Macro): string;

/**
 * Compute the xparse argument signature of the `\newcommand`/`\renewcommand`/etc. macro.
 */
export declare function newcommandMacroToSpec(node: Ast.Macro): string;

/**
 * Returns the AST that should be used for substitution. E.g.,
 * `\newcommand{\foo}{\bar{#1}}` would return `\bar{#1}`.
 */
export declare function newcommandMacroToSubstitutionAst(node: Ast.Macro): Ast.Node[];

export declare const newcommandMatcher: Ast.TypeGuard<Ast.Macro & {
    content: string;
}>;

declare type NewCommandSpec = {
    name: string;
    signature: string;
    body: Ast.Node[];
    definition: Ast.Macro;
};

/**
 * Parse for macro substitutions. For example, in "\foo{#1}", the `#1`
 * is recognized as a `HashNumber` (`{type: "hash_number"}`). Double hashes
 * are automatically replaced with their single-hash substitutions.
 *
 * The resulting AST is ready for substitutions to be applied to it.
 */
export declare function parseMacroSubstitutions(ast: Ast.Node[]): (Ast.Node | HashNumber)[];

export declare const XPARSE_NEWCOMMAND: Set<string>;

export { }
