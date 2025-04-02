// ToolCallResponse.tsx
import { CopyBlock } from "react-code-blocks";
import { MessageSquare } from "lucide-react";

interface ToolCallResponseProps {
  content: any[];
}

const ToolCallResponse = ({ content }: ToolCallResponseProps) => {
  return (
    <div className="tool-call-response">
      <div className="flex-row gap-sm mb-sm">
        <MessageSquare size={14} strokeWidth={2.5} className="text-accent-tertiary" />
        <span className="text-sm">Response</span>
      </div>

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
              fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
              fontSize: "11px",
              lineHeight: 1.5
            }}
            codeContainerStyle={{
              backgroundColor: "var(--bg-elevated)",
              margin: 0,
              padding: "0.5rem",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-subtle)"
            }}
            theme={{
              mode: "dark",
              backgroundColor: "transparent",
              textColor: "var(--text-primary)",
              stringColor: "var(--status-success)",
              numberColor: "var(--status-warning)",
              keywordColor: "var(--accent-primary)",
              nameColor: "var(--accent-secondary)",
              attributeColor: "var(--accent-tertiary)",
            }}
          />
        );
      })}
    </div>
  );
};

export default ToolCallResponse;
