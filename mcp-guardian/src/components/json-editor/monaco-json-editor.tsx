import React, { useRef, useEffect } from "react";
import Editor, { EditorProps, Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { Check, AlertCircle, RefreshCcw } from "lucide-react";
import { cn } from "../../utils";
import { defineMonacoThemes } from "./monaco-themes";
import { detectThemeMode, watchThemeChanges } from "./theme-utils";
import "./monaco-editor.css";

interface MonacoJsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  maxHeight?: string;
  schema?: any;
  schemaUri?: string; // Optional schema URI for identification
  label?: string;
}

const MonacoJsonEditor: React.FC<MonacoJsonEditorProps> = ({
  value,
  onChange,
  disabled = false,
  maxHeight = "500px",
  schema,
  schemaUri = "http://mcp-guardian/schemas/default.json",
  label,
}) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const [isValid, setIsValid] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  // Initialize theme using the utility function for more accurate detection
  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(detectThemeMode());

  // Function to validate JSON manually (for errors not caught by Monaco)
  const validateJson = (text: string): boolean => {
    if (!text || text.trim() === "") {
      // Handle empty input case
      setIsValid(false);
      setErrorMessage("JSON content cannot be empty");
      return false;
    }
    
    try {
      JSON.parse(text);
      setIsValid(true);
      setErrorMessage("");
      return true;
    } catch (e: any) {
      setIsValid(false);
      setErrorMessage(e.message);
      return false;
    }
  };

  // Format JSON with Monaco's formatter
  const formatDocument = () => {
    if (editorRef.current) {
      editorRef.current.getAction("editor.action.formatDocument")?.run();
    }
  };

  // Keep a reference to the overflow widgets DOM node for cleanup
  const overflowWidgetsDomNodeRef = useRef<HTMLDivElement | null>(null);

  // Clean up the overflow widgets DOM node when the component unmounts
  useEffect(() => {
    return () => {
      if (overflowWidgetsDomNodeRef.current && typeof document !== 'undefined') {
        document.body.removeChild(overflowWidgetsDomNodeRef.current);
        overflowWidgetsDomNodeRef.current = null;
      }
    };
  }, []);

  // Listen for theme changes using our utility function
  useEffect(() => {
    const handleThemeChange = (newDarkMode: boolean) => {
      console.debug('[MonacoEditor] Theme changed, isDarkMode:', newDarkMode);
      setIsDarkMode(newDarkMode);
    };

    // Initial check on mount to ensure we have the right value
    const initialTheme = detectThemeMode();
    if (initialTheme !== isDarkMode) {
      console.debug('[MonacoEditor] Initial theme correction, isDarkMode:', initialTheme);
      setIsDarkMode(initialTheme);
    }

    // Set up the theme watcher which handles all the different ways the theme can change
    const cleanupWatcher = watchThemeChanges(handleThemeChange);
    
    return cleanupWatcher;
  }, []);

  // Handle editor mount
  const handleEditorDidMount = (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Define and register our custom themes
    const themes = defineMonacoThemes(monaco);
    
    // Set the appropriate theme based on current mode
    const themeName = isDarkMode ? themes.dark : themes.light;
    console.debug(`[MonacoEditor] Initial theme: ${themeName}, isDarkMode: ${isDarkMode}`);
    monaco.editor.setTheme(themeName);

    // Set up fixed widget container for overflow widgets
    // This creates a special container at the document level for widgets
    // so they're not constrained by any parent overflow settings
    if (typeof document !== 'undefined') {
      // Only create a new container if one doesn't already exist
      if (!overflowWidgetsDomNodeRef.current) {
        const widgetsDomNode = document.createElement('div');
        widgetsDomNode.className = 'monaco-editor-overflow-widgets';
        widgetsDomNode.style.position = 'fixed';
        widgetsDomNode.style.top = '0';
        widgetsDomNode.style.left = '0';
        widgetsDomNode.style.width = '0';
        widgetsDomNode.style.height = '0';
        widgetsDomNode.style.zIndex = '9999';
        document.body.appendChild(widgetsDomNode);
        overflowWidgetsDomNodeRef.current = widgetsDomNode;
      }
      
      // Apply the overflow widgets DOM node to the editor using a method that doesn't rely on TypeScript types
      // The editor has this property in runtime but TypeScript doesn't know about it
      const editorInstance = editor as any;
      if (editorInstance && typeof editorInstance.updateOptions === 'function') {
        editorInstance.updateOptions({
          overflowWidgetsDomNode: overflowWidgetsDomNodeRef.current
        });
      }
    }

    // Set schema for validation if provided
    if (schema && monaco) {
      // Enhance the schema to ensure additionalProperties: false is set at root level
      // This ensures unrecognized keys will be marked as errors
      const enhancedSchema = {
        ...schema,
        additionalProperties: false, // Explicitly disallow unknown properties at root level
      };

      // Configure JSON language features with enhanced schema
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        allowComments: false, // Disallow comments in JSON for strict validation
        schemaValidation: "error", // Show schema validation issues as errors
        enableSchemaRequest: false, // Don't fetch schemas from outside
        trailingCommas: "error", // Mark trailing commas as errors
        comments: "error", // No comments in JSON
        // Make Monaco validation more strict to catch more errors
        doValidation: true, // Explicitly enable validation
        diagnosticOptions: {
          validate: true,
          schemaValidation: true,
          enableSchemaRequest: false,
          trailingCommas: false,
        },
        schemas: [
          {
            uri: schemaUri,
            fileMatch: ["*"],
            schema: enhancedSchema,
          },
        ],
      });
      
      // Configure hover settings to make documentation more visible
      editor.updateOptions({
        hover: {
          enabled: true,
          delay: 300, // Show hover a bit faster than default
          sticky: true, // Keep hover visible when mouse moves over it
        },
        // Enhance tooltips/documentation experience
        inlayHints: {
          enabled: "on",
        },
      });
    }

    // Add custom validation event
    editor.onDidChangeModelContent(() => {
      validateJson(editor.getValue());
    });

    // Set initial validation state (ensure we have valid JSON)
    let initialValue = value;
    if (!initialValue || initialValue.trim() === "") {
      initialValue = "{}";
      // Update parent component's state with valid JSON
      onChange(initialValue);
    }
    
    // Validate and ensure proper formatting
    try {
      // Try to parse and re-stringify to ensure valid JSON
      const parsed = JSON.parse(initialValue);
      const formatted = JSON.stringify(parsed, null, 2);
      if (formatted !== initialValue) {
        // If the format changed, update the editor and parent state
        editor.setValue(formatted);
        onChange(formatted);
      }
      setIsValid(true);
      setErrorMessage("");
    } catch (e: any) {
      // If the JSON is invalid, show error but don't change the content
      setIsValid(false);
      setErrorMessage(e.message);
    }

    // Focus the editor if not disabled
    if (!disabled) {
      editor.focus();
    }
    
    // Format document on initial load
    formatDocument();
  };

  // Update options when disabled state changes
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({ readOnly: disabled });
    }
  }, [disabled]);

  // Update theme when dark mode changes
  useEffect(() => {
    if (monacoRef.current && editorRef.current) {
      const themes = defineMonacoThemes(monacoRef.current);
      const themeName = isDarkMode ? themes.dark : themes.light;
      console.debug(`[MonacoEditor] Applying theme: ${themeName}, isDarkMode: ${isDarkMode}`);
      monacoRef.current.editor.setTheme(themeName);
    }
  }, [isDarkMode]);

  // Custom Monaco theme options matching application style
  const themeOptions: EditorProps["options"] = {
    minimap: { enabled: false },
    lineNumbers: "on",
    scrollBeyondLastLine: false,
    readOnly: disabled,
    automaticLayout: true,
    formatOnPaste: true,
    wordWrap: "on",
    fontSize: 13,
    fontFamily: "var(--fontFamily-mono)",
    tabSize: 2,
    renderLineHighlight: "all",
    cursorStyle: "line-thin",
    cursorWidth: 2,
    cursorBlinking: "smooth",
    roundedSelection: true,
    smoothScrolling: true,
    scrollbar: {
      verticalScrollbarSize: 12,
      horizontalScrollbarSize: 12,
      alwaysConsumeMouseWheel: false,
    },
    padding: {
      top: 12,
      bottom: 12,
    },
    glyphMargin: false,
    renderWhitespace: "none",
    quickSuggestions: true,
    folding: true,
    bracketPairColorization: {
      enabled: true,
    },
    // Critical option for widget overflow
    fixedOverflowWidgets: true, // This positions widgets in a fixed position
    
    // Enhanced error/validation highlighting
    // Make errors more visible with squiggly underlines
    'editor.renderValidationDecorations': 'on',
    'editor.colorDecorators': true,
    'editor.matchBrackets': 'always',
    'editor.wordWrap': 'on',
    
    // Make squiggly lines more prominent
    'editor.highlightActiveIndentGuide': true,
    'editor.guides.highlightActiveIndentGuide': true,
    
    // Show validation errors in tooltip/hover
    hover: {
      enabled: true,
      delay: 300,
      sticky: true,
    },
  };

  // Format JSON
  const formatJson = () => {
    if (editorRef.current) {
      try {
        // Get current value
        const value = editorRef.current.getValue();
        // Parse and re-stringify for consistent formatting
        const parsed = JSON.parse(value);
        const formatted = JSON.stringify(parsed, null, 2);
        
        // Only update if it actually changed the formatting
        if (formatted !== value) {
          // Update the editor with well-formatted JSON
          editorRef.current.setValue(formatted);
          // Also update the parent component's state
          onChange(formatted);
        } else {
          // Otherwise just run the built-in formatter
          formatDocument();
        }
        
        // Indicate valid JSON
        setIsValid(true);
        setErrorMessage("");
      } catch (e: any) {
        // If we can't parse it, just try the built-in formatter
        formatDocument();
      }
    }
  };

  return (
    <div className="relative space-y-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {label && (
            <span className="text-sm font-medium flex items-center gap-1">
              <span>{label}</span>
              {isValid ? (
                <Check size={14} className="text-colors-status-success" />
              ) : (
                <AlertCircle size={14} className="text-colors-status-danger" />
              )}
            </span>
          )}
          {!disabled && !label && (
            <div className="flex items-center gap-2">
              {isValid ? (
                <Check size={14} className="text-colors-status-success" />
              ) : (
                <AlertCircle size={14} className="text-colors-status-danger" />
              )}
              <span
                className={cn(
                  "text-xs",
                  isValid ? "text-colors-status-success" : "text-colors-status-danger"
                )}
              >
                {isValid ? "Valid JSON" : "Invalid JSON"}
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {!disabled && (
            <button
              onClick={formatJson}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-colors-muted hover:bg-colors-primary hover:text-white transition-colors"
              title="Format JSON"
            >
              <RefreshCcw size={12} className="format-icon transition-transform duration-300" />
              <span>Format</span>
            </button>
          )}
        </div>
      </div>

      <div 
        className={cn(
          "border rounded-md transition-all",
          !isValid && !disabled 
            ? "border-colors-status-danger shadow-[0_0_0_1px_var(--color-destructive)]" 
            : "border-colors-border-subtle hover:border-colors-primary/50",
          isDarkMode ? "shadow-md" : "",
        )}
        style={{ 
          height: maxHeight,
          boxShadow: isDarkMode && isValid ? "0 0 8px rgba(var(--primary-rgb), 0.15)" : undefined,
          position: 'relative', // Ensure proper stacking context
        }}
      >
        <Editor
          defaultLanguage="json"
          value={value}
          onChange={(v) => {
            const newValue = v || "";
            onChange(newValue);
          }}
          options={{
            ...themeOptions,
            fixedOverflowWidgets: false, // This allows widgets to overflow their container
            
            // Stricter validation settings
            renderValidationDecorations: "on",
            colorDecorators: true,
            guides: {
              bracketPairs: true,
              indentation: true,
              highlightActiveIndentation: true,
            },
          }}
          onMount={handleEditorDidMount}
          className={cn(
            "monaco-editor-container transition-opacity",
            disabled ? "opacity-60" : ""
          )}
          loading={
            <div className="h-full w-full flex items-center justify-center">
              <span className="text-colors-primary">Loading editor...</span>
            </div>
          }
        />
      </div>

      {!isValid && errorMessage && (
        <p className="text-colors-status-danger text-xs mt-1 flex items-center gap-1">
          <AlertCircle size={12} />
          <span>{errorMessage}</span>
        </p>
      )}
    </div>
  );
};

export default MonacoJsonEditor;