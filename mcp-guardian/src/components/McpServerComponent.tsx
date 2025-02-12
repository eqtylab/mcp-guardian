import { useState } from "react";
import Collapsible from "react-collapsible";
import { invoke } from "@tauri-apps/api/core";
import { NamedMcpServer } from "../bindings/NamedMcpServer";
import { McpServer } from "../bindings/McpServer";
import "./McpServerComponent.css";

interface McpServerComponentProps {
  namedMcpServer: NamedMcpServer;
}

const McpServerComponent = ({ namedMcpServer }: McpServerComponentProps) => {
  const { namespace, name, mcp_server } = namedMcpServer;

  const [configText, setConfigText] = useState(JSON.stringify(mcp_server, null, 2));

  const updateMcpServer = async (mcpServer: McpServer) => {
    await invoke("set_mcp_server", { namespace, name, mcpServer });
  };

  return (
    <div className="mcp-server-component-container">
      <Collapsible
        trigger={`\u25B8 ${namespace}.${name}`}
        triggerWhenOpen={`\u25BE ${namespace}.${name}`}
        transitionTime={150}
      >
        <div className="server-grid">
          <div>
            <textarea
              value={configText}
              onChange={(e) => setConfigText(e.target.value)}
              rows={configText.split("\n").length}
            />
          </div>
          <div className="save-btn-div">
            <button className="save-btn" onClick={() => updateMcpServer(JSON.parse(configText))}>
              Save
            </button>
          </div>
        </div>
      </Collapsible>
    </div>
  );
};

export default McpServerComponent;
