import React from "react";
import { Filter, BookOpen, UserCheck, GitMerge } from "lucide-react";

interface InterceptorToolboxProps {
  onAddNode: (type: string) => void;
  disabled?: boolean;
}

// Define interceptor types with their metadata
const interceptorTypes = [
  {
    type: "Filter",
    icon: Filter,
    label: "Filter",
    description: "Conditionally process messages based on content or type",
    color: "bg-amber-100 dark:bg-amber-900/30",
    textColor: "text-amber-600 dark:text-amber-400",
  },
  {
    type: "MesssageLog",
    icon: BookOpen,
    label: "Message Log",
    description: "Log messages for debugging and auditing",
    color: "bg-cyan-100 dark:bg-cyan-900/30",
    textColor: "text-cyan-600 dark:text-cyan-400",
  },
  {
    type: "ManualApproval",
    icon: UserCheck,
    label: "Manual Approval",
    description: "Require human approval before proceeding",
    color: "bg-violet-100 dark:bg-violet-900/30",
    textColor: "text-violet-600 dark:text-violet-400",
  },
  {
    type: "Chain",
    icon: GitMerge,
    label: "Chain",
    description: "Combine multiple interceptors in sequence",
    color: "bg-rose-100 dark:bg-rose-900/30",
    textColor: "text-rose-600 dark:text-rose-400",
  },
];

const InterceptorToolbox: React.FC<InterceptorToolboxProps> = ({ onAddNode, disabled = false }) => {
  const handleClick = (nodeType: string) => {
    if (!disabled) {
      onAddNode(nodeType);
    }
  };

  return (
    <div>
      <h3 className="font-medium text-sm mb-3">Interceptors</h3>
      <div className="space-y-2">
        {interceptorTypes.map((interceptor) => (
          <div
            key={interceptor.type}
            className={`flex items-center p-2 border rounded-md ${
              disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-muted/30"
            } transition-colors`}
            onClick={() => handleClick(interceptor.type)}
          >
            <div className={`mr-3 w-7 h-7 ${interceptor.color} rounded-md flex items-center justify-center`}>
              <interceptor.icon size={14} className={interceptor.textColor} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">{interceptor.label}</div>
              <div className="text-xs text-muted-foreground truncate">{interceptor.description}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-2 bg-muted/30 rounded-md text-xs text-muted-foreground">
        <p className="mb-1 font-medium">Tips:</p>
        <ul className="space-y-1 pl-4 list-disc">
          <li>Click any interceptor to add it to the flow</li>
          <li>Connect interceptors to form message paths</li>
          <li>Configure properties in the right panel</li>
        </ul>
      </div>
    </div>
  );
};

export default InterceptorToolbox;
