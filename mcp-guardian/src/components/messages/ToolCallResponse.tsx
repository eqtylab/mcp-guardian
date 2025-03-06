// ToolCallResponse.tsx
import { CopyBlock } from "react-code-blocks";
import { MessageSquare } from "lucide-react";

interface ToolCallResponseProps {
  content: any[];
}

const ToolCallResponse = ({ content }: ToolCallResponseProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <MessageSquare size={18} className="text-shield-300" />
        <span className="font-medium">Response</span>
      </div>

      <div className="space-y-4">
        {content.map((item, i) => {
          const json = (() => {
            if (item.type === "text") {
              try {
                const json = JSON.stringify(JSON.parse(item.text), null, 2);
                return json;
              } catch (_) {
                return item.text;
              }
            } else {
              return JSON.stringify(item, null, 2);
            }
          })();

          return (
            <div key={i} className="rounded-[var(--radius-brand)] overflow-hidden bg-cream-100 dark:bg-primary-700">
              <CopyBlock
                text={json}
                language="json"
                codeBlockStyle={{
                  fontFamily: "Inter, monospace",
                  fontSize: "0.875rem",
                }}
                codeContainerStyle={{
                  backgroundColor: "transparent",
                  margin: 0,
                  padding: "1rem",
                }}
                theme={{
                  mode: "light",
                  backgroundColor: "transparent",
                  textColor: "var(--color-primary-900)",
                  stringColor: "var(--color-primary-900)",
                  numberColor: "var(--color-primary-900)",
                  keywordColor: "var(--color-primary-900)",
                  nameColor: "var(--color-primary-900)",
                  attributeColor: "var(--color-primary-900)",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ToolCallResponse;
