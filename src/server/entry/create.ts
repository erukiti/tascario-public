import { db } from "~/server/db";

import { randomUUID } from "node:crypto";
import { analyzeEntry } from "~/server/entry/analyze";
import type { PendingEntry, Entry } from "~/entry";

type CreateEntryArgs = {
  url?: string;
  content: string;
  isHtml: boolean;
} & {
  userId: string;
};

export const createEntry = async (input: CreateEntryArgs) => {
  // TODO: error handling

  // Firestoreに、pending状態でエントリーを保存
  const entryId = randomUUID();
  const pendingEntry: PendingEntry = {
    ...input,
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
    entryId,
  };

  const doc = db
    .collection("users")
    .doc(input.userId)
    .collection("entries")
    .doc(entryId);

  await doc.set(pendingEntry);
  console.log("Entry created:", entryId);

  // TODO: pub/subとかそういう仕組みに置き換える
  const data = await analyzeEntry({
    content: input.content,
    isHtml: input.isHtml,
  });

  const completedEntry: Omit<Entry, "entryId" | "createdAt" | "updatedAt"> = {
    status: "completed",
    title: data.title,
    summary: data.summary,
    topics: data.topics,
    keywords: data.keywords,
    // resolvedIssues: data.resolvedIssues,
    // unresolvedIssues: data.unresolvedIssues,
    suggestions: data.suggestions,
    category: data.category,
    insights: data.insights,
    description: data.description,
    embeddings: data.embeddings.map((e) => ({
      value: e,
    })),
    content: input.content,
    isHtml: input.isHtml,
    url: input.url,
    knowledge: data.knowledge,
    // text: data.text,
    readingContexts: data.readingContexts,
  };

  await doc.update(completedEntry);

  return entryId;
};
