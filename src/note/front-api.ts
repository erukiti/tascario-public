import { useState, useEffect, useRef, useCallback } from "react";
import { Entry } from "~/entry";
import type { Suggestion } from "~/note/analyze/types";
import { api } from "~/utils/api";

interface UseDebounceTextAnalysisOptions {
  debounceMs?: number;
  minLength?: number;
}

export function useDebounceTextAnalysis(
  noteId: string,
  { debounceMs = 1000, minLength = 10 }: UseDebounceTextAnalysisOptions = {},
) {
  const [text, setText] = useState("");
  const [debouncedText, setDebouncedText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const pendingAnalysisRef = useRef<string | null>(null);
  const latestAnalyzedTextRef = useRef<string>("");
  const [analysis, setAnalysis] = useState<Suggestion[]>([]);
  const [relatedEntries, setRelatedEntries] = useState<Entry[]>([]);

  // tRPCのミューテーション設定
  const updateText = api.note.update.useMutation({
    onSettled: async () => {
      setIsAnalyzing(false);
      // 分析待ちのテキストがあれば、かつ前回と異なる場合のみ処理
      if (
        pendingAnalysisRef.current &&
        pendingAnalysisRef.current !== latestAnalyzedTextRef.current
      ) {
        const textToAnalyze = pendingAnalysisRef.current;
        pendingAnalysisRef.current = null;
        const res = await performAnalysis(textToAnalyze);
        if (res && res.suggestions.length > 0) {
          setAnalysis(res.suggestions);
        }
        if (res) {
          setRelatedEntries(res.relatedEntries);
        }
      }
    },
    onError: (error) => {
      console.error("Analysis failed:", error);
      setIsAnalyzing(false);
    },
  });

  // 分析実行関数
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const performAnalysis = useCallback(
    (textToAnalyze: string) => {
      if (isAnalyzing || textToAnalyze === latestAnalyzedTextRef.current) {
        // 分析中または同じテキストの場合は、必要に応じて待機リストに入れる
        if (textToAnalyze !== latestAnalyzedTextRef.current) {
          pendingAnalysisRef.current = textToAnalyze;
        }
        return;
      }

      setIsAnalyzing(true);
      latestAnalyzedTextRef.current = textToAnalyze;
      return updateText.mutateAsync({ text: textToAnalyze, noteId });
    },
    [], // 依存配列を空にする
  );

  // テキストの更新をデバウンス
  useEffect(() => {
    if (text.length < minLength) {
      setDebouncedText("");
      return;
    }

    const handler = setTimeout(() => {
      setDebouncedText(text);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [text, debounceMs, minLength]);

  // デバウンスされたテキストが更新されたら分析を実行
  useEffect(() => {
    if (!debouncedText) return;
    performAnalysis(debouncedText)?.then((res) => {
      if (res && res.suggestions.length > 0) {
        setAnalysis(res.suggestions);
      }
      if (res) {
        setRelatedEntries(res.relatedEntries || []);
      }
    });
  }, [debouncedText, performAnalysis]);

  return {
    text,
    setText,
    isAnalyzing,
    analysis,
    error: updateText.error,
    hasPendingAnalysis: pendingAnalysisRef.current !== null,
    relatedEntries,
  };
}
