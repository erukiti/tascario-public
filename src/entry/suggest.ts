import { type ResponseSchema, SchemaType } from "@google-cloud/vertexai";
import type { Entry } from "~/entry/types";
import { analyzeNote } from "~/note/analyze";
import type { Suggestion } from "~/note/analyze/types";
import { db } from "~/server/db";
import { getEmbeddingsVertexAi } from "~/server/embedding";
import { generateContent } from "~/server/gemini";
import { extractValidJson } from "~/server/gemini/generate-structured-content";

type Args = {
  userId: string;
  texts: string[];
};

type Response = {
  suggestions: Suggestion[];
  relatedEntries: Entry[];
};

/**
 * テキストを分析して、関連するエントリーを提案する
 */
export const generateSuggestions = async ({ userId, texts }: Args): Promise<Response> => {
  const t1 = Date.now();
  console.log("t1");
  const readEntries = db
    .collection("users")
    .doc(userId)
    .collection("entries")
    .where("status", "==", "completed")
    .get();

  const [suggestions, entryRefs] = await Promise.all([
    analyzeNote(texts),
    readEntries,
  ]);

  console.log("t2");
  const t2 = Date.now();
  console.log("updateNote analyze & read entries:", (t2 - t1) / 1000, "s");

  const entries = entryRefs.docs.map((doc) => {
    const entry = doc.data();

    const embeddings = entry.embeddings?.map((e) => e.value);

    return {
      entry,
      embeddings,
    };
  });
  console.log("entries", entries.length);

  const matchEntry = (
    embedding: number[],
  ): Array<Entry & { similarity: number }> => {
    const norm1 = Math.sqrt(embedding.reduce((acc, cur) => acc + cur * cur, 0));

    const getSimilarity = (e: number[]) => {
      const dot = embedding.reduce((acc, cur, i) => acc + cur * e[i], 0);
      const norm2 = Math.sqrt(e.reduce((acc, cur) => acc + cur * cur, 0));
      return dot / (norm1 * norm2);
    };

    // entriesでそれぞれのentryのembeddingとの類似度を計算して、entryと類似度を返す
    return entries
      .map(({ entry, embeddings }) => {
        if (!embeddings) {
          return null;
        }

        const similarities = embeddings.map((e) => getSimilarity(e));

        const maxSimilarity = Math.max(...similarities);

        return {
          ...entry,
          similarity: maxSimilarity,
        };
      })
      .filter((e) => e !== null) as Array<Entry & { similarity: number }>;
  };

  const matchEntries = async (suggest: Suggestion) => {
    console.log(108, suggest.title);
    const inquiryTexts = [...suggest.inquiryTopics];
    const inquiryEmbeddings = await getEmbeddingsVertexAi(inquiryTexts);

    console.log(112, suggest.title, inquiryEmbeddings.length);
    const matchedEntries = inquiryEmbeddings.flatMap((e) => matchEntry(e));
    console.log(114, suggest.title, matchedEntries.length);

    // 重複を除去しつつ、類似度でソートして、上位5つを返す
    return matchedEntries
      .filter(
        (e, i, self) => self.findIndex((s) => s.entryId === e.entryId) === i,
      )
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5);
  };

  const relatedEntries = await Promise.all(
    suggestions.map(async (suggestion) => {
      const matched = await matchEntries(suggestion);
      console.log(
        "matched",
        suggestion.title,
        matched.map((m) => ({
          title: m.title,
          similarity: m.similarity,
        })),
      );

      const prompt = `TextとEntriesに関連性があるかを確認してください。

<Text>
${suggestion.text}
</Text>

<Entries>
${matched
  .map(
    (m) => `<Entry>
${JSON.stringify({ entryId: m.entryId, topics: m.topics, knowledge: m.knowledge, readingContexts: m.readingContexts, description: m.description, suggestions: m.suggestions })}
</Entry>`,
  )
  .join("\n")}
</Entries>
`;
      const responseSchema: ResponseSchema = {
        type: SchemaType.OBJECT,
        properties: {
          entries: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                entryId: {
                  type: SchemaType.STRING,
                },
                usefulnessCriteria: {
                  type: SchemaType.OBJECT,
                  description: "Textとの関連性",
                  properties: {
                    relationFactor: {
                      type: SchemaType.STRING,
                      description: "何かしらの関連性はあるか？",
                    },

                    // reason: {
                    //   type: SchemaType.STRING,
                    //   description: "なぜ役立つか",
                    // },
                    isUseful: {
                      type: SchemaType.BOOLEAN,
                      description: "Textに役立つ",
                    },
                  },
                },
              },
            },
          },
        },
        required: ["entries"],
      };

      const res = await generateContent({
        prompt,
        responseSchema,
      });

      const data = await extractValidJson(res?.text);
      console.log("related", JSON.stringify(data, null, 2));

      const usefulEntries = data.entries
        .filter((e: any) => e.usefulnessCriteria.isUseful)
        .map((e: any) => matched.find((m) => m.entryId === e.entryId));

      return usefulEntries;
    }),
  );

  const t3 = Date.now();
  console.log("updateNote suggestEmbeddings:", (t3 - t2) / 1000, "s");

  return {
    suggestions,
    relatedEntries: relatedEntries.flat().map((e) => ({
      ...e,
      createdAt: e.createdAt.toDate(),
      updatedAt: e.updatedAt.toDate(),
    })),
  };
};
