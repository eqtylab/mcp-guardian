// components/JsonEditor.tsx
import React, { useState } from "react";
import { Check, AlertCircle, Code } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { cn } from "../utils";

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  maxHeight?: string;
}

const JsonEditor: React.FC<JsonEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter JSON configuration",
  disabled = false,
  maxHeight = "500px",
}) => {
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const formatJson = () => {
    try {
      const parsed = JSON.parse(value);
      const formatted = JSON.stringify(parsed, null, 2);
      onChange(formatted);
      setIsValid(true);
      setErrorMessage("");
    } catch (e: any) {
      setIsValid(false);
      setErrorMessage(e.message);
    }
  };

  const validateJson = (text: string) => {
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

  return (
    <div className="relative space-y-2">
      <div className="flex items-center justify-between mb-2">
        <div
          className={cn(
            "flex items-center gap-2",
            disabled ? "hidden" : ""
          )}
        >
          {isValid ? (
            <Check size={16} className="text-colors-status-success" />
          ) : (
            <AlertCircle size={16} className="text-colors-status-danger" />
          )}
          <span
            className={cn(
              "text-sm",
              isValid ? "text-colors-status-success" : "text-colors-status-danger"
            )}
          >
            {isValid ? "Valid JSON" : "Invalid JSON"}
          </span>
        </div>
        
        {!disabled && (
          <Button
            onClick={formatJson}
            variant="ghost"
            size="sm"
            className="gap-1 p-1.5"
            title="Format JSON"
          >
            <Code size={16} />
            <span className="text-sm">Format</span>
          </Button>
        )}
      </div>

      <Textarea
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          validateJson(e.target.value);
        }}
        disabled={disabled}
        className={cn(
          "w-full font-mono text-sm",
          !isValid && "border-colors-status-danger"
        )}
        style={{
          maxHeight,
          minHeight: "200px",
        }}
        placeholder={placeholder}
        error={!isValid}
      />

      {!isValid && errorMessage && (
        <p className="text-colors-status-danger text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default JsonEditor;
