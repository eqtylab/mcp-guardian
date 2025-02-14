import { useState } from "react";
import Collapsible from "react-collapsible";
import { invoke } from "@tauri-apps/api/core";
import { NamedMcpServer } from "../bindings/NamedMcpServer";
import { McpServer } from "../bindings/McpServer";
import { notifyError, notifySuccess } from "./toast";

interface McpServerComponentProps {
  namedMcpServer: NamedMcpServer;
  onDeleteSuccess: () => void;
  open: boolean;
  onToggle: () => void;
}

const McpServerComponent = ({ namedMcpServer, onDeleteSuccess, open, onToggle }: McpServerComponentProps) => {
  const { namespace, name, mcp_server } = namedMcpServer;

  const [configText, setConfigText] = useState(JSON.stringify(mcp_server, null, 2));

  const updateMcpServer = async (mcpServer: McpServer) => {
    try {
      await invoke("set_mcp_server", { namespace, name, mcpServer });
      notifySuccess(`MCP server "${namespace}.${name}" saved`);
    } catch (e: any) {
      notifyError(e);
    }
  };

  const deleteMcpServer = async () => {
    try {
      await invoke("delete_mcp_server", { namespace, name });
      onDeleteSuccess();
      notifySuccess(`MCP Server "${namespace}.${name}" deleted`);
    } catch (e: any) {
      notifyError(e);
    }
  };

  return (
    <div className="component-container">
      <Collapsible
        trigger={`\u25B8 ${namespace}.${name}`}
        triggerWhenOpen={`\u25BE ${namespace}.${name}`}
        transitionTime={150}
        open={open}
        handleTriggerClick={onToggle}
      >
        <div className="grid">
          <textarea
            className="textarea"
            value={configText}
            onChange={(e) => setConfigText(e.target.value)}
            rows={configText.split("\n").length}
          />
          <div className="button-container">
            <div className="save-btn-div">
              <button className="save-btn" onClick={() => updateMcpServer(JSON.parse(configText))}>
                Save
              </button>
            </div>
            <div className="delete-btn-div">
              <button className="delete-btn" onClick={deleteMcpServer}>
                Delete
              </button>
            </div>
          </div>
        </div>
      </Collapsible>
    </div>
  );
};

export default McpServerComponent;
