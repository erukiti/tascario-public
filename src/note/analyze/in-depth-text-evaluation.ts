import { type ResponseSchema, SchemaType } from "@google-cloud/vertexai";
import { topicsPrompt } from "~/analyze/constants";
import type { InDepthTextEvaluation } from "~/note/analyze/types";
import { generateContent } from "~/server/gemini";
import { extractValidJson } from "~/server/gemini/generate-structured-content";

// TODO: zodスキーマ!!!!

type Args = {
  texts: string[];
};

/**
 * あるスクラッチパッドを文章で区切って、
 * それぞれの文章に対する細かい一時分析を行う
 */
export const analyzeTexts = async ({
  texts,
}: Args): Promise<InDepthTextEvaluation[]> => {
  const prompt = `Textsは、文章の配列である。

* Textsはそれぞれ、つながりがあるかもしれないし、ないかもしれない
* 必ずすべてのTextsを分析せよ
* 分析結果を日本語で出力せよ

${topicsPrompt}

<Texts>
${texts.map((text) => `<Text>${text}</Text>`).join("\n")}
</Texts>

`;
  const schema: ResponseSchema = {
    type: SchemaType.OBJECT,
    properties: {
      texts: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            text: { type: SchemaType.STRING, description: "対象のテキスト" },
            topics: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
              description: "トピック",
            },
            narrativeStyle: {
              type: SchemaType.STRING,
              description:
                "テキストの性質（自問自答、考察、アイデア、感情の発露など）",
            },
            perspective: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.STRING,
              },
              description:
                "このテキストに対して、どのような視点で見ると新たな示唆や洞察が得られるか？",
            },
            insights: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
              description:
                "読み取れる示唆、潜在的な意味、今後のアクションにつながる気づきなど、意味のある洞察",
            },
            logic: {
              type: SchemaType.STRING,
              description: "テキストにおける論理を掘り下げる",
            },
            emotion: {
              type: SchemaType.STRING,
              description: "テキストに込められた感情を掘り下げる",
            },
            needs: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
              description: "論理・感情をもとに、何が必要か？",
            },
            criticalQuestion: {
              type: SchemaType.STRING,
              description: "新たな示唆や洞察を得るために立てるべき問い",
            },
            keywords: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
              description: "重要なキーワードがあれば3個以内で優先順位順に出力せよ",
            },
            prev: {
              type: SchemaType.OBJECT,
              properties: {
                logic: {
                  type: SchemaType.STRING,
                  description: "前のテキストの論理構造とは繋がっているか？",
                },
                // topic: {
                //   type: SchemaType.STRING,
                //   description: "前のテキストとのトピックとはどれくらい離れているか",
                // },
                reason: {
                  type: SchemaType.STRING,
                  description: "前のテキストとのつながっている理由",
                },
                narrativeProgression: {
                  type: SchemaType.STRING,
                  description: "前のテキストからどう展開・深化しているか？",
                },
                isRelevant: {
                  type: SchemaType.BOOLEAN,
                  description: "前のテキストに関連しているか？",
                },
              },
            },
          },
          required: [
            "text",
            "keywords",
            "narrativeStyle",
            "emotion",
            "logic",
            "prev",
            // "topics",
            // "perspective",
            // "insights",
            // "needs",
            // "criticalQuestion",
          ],
        },
      },
    },
    required: ["texts"],
  };

  console.log("analyze InDepthTextEvaluation");
  const res = await generateContent({
    prompt,
    responseSchema: schema,
  });
  try {
    const data = await extractValidJson(res?.text);
    console.log("analyzed", JSON.stringify(data, null, 2));
    return data.texts;
  } catch (error) {
    console.error("Failed to analyze", error);
    throw error;
  }
};
