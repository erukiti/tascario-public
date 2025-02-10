import { env } from "~/env";
import {
  GoogleGenerativeAI,
  type EmbedContentResponse,
} from "@google/generative-ai";

/**
 * Google AI Studioを使って文字列のembeddingを取得する
 * @param text - embeddingを取得する文字列
 * @returns {Promise<EmbedContentResponse | null>} - embedding response or null if error
 */
export async function getEmbeddingAiStudio(
  text: string,
): Promise<EmbedContentResponse | null> {
  try {
    if (!env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set in the environment variables.");
      return null;
    }

    const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

    const result: EmbedContentResponse = await model.embedContent(text);
    return result;
  } catch (error) {
    console.error("Failed to get embedding:", error);
    return null;
  }
}
