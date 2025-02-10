import { ArrowLeft, Clock, Star, Edit, Bookmark, Share2, Link } from "lucide-react";
import { useRouter } from "next/router";

type EntryHeaderProps = {
  category: string;
  date: Date;
  title: string;
  url?: string;
};

export const EntryHeader = ({
  category,
  date,
  title,
  url,
}: EntryHeaderProps) => {
  const router = useRouter();

  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => router.push("/")}
          type="button"
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-1">{title}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
              {category}
            </span>
          </div>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:underline mt-2 text-sm"
            >
              <Link size={16} />
              {url}
            </a>
          )}
        </div>
        {/* <EntryActions /> */}
      </div>
    </div>
  );
};

const EntryActions = () => (
  <div className="flex gap-2">
    <button type="button" className="p-2 hover:bg-gray-100 rounded-full">
      <Edit size={20} />
    </button>
    <button type="button" className="p-2 hover:bg-gray-100 rounded-full">
      <Bookmark size={20} />
    </button>
    <button type="button" className="p-2 hover:bg-gray-100 rounded-full">
      <Share2 size={20} />
    </button>
  </div>
);
