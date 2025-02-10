import type React from "react";

// タブコンテナ
const TabContainer: React.FC<{
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>> = ({ className = "", children, ...props }) => {
  return (
    <div className={`border rounded-lg bg-white ${className}`} {...props}>
      {children}
    </div>
  );
};

// タブリスト
const TabList: React.FC<
  {
    className?: string;
    children?: React.ReactNode;
  } & React.HTMLAttributes<HTMLDivElement>
> = ({ className = "", children, ...props }) => {
  return (
    <div className={`flex border-b ${className}`} {...props}>
      {children}
    </div>
  );
};

// タブボタン
const TabButton: React.FC<{
  isActive: boolean;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLButtonElement>> = ({ isActive, className = "", children, ...props }) => {
  return (
    <button
      className={`px-4 py-2 text-sm font-medium ${
        isActive
          ? "border-b-2 border-blue-600 text-blue-600"
          : "text-gray-500 hover:text-gray-700"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// タブパネル
const TabPanel: React.FC<{
  isActive: boolean;
  className?: string;
  children?: React.ReactNode;
}> = ({ isActive, className = "", children, ...props }) => {
  if (!isActive) return null;
  return (
    <div className={`p-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

// テキストエリア
const TextArea = ({ className = "", ...props }) => {
  return (
    <textarea
      className={`w-full p-3 border rounded-lg min-h-[200px] resize-y
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        ${className}`}
      {...props}
    />
  );
};

// URLインプット
const URLInput = ({ className = "", ...props }) => {
  return (
    <input
      type="url"
      className={`w-full p-3 border rounded-lg
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        ${className}`}
      {...props}
    />
  );
};

export { TabContainer, TabList, TabButton, TabPanel, TextArea, URLInput };
