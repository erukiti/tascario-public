import { z } from "zod";

export const listEntryArgsSchema = z.object({
  filter: z
    .object({
      category: z.string().optional(),
      topics: z.array(z.string()).optional(),
      keyword: z.string().optional(),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
    })
    .optional(),
  // sort: z
  //   .object({
  //     field: z.enum(["createdAt", "updatedAt", "title"]),
  //     order: z.enum(["asc", "desc"]),
  //   })
  //   .optional(),
  // limit: z.number().min(1).max(100).default(20).optional(),
  // cursor: z.string().optional(),
}).optional();

export type ListEntryArgs = z.infer<typeof listEntryArgsSchema>;

export const getEntryArgsSchema = z.object({
  entryId: z.string(),
});

export type GetEntryArgs = z.infer<typeof getEntryArgsSchema>;

export const updateEntryArgsSchema = z.object({
  id: z.string(),
  updates: z.object({
    title: z.string().optional(),
    category: z.string().optional(),
    topics: z.array(z.string()).optional(),
    // ...
  }),
});

export type UpdateEntryArgs = z.infer<typeof updateEntryArgsSchema>;

export const deleteEntryArgsSchema = z.object({
  id: z.string(),
});

export type DeleteEntryArgs = z.infer<typeof deleteEntryArgsSchema>;
