import React, { useState, useEffect, useCallback } from "react";
import {
  Loader2,
  Search,
  Filter,
  Plus,
  ChevronDown,
  GripHorizontal,
  Grid,
  List,
  Calendar,
  X,
  Link,
  NotebookIcon,
} from "lucide-react";
import { api } from "~/utils/api";
import { EntryCard } from "~/components/entry/entry-card";
import { useDebounceTextAnalysis } from "~/note/front-api";
import { ThoughtAnalysis } from "~/components/thought-analysis";
import type { Entry } from "~/entry";

const IntegratedWorkspace = () => {
  const [panels, setPanels] = useState({
    scratchpad: { flex: 2 },
    content: { flex: 3 },
  });

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list" | "timeline"

  const { text, setText, isAnalyzing, analysis, error, relatedEntries } =
    useDebounceTextAnalysis("scratchpad", {
      debounceMs: 1000,
      minLength: 10,
    });

  const [openTabs, setOpenTabs] = useState<
    Array<{ noteId: string; title: string }>
  >([]);
  const [activeTab, setActiveTab] = useState("main");
  // タブを閉じる
  const closeTab = useCallback(
    (tabId: string, e) => {
      e.stopPropagation();
      setOpenTabs(openTabs.filter((tab) => tab.noteId !== tabId));
      setActiveTab("main");
    },
    [openTabs],
  );

  // const { data: entriesData } = api.entry.list.useQuery({
  //   filter: {
  //     category: selectedCategory === "all" ? undefined : selectedCategory,
  //   },
  // });

  // const entries = entriesData?.entries ?? [];

  useEffect(() => {
    setShowSuggestions(text.length >= 10);
  }, [text]);

  // エントリーのレイアウトスタイルを動的に生成
  const getEntriesLayoutStyle = () => {
    switch (viewMode) {
      case "grid":
        return "grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3";
      case "list":
        return "flex flex-col gap-4";
      case "timeline":
        return "grid gap-4 grid-cols-1";
      default:
        return "grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3";
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* ヘッダー */}
      <div className="border-b p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tascario</h1>
        <div className="flex gap-4">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={() => {
              window.location.href = "/entry/new";
            }}
          >
            <Plus size={20} />
            New Entry
          </button>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 flex overflow-hidden">
        {/* Scratchpad */}
        <div className="flex flex-col" style={{ flex: panels.scratchpad.flex }}>
          {/* タブヘッダー */}
          <div className="flex items-center gap-1 mb-2 border-b">
            <button
              className={`px-4 py-2 flex items-center gap-2 border-b-2 ${
                activeTab === "main"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab("main")}
            >
              <NotebookIcon className="w-4 h-4" />
              Thought Space
            </button>

            {openTabs.map((tab) => (
              <div
                key={tab.noteId}
                className={`group relative flex items-center ${
                  activeTab === tab.noteId
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "border-b-2 border-transparent text-gray-600"
                }`}
              >
                <button
                  className="px-4 py-2 flex items-center gap-2 hover:text-gray-800"
                  onClick={() => setActiveTab(tab.noteId)}
                >
                  <Link className="w-4 h-4" />
                  <span className="max-w-[200px] truncate">{tab.title}</span>
                </button>
                <button
                  className="opacity-0 group-hover:opacity-100 absolute right-1 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                  onClick={(e) => closeTab(tab.noteId, e)}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* main content */}

          <div className="flex-1 p-4 overflow-auto">
            <textarea
              className="w-full h-full resize-none border rounded-lg p-4"
              placeholder="Start typing your thoughts..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="w-1 hover:w-2 bg-gray-200 hover:bg-blue-200 cursor-col-resize flex items-center justify-center transition-all">
          <GripHorizontal className="w-4 h-4 text-gray-400" />
        </div>

        {/* Right Panel (Suggestions or Entries) */}
        <div className="flex flex-col" style={{ flex: panels.content.flex }}>
          <div className="p-4 border-b bg-white">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">
                {showSuggestions
                  ? "AI Suggestions & Related Entries"
                  : "All Entries"}
              </h2>

              {/* レイアウト切り替えボタン */}
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`p-2 border rounded-lg hover:bg-gray-50 ${
                    viewMode === "timeline" ? "bg-gray-100" : ""
                  }`}
                  onClick={() => setViewMode("timeline")}
                >
                  <Calendar size={20} />
                </button>
                <button
                  type="button"
                  className={`p-2 border rounded-lg hover:bg-gray-50 ${
                    viewMode === "grid" ? "bg-gray-100" : ""
                  }`}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid size={20} />
                </button>
                <button
                  type="button"
                  className={`p-2 border rounded-lg hover:bg-gray-50 ${
                    viewMode === "list" ? "bg-gray-100" : ""
                  }`}
                  onClick={() => setViewMode("list")}
                >
                  <List size={20} />
                </button>
              </div>
            </div>

            {/* 検索・フィルターバー (エントリー表示時のみ) */}
            {!showSuggestions && (
              <div className="mt-4 flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search entries..."
                      className="pl-10 pr-4 py-2 w-full border rounded-lg"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50">
                    <Filter size={16} />
                    Filter
                    <ChevronDown size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* カテゴリフィルター (エントリー表示時のみ) */}
            {!showSuggestions && (
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {[
                  "all",
                  "LLM conversations",
                  "technical documents",
                  "news article",
                  "other",
                ].map((category) => (
                  <button
                    key={category}
                    className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap
                        ${
                          selectedCategory === category
                            ? "bg-blue-100 text-blue-700 border-blue-200"
                            : "bg-gray-100 text-gray-700 border-gray-200"
                        } border hover:bg-opacity-80`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 p-4 overflow-auto">
            {showSuggestions ? (
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="font-semibold mb-4">AI Suggestions</h3>
                  <ThoughtAnalysis data={analysis} />
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="font-semibold mb-4">Related Entries</h3>
                  <div className={getEntriesLayoutStyle()}>
                    {relatedEntries.map((entry) => (
                      <EntryCard key={entry.entryId} entry={entry} />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className={getEntriesLayoutStyle()}>
                {relatedEntries.map((entry) => (
                  <EntryCard key={entry.entryId} entry={entry} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegratedWorkspace;
