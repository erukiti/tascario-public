import { z } from "zod";
import { readScratchpad, updateNote } from "~/note";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const noteRouter = createTRPCRouter({
  update: protectedProcedure
    .input(z.object({ text: z.string(), noteId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return updateNote({
        text: input.text,
        noteId: input.noteId,
        userId: ctx.session.user.id,
      });
    }),
  readScratchpad: protectedProcedure.query(async ({ ctx }) => {
    return readScratchpad({
      userId: ctx.session.user.id,
    });
  }),
});
