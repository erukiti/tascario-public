import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import rehypeRemark from "rehype-remark";
import remarkStringify from "remark-stringify";
import { visit } from 'unist-util-visit';
import { SKIP } from 'unist-util-visit-parents';
import type { Node } from "unist";
import { defaultSchema } from "hast-util-sanitize";

const rehypeNormalizeWhitespace = () => (tree: Node) => {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  visit(tree, "text", (node: any) => {
    node.value = node.value.replace(/\s+/g, " ");
  });
};

/** HTMLをMarkdownに変換 */
export const convertToMarkdown = (html: string): string => {
  const file = unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeRemark)
    .use(remarkStringify)
    .processSync(html);

  return String(file);
};

function removeEmptyNodes() {
  return (tree: any) => {
    visit(tree, (node, index, parent) => {
      // 親がない場合はスキップ
      if (!parent) return;

      // element タイプのノードで子要素を持たない場合は削除
      if (node.type === 'element') {
        // 1) 子が存在しない場合
        if (!node.children || node.children.length === 0) {
          parent.children.splice(index, 1);
          return [SKIP, index];
        }

        // 2) 子要素がすべてテキストノードで、しかも空白のみの場合
        const allWhitespace = node.children.every(child => {
          return child.type === 'text' && !child.value.trim();
        });

        if (allWhitespace) {
          parent.children.splice(index, 1);
          return [SKIP, index];
        }
      }
    });
  };
}

/** HTMLを整形する */
export const cleanHtml = async (html: string): Promise<string> => {
  const mySchema = {
    ...defaultSchema,
    // 必要に応じてタグ名を追加する（例えば html, head, body など）。
    // デフォルトのスキーマには含まれていない場合があります。
    tagNames: [
      ...(defaultSchema.tagNames || []),
      "title",
    ],
  };

  const file = await unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeSanitize, mySchema)
    .use(rehypeNormalizeWhitespace)
    .use(removeEmptyNodes)
    .use(rehypeStringify, { closeSelfClosing: true })
    .process(html);

  return String(file);
};
