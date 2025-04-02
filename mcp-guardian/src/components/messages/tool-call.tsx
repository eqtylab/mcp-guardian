import { Code } from "lucide-react";
import { JSONViewer } from "../ui/jsonviewer";
import { cn } from "../../utils";

interface ToolCallProps {
  name: string;
  args: any;
  className?: string;
}

const ToolCall = ({ name, args, className }: ToolCallProps) => {
  return (
    <div className={cn(
      "border-l-2 border-colors-accent-secondary pl-4 py-3 pr-4",
      "bg-[hsla(215,85%,65%,0.05)] rounded-sm mb-4",
      className
    )}>
      <div className="flex items-center gap-2 mb-2">
        <Code size={14} strokeWidth={2.5} className="text-colors-accent-secondary" />
        <span className="text-sm font-medium">{name}</span>
      </div>

      <div className="text-xs text-colors-text-secondary mb-2">Arguments:</div>
      <JSONViewer data={args} />
    </div>
  );
};

export default ToolCall;