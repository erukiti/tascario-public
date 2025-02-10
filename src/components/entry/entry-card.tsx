import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/parts/card";
import Link from "next/link";
import type { Entry } from "~/entry";

const getDateString = (date: Date): string => {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export const EntryCard: React.FC<{
  entry: Entry;
  isDisplayDescription?: boolean;
}> = ({ entry, isDisplayDescription = false }) => {
  return (
    <Link href={`/entry/${entry.entryId}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <CardTitle className="text-lg">{entry.title}</CardTitle>
          <CardDescription className="flex gap-2 text-sm">
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
              {entry.category}
            </span>
            <span className="text-gray-500">
              {getDateString(entry.createdAt)}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!!entry.url && <p className="text-xs mb-2 break-all">{entry.url}</p>}

          {isDisplayDescription && (
            <p className="text-gray-600 text-sm mb-3">{entry.description}</p>
          )}
          {entry.insights.length > 0 && (
            <div className="text-sm text-gray-500 mb-3">
              <ul className="list-disc pl-5">
                {entry.insights.slice(0, 3).map((insight) => (
                  <li key={insight}>{insight}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex flex-wrap gap-1">
            {entry.topics.map((topic) => (
              <span
                key={topic}
                className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs"
              >
                {topic}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {entry.keywords.slice(0, 5).map((keyword) => (
              <span
                key={keyword}
                className="bg-orange-50 text-gray-600 px-2 py-0.5 rounded text-xs"
              >
                {keyword}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
