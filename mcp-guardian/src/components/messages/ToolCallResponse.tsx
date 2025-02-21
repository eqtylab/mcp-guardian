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
              return JSON.stringify(JSON.parse(item.text), null, 2);
            } else {
              return JSON.stringify(item, null, 2);
            }
          })();

          return (
            <div key={i} className="rounded-md overflow-hidden bg-primary-800 dark:bg-primary-900">
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
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ToolCallResponse;
