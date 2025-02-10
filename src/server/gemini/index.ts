import { env } from "~/env";
import type { GeminiConfig, GeminiRequest } from "~/server/gemini/types";
import { generateContentVertexAI } from "~/server/gemini/vertex-ai";

export * from "./vertex-ai";
export * from "./ai-studio";
export * from "./generative-ai";
export * from "./ai-platform";
export * from "./embedding";

export const generateContent = async (request: GeminiRequest) => {
  const conf: GeminiConfig = {
    projectId: env.GOOGLE_APPLICATION_ID,
    location: "us-central1",
    modelId: request.modelId ?? "gemini-2.0-flash-001",
  };

  // return generateContentGenerativeAI(conf, request);
  return generateContentVertexAI(conf, request);
};
