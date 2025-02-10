import { PredictionServiceClient } from '@google-cloud/aiplatform';
import { helpers } from '@google-cloud/aiplatform';
import { env } from "~/env";


/**
 * Vertex AIのembeddingを取得する関数
 * @param {string} model モデル名
 * @param {string[]} texts テキストの配列
 * @param {string} [task='RETRIEVAL_DOCUMENT'] タスクの種類
 * @param {number} [dimensionality=768] 次元数
 * @returns {Promise<number[][]>} embeddingの配列
 */
export async function getEmbeddingsVertexAi(
  texts: string[],
  task: string = 'RETRIEVAL_DOCUMENT',
  dimensionality: number = 768,
): Promise<number[][]> {
  const model = "text-multilingual-embedding-002";
  const project = env.GOOGLE_APPLICATION_ID;
  const location = env.GOOGLE_APPLICATION_LOCATION;
  const apiEndpoint = `${location}-aiplatform.googleapis.com`;
  const clientOptions = { apiEndpoint };

  // エンドポイントの構築
  const endpoint = `projects/${project}/locations/${location}/publishers/google/models/${model}`;

  // インスタンスの作成
  const instances = texts.map(text =>
    helpers.toValue({
      content: text,
      task_type: task
    }) as any
  );

  // パラメータの設定
  const parameters = helpers.toValue({
    outputDimensionality: dimensionality
  });

  // リクエストの作成
  const request = {
    endpoint,
    instances,
    parameters
  };

  // クライアントの作成とリクエストの実行
  const client = new PredictionServiceClient(clientOptions);
  const [response] = await client.predict(request) as any;

  // レスポンスからembeddingsを抽出
  return response.predictions.map((prediction: any) => {
    const embeddingsProto = prediction.structValue.fields.embeddings;
    const valuesProto = embeddingsProto.structValue.fields.values;
    return valuesProto.listValue.values.map((v: any) => v.numberValue);
  });
}
