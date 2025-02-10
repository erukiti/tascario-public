import type { Note, PendingNote } from "~/note/types";
import { db } from "~/server/db";

export const readScratchpad = async ({ userId }: { userId: string }): Promise<PendingNote | Note> => {
  const noteRef = db
    .collection("users")
    .doc(userId)
    .collection("notes")
    .doc("scratchpad");

  const doc = await noteRef.get();
  if (doc.exists) {
    const note = doc.data() as PendingNote | Note;
    return note;
  }

  const note: Note = {
    noteId: "scratchpad",
    texts: [],
    status: "completed",
    createdAt: new Date(),
    updatedAt: new Date(),
    suggestions: [],
  };

  await noteRef.set(note);
  return note;
}
