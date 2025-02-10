import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  createEntry,
  getEntry,
  listEntries,
  getEntryArgsSchema,
  listEntryArgsSchema,
} from "~/server/entry";
import { searchEntries } from "~/server/entry/search";

export const entryRouter = createTRPCRouter({
  // エントリーの作成
  create: protectedProcedure
    .input(
      z.object({
        url: z.string().optional(),
        content: z.string(),
        isHtml: z.boolean()
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      return createEntry({ ...input, userId });
    }),

  // エントリー一覧の取得
  list: protectedProcedure
    .input(listEntryArgsSchema)
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      return listEntries({ ...input, userId });
    }),

  // エントリーの詳細取得
  get: protectedProcedure
    .input(getEntryArgsSchema)
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      return getEntry({ ...input, userId });
    }),

  // エントリーの検索
  search: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      return searchEntries({ query: input, userId });
    }),
});
