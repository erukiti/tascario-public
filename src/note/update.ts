import type { Entry } from "~/entry";
import { generateSuggestions } from "~/entry/suggest";
import type { Suggestion } from "~/note/analyze/types";
import { splitTexts } from "~/note/analyze/utils";
import type { Note, PendingNote } from "~/note/types";
import { db } from "~/server/db";

type Args = {
  text: string;
  userId: string;
  noteId: string;
};

type Response = {
  suggestions: Suggestion[];
  relatedEntries: Entry[];
};

export const updateNote = async ({
  text,
  userId,
  noteId,
}: Args): Promise<Response> => {
  const texts = splitTexts(text);

  const noteRef = db
    .collection("users")
    .doc(userId)
    .collection("notes")
    .doc(noteId);

  const doc = await noteRef.get();
  let note: PendingNote | Note;

  if (!doc.exists) {
    // いまはやらないが、
    // 本来は存在しないIDの場合はエラーにする
    // scrachpadのケースだけを特別扱いにでもする？

    note = {
      texts,
      noteId,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await noteRef.set(note);
  } else {
    const prev = doc.data() as PendingNote | Note;

    console.log(35, JSON.stringify(prev, null, 2));

    const isEqualTexts = prev.texts.join("") === texts.join("");
    if (prev.status === "completed" && isEqualTexts) {
      return prev;
    }

    note = {
      ...prev,
      texts,
      updatedAt: new Date(),
    };
  }

  const { relatedEntries, suggestions } = await generateSuggestions({ userId, texts });

  const updateNote: Note = {
    ...note,
    suggestions,
    relatedEntries: relatedEntries.flatMap((r) => r.entryId),
    noteId,
    status: "completed",
  };

  await noteRef.update(updateNote);

  return {
    suggestions,
    relatedEntries: relatedEntries.flat().map((e) => ({
      ...e,
    })),
  };
};
