import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { NamedMcpServer } from "../bindings/NamedMcpServer";
import { McpServer } from "../bindings/McpServer";
import { notifyError, notifySuccess } from "./toast";
import { ChevronDown, ChevronRight, Save, Trash2 } from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";
import JsonEditor from "./JSONEditor";

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setConfigText(JSON.stringify(mcp_server, null, 2));
  }, [mcp_server]);

  const handleDelete = async () => {
    try {
      await invoke("delete_mcp_server", { namespace, name });
      onDeleteSuccess();
      notifySuccess(`Server "${namespace}.${name}" deleted`);
    } catch (e: any) {
      notifyError(e);
    }
  };

  const updateMcpServer = async () => {
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
        title={`${namespace}.${name} server configuration`}
      >
        <span className="font-medium">{`${namespace}.${name}`}</span>
        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </button>

      {isExpanded && (
        <div className="p-4 space-y-4">
          <JsonEditor value={configText} onChange={setConfigText} placeholder="Enter MCP server configuration" />

          <div className="flex justify-end space-x-4">
            <button
              onClick={updateMcpServer}
              className="btn-success flex items-center gap-2"
              disabled={!isValid}
              title="Save server changes"
            >
              <Save size={16} />
              Save Changes
            </button>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="btn-danger flex items-center gap-2"
              title="Delete this server"
            >
              <Trash2 size={16} />
              Delete Server
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete MCP Server"
        message={`Are you sure you want to delete the server "${namespace}.${name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default McpServerComponent;
