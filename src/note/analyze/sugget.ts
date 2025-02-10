import { type ResponseSchema, SchemaType } from "@google-cloud/vertexai";
import type { InDepthTextEvaluation, Suggestion } from "~/note/analyze/types";
import { generateContent } from "~/server/gemini";
import { extractValidJson } from "~/server/gemini/generate-structured-content";

// TODO: zodスキーマ!!!!

/**
 * 個々に分析された結果を元に、示唆を出す
 */
export const suggest = async (
  input: InDepthTextEvaluation[],
): Promise<Suggestion> => {
  const prompt = `InDepthTextEvaluationsは、ユーザーが自由形式で、徒然なく脳内の思考を吐き出したテキストを分析した結果の配列である。日本語で示唆を出力せよ

* すべてのテキストには、分析して示唆を出す価値があるとは限らない

<InDepthTextEvaluations>
${JSON.stringify(input)}
</InDepthTextEvaluations>
`;

  const schema: ResponseSchema = {
    type: SchemaType.OBJECT,
    properties: {
      // 中間分析
      context: {
        type: SchemaType.OBJECT,
        properties: {
          purpose: {
            type: SchemaType.STRING,
            description: "テキストの目的",
          },
          underlyingAssumptions: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "テキストの背後にある前提、暗黙の了解",
          },
        },
      },
      logic: {
        type: SchemaType.STRING,
        description: "これらテキストの論理性を説明せよ",
      },
      problems: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING },
        description: "テキストから読み取れる課題、問題点",
      },
      opportunities: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING },
        description: "テキストから見出せる機会、可能性",
      },

      // 成果物
      durationCategory: {
        type: SchemaType.STRING,
        description: "長期・中期・短期",
      },
      title: {
        type: SchemaType.STRING,
        description: "テキストのタイトル",
      },
      solutionIdeas: {
        type: SchemaType.ARRAY,
        description: "テキスト内で提示されている解決策・アイデア",
        items: {
          type: SchemaType.OBJECT,
          properties: {
            approach: {
              type: SchemaType.STRING,
              description: "解決策",
            },
            explanation: {
              type: SchemaType.STRING,
              description: "解決策の有用性",
            },
            novelty: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
              description: "解決策の新規性・ユニーク性",
            },
          },
        },
      },
      keywords: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING },
        description: "重要なキーワード（5個以内）を優先順位順に並べよ",
      },
      topics: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING },
        description: "トピック",
      },

      // embedding 用
      inquiryTopics: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING },
        description: "問題を解決するためにしたいこと、知りたいこと",
      },
      inquiryKeywords: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING },
        description: "問題を解決するために調査すべきキーワード",
      },
    },
    required: [
      "title",
      "context",
      "opportunities",
      "problems",
      "solutionIdeas",
      "durationCategory",
      "keywords",
      "topics",
      "logic",
      "inquiryTopics",
      "inquiryKeywords",
    ],
  };

  // console.log("suggest start", input.map((i) => i.text).join("").slice(0, 100));
  const res = await generateContent({
    prompt,
    responseSchema: schema,
  });
  try {
    const data = await extractValidJson(res?.text);
    // console.log("suggest", JSON.stringify(data, null, 2));
    console.log(
      "suggested",
      JSON.stringify([...data.inquiryKeywords, ...data.inquiryTopics], null, 2),
    );
    return {
      ...data,
      text: input.map((i) => i.text).join("\n"),
      updatedAt: new Date(),
    };
  } catch (e) {
    console.log(res?.text);
    console.log(e);
    throw e;
  }
};
