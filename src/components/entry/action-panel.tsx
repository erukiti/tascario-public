import { Section, SectionHeader, ActionItem } from "~/components/parts/details";
import type { ActionItemType } from "~/components/entry/types";

// EntryActionPanel.tsx
type EntryActionPanelProps = {
  actionItems?: ActionItemType[];  // Make optional
};

export const EntryActionPanel = ({
  actionItems = []  // Default empty array
}: EntryActionPanelProps) => (
  <Section>
    <SectionHeader title="Action Items" />
    {actionItems.length > 0 ? (
      <div className="space-y-3">
        {actionItems.map((item, index) => (
          <ActionItem
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={index}
            title={item.title}
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            status={item.status as any}
          />
        ))}
      </div>
    ) : (
      <p className="text-gray-500">No action items yet</p>
    )}
  </Section>
);
