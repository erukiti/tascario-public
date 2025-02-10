import { jsonrepair } from "jsonrepair";

/** JSON以外のデータを削って、JSON.parseして返す */
export const extractValidJson = async (content: string| null | undefined) => {
  if (!content) {
    throw new Error("No content");
  }
  const jsonStart = content.indexOf("{");
  const jsonEnd = content.lastIndexOf("}") + 1;
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("No JSON content found");
  }
  const jsonString = content.slice(jsonStart, jsonEnd);
  return JSON.parse(jsonrepair(jsonString));
};
