import type { FunctionDeclaration, ResponseSchema } from "@google-cloud/vertexai";

/**
 * Gemini APIのレスポンス型
 * @property text - 生成されたテキスト
 */
export type GeminiResponse = {
  text: string;
};

/**
 * Gemini APIの設定オプション
 * @property projectId - Google Cloudのプロジェクトid
 * @property location - APIのロケーション（例: "us-central1"）
 * @property modelId - 使用するモデルのID
 */
export type GeminiConfig = {
  /** Google CloudのプロジェクトID */
  projectId: string;
  /** APIのロケーション */
  location: string;
  /** 使用するモデルのID */
  modelId: string;
};

/**
 * Gemini APIのリクエストパラメータ
 * @property prompt - 生成に使用するプロンプト
 */
export type GeminiRequest = {
  /** 生成に使用するプロンプト */
  prompt: string;
  /** いわゆる FunctionCalling */
  function?: FunctionDeclaration;
  /** データ構造化 */
  responseSchema?: ResponseSchema;
  /** モデル名を指定 */
  modelId?: string;
};
