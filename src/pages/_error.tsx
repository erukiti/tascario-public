import type { NextPage, NextPageContext } from "next";
import { TRPCClientError } from "@trpc/client";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import { useRouter } from "next/router";

// tRPCのエラーコードの型定義
type TRPCErrorCode =
  | "PARSE_ERROR"
  | "BAD_REQUEST"
  | "INTERNAL_SERVER_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "METHOD_NOT_SUPPORTED"
  | "TIMEOUT"
  | "CONFLICT"
  | "PRECONDITION_FAILED"
  | "PAYLOAD_TOO_LARGE"
  | "UNPROCESSABLE_CONTENT"
  | "TOO_MANY_REQUESTS"
  | "CLIENT_CLOSED_REQUEST";

interface ErrorContent {
  title: string;
  message: string;
  action: () => void;
}

interface ErrorProps {
  statusCode: number;
  message?: string;
  error?: Error | TRPCClientError<any>;
}

const ErrorPage: NextPage<ErrorProps> = ({ statusCode, message, error }) => {
  const router = useRouter();

  // tRPCエラーの詳細情報を抽出
  const tRPCError =
    error instanceof TRPCClientError
      ? {
          code: error.data?.code as TRPCErrorCode,
          message: error.message,
        }
      : null;

  // エラー内容とアクションを決定
  const getErrorContent = (): ErrorContent => {
    // tRPCエラーの場合
    if (tRPCError) {
      switch (tRPCError.code) {
        case "UNAUTHORIZED":
          return {
            title: "Authentication Required",
            message: "Please sign in to access this content.",
            action: () => router.push("/auth/signin"),
          };
        case "FORBIDDEN":
          return {
            title: "Access Denied",
            message: "You don't have permission to access this content.",
            action: () => router.push("/"),
          };
        case "NOT_FOUND":
          return {
            title: "Content Not Found",
            message: "The requested content could not be found.",
            action: () => router.push("/"),
          };
        case "TIMEOUT":
          return {
            title: "Request Timeout",
            message: "The request took too long to complete. Please try again.",
            action: () => router.reload(),
          };
        case "TOO_MANY_REQUESTS":
          return {
            title: "Too Many Requests",
            message: "Please wait a moment before trying again.",
            action: () => router.reload(),
          };
        default:
          return {
            title: "Server Error",
            message: tRPCError.message || "An unexpected error occurred.",
            action: () => router.reload(),
          };
      }
    }

    // HTTPステータスコードに基づくエラー
    switch (statusCode) {
      case 404:
        return {
          title: "Page Not Found",
          message:
            "The page you are looking for might be moved or does not exist.",
          action: () => router.push("/"),
        };
      case 401:
        return {
          title: "Unauthorized",
          message: "Please sign in to access this page.",
          action: () => router.push("/auth/signin"),
        };
      case 403:
        return {
          title: "Forbidden",
          message: "You don't have permission to access this page.",
          action: () => router.push("/"),
        };
      default:
        return {
          title: `Error ${statusCode}`,
          message: message || "An unexpected error occurred.",
          action: () => router.reload(),
        };
    }
  };

  const errorContent = getErrorContent();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <AlertTriangle size={64} className="text-amber-500" />
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-2">{errorContent.title}</h1>
          <p className="text-gray-600">{errorContent.message}</p>
          {tRPCError?.code && (
            <p className="text-sm text-gray-500 mt-2">
              Error code: {tRPCError.code}
            </p>
          )}
          {process.env.NODE_ENV === "development" && error && (
            <pre className="mt-4 p-4 bg-gray-100 rounded-lg text-left text-sm overflow-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          <button
          type="button"
            onClick={() => errorContent.action()}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <RefreshCcw size={20} />
            Try Again
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Home size={20} />
            Home
          </button>
        </div>
      </div>
    </div>
  );
};

ErrorPage.getInitialProps = ({ res, err }: NextPageContext): ErrorProps => {
  const statusCode = res ? res.statusCode : err ? (err as any).statusCode : 404;
  return {
    statusCode,
    message: err?.message,
    error: err || undefined,
  };
};

export default ErrorPage;
