import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { BookOpen, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";

import { GuardProfileNodeData } from "./nodeData.type";

export interface GuardProfileMessageLogNodeData extends GuardProfileNodeData {
  type: "MessageLog";
  log_level: string;
}

export interface GuardProfileMessageLogNode extends Node {
  type: "MessageLog";
  data: GuardProfileMessageLogNodeData;
}

export interface GuardProfileMessageLogNodeProps extends NodeProps {
  data: GuardProfileMessageLogNodeData;
}

// Use NodeProps from ReactFlow - fixed for proper type compatibility
const MessageLogNode = ({ data, selected, id }: GuardProfileMessageLogNodeProps) => {
  // Get the data - handle it gracefully if it's invalid
  const currentLogLevel = data?.log_level || "Info";

  // Use expanded state from props instead of local state
  const expanded = data.isExpanded || false;

  // Color utilities
  const getLogLevelColor = (level: string) => {
    switch (level) {
      case "Error":
        return "text-red-600 dark:text-red-400";
      case "Warn":
        return "text-orange-600 dark:text-orange-400";
      case "Info":
        return "text-blue-600 dark:text-blue-400";
      case "Debug":
        return "text-purple-600 dark:text-purple-400";
      case "Trace":
        return "text-slate-600 dark:text-slate-400";
      default:
        return "text-slate-600 dark:text-slate-400";
    }
  };

  // Get log level icon based on level
  const getLogLevelIcon = (level: string) => {
    switch (level) {
      case "Error":
        return (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-red-500"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        );
      case "Warn":
        return (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-orange-500"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        );
      case "Info":
        return (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-500"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        );
      case "Debug":
        return (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-purple-500"
          >
            <path d="M7 12a5 5 0 0 1 5-5v0a5 5 0 0 1 5 5v0"></path>
            <path d="M12 7v1"></path>
            <path d="M7 7v1"></path>
            <path d="M17 7v1"></path>
            <path d="M17 17v1"></path>
            <path d="M7 17v1"></path>
            <path d="M12 17v1"></path>
          </svg>
        );
      case "Trace":
        return (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-slate-500"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        );
      default:
        return (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-slate-500"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        );
    }
  };

  // Notify parent of log level change
  const updateLogLevel = (newLevel: string) => {
    // Create event to notify parent about data change
    const event = new CustomEvent("nodeDataChanged", {
      detail: {
        nodeId: id,
        data: {
          // Only include the MessageLogNodeData properties, not UI state
          log_level: newLevel,
          type: "MessageLog",
        },
      },
    });
    document.dispatchEvent(event);
  };

  // Get description text for log level
  const getLogLevelDescription = (level: string): string => {
    switch (level) {
      case "Error":
        return "Critical errors only";
      case "Warn":
        return "Warnings and errors";
      case "Info":
        return "General information (default)";
      case "Debug":
        return "Detailed information for debugging";
      case "Trace":
        return "Very verbose with all details";
      default:
        return "Unknown level";
    }
  };

  return (
    <div
      className={`node messagelog-node rounded-lg border p-3 shadow-md cursor-move ${
        expanded ? "w-[280px]" : "max-w-[180px]"
      } ${
        selected
          ? "border-primary ring-2 ring-primary/20 bg-cyan-950/5 dark:bg-cyan-800/10"
          : "border-muted bg-card dark:bg-cyan-950/5"
      }`}
      style={{ zIndex: 5, visibility: "visible", pointerEvents: "all" }}
      data-id={id}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 border border-cyan-400 dark:border-cyan-600 bg-cyan-500"
        style={{ zIndex: 6 }}
      />

      {/* Node header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0 w-7 h-7 bg-cyan-100 dark:bg-cyan-900/30 rounded-md flex items-center justify-center">
            <BookOpen size={14} className="text-cyan-600 dark:text-cyan-400" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate">Message Log</div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Level:</span>
              <span className={`font-medium ${getLogLevelColor(currentLogLevel)}`}>{currentLogLevel}</span>
            </div>
          </div>
        </div>

        {/* Toggle button for expand/collapse */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (data.onToggleExpand) {
              data.onToggleExpand(id);
            }
          }}
          className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 hover:bg-cyan-200 dark:hover:bg-cyan-800/30 transition-colors cursor-pointer"
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Configuration content when expanded */}
      {expanded && (
        <div
          className="mt-3 border-t border-muted pt-3 space-y-3"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="grid grid-cols-1 gap-y-3">
            {/* Custom Log Level Selection with buttons instead of dropdown */}
            <div className="text-xs">
              <label className="block text-muted-foreground text-[10px] mb-0.5">Log Level</label>
              <div className="grid grid-cols-1 gap-1">
                {/* Error level button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    updateLogLevel("Error");
                  }}
                  className={`py-1 px-2 rounded flex items-center justify-between text-left ${
                    currentLogLevel === "Error"
                      ? "bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400"
                      : "bg-background border border-border hover:bg-red-50 dark:hover:bg-red-900/10"
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-red-500"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span>Error</span>
                  </div>
                  {currentLogLevel === "Error" && <CheckCircle2 size={12} className="text-red-600" />}
                </button>

                {/* Warn level button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    updateLogLevel("Warn");
                  }}
                  className={`py-1 px-2 rounded flex items-center justify-between text-left ${
                    currentLogLevel === "Warn"
                      ? "bg-orange-100 dark:bg-orange-900/30 border border-orange-400 text-orange-700 dark:text-orange-400"
                      : "bg-background border border-border hover:bg-orange-50 dark:hover:bg-orange-900/10"
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-orange-500"
                    >
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <span>Warn</span>
                  </div>
                  {currentLogLevel === "Warn" && <CheckCircle2 size={12} className="text-orange-600" />}
                </button>

                {/* Info level button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    updateLogLevel("Info");
                  }}
                  className={`py-1 px-2 rounded flex items-center justify-between text-left ${
                    currentLogLevel === "Info"
                      ? "bg-blue-100 dark:bg-blue-900/30 border border-blue-400 text-blue-700 dark:text-blue-400"
                      : "bg-background border border-border hover:bg-blue-50 dark:hover:bg-blue-900/10"
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-blue-500"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <span>Info</span>
                  </div>
                  {currentLogLevel === "Info" && <CheckCircle2 size={12} className="text-blue-600" />}
                </button>

                {/* Debug level button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    updateLogLevel("Debug");
                  }}
                  className={`py-1 px-2 rounded flex items-center justify-between text-left ${
                    currentLogLevel === "Debug"
                      ? "bg-purple-100 dark:bg-purple-900/30 border border-purple-400 text-purple-700 dark:text-purple-400"
                      : "bg-background border border-border hover:bg-purple-50 dark:hover:bg-purple-900/10"
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-purple-500"
                    >
                      <path d="M7 12a5 5 0 0 1 5-5v0a5 5 0 0 1 5 5v0"></path>
                      <path d="M12 7v1"></path>
                      <path d="M7 7v1"></path>
                      <path d="M17 7v1"></path>
                      <path d="M17 17v1"></path>
                      <path d="M7 17v1"></path>
                      <path d="M12 17v1"></path>
                    </svg>
                    <span>Debug</span>
                  </div>
                  {currentLogLevel === "Debug" && <CheckCircle2 size={12} className="text-purple-600" />}
                </button>

                {/* Trace level button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    updateLogLevel("Trace");
                  }}
                  className={`py-1 px-2 rounded flex items-center justify-between text-left ${
                    currentLogLevel === "Trace"
                      ? "bg-slate-100 dark:bg-slate-900/30 border border-slate-400 text-slate-700 dark:text-slate-400"
                      : "bg-background border border-border hover:bg-slate-50 dark:hover:bg-slate-900/10"
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-slate-500"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span>Trace</span>
                  </div>
                  {currentLogLevel === "Trace" && <CheckCircle2 size={12} className="text-slate-600" />}
                </button>
              </div>
            </div>

            {/* Log Level Explanation */}
            <div className="grid grid-cols-1 gap-2 p-2 border border-cyan-200 dark:border-cyan-900/50 bg-cyan-50/30 dark:bg-cyan-900/20 rounded-md">
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                {getLogLevelIcon(currentLogLevel)}
                <span className={`font-medium ${getLogLevelColor(currentLogLevel)}`}>{currentLogLevel}</span>
                <span className="flex-1"> - {getLogLevelDescription(currentLogLevel)}</span>
              </div>
              <div className="text-[10px] text-muted-foreground mt-1">
                Higher levels (like Error) include fewer messages, while lower levels (like Trace) include more verbose
                output.
              </div>
            </div>
          </div>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 border border-cyan-400 dark:border-cyan-600 bg-cyan-500"
        style={{ zIndex: 6 }}
      />
    </div>
  );
};

export default MessageLogNode;
