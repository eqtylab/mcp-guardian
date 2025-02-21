// ToolCall.tsx
import { CopyBlock } from "react-code-blocks";
import { Code } from "lucide-react";

interface ToolCallProps {
  name: string;
  args: any;
}

const ToolCall = ({ name, args }: ToolCallProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Code size={18} className="text-shield-300" />
        <span className="font-medium">Function: {name}</span>
      </div>

      <div className="space-y-2">
        <div className="font-medium">Arguments:</div>
        <div className="rounded-[var(--radius-brand)] overflow-hidden bg-cream-100 dark:bg-primary-700">
          <CopyBlock
            text={JSON.stringify(args, null, 2)}
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
      </div>
    </div>
  );
};

export default ToolCall;
