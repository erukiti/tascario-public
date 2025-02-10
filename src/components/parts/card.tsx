import type React from "react";

// 基本のCardコンポーネント
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ className = "", children, ...props }) => {
  return (
    <div
      className={`border rounded-lg bg-white hover:shadow-lg transition-shadow ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// カードヘッダー用コンポーネント
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

const CardHeader: React.FC<CardHeaderProps> = ({
  className = "",
  children,
  ...props
}) => {
  return (
    <div className={`p-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

// カードタイトル用コンポーネント
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
  children: React.ReactNode;
}

const CardTitle: React.FC<CardTitleProps> = ({
  className = "",
  children,
  ...props
}) => {
  return (
    <h3 className={`text-lg font-semibold ${className}`} {...props}>
      {children}
    </h3>
  );
};

// カードの説明文用コンポーネント
interface CardDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

const CardDescription: React.FC<CardDescriptionProps> = ({
  className = "",
  children,
  ...props
}) => {
  return (
    <div className={`text-sm text-gray-500 mt-1 ${className}`} {...props}>
      {children}
    </div>
  );
};

// カードコンテンツ用コンポーネント
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

const CardContent: React.FC<CardContentProps> = ({
  className = "",
  children,
  ...props
}) => {
  return (
    <div className={`px-4 pb-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

export { Card, CardHeader, CardTitle, CardDescription, CardContent };
