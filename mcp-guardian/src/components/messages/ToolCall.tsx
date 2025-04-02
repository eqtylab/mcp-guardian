// ToolCall.tsx
import { CopyBlock } from "react-code-blocks";
import { Code } from "lucide-react";

interface ToolCallProps {
  name: string;
  args: any;
}

const ToolCall = ({ name, args }: ToolCallProps) => {
  return (
    <div className="border-l-2 border-colors-accent-secondary pl-4 py-3 pr-4 
                    bg-[hsla(215,85%,65%,0.05)] rounded-sm mb-4">
      <div className="flex items-center gap-2 mb-2">
        <Code size={14} strokeWidth={2.5} className="text-colors-accent-secondary" />
        <span className="text-sm">{name}</span>
      </div>

      <div className="text-xs text-colors-text-secondary mb-2">Arguments:</div>
      <CopyBlock
        text={JSON.stringify(args, null, 2)}
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
    </div>
  );
};

export default ToolCall;
