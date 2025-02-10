import { GoogleGenerativeAI, type Tool } from "@google/generative-ai";
import { env } from "~/env";
import type { GeminiConfig, GeminiRequest } from "~/server/gemini/types";

/** Googleのgenerative-aiライブラリを使って、LLMの応答を返す */
export const generateContentGenerativeAI = async (
  config: GeminiConfig,
  request: GeminiRequest,
) => {
  const apiKey = env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set.");
  }

  const tools: Tool[] = [];
  if (request.function) {
    tools.push({
      functionDeclarations: [request.function],
    });
  }

  try {
    const generativeAI = new GoogleGenerativeAI(apiKey);
    const model = generativeAI.getGenerativeModel({
      model: config.modelId,
    });

    let generationConfig = undefined;
    if (request.responseSchema) {
      generationConfig = {
        responseMimeType: "application/json",
        responseSchema: request.responseSchema,
      }
    }

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: request.prompt }] }],
      tools,
      generationConfig,
    });

    const response = result.response;

    if (!response.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Response does not contain expected text");
    }

    return { text: response.candidates[0].content.parts[0].text };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to analyze text with Gemini API.");
  }
};
