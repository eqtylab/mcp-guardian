// components/JsonEditor.tsx
import React, { useState } from "react";
import { Check, AlertCircle, Code } from "lucide-react";

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
          className={`flex items-center gap-2
          ${disabled ? "hidden" : ""}
          `}
        >
          {isValid ? (
            <Check size={16} className="text-[var(--color-success)]" />
          ) : (
            <AlertCircle size={16} className="text-[var(--color-danger)]" />
          )}
          <span
            className={`text-sm 
            ${isValid ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"}
            
            `}
          >
            {isValid ? "Valid JSON" : "Invalid JSON"}
          </span>
        </div>
        <button
          onClick={formatJson}
          disabled={disabled}
          className={`p-1.5 hover:bg-cream-100 dark:hover:bg-primary-700 rounded flex items-center gap-1
            ${disabled ? "hidden" : ""}`}
          title="Format JSON"
        >
          <Code size={16} />
          <span className="text-sm">Format</span>
        </button>
      </div>

      <textarea
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          validateJson(e.target.value);
        }}
        disabled={disabled}
        className={`
          w-full font-mono text-sm p-3
          bg-cream-100 dark:bg-primary-700
          rounded-[var(--radius-brand)]
          ${!isValid ? "border-[var(--color-danger)]" : "border-transparent"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
        style={{
          maxHeight,
          minHeight: "200px",
        }}
        placeholder={placeholder}
      />

      {!isValid && errorMessage && <p className="text-[var(--color-danger)] text-sm mt-1">{errorMessage}</p>}
    </div>
  );
};

export default JsonEditor;
