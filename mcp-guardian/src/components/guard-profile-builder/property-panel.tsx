import React, { useState, SVGProps } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

import { GuardProfileNode } from "./nodes";

interface PropertyPanelProps {
  node: GuardProfileNode;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({ node }) => {
  // We start with unknown type because the node data can be of different types

  const [collapsed, setCollapsed] = useState<boolean>(true);

  // Get detailed information about the interceptor type
  const getInterceptorInfo = () => {
    switch (node.type) {
      case "Filter":
        return {
          title: "Filter Interceptor",
          tagline: "Message criteria-based control",
          description:
            "Conditionally process messages based on content, direction, or message type. Filters can send, drop, or intercept messages based on matching criteria.",
          details: [
            "Apply different actions to messages that match vs. don't match criteria",
            "Filter by direction (inbound/outbound), message type, or request method",
            "Use logical operators (AND, OR, NOT) for complex conditions",
            "Actions include: send (pass through), drop (discard), or intercept (stop for review)",
          ],
          color: "amber",
          icon: "filter",
          docsUrl: "https://docs.example.com/mcp-guardian/interceptors/filter",
        };
      case "MessageLog":
        return {
          title: "Message Log Interceptor",
          tagline: "Transparent message inspection",
          description:
            "Log messages passing through the system at different severity levels. Useful for debugging, auditing, and monitoring message flow without affecting processing.",
          details: [
            "Choose from five logging severity levels (Error, Warn, Info, Debug, Trace)",
            "Logs message content without modifying or blocking it",
            "Use for debugging, compliance, and activity monitoring",
            "Create audit trails of all message traffic through the system",
          ],
          color: "emerald",
          icon: "file-text",
          docsUrl: "https://docs.example.com/mcp-guardian/interceptors/messagelog",
        };
      case "ManualApproval":
        return {
          title: "Manual Approval Interceptor",
          tagline: "Human-in-the-loop verification",
          description:
            "Requires human approval before messages can proceed through the system. Creates approval requests that must be explicitly accepted or rejected.",
          details: [
            "Halts message processing until explicit approval is provided",
            "Presents message content for review in the pending messages queue",
            "Provides approve/reject options with optional comments",
            "Ideal for sensitive operations or high-risk AI interactions",
          ],
          color: "violet",
          icon: "user-check",
          docsUrl: "https://docs.example.com/mcp-guardian/interceptors/manualapproval",
        };
      case "Chain":
        return {
          title: "Chain Interceptor",
          tagline: "Multi-stage processing pipeline",
          description:
            "Combines multiple interceptors to be processed in sequence. Allows creating complex processing pipelines with multiple steps and conditions.",
          details: [
            "Connect multiple interceptors in a specific processing order",
            "Create sophisticated approval workflows with multiple checks",
            "Each interceptor in the chain is executed in sequence",
            "Enables complex logic without writing custom code",
          ],
          color: "blue",
          icon: "link",
          docsUrl: "https://docs.example.com/mcp-guardian/interceptors/chain",
        };
      default:
        return {
          title: "Unknown Interceptor",
          tagline: "Unrecognized node type",
          description: "No information available for this interceptor type.",
          details: [],
          color: "gray",
          icon: "help-circle",
          docsUrl: "",
        };
    }
  };

  // Render documentation for the interceptor
  const renderInfo = () => {
    const info = getInterceptorInfo();

    // Determine icon component
    const renderIcon = (iconName: string, color: string) => {
      const iconSize = 18;
      const colorClass = `text-${color}-500 dark:text-${color}-400`;

      // Common SVG props
      const svgProps: SVGProps<SVGSVGElement> = {
        width: iconSize,
        height: iconSize,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round" as "round",
        strokeLinejoin: "round" as "round",
        className: `lucide lucide-${iconName} ${colorClass}`,
      };

      // Select icon based on name
      switch (iconName) {
        case "filter":
          return (
            <svg {...svgProps}>
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          );
        case "file-text":
          return (
            <svg {...svgProps}>
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <line x1="10" y1="9" x2="8" y2="9" />
            </svg>
          );
        case "user-check":
          return (
            <svg {...svgProps}>
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <polyline points="16 11 18 13 22 9" />
            </svg>
          );
        case "link":
          return (
            <svg {...svgProps}>
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          );
        default:
          return (
            <svg {...svgProps}>
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          );
      }
    };

    return (
      <div className="p-4">
        <div className={`pb-4 relative overflow-hidden mb-6`}>
          {/* Subtle background grid for cyberpunk feel */}
          <div className="cyber-card-grid-subtle absolute inset-0 opacity-30" />

          <div className="relative">
            {/* Header with icon */}
            <div className="flex items-center gap-2 mb-4">
              {/* Icon with color-specific background */}
              <div
                className={`flex-shrink-0 w-10 h-10 bg-${info.color}-100 dark:bg-${info.color}-900/30 rounded-md flex items-center justify-center`}
              >
                {renderIcon(info.icon, info.color)}
              </div>

              <div>
                <h3 className="font-medium text-lg text-foreground">{info.title}</h3>
                <p className="text-sm text-muted-foreground cyber-text-glow">{info.tagline}</p>
              </div>
            </div>

            <div className="border-b border-muted/50 my-4"></div>

            {/* Main description */}
            <h4 className="text-sm font-medium mb-2 text-foreground/90">Description</h4>
            <p className="text-sm text-foreground/80 mb-5 leading-relaxed">{info.description}</p>

            {/* Bullet points for details */}
            {info.details.length > 0 && (
              <div className="mb-5">
                <h4 className="text-sm font-medium mb-2 text-foreground/90">Key Capabilities</h4>
                <div className="bg-muted/30 rounded p-4 cyber-card-grid-subtle relative overflow-hidden">
                  <ul className="space-y-2 text-sm text-foreground/80 pl-4 list-disc">
                    {info.details.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Usage hints based on node type */}
            <div className="mb-5">
              <h4 className="text-sm font-medium mb-2 text-foreground/90">Usage Hints</h4>
              <div
                className={`bg-${info.color}-50/20 dark:bg-${info.color}-900/10 rounded p-4 border border-${info.color}-200/30 dark:border-${info.color}-800/30`}
              >
                {node.type === "Filter" && (
                  <ul className="space-y-2 text-sm pl-4 list-disc">
                    <li>
                      Use <strong>Match Action</strong> to control what happens when the filter condition is met
                    </li>
                    <li>
                      Use <strong>Non-Match Action</strong> for the opposite case
                    </li>
                    <li>Filter by direction or message type for the most common use cases</li>
                    <li>For complex logic, combine filters using Chain with AND/OR conditions</li>
                  </ul>
                )}
                {node.type === "MessageLog" && (
                  <ul className="space-y-2 text-sm pl-4 list-disc">
                    <li>
                      Use <strong>Error</strong> level only for critical issues that need attention
                    </li>
                    <li>
                      Use <strong>Info</strong> level for general activity tracking
                    </li>
                    <li>
                      Use <strong>Debug</strong> or <strong>Trace</strong> for detailed troubleshooting
                    </li>
                    <li>Message logs don't block messages - they pass through transparently</li>
                  </ul>
                )}
                {node.type === "ManualApproval" && (
                  <ul className="space-y-2 text-sm pl-4 list-disc">
                    <li>Messages will be held in the Pending Messages queue until approved or rejected</li>
                    <li>Best practice is to use a Filter before Manual Approval to reduce volume</li>
                    <li>Chain this with other interceptors to create a review-then-process flow</li>
                    <li>Provides full human oversight of message content before proceeding</li>
                  </ul>
                )}
                {node.type === "Chain" && (
                  <ul className="space-y-2 text-sm pl-4 list-disc">
                    <li>Connect interceptors to the Chain in the order you want them to execute</li>
                    <li>Chain processes each interceptor in sequence, from left to right</li>
                    <li>Useful for creating complex logic without writing custom code</li>
                    <li>Combine filters, logs, and approvals for sophisticated workflows</li>
                  </ul>
                )}
              </div>
            </div>

            {/* Configuration tip */}
            <div className="bg-primary/10 rounded-lg p-4 border border-primary/30 mb-5">
              <div className="flex items-center gap-2 mb-1 text-muted-foreground">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span className="font-medium text-sm text-muted-foreground">Configuration Tip</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Configure this interceptor using the form fields below. Select different nodes in the diagram to edit
                their respective settings.
              </p>
            </div>

            {/* Documentation link with cyber styling */}
            {info.docsUrl && (
              <a
                href={info.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm inline-flex items-center gap-2 text-${info.color}-500 dark:text-${info.color}-400 hover:underline py-2 px-3 rounded border border-${info.color}-200/50 dark:border-${info.color}-800/30 bg-${info.color}-50/30 dark:bg-${info.color}-900/20`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-book-open"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                View full documentation
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Get a color-specific class string based on the interceptor type
  const getTypeColorClasses = () => {
    const info = getInterceptorInfo();
    return {
      borderColor: `border-${info.color}-500/30`,
      bgColor: `bg-${info.color}-50 dark:bg-${info.color}-900/10`,
      textColor: `text-${info.color}-600 dark:text-${info.color}-400`,
      iconBgColor: `bg-${info.color}-100 dark:bg-${info.color}-900/30`,
    };
  };

  // No node selected state
  if (!node || !node.type) {
    return (
      <div className="property-panel p-4 h-full flex flex-col items-center justify-center text-center border-l border-border">
        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center mb-2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="12" cy="12" r="1" />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-1">No Node Selected</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Select a node in the diagram to view and edit its properties here.
        </p>
      </div>
    );
  }

  const colorClasses = getTypeColorClasses();

  // Function to render documentation only - configuration is now in the nodes
  const renderDocumentation = () => {
    return (
      <>
        {/* Documentation Section */}
        <div className="mb-6">{renderInfo()}</div>

        {/* Info about in-node configuration */}
        <div className="p-4">
          <div className="border-t border-border -mx-4 px-4 py-4 bg-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="M12 16v.01" />
                <path d="M12 8v4" />
              </svg>
              <h4 className="text-sm font-medium text-primary">In-Node Configuration</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              This interceptor can be configured directly in the node. Click the dropdown button in the node to expand
              it and access configuration options.
            </p>
            <div className="bg-background/50 border border-border rounded-md p-3 text-xs">
              <div className="font-medium mb-1">Configuration Tips:</div>
              <ul className="pl-4 list-disc space-y-1 text-muted-foreground">
                <li>Click the chevron icon to expand/collapse the node configuration</li>
                <li>Changes apply immediately - no need to save</li>
                <li>Complex conditions can only be edited in JSON view</li>
                <li>Use the node toolbox to add new interceptors</li>
              </ul>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div
      className={`property-panel h-full border-l border-border flex ${collapsed ? "w-12" : "w-80"} transition-all duration-200`}
    >
      {/* Collapse toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex-shrink-0 w-12 h-full bg-background hover:bg-muted flex flex-col items-center justify-center border-r border-border text-muted-foreground hover:text-foreground"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        <div className="text-xs mt-2 font-medium tracking-wide [writing-mode:vertical-rl] rotate-180">
          {collapsed ? "INFO" : "HIDE"}
        </div>
      </button>

      {/* Content panel - only shown when expanded */}
      {!collapsed && (
        <div className="flex-1 h-full overflow-y-auto">
          {/* Header with  debug info */}
          <div className="mt-auto p-4 border-t border-border text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <div>Node ID: {node.id.substring(0, 8)}</div>
              <div>Type: {node.type}</div>
            </div>
          </div>

          {/* Documentation header with node type indicator */}
          <div
            className={`px-4 py-3 border-b ${colorClasses.borderColor} ${colorClasses.bgColor} flex items-center gap-2`}
          >
            <div className={`w-3 h-3 rounded-full ${colorClasses.textColor} ring-2 ring-current opacity-80`} />
            <h3 className={`text-sm font-medium ${colorClasses.textColor}`}>
              {node.type.charAt(0).toUpperCase() + node.type.slice(1)} Documentation
            </h3>
          </div>

          {/* Documentation only content */}
          {renderDocumentation()}
        </div>
      )}
    </div>
  );
};

export default PropertyPanel;
