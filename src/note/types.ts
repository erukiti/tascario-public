import { z } from "zod";

const pendingNoteSchema = z.object({
  status: z.literal("pending"),
  noteId: z.string(),
  texts: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type PendingNote = z.infer<typeof pendingNoteSchema>;

export const noteSchema = z.object({
  status: z.literal("completed"),
  noteId: z.string(),
  texts: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
  /*
  resolvedIssues: z.array(z.string()),
  unresolvedIssues: z.array(z.string()),
  suggestions: z.array(z.string()),
  insights: z.array(z.string()),
  target: z.array(z.string()),
  description: z.string(),
  embeddings: z.array(z.object({ value: z.array(z.number()) })),
*/
  // 成果物
  suggestions: z.array(
    z.object({
      title: z.string(),
      durationCategory: z.string(),
      solutionIdeas: z.array(
        z.object({
          approach: z.string(),
          explanation: z.string(),
          novelty: z.array(z.string()),
        }),
      ),
      keywords: z.array(z.string()),
      topics: z.array(z.string()),
    }),
  ),
  relatedEntries: z.array(z.string()),
});

export type Note = z.infer<typeof noteSchema>;
