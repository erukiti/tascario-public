import type React from "react";

type SectionProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children: React.ReactNode;
};

// セクションコンテナ
export const Section: React.FC<SectionProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={`rounded-lg bg-white p-6 border ${className}`} {...props}>
      {children}
    </div>
  );
};

// セクションヘッダー
type SectionHeaderProps = {
  title: string;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  className = "",
  children,
  ...props
}) => {
  return (
    <div
      className={`flex justify-between items-center mb-4 ${className}`}
      {...props}
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </div>
  );
};

// タグリスト
type TagListProps = {
  tags: string[];
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const TagList: React.FC<TagListProps> = ({
  tags,
  className = "",
  ...props
}) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`} {...props}>
      {tags.map((tag) => (
        <span
          key={tag}
          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
        >
          {tag}
        </span>
      ))}
    </div>
  );
};

// アクションアイテム
type ActionItemProps = {
  title: string;
  status?: "pending" | "completed" | "inProgress";
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const ActionItem: React.FC<ActionItemProps> = ({
  title,
  status = "pending",
  className = "",
  ...props
}) => {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    inProgress: "bg-blue-100 text-blue-800",
  };

  return (
    <div
      className={`flex items-center justify-between p-3 border rounded-lg ${className}`}
      {...props}
    >
      <span>{title}</span>
      <span
        className={`px-2 py-1 rounded-full text-sm ${statusColors[status]}`}
      >
        {status}
      </span>
    </div>
  );
};
