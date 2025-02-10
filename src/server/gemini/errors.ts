// ./src/errors.ts

import { debugLog } from "~/server/utils/debug";

/**
 * Gemini API関連の基本エラークラス
 */
export class GeminiError extends Error {
  /**
   * @param message - エラーメッセージ
   */
  constructor(message: string) {
    super(message);
    this.name = "GeminiError";
  }
}

/**
 * Gemini APIの認証エラー
 */
export class GeminiAuthError extends GeminiError {
  /**
   * @param message - エラーメッセージ
   */
  constructor(message: string) {
    super(message);
    this.name = "GeminiAuthError";
  }
}

/**
 * Gemini APIのネットワークエラー
 */
export class GeminiNetworkError extends GeminiError {
  /**
   * @param message - エラーメッセージ
   * @param cause - 元のエラー
   */
  constructor(
    message: string,
    public cause?: Error,
  ) {
    super(message);
    this.name = "GeminiNetworkError";
  }
}

/**
 * Gemini APIのレスポンスエラー
 */
export class GeminiAPIError extends GeminiError {
  /**
   * @param message - エラーメッセージ
   * @param statusCode - HTTPステータスコード
   */
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    debugLog(message)

    this.name = "GeminiAPIError";
  }
}
