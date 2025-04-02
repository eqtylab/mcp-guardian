// ToolCallResponse.tsx
import { CopyBlock } from "react-code-blocks";
import { MessageSquare } from "lucide-react";

interface ToolCallResponseProps {
  content: any[];
}

const ToolCallResponse = ({ content }: ToolCallResponseProps) => {
  return (
    <div className="border-l-2 border-colors-accent-tertiary pl-4 py-3 pr-4 
                    bg-[hsla(190,90%,45%,0.05)] rounded-sm mb-4">
      <div className="flex items-center gap-2 mb-2">
        <MessageSquare size={14} strokeWidth={2.5} className="text-colors-accent-tertiary" />
        <span className="text-sm">Response</span>
      </div>

      <div className="space-y-3">
        {content.map((item, i) => {
          const json = (() => {
            if (item.type === "text") {
              try {
                return JSON.stringify(JSON.parse(item.text), null, 2);
              } catch (_) {
                return item.text;
              }
            } else {
              return JSON.stringify(item, null, 2);
            }
          })();

          return (
            <CopyBlock
              key={i}
              text={json}
              language="json"
              codeBlockStyle={{
                fontFamily: "var(--fontFamily-mono)",
                fontSize: "11px",
                lineHeight: 1.5
              }}
              codeContainerStyle={{
                backgroundColor: "var(--colors-bg-elevated)",
                margin: 0,
                padding: "0.5rem",
                borderRadius: "var(--borderRadius-sm)",
                border: "1px solid var(--colors-border-subtle)"
              }}
              theme={{
                mode: "dark",
                backgroundColor: "transparent",
                textColor: "var(--colors-text-primary)",
                stringColor: "var(--colors-status-success)",
                numberColor: "var(--colors-status-warning)",
                keywordColor: "var(--colors-accent-primary)",
                nameColor: "var(--colors-accent-secondary)",
                attributeColor: "var(--colors-accent-tertiary)",
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ToolCallResponse;
