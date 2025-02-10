import { v1, helpers } from "@google-cloud/aiplatform";
import type { GeminiConfig, GeminiRequest } from "~/server/gemini/types";

// 公式サンプル

async function main(
  project,
  model = "text-embedding-004",
  texts = "banana bread?;banana muffins?",
  task = "QUESTION_ANSWERING",
  dimensionality = 0,
  apiEndpoint = "us-central1-aiplatform.googleapis.com",
) {
  const aiplatform = require("@google-cloud/aiplatform");
  const { PredictionServiceClient } = aiplatform.v1;
  const { helpers } = aiplatform; // helps construct protobuf.Value objects.
  const clientOptions = { apiEndpoint: apiEndpoint };
  const location = "us-central1";
  const endpoint = `projects/${project}/locations/${location}/publishers/google/models/${model}`;

  async function callPredict() {
    const instances = texts
      .split(";")
      .map((e) => helpers.toValue({ content: e, task_type: task }));
    const parameters = helpers.toValue(
      dimensionality > 0
        ? { outputDimensionality: parseInt(dimensionality) }
        : {},
    );
    const request = { endpoint, instances, parameters };
    const client = new PredictionServiceClient(clientOptions);
    const [response] = await client.predict(request);
    const predictions = response.predictions;
    const embeddings = predictions.map((p) => {
      const embeddingsProto = p.structValue.fields.embeddings;
      const valuesProto = embeddingsProto.structValue.fields.values;
      return valuesProto.listValue.values.map((v) => v.numberValue);
    });
    console.log("Got embeddings: \n" + JSON.stringify(embeddings));
  }

  callPredict();
}

/**
 * VertexAIのGemini APIを使用してembeddingを生成する
 * 認証情報は、環境変数GOOGLE_APPLICATION_CREDENTIALSで指定されたファイルから読み込まれます
 * @param config - Gemini APIの設定
 * @param test - embeding
 * @returns 生成されたembeddingを含むレスポンス
 * @throws {GeminiAuthError} 認証エラーの場合
 * @throws {GeminiNetworkError} ネットワークエラーの場合
 * @throws {GeminiAPIError} APIエラーの場合
 */

export const getEmbedding = async (
  config: GeminiConfig,
  text: string,
): Promise<number[]> => {
  try {
    const endpoint = `projects/${config.projectId}/locations/${config.location}/models/${config.modelId}`;
    const instances = [{ content: text }];
    const parameters = {};
    const request = { endpoint, instances, parameters };
    const client = new v1.PredictionServiceClient();
    const [response] = await client.predict(request);
    const predictions = response.predictions;
    const embeddings = predictions.map((p) => {
      const embeddingsProto = p.structValue.fields.embeddings;
      const valuesProto = embeddingsProto.structValue.fields.values;
      return valuesProto.listValue.values.map((v) => v.numberValue);
    });
    return embeddings[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};
