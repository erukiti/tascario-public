import { useState, useEffect, useCallback } from "react";
import { X, Loader2, Clipboard, Download } from "lucide-react";
import { TextArea, URLInput } from "~/components/parts/input";
import { api } from "~/utils/api";
import { cleanHtml } from "~/server/utils";

const NewEntryScreen = () => {
  const create = api.entry.create.useMutation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [clipboardPreview, setClipboardPreview] = useState<string | null>(null);
  const [clipboardFormat, setClipboardFormat] = useState<
    "text" | "html" | null
  >(null);
  const [isHtml, setIsHtml] = useState(false);
  // TODO: isHtml無理があるから、判定はサーバーに寄せる

  // 入力内容を更新する関数
  const updateContent = async (html: string) => {
    const cleaned = await cleanHtml(html);
    setTextInput(cleaned);
  };

  // クリップボードの内容をチェック
  const checkClipboard = useCallback(async () => {
    try {
      const items = await navigator.clipboard.read();

      // TODO: 複数アイテムの場合の処理を考える
      // 今は最初のアイテムのみを処理
      for (const item of items) {
        if (item.types.includes("text/html")) {
          const blob = await item.getType("text/html");
          const htmlContent = await blob.text();
          const preview =
            htmlContent.length > 100
              ? `${htmlContent.slice(0, 100)}...`
              : htmlContent;
          setClipboardPreview(preview);
          setClipboardFormat("html");
          return;
        }

        if (item.types.includes("text/plain")) {
          const blob = await item.getType("text/plain");
          const text = await blob.text();
          setClipboardPreview(
            text.length > 50 ? `${text.slice(0, 50)}...` : text,
          );
          setClipboardFormat("text");
          return;
        }
      }

      setClipboardPreview(null);
      setClipboardFormat(null);
    } catch (error) {
      console.error("Clipboard error:", error);
      try {
        const text = await navigator.clipboard.readText();
        if (text) {
          setClipboardPreview(
            text.length > 50 ? `${text.slice(0, 50)}...` : text,
          );
          setClipboardFormat("text");
        } else {
          setClipboardPreview(null);
          setClipboardFormat(null);
        }
      } catch {
        setClipboardPreview(null);
        setClipboardFormat(null);
      }
    }
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      checkClipboard();
    };

    window.addEventListener("focus", handleFocus);
    checkClipboard();

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [checkClipboard]);

  const handlePaste = async () => {
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        if (item.types.includes("text/html")) {
          const blob = await item.getType("text/html");
          const htmlContent = await blob.text();
          updateContent(htmlContent);
          setClipboardPreview(null);
          setIsHtml(true);
          return;
        }

        if (item.types.includes("text/plain")) {
          const blob = await item.getType("text/plain");
          const text = await blob.text();
          setTextInput(text);
          setIsHtml(false);
          setClipboardPreview(null);
          return;
        }
      }
    } catch (error) {
      console.error("Paste error:", error);
      try {
        const text = await navigator.clipboard.readText();
        if (text) {
          setTextInput(text);
          setIsHtml(false);
          setClipboardPreview(null);
        }
      } catch (error) {
        console.error("Failed to paste:", error);
      }
    }
  };

  // URLからコンテンツを取得
  const handleFetchUrl = async () => {
    if (!urlInput) return;

    setIsFetching(true);
    try {
      const response = await fetch("/api/fetch-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Original-Headers": JSON.stringify({
            "User-Agent": window.navigator.userAgent,
            "Accept-Language": window.navigator.language,
            Referer: document.referrer,
          }),
        },
        body: JSON.stringify({ url: urlInput }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch URL");
      }

      const data = await response.json();
      updateContent(data.content);
      setIsHtml(data.isHtml);
    } catch (error) {
      console.error("Error fetching URL:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const props = { content: textInput, url: urlInput, isHtml };
      const data = await create.mutateAsync(props);
      console.log("Success:", data);
      window.location.href = `/entry/${data}`;
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">New Entry</h1>
        <button type="button" className="p-2 hover:bg-gray-100 rounded-full">
          <a href="/">
            <X size={24} />
          </a>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="urlInput"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            URL Input
          </label>
          <div className="flex gap-2">
            <div className="flex-grow">
              <URLInput
                id="urlInput"
                placeholder="https://example.com/article"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={handleFetchUrl}
              disabled={!urlInput || isFetching}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
            >
              {isFetching ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Fetching...
                </>
              ) : (
                <>
                  <Download size={16} />
                  Fetch Content
                </>
              )}
            </button>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-4">
              <label
                htmlFor="textInput"
                className="block text-sm font-medium text-gray-700"
              >
                Text Input
              </label>
            </div>
            {clipboardPreview && (
              <div className="flex items-stretch">
                <div className="flex items-center px-3 py-1 bg-gray-50 border border-r-0 rounded-l-md">
                  <span className="text-sm text-gray-600 max-w-[200px] truncate">
                    {clipboardFormat === "html" ? "HTML: " : ""}
                    {clipboardPreview}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handlePaste}
                  className="px-3 py-1 text-gray-600 bg-gray-50 hover:bg-gray-100 border border-l-0 rounded-r-md flex items-center gap-2 text-sm"
                >
                  <Clipboard size={16} />
                  Paste
                </button>
              </div>
            )}
            {!clipboardPreview && (
              <button
                type="button"
                disabled
                className="px-3 py-1 text-gray-400 bg-gray-50 rounded-md flex items-center gap-2 text-sm cursor-not-allowed"
              >
                <Clipboard size={16} />
                Paste
              </button>
            )}
          </div>
          <TextArea
            id="textInput"
            placeholder="Paste or enter your text here..."
            value={textInput}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              const newText = e.target.value;
              setTextInput(newText);
            }}
            className="min-h-[200px] font-mono"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
            onClick={() => (window.location.href = "/")}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isProcessing || !textInput}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Processing...
              </>
            ) : (
              "Analyze"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewEntryScreen;
