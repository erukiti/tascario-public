/*

    {
      "criticalQuestion": "AIが生成するドキュメントの構造は？",
      "emotion": "疑問、探求",
      "insights": [
        "AIが生成するドキュメントの構造について、まだ具体的なアイデアがない。",
        "構造化された情報が必要であることを認識している。"
      ],
      "keywords": [
        "ペイン2",
        "ドキュメント",
        "構造"
      ],
      "logic": "AIが生成するドキュメントの構造について疑問を投げかけている。",
      "narrativeStyle": "質問、問題提起",
      "needs": [
        "ドキュメント構造の定義",
        "情報構造化"
      ],
      "prev": {
        "isRelevant": true,
        "narrativeProgression": "AIが生成する情報の構造",
        "reason": "AIが生成するドキュメントの構造に関する疑問を提示している"
      },
      "text": "ペイン2のドキュメントは、どういう構造か？",
      "topics": [
        "プログラミング・システム開発",
        "文章作成",
        "教育・学習",
        "技術文書"
      ],
      "perspective": [
        "データベース設計",
        "情報モデリング",
        "オントロジー"
      ],
      "solution": []
    }
*/

/** テキスト群を、個々に詳細分析した結果 */
export type InDepthTextEvaluation = {
  text: string;
  keywords: string[];
  topics: string[];
  narrativeStyle: string;
  perspective: string[];
  insights: string[];
  logic: string;
  emotion: string;
  needs: string[];
  criticalQuestion: string;
  prev: {
    reason: string;
    narrativeProgression: string;
    isRelevant: boolean;
  };
  solution: string[];
};

export type Suggestion = {
  title: string;
  underlyingAssumptions: string[];
  opportunities: string[];
  problems: string[];
  solutionIdeas: {
    approach: string;
    explanation: string;
    novelty: string[];
  }[];
  durationCategory: string;
  keywords: string[];
  topics: string[];
  logic: string;
  updatedAt: Date;
  inquiryTopics: string[];
  inquiryKeywords: string[];
  text: string;
};
