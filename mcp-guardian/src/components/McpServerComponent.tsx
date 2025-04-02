import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { NamedMcpServer } from "../bindings/NamedMcpServer";
import { notifyError, notifySuccess } from "./toast";
import { ChevronDown, ChevronRight, Save, Trash2 } from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";
import JsonEditor from "./JsonValidEditor";

interface McpServerComponentProps {
  namedMcpServer: NamedMcpServer;
  onUpdateSuccess: () => void;
  onDeleteSuccess: () => void;
  isExpanded: boolean;
  onToggle: () => void;
  enableEdit: boolean;
}

const McpServerComponent = ({
  namedMcpServer,
  onUpdateSuccess,
  onDeleteSuccess,
  isExpanded,
  onToggle,
  enableEdit,
}: McpServerComponentProps) => {
  const { namespace, name, mcp_server } = namedMcpServer;
  const [configText, setConfigText] = useState("");
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
    <div className="bg-bg-surface rounded-md border border-border-subtle overflow-hidden mb-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 hover:bg-bg-elevated transition-colors duration-fast"
        title={`${namespace}.${name} server configuration`}
      >
        <span className="font-medium text-text-primary">{`${namespace}.${name}`}</span>
        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </button>

      {isExpanded && (
        <div className="p-4 space-y-4">
          <JsonEditor
            value={configText}
            onChange={setConfigText}
            disabled={!enableEdit}
            placeholder="Enter MCP server configuration"
          />

          {enableEdit && (
            <div className="flex justify-end gap-4">
              <button
                onClick={updateMcpServer}
                className="bg-status-success text-bg-base hover:bg-status-success/90 
                           rounded-sm py-2 px-3 font-medium text-sm border-0
                           flex items-center gap-2 transition-colors duration-fast"
                title="Save server changes"
              >
                <Save size={16} />
                Save Changes
              </button>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-status-danger text-white hover:bg-status-danger/90 
                           rounded-sm py-2 px-3 font-medium text-sm border-0
                           flex items-center gap-2 transition-colors duration-fast"
                title="Delete this server"
              >
                <Trash2 size={16} />
                Delete Server
              </button>
            </div>
          )}
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
