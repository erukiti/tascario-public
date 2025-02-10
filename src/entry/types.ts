import { z } from "zod";

const pendingEntrySchema = z.object({
  status: z.literal("pending"),
  entryId: z.string(),
  url: z.string().optional(),
  content: z.string(),
  isHtml: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type PendingEntry = z.infer<typeof pendingEntrySchema>;

export const entrySchema = z.object({
  status: z.literal("completed"),
  entryId: z.string(),
  content: z.string(),
  isHtml: z.boolean(),
  url: z.string().optional(),
  title: z.string(),
  summary: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  topics: z.array(z.string()),
  keywords: z.array(z.string()),
  // resolvedIssues: z.array(z.string()),
  // unresolvedIssues: z.array(z.string()),
  suggestions: z.array(z.string()),
  insights: z.array(z.string()),
  description: z.string(),
  knowledge: z.array(z.string()),
  embeddings: z.array(z.object({ value: z.array(z.number()) })),
  readingContexts: z.array(z.string()),

  /**
   * 現状はllm conversations, technical documentsなど
   * とりあえずシステムで固定にする
   * TODO: もうちょっと考える
   */
  category: z.string(),
});

export type Entry = z.infer<typeof entrySchema>;
