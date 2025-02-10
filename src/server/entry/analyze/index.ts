import { analyze } from "~/server/entry/analyze/analyze-content";
import { getEmbeddingsVertexAi } from "~/server/embedding";
import { convertToMarkdown } from "~/server/utils";

type Args = {
  content: string;
  isHtml: boolean;
};

export const analyzeEntry = async ({ content, isHtml }: Args) => {
  const text = isHtml ? convertToMarkdown(content) : content;

  const analyzed = await analyze(text);

  const texts: string[] = [
    ...analyzed.knowledge,
    ...analyzed.readingContexts,
    ...analyzed.insights,
  ];

  const embeddings = await getEmbeddingsVertexAi(texts);

  return {
    ...analyzed,
    embeddings,
    // text,
  };
};
