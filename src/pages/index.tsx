import React, { useState, type KeyboardEvent } from "react";
import { Search, Plus, Bell, Settings, LogOut } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { EntryCard } from "~/components/entry/entry-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/parts/dropdown";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/parts/avatar";
import { TascarioHeader } from "~/components/header";

const DashboardUI = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const { data: sessionData } = useSession();

  const { data } = api.entry.list.useQuery({});
  const search = api.entry.search.useMutation();

  const displayEntries = searchResults ?? data?.entries ?? [];

  const executeSearch = async () => {
    if (!searchInput.trim()) {
      setSearchResults(null);
      return;
    }
    const res = await search.mutateAsync(searchInput);
    setSearchResults(res);
  };

  const handleKeyDown = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      await executeSearch();
    }
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchResults(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TascarioHeader sessionData={sessionData} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <textarea
            placeholder="自然なことばで検索できます。 (Press CMD/CTRL + Enter to search)"
            className="w-full border rounded-lg resize-y min-h-[100px] max-h-[300px] p-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={4}
          />
          <div className="flex gap-2 mt-2">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
              onClick={executeSearch}
            >
              <Search className="h-4 w-4" />
              Search
            </button>
            <button
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
              onClick={clearSearch}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Entries Grid */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {displayEntries.map((entry) => (
            <EntryCard key={entry.entryId} entry={entry} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default DashboardUI;
