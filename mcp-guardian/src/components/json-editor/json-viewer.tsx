import React, { useRef } from "react";
import Editor from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { Copy, Check } from "lucide-react";
import { cn } from "../../utils";

interface JsonViewerProps {
  data: any;
  className?: string;
  title?: string;
  collapsible?: boolean;
  expanded?: boolean;
  maxHeight?: string;
}

const JsonViewer: React.FC<JsonViewerProps> = ({
  data,
  className,
  title,
  collapsible = false,
  expanded = true,
  maxHeight = "300px",
}) => {
  const [isExpanded, setIsExpanded] = React.useState(expanded);
  const [copied, setCopied] = React.useState(false);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  
  // Format the JSON data
  const jsonString = React.useMemo(() => {
    try {
      return JSON.stringify(data, null, 2);
    } catch (error) {
      return String(data);
    }
  }, [data]);

  // Handle editor mount
  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };

  return (
    <div className={cn("overflow-hidden", className)}>
      <div className="flex items-center justify-between mb-2">
        {title && <div className="text-sm font-medium">{title}</div>}
        <div className="flex items-center space-x-2">
          {collapsible && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-colors-text-tertiary hover:text-colors-text-secondary text-xs py-1 px-2 rounded"
            >
              {isExpanded ? "Collapse" : "Expand"}
            </button>
          )}
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1 text-colors-text-tertiary hover:text-colors-text-secondary text-xs py-1 px-2 rounded"
            title="Copy to clipboard"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>
      
      {(!collapsible || isExpanded) && (
        <div 
          className="border border-colors-border-subtle rounded-md overflow-hidden"
          style={{ height: maxHeight }}
        >
          <Editor
            defaultLanguage="json"
            value={jsonString}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: "on",
              fontSize: 12,
              fontFamily: "var(--fontFamily-mono)",
              domReadOnly: true,
              contextmenu: false,
            }}
            onMount={handleEditorDidMount}
            theme="vs-dark"
          />
        </div>
      )}
    </div>
  );
};

export default JsonViewer;