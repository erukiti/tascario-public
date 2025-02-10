import { db } from "~/server/db";
import type { ListEntryArgs } from "./types";
import type { Entry } from "~/entry";

export const listEntries = async (
  input: ListEntryArgs & { userId: string },
) => {
  const category = input.filter?.category;

  let entriesRef = db
    .collection("users")
    .doc(input.userId)
    .collection("entries")
    .where("status", "==", "completed")
    .orderBy("createdAt", "desc");

  if (typeof category === "string") {
    entriesRef = entriesRef.where("category", "==", category);
  }

  const res = await entriesRef.get();

  const entries: Entry[] = res.docs.map((doc) => {
    const data = doc.data();

    return {
      entryId: data.entryId,
      title: data.title,
      summary: data.summary,
      description: data.description,
      category: data.category,
      date: data.createdAt.toDate(),
      topics: data.topics,
      keywords: data.keywords,
      resolvedIssues: data.resolvedIssues,
      unresolvedIssues: data.unresolvedIssues,
      suggestions: data.suggestions,
      insights: data.insights || "",
      target: data.target,
      isHtml: data.isHtml,
      url: data.url,
      embeddings: data.embeddings,
      status: data.status,
      content: data.content,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt?.toDate() || data.createdAt.toDate(),
      knowledge: data.knowledge,
      readingContexts: data.readingContexts,
    };
  });

  return {
    entries,
    cursor: "cursor",
  };
};
