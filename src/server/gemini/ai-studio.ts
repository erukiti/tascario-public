// curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=GEMINI_API_KEY" \
// -H 'Content-Type: application/json' \
// -X POST \
// -d '{
//   "contents": [{
//     "parts":[{"text": "Explain how AI works"}]
//     }]
//    }'

import { env } from "~/env";
import { extractValidJson } from "~/server/gemini/generate-structured-content";
import type { GeminiConfig, GeminiRequest } from "~/server/gemini/types";


/** Google AI StudioによるLLMの応答を生成する */
export const generateContentAiStudio = async (config: GeminiConfig, request: GeminiRequest) => {
  const apiKey = env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set.");
  }

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${config.modelId}:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: request.prompt }] }],
      }),
    });
    if (!res.ok || !res?.body) {
      throw new Error("API Error");
    }

    const data = await extractValidJson(await res.text());

    const text = data.candidates[0].content.parts[0].text;


    return {
      text,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}
