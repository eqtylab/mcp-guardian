import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { NamedMcpServer } from "../bindings/NamedMcpServer";
import { McpServer } from "../bindings/McpServer";
import { notifyError, notifySuccess } from "./toast";
import { ChevronDown, ChevronRight, Save, Trash2 } from "lucide-react";

interface McpServerComponentProps {
  namedMcpServer: NamedMcpServer;
  onUpdateSuccess: () => void;
  onDeleteSuccess: () => void;
  isExpanded: boolean;
  onToggle: () => void;
}

const McpServerComponent = ({
  namedMcpServer,
  onUpdateSuccess,
  onDeleteSuccess,
  isExpanded,
  onToggle,
}: McpServerComponentProps) => {
  const { namespace, name, mcp_server } = namedMcpServer;
  const [configText, setConfigText] = useState("");
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setConfigText(JSON.stringify(mcp_server, null, 2));
  }, [mcp_server]);

  const validateConfig = (text: string) => {
    try {
      JSON.parse(text);
      setIsValid(true);
      return true;
    } catch {
      setIsValid(false);
      return false;
    }
  };

  const updateMcpServer = async () => {
    if (!validateConfig(configText)) {
      notifyError("Invalid JSON configuration");
      return;
    }

    try {
      const mcpServer = JSON.parse(configText);
      await invoke("set_mcp_server", { namespace, name, mcpServer });
      onUpdateSuccess();
      notifySuccess(`Server "${namespace}.${name}" updated successfully`);
    } catch (e: any) {
      notifyError(e);
    }
  };

  return (
    <div className="component-container">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 hover:bg-cream-100 dark:hover:bg-primary-700 rounded-t-lg"
      >
        <span className="font-medium">{`${namespace}.${name}`}</span>
        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </button>

      {isExpanded && (
        <div className="p-4 space-y-4">
          <div className="relative">
            <textarea
              className={`w-full font-mono text-sm p-3 ${!isValid ? "border-[var(--color-danger)]" : ""}`}
              value={configText}
              onChange={(e) => {
                setConfigText(e.target.value);
                validateConfig(e.target.value);
              }}
              rows={Math.min(20, configText.split("\n").length + 2)}
              placeholder="Enter server configuration in JSON format"
            />
            {!isValid && <p className="text-[var(--color-danger)] text-sm mt-1">Invalid JSON configuration</p>}
          </div>

          <div className="flex justify-end space-x-4">
            <button onClick={updateMcpServer} className="btn-success flex items-center gap-2" disabled={!isValid}>
              <Save size={16} />
              Save Changes
            </button>

            <button
              onClick={async () => {
                if (confirm(`Delete server "${namespace}.${name}"?`)) {
                  try {
                    await invoke("delete_mcp_server", { namespace, name });
                    onDeleteSuccess();
                    notifySuccess(`Server "${namespace}.${name}" deleted`);
                  } catch (e: any) {
                    notifyError(e);
                  }
                }
              }}
              className="btn-danger flex items-center gap-2"
            >
              <Trash2 size={16} />
              Delete Server
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default McpServerComponent;
