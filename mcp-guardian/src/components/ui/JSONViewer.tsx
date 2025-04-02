import * as React from "react";
import { CopyBlock } from "react-code-blocks";
import { cn } from "../../utils";

interface JSONViewerProps {
  data: any;
  className?: string;
  title?: string;
  collapsible?: boolean;
  expanded?: boolean;
}

export function JSONViewer({
  data,
  className,
  title,
  collapsible = false,
  expanded = true,
}: JSONViewerProps) {
  const [isExpanded, setIsExpanded] = React.useState(expanded);
  const jsonString = React.useMemo(() => {
    try {
      return JSON.stringify(data, null, 2);
    } catch (error) {
      return String(data);
    }
  }, [data]);

  return (
    <div className={cn("overflow-hidden", className)}>
      {(title || collapsible) && (
        <div className="flex items-center justify-between mb-2">
          {title && <div className="text-sm font-medium">{title}</div>}
          {collapsible && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-colors-text-tertiary hover:text-colors-text-secondary"
            >
              {isExpanded ? "Collapse" : "Expand"}
            </button>
          )}
        </div>
      )}
      
      {(!collapsible || isExpanded) && (
        <CopyBlock
          text={jsonString}
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
      )}
    </div>
  );
}