import { MessageSquare } from "lucide-react";
import { JsonViewer } from "../json-editor";
import { cn } from "../../utils";

interface ToolCallResponseProps {
  content: any[];
  className?: string;
}

const ToolCallResponse = ({ content, className }: ToolCallResponseProps) => {
  return (
    <div className={cn(
      "border-l-2 border-colors-accent-tertiary pl-4 py-3 pr-4",
      "bg-[hsla(190,90%,45%,0.05)] rounded-sm mb-4",
      className
    )}>
      <div className="flex items-center gap-2 mb-2">
        <MessageSquare size={14} strokeWidth={2.5} className="text-colors-accent-tertiary" />
        <span className="text-sm font-medium">Response</span>
      </div>

      <div className="space-y-3">
        {content.map((item, i) => {
          let data;
          if (item.type === "text") {
            try {
              data = JSON.parse(item.text);
            } catch (_) {
              data = item.text;
            }
          } else {
            data = item;
          }

          // Create a unique stable key using index and content hash to avoid re-renders
          const contentKey = `item-${i}-${typeof data === 'object' ? JSON.stringify(data).length : String(data).length}`;
          
          return (
            <JsonViewer 
              key={contentKey} 
              data={data} 
              maxHeight="200px"
            />
          );
        })}
      </div>
    </div>
  );
};

export default ToolCallResponse;