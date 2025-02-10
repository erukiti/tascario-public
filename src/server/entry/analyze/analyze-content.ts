import { type ResponseSchema, SchemaType } from "@google-cloud/vertexai";
import { generateContent } from "~/server/gemini";
import { extractValidJson } from "~/server/gemini/generate-structured-content";
import type { Analyzed } from "~/server/entry/analyze/types";
import { topicsPrompt } from "~/analyze/constants";

// TODO: zodスキーマを使えるようにする!!!!!!

export const analyze = async (content: string): Promise<Analyzed> => {
  const prompt = `Contentは文章である。ただし不完全でノイズを含んでいることがある。これは日本人向けなので、必ず日本語で出力せよ。

1. Contentは必ずその文章の持つ主張があり、主張はこの文章全体で情報量が多いはずである。まずは主張を特定せよ
2. 主張を元にdescriptionを作成せよ
3. descriptionを元に、主張をすべて検証せよ
4. ノイズを取り除いた上で、残りの分析結果を日本語で出力せよ

※サイト全体で有効な情報、広告、広いアナウンスなどはノイズである可能性が高い

${topicsPrompt}

内容のカテゴリは以下から選ぶこと。
<Categories>
  <LLM conversations>LLMとユーザーの対話。必ず二人の対話形式であること</LLM conversations>
  <technical document>技術文書。技術的な内容が含まれていること</technical document>
  <news article>ニュース記事。最新の出来事に関する記事であること</news article>
  <other>その他</other>
</Categories>

<Content>${content}</Content>

必ず日本語で出力せよ。
`;

  const schema: ResponseSchema = {
    type: SchemaType.OBJECT,
    properties: {
      // 中間分析

      conversations: {
        type: SchemaType.ARRAY,
        description: "会話である場合、会話の配列（ノイズを除去すること）",
        items: {
          type: SchemaType.OBJECT,
          properties: {
            speaker: {
              type: SchemaType.STRING,
              description: "話者（人間 or LLM）",
            },
            text: { type: SchemaType.STRING, description: "会話内容全文" },
          },
        },
      },
      claims: {
        type: SchemaType.ARRAY,
        description: "主張を出せる限り出し尽くす",
        items: {
          type: SchemaType.OBJECT,
          properties: {
            text: { type: SchemaType.STRING, description: "主張" },
            source: { type: SchemaType.STRING, description: "情報源" },
            evidence: { type: SchemaType.STRING, description: "根拠" },
            certainty: {
              type: SchemaType.STRING,
              description: "確からしさ",
            },
          },
          required: ["text", "evidence", "certainty"],
        },
      },
      description: {
        type: SchemaType.STRING,
        description: "文書の要約を1000文字程度で",
      },
      topicValidation: {
        type: SchemaType.ARRAY,
        description: "descriptionを元に、主張を検証しなおす",
        items: {
          type: SchemaType.OBJECT,
          properties: {
            claims: {
              type: SchemaType.STRING,
              description: "検証する対象の主張",
            },
            summaryDescription: {
              type: SchemaType.STRING,
              description: "descriptionとの関連性を説明せよ",
            },
            reader: {
              type: SchemaType.STRING,
              description: "それは読者が知りたいことか？",
            },
            isRelevant: {
              type: SchemaType.ARRAY,
              description: "この文章の主題にそっているか？",
              items: { type: SchemaType.BOOLEAN },
            },
          },
        },
      },
      noises: {
        type: SchemaType.ARRAY,
        description: "除去すべきノイズ",
        items: { type: SchemaType.STRING },
      },

      // 成果物
      topics: {
        type: SchemaType.ARRAY,
        description: "文書のトピック",
        items: { type: SchemaType.STRING },
      },
      keywords: {
        type: SchemaType.ARRAY,
        description: "文書の重要なキーワード",
        items: { type: SchemaType.STRING },
      },
      knowledge: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING },
        description: "この文書から得られる知識・知見",
      },
      readingContexts: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING },
        description: "この文章が役立つシチュエーション",
      },
      // resolvedIssues: {
      //   type: SchemaType.ARRAY,
      //   description: "この文書によって解決すること（ノイズを除去すること）",
      //   items: { type: SchemaType.STRING },
      // },
      // unresolvedIssues: {
      //   type: SchemaType.ARRAY,
      //   description: "この文書で未解決のこと（ノイズを除去すること）",
      //   items: { type: SchemaType.STRING },
      // },
      suggestions: {
        type: SchemaType.ARRAY,
        description: "この文章から得られる提案",
        items: { type: SchemaType.STRING },
      },
      insights: {
        type: SchemaType.ARRAY,
        description: "この文章から得られる洞察",
        items: { type: SchemaType.STRING },
      },
      category: {
        type: SchemaType.STRING,
        description: "文書のカテゴリ",
        enum: [
          "LLM conversations",
          "technical document",
          "news article",
          "other",
        ],
      },
      summary: {
        type: SchemaType.STRING,
        description: "忙しい人向けに3000文字程度で分かりやすく解説せよ",
      },
      title: {
        type: SchemaType.STRING,
        description: "文書のタイトル",
      },
    },
    required: [
      "claims",
      "description",
      "topicValidation",
      "topics",
      "keywords",
      "noises",
      "suggestions",
      "summary",
      "insights",
      "category",
      "title",
      "knowledge",
      "readingContexts",
    ],
  };

  const t1 = Date.now();
  console.log("entry analyze");
  const res = await generateContent({
    prompt,
    responseSchema: schema,
  });

  console.log(118);
  try {
    const data = await extractValidJson(res?.text);
    console.log("analyzed", JSON.stringify(data, null, 2));
    console.log("analyze duration", (Date.now() - t1) / 1000, "s");

    return data;
  } catch (e) {
    console.log(res?.text);
    console.log(e);
    throw e;
  }
};
