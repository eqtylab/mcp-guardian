import React, { useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../../utils";
import { defineMonacoThemes } from "./monaco-themes";
import "./monaco-editor.css";

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
  const monacoRef = useRef<any>(null);
  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(
    document.documentElement.classList.contains('dark') 
    || window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  
  // Format the JSON data
  const jsonString = React.useMemo(() => {
    try {
      return JSON.stringify(data, null, 2);
    } catch (error) {
      return String(data);
    }
  }, [data]);

  // Listen for theme changes in the document
  useEffect(() => {
    const handleThemeChange = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    // Check for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          handleThemeChange();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    // Also listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleThemeChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, []);

  // Handle editor mount
  const handleEditorDidMount = (
    editor: editor.IStandaloneCodeEditor,
    monaco: any
  ) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Define and register our custom themes
    const themes = defineMonacoThemes(monaco);
    
    // Set the appropriate theme based on current mode
    monaco.editor.setTheme(isDarkMode ? themes.dark : themes.light);
  };

  // Update theme when dark mode changes
  useEffect(() => {
    if (monacoRef.current && editorRef.current) {
      const themes = defineMonacoThemes(monacoRef.current);
      monacoRef.current.editor.setTheme(isDarkMode ? themes.dark : themes.light);
    }
  }, [isDarkMode]);

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
        {title && (
          <div className="text-sm font-medium flex items-center gap-1">
            {title}
          </div>
        )}
        <div className="flex items-center space-x-2">
          {collapsible && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-colors-text-tertiary hover:text-colors-primary text-xs py-1 px-2 rounded flex items-center gap-1 transition-colors"
            >
              {isExpanded ? (
                <>
                  <ChevronUp size={12} />
                  <span>Collapse</span>
                </>
              ) : (
                <>
                  <ChevronDown size={12} />
                  <span>Expand</span>
                </>
              )}
            </button>
          )}
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1 text-colors-text-tertiary hover:text-colors-primary text-xs py-1 px-2 rounded transition-colors"
            title="Copy to clipboard"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>
      
      {(!collapsible || isExpanded) && (
        <div 
          className={cn(
            "border rounded-md overflow-hidden transition-all",
            "border-colors-border-subtle hover:border-colors-primary/30",
            isDarkMode ? "shadow-sm" : "",
          )}
          style={{ 
            height: maxHeight,
            boxShadow: isDarkMode ? "0 0 8px rgba(var(--primary-rgb), 0.1)" : undefined,
          }}
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
              padding: {
                top: 8,
                bottom: 8,
              },
              scrollbar: {
                verticalScrollbarSize: 10,
                horizontalScrollbarSize: 10,
                alwaysConsumeMouseWheel: false,
              },
              renderLineHighlight: "none",
              folding: true,
              bracketPairColorization: {
                enabled: true,
              },
            }}
            onMount={handleEditorDidMount}
            className="monaco-editor-container"
            loading={
              <div className="h-full w-full flex items-center justify-center">
                <span className="text-colors-primary text-sm">Loading...</span>
              </div>
            }
          />
        </div>
      )}
    </div>
  );
};

export default JsonViewer;