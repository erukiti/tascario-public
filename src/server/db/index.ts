import { Firestore } from '@google-cloud/firestore';
import { env } from "~/env";

// ローカル開発とCloud Run環境で異なる設定を使用
const options: { projectId: string; keyFilename?: string } = {
  projectId: env.GOOGLE_APPLICATION_ID,
};

// ローカル開発時のみキーファイルを使用
if (process.env.NODE_ENV !== 'production' && env.GOOGLE_APPLICATION_CREDENTIALS) {
  options.keyFilename = env.GOOGLE_APPLICATION_CREDENTIALS;
}

console.log('Firestore options:', options);

const db = new Firestore(options);

export { db };
