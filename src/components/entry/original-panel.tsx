import { Section, SectionHeader } from "~/components/parts/details";
import { convertToMarkdown } from "~/server/utils";

type EntryOriginalPanelProps = {
  originalText: string;
  isHtml: boolean;
};

export const EntryOriginalPanel = ({
  originalText,
  isHtml,
}: EntryOriginalPanelProps) => {
  const content = isHtml ? convertToMarkdown(originalText) : originalText;

  return (
    <Section>
      <pre className="prose max-w-none text-wrap">{content}</pre>
    </Section>
  );
};
