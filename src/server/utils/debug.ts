// ./src/utils/debug.ts
/**
 * デバッグログユーティリティ
 * 環境変数 DEBUG が設定されている場合にのみログを出力
 */

/**
 * デバッグメッセージを出力
 * @param message - 出力するメッセージ
 * @param meta - 追加のメタデータ（オプション）
 * @returns void
 */
export const debugLog = (
  message: string,
  meta?: Record<string, unknown>,
): void => {
  const timestamp = new Date().toISOString();
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
  console.log(`[DEBUG ${timestamp}] ${message}${metaStr}`);
};
