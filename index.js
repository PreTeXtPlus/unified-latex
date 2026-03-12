import { unified } from "unified";
import { unifiedLatexToHast } from "@unified-latex/unified-latex-to-hast";
import rehypeRemark from "rehype-remark";
import { toString } from "hast-util-to-string";
import remarkStringify from "remark-stringify";
import { processLatexViaUnified } from "@unified-latex/unified-latex";
const defaultHandlers = {
  span(state, node, parent) {
    const className = node.properties.className || [];
    if (className.includes("inline-math")) {
      return { type: "html", value: `$${toString(node)}$` };
    }
    return state.all(node);
  },
  div(state, node, parent) {
    const className = node.properties.className || [];
    if (className.includes("display-math")) {
      return { type: "code", lang: "math", value: toString(node) };
    }
    return state.all(node);
  }
};
const unifiedLatexToMdast = function unifiedLatexToMdast2(options) {
  const handlers = Object.assign({}, defaultHandlers, options == null ? void 0 : options.handlers);
  options = Object.assign({}, options, { handlers });
  return (tree, file) => {
    const mdast = unified().use(unifiedLatexToHast, options).use(rehypeRemark, options).runSync(tree, file);
    return mdast;
  };
};
const _processor = processLatexViaUnified().use(unifiedLatexToMdast).use(remarkStringify);
function convertToMarkdown(tree, options) {
  let processor = _processor;
  if (!Array.isArray(tree) && tree.type !== "root") {
    tree = { type: "root", content: [tree] };
  }
  if (Array.isArray(tree)) {
    tree = { type: "root", content: tree };
  }
  if (options) {
    processor = _processor.use(unifiedLatexToMdast, options);
  }
  const mdast = processor.runSync(tree);
  return processor.stringify(mdast);
}
export {
  convertToMarkdown,
  unifiedLatexToMdast
};
//# sourceMappingURL=index.js.map
