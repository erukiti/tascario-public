export type Analyzed = {
  topics: string[];
  keywords: string[];
  noises: string[];
  // resolvedIssues: string[];
  // unresolvedIssues: string[];
  suggestions: string[];
  summary: string;
  description: string;
  insights: string[];
  conversations?: { speaker: string; text: string }[];
  category:
    | "LLM conversations"
    | "technical document"
    | "news article"
    | "other";
  title: string;
  knowledge: string[];
  readingContexts: string[];
};
