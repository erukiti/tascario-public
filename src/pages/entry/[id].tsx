import { useState } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import {
  TabContainer,
  TabList,
  TabButton,
  TabPanel,
} from "~/components/parts/input";
import {
  EntryHeader,
  EntrySummaryPanel,
  EntryOriginalPanel,
  EntryActionPanel,
  EntryErrorState,
  EntryLoadingState,
} from "~/components/entry";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { convertToMarkdown } from "~/server/utils";
// 注意: entry.content が既にサニタイズ済みの場合、rehypeRaw を使っても安全と判断できるなら使用できます
// import rehypeRaw from "rehype-raw";

const EntryDetailScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("summary");

  const id = router.query.id as string;
  const {
    data: entry,
    isLoading,
    error,
  } = api.entry.get.useQuery({ entryId: id }, { enabled: !!id });

  if (!id) {
    return <EntryErrorState message="Invalid entry ID" />;
  }

  if (error) {
    return (
      <EntryErrorState message={`Error loading entry: ${error.message}`} />
    );
  }

  if (isLoading) {
    return <EntryLoadingState />;
  }

  if (!entry) {
    return <EntryErrorState message="Entry not found" />;
  }

  // HTMLコンテンツを安全にレンダリングする関数
  const renderContent = () => {
    if (entry.url) return null;

    if (entry.isHtml) {
      return (
        <div className="prose prose-sm max-w-none dark:prose-invert mt-6">
          <ReactMarkdown
            // GitHub Flavored Markdown を利用する場合
            remarkPlugins={[remarkGfm]}
            // サニタイズ済みなら、HTML をそのままパースして良い場合に rehypeRaw を利用
            // rehypePlugins={[rehypeRaw]}
          >
            {convertToMarkdown(entry.content)}
          </ReactMarkdown>
        </div>
      );
    }

    return (
      <pre className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg whitespace-pre-wrap break-all">
        <code>{entry.content}</code>
      </pre>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <EntryHeader
        category={entry.category}
        date={entry.createdAt}
        title={entry.title}
        url={entry.url}
      />

      <TabContainer>
        <TabList>
          <TabButton
            isActive={activeTab === "summary"}
            onClick={() => setActiveTab("summary")}
          >
            Summary
          </TabButton>
          <TabButton
            isActive={activeTab === "original"}
            onClick={() => setActiveTab("original")}
          >
            Original
          </TabButton>
        </TabList>

        <TabPanel isActive={activeTab === "summary"}>
          <EntrySummaryPanel
            summary={entry.summary}
            topics={entry.topics}
            keywords={entry.keywords}
            suggestions={entry.suggestions}
            insights={entry.insights}
            knowledge={entry.knowledge}
            readingContexts={entry.readingContexts}
          />
        </TabPanel>

        <TabPanel isActive={activeTab === "original"}>
          {renderContent()}
        </TabPanel>
      </TabContainer>
    </div>
  );
};

export default EntryDetailScreen;
