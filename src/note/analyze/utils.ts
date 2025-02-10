import type { InDepthTextEvaluation } from "./types";

export const splitTexts = (text: string) => {
  // 空行で分割
  return text
    .trim()
    .replace(/\n\n+/g, "\n\n")
    .split("\n\n")
    .map((v) => v.trim());
};

export const grouping = (
  evaluations: InDepthTextEvaluation[],
): InDepthTextEvaluation[][] => {
  //prev が isRelevant なものをまとめる
  return evaluations.reduce(
    (acc, evaluation) => {
      const lastGroup = acc[acc.length - 1];
      if (evaluation.prev.isRelevant && lastGroup) {
        lastGroup.push(evaluation);
      } else {
        acc.push([evaluation]);
      }
      return acc;
    },
    [[]] as InDepthTextEvaluation[][],
  );
};

