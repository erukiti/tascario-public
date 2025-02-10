import { Section, SectionHeader, TagList } from "~/components/parts/details";

type EntrySummaryPanelProps = {
  summary: string;
  topics: string[];
  keywords: string[];
  knowledge: string[];
  suggestions: string[];
  insights: string[];
  readingContexts: string[];
};

export const EntrySummaryPanel = ({
  summary,
  topics = [],
  keywords = [],
  suggestions = [],
  insights = [],
  knowledge = [],
  readingContexts = [],
}: EntrySummaryPanelProps) => (
  <div className="space-y-6">
    <Section className="flex flex-col gap-4">
      <div>
        <SectionHeader title="概要" />
        <p className="text-gray-700">{summary}</p>
      </div>

      <div>
        <SectionHeader title="こういうときに読みたい" />
        <ul className="space-y-2 text-gray-700">
          {readingContexts.map((context) => (
            <li key={context} className="flex items-start gap-2">
              <span className="block w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
              {context}
            </li>
          ))}
        </ul>
      </div>

      {knowledge.length > 0 && (
        <div>
          <SectionHeader title="得られる知見" />
          <ul className="space-y-2 text-gray-700">
            {knowledge.map((point) => (
              <li key={point} className="flex items-start gap-2">
                <span className="block w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}

      <TagList tags={topics} />
      <TagList tags={keywords} />
    </Section>

    <Section>
      <div className="flex flex-col gap-4">
        {insights.length > 0 && (
          <div>
            <SectionHeader title="insights" />
            <ul className="space-y-2 text-gray-700">
              {insights.map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <span className="block w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <SectionHeader title="Suggestions" />
          <ul className="space-y-2 text-gray-700">
            {suggestions.map((point) => (
              <li key={point} className="flex items-start gap-2">
                <span className="block w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  </div>
);
