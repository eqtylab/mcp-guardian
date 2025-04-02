import React, { useRef, useEffect } from "react";
import Editor, { EditorProps, Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { Check, AlertCircle } from "lucide-react";
import { cn } from "../../utils";

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

  // Handle editor mount
  const handleEditorDidMount = (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Set schema for validation if provided
    if (schema && monaco) {
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemas: [
          {
            uri: schemaUri,
            fileMatch: ["*"],
            schema,
          },
        ],
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

  // Custom Monaco theme options matching application style
  const themeOptions: EditorProps["options"] = {
    minimap: { enabled: false },
    lineNumbers: "on",
    scrollBeyondLastLine: false,
    readOnly: disabled,
    automaticLayout: true,
    formatOnPaste: true,
    wordWrap: "on",
    fontSize: 12,
    fontFamily: "var(--fontFamily-mono)",
    tabSize: 2,
  };

  return (
    <div className="relative space-y-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {label && <span className="text-sm font-medium">{label}</span>}
          {!disabled && (
            <div className="flex items-center gap-2">
              {isValid ? (
                <Check size={16} className="text-colors-status-success" />
              ) : (
                <AlertCircle size={16} className="text-colors-status-danger" />
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
      </div>

      <div 
        className={cn(
          "border rounded-md overflow-hidden",
          !isValid && !disabled ? "border-colors-status-danger" : "border-colors-border-subtle"
        )}
        style={{ 
          height: maxHeight 
        }}
      >
        <Editor
          defaultLanguage="json"
          value={value}
          onChange={(v) => {
            const newValue = v || "";
            onChange(newValue);
          }}
          options={themeOptions}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          className={disabled ? "opacity-70" : ""}
        />
      </div>

      {!isValid && errorMessage && (
        <p className="text-colors-status-danger text-xs mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default MonacoJsonEditor;