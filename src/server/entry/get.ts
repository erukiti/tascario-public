import type { Entry } from "~/entry";
import { db } from "~/server/db";
import type { GetEntryArgs } from "~/server/entry/types";

export const getEntry = async (input: GetEntryArgs & { userId: string }) => {
  const entryRef = db
    .collection("users")
    .doc(input.userId)
    .collection("entries")
    .doc(input.entryId);

  const data = (await entryRef.get()).data();
  // console.log(data);

  if (!data) {
    throw new Error("Entry not found");
  }

  const entry: Entry = {
    status: "completed",
    entryId: input.entryId,
    title: data.title,
    summary: data.summary,
    category: data.category,
    createdAt: data.createdAt.toDate(),
    topics: data.topics,
    keywords: data.keywords,
    // resolvedIssues: data.resolvedIssues,
    // unresolvedIssues: data.unresolvedIssues,
    suggestions: data.suggestions,
    insights: data.insights,
    content: data.content,
    isHtml: data.isHtml,
    url: data.url,
    description: data.description,
    embeddings: data.embeddings,
    updatedAt: data.updatedAt?.toDate() || data.createdAt.toDate(),
    knowledge: data.knowledge,
    readingContexts: data.readingContexts,
  };

  return entry;
};
