// ToolCall.tsx
import { CopyBlock } from "react-code-blocks";
import { Code } from "lucide-react";

interface ToolCallProps {
  name: string;
  args: any;
}

const ToolCall = ({ name, args }: ToolCallProps) => {
  return (
    <div className="tool-call">
      <div className="flex-row gap-sm mb-sm">
        <Code size={14} strokeWidth={2.5} className="text-accent-secondary" />
        <span className="text-sm">{name}</span>
      </div>

      <div className="text-xs text-text-secondary mb-sm">Arguments:</div>
      <CopyBlock
        text={JSON.stringify(args, null, 2)}
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
    </div>
  );
};

export default ToolCall;
