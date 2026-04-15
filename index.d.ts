import type * as Ast from '@unified-latex/unified-latex-types';
import type * as Mdast from 'mdast';
import { Options } from 'rehype-remark';
import { Plugin as Plugin_2 } from 'unified';
import { PluginOptions as PluginOptions_2 } from '@unified-latex/unified-latex-to-hast';

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
export declare function convertToMarkdown(tree: Ast.Node | Ast.Node[], options?: PluginOptions): string;

export declare type PluginOptions = PluginOptions_2 & Options;

/**
 * Unified plugin to convert a `unified-latex` AST into a `mdast` AST.
 */
export declare const unifiedLatexToMdast: Plugin_2<PluginOptions[], Ast.Root, Mdast.Root>;

export { }
