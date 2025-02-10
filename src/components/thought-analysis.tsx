import type React from "react";
import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Sparkles,
  AlertCircle,
  Book,
  Brain,
  Target,
  Lightbulb,
  Link2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./parts/card";
import type { Suggestion } from "~/note/analyze/types";

const AnalysisSection = ({ section, isOpen, onToggle, children }) => (
  <div className="border-b last:border-b-0">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-2 hover:bg-gray-50"
    >
      <div className="flex items-center gap-2">
        {isOpen ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
        <span className="font-medium">{section}</span>
      </div>
    </button>
    {isOpen && <div className="p-2 bg-gray-50">{children}</div>}
  </div>
);

type Props = {
  data: Suggestion[];
};

export const ThoughtAnalysis: React.FC<Props> = ({ data }) => {
  const [expandedThoughts, setExpandedThoughts] = useState(new Set());
  const [expandedSections, setExpandedSections] = useState(new Map());

  const toggleThought = (index) => {
    const newExpanded = new Set(expandedThoughts);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedThoughts(newExpanded);
  };

  const toggleSection = (thoughtIndex, section) => {
    const key = `${thoughtIndex}-${section}`;
    setExpandedSections(
      new Map(expandedSections.set(key, !expandedSections.get(key))),
    );
  };

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            思考の分析結果
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">分析データがありません</p>
        </CardContent>
      </Card>
    );
  }

  const dateToString = (date: Date) => {
    const pad0 = (n: number) => (n < 10 ? `0${n}` : n);

    const d = new Date(date);
    // yyyy/MM/dd hh:mm:ss
    return `${d.getFullYear()}/${pad0(d.getMonth() + 1)}/${pad0(d.getDate())} ${pad0(d.getHours())}:${pad0(d.getMinutes())}:${pad0(d.getSeconds())}`;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            思考の分析結果
          </CardTitle>
        </CardHeader>
        <div className="p-4 bg-gray-50 text-xs">
          <pre className="whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
        </div>
        <CardContent className="space-y-4">
          {data.map((thought, index) => (
            <div key={index} className="border rounded-lg">
              <button
                onClick={() => toggleThought(index)}
                className="w-full p-3 flex items-center justify-between hover:bg-gray-50 rounded-t-lg"
              >
                <div className="flex items-center gap-2">
                  {expandedThoughts.has(index) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <span className="font-medium">{thought.title || "無題"}</span>
                  <span className="text-xs">
                    {dateToString(thought.updatedAt)}
                  </span>
                </div>
              </button>

              {expandedThoughts.has(index) && (
                <div className="p-3 space-y-1">
                  {thought.keywords?.length > 0 && (
                    <AnalysisSection
                      section="キーワード"
                      isOpen={expandedSections.get(`${index}-keywords`)}
                      onToggle={() => toggleSection(index, "keywords")}
                    >
                      <div className="flex flex-wrap gap-2">
                        {thought.keywords.map((keyword, i) => (
                          <span
                            key={i}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </AnalysisSection>
                  )}

                  {thought.problems?.length > 0 && (
                    <AnalysisSection
                      section="課題"
                      isOpen={expandedSections.get(`${index}-problems`)}
                      onToggle={() => toggleSection(index, "problems")}
                    >
                      <ul className="list-disc list-inside space-y-1">
                        {thought.problems.map((problem, i) => (
                          <li key={i} className="text-sm">
                            {problem}
                          </li>
                        ))}
                      </ul>
                    </AnalysisSection>
                  )}

                  {thought.opportunities?.length > 0 && (
                    <AnalysisSection
                      section="機会"
                      isOpen={expandedSections.get(`${index}-opportunities`)}
                      onToggle={() => toggleSection(index, "opportunities")}
                    >
                      <ul className="list-disc list-inside space-y-1">
                        {thought.opportunities.map((opportunity, i) => (
                          <li key={i} className="text-sm">
                            {opportunity}
                          </li>
                        ))}
                      </ul>
                    </AnalysisSection>
                  )}

                  {thought.solutionIdeas?.length > 0 && (
                    <AnalysisSection
                      section="解決アイデア"
                      isOpen={expandedSections.get(`${index}-solutions`)}
                      onToggle={() => toggleSection(index, "solutions")}
                    >
                      {thought.solutionIdeas.map((solution, i) => (
                        <div key={i} className="mb-2 last:mb-0">
                          <div className="font-medium text-sm">
                            {solution.approach}
                          </div>
                          <p className="text-sm text-gray-600">
                            {solution.explanation}
                          </p>
                        </div>
                      ))}
                    </AnalysisSection>
                  )}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
