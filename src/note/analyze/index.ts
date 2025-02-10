import { analyzeTexts } from "./in-depth-text-evaluation";
import { suggest } from "./sugget";
import { grouping } from "./utils";

export const analyzeNote = async (texts: string[]) => {
  const t1 = Date.now();
  const evaluations = await analyzeTexts({ texts });
  // analuzedは結構でかいのでCloudStorageに保存したい
  const groupedEvaluations = grouping(evaluations).filter((v) => v.length > 0);
  // console.log("grouped", JSON.stringify(groupedEvaluations, null, 2));

  const t2 = Date.now();
  console.log("LLM analyzeNote first analize:", (t2 - t1) / 1000, "s");

  // const res = [];
  // for (const group of groupedEvaluations) {
  //   const suggesttions = await suggest(group);
  //   res.push(suggesttions);
  // }

  // 遅いので並列化した
  const res = await Promise.all(
    groupedEvaluations.map(async (group) => {
      const suggesttions = await suggest(group);
      return suggesttions;
    }),
  );
  const t3 = Date.now();
  console.log(
    "LLM analyzeNote suggest:",
    (t3 - t2) / 1000,
    "s",
  );

  return res;
};

