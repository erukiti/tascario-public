import { PredictionServiceClient } from "@google-cloud/aiplatform";
import {
  GeminiAPIError,
  GeminiAuthError,
  GeminiNetworkError,
} from "~/server/gemini/errors";
import type {
  GeminiConfig,
  GeminiRequest,
  GeminiResponse,
} from "~/server/gemini/types";

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
export async function generateContentAIPlatform(
  config: GeminiConfig,
  request: GeminiRequest,
): Promise<GeminiResponse> {
  try {
    const client = new PredictionServiceClient();
    const endpoint = `projects/${config.projectId}/locations/${config.location}/models/${config.modelId}`;
    const response = await client.predict({
      endpoint,
      instances: [{ prompt: request.prompt }],
    });
    const generatedText = response[0].predictions[0].generated_text;
    return { text: generatedText };
  } catch (error) {
    console.error(error);

    if ((error as any).message.includes("authentication")) {
      throw new GeminiAuthError("認証エラーが発生しました");
    }

    if ((error as any).message.includes("network")) {
      throw new GeminiNetworkError(
        "ネットワークエラーが発生しました",
        error as Error,
      );
    }

    throw new GeminiAPIError("APIエラーが発生しました", error as Error);
  }
}
