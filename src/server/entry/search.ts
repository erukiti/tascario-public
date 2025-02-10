import type { Entry } from "~/entry";
import { generateSuggestions } from "~/entry/suggest";
import { splitTexts } from "~/note/analyze/utils";

type Args = {
  query: string;
  userId: string;
};

export const searchEntries = async ({
  query,
  userId,
}: Args): Promise<Entry[]> => {
  const { relatedEntries } = await generateSuggestions({
    userId,
    texts: splitTexts(query),
  });

  return relatedEntries;
};
