// ./src/gemini.ts
import { type GenerationConfig, VertexAI } from "@google-cloud/vertexai";
import { debugLog } from "~/server/utils/debug";
import type { GeminiConfig, GeminiRequest, GeminiResponse } from "./types";
import { GeminiAuthError, GeminiAPIError, GeminiNetworkError } from "./errors";

/**
 * VertexAIのGemini APIを使用してテキストを生成する
 * 認証情報は、環境変数GOOGLE_APPLICATION_CREDENTIALSで指定されたファイルから読み込まれます
 * @param config - Gemini APIの設定
 * @param request - 生成リクエスト
 * @returns 生成されたテキストを含むレスポンス
 * @throws {GeminiAuthError} 認証エラーの場合
 * @throws {GeminiNetworkError} ネットワークエラーの場合
 * @throws {GeminiAPIError} APIエラーの場合
 */
export async function generateContentVertexAI(
  config: GeminiConfig,
  request: GeminiRequest,
): Promise<GeminiResponse> {
  try {
    // console.log(config);
    // debugLog("Generating content", { prompt: request.prompt });

    const vertexAI = new VertexAI({
      project: config.projectId,
      location: config.location,
    });

    const model = vertexAI.preview.getGenerativeModel({
      model: config.modelId,
    });

    const responseSchema = request.responseSchema;

    let generationConfig: GenerationConfig | undefined = undefined;
    if (responseSchema) {
      generationConfig = {
        responseMimeType: "application/json",
        responseSchema,
      };
    }

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: request.prompt }] }],
      generationConfig,
    });

    const response = result.response;
    if (!response.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new GeminiAPIError(
        "レスポンスに期待されるテキストが含まれていません",
        500,
      );
    }

    const generatedText = response.candidates[0].content.parts[0].text;
    // debugLog("Response received", { text: generatedText });

    return { text: generatedText };
  } catch (error) {
    if (error instanceof GeminiAPIError) {
      throw error;
    }

    if ((error as Error).message.includes("authentication")) {
      throw new GeminiAuthError("認証エラーが発生しました");
    }

    if ((error as Error).message.includes("network")) {
      throw new GeminiNetworkError(
        "ネットワークエラーが発生しました",
        error as Error,
      );
    }

    throw new GeminiAPIError(
      `APIエラーが発生しました: ${(error as Error).message}`,
      500,
    );
  }
}
