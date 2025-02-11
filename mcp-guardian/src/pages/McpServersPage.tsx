import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import McpServerComponent from "../components/McpServerComponent";
import { NamedMcpServer } from "../bindings/NamedMcpServer";

const getMcpServers = (): Promise<NamedMcpServer[]> => invoke("list_mcp_servers", {});

const McpServers = () => {
  const [mcpServers, setMcpServers] = useState<NamedMcpServer[]>([]);

  const updateMcpServers = async () => {
    const newServers: NamedMcpServer[] = await getMcpServers();
    setMcpServers(newServers);
  };

  useEffect(() => {
    updateMcpServers();
  }, []);

  console.log("mcpServers", mcpServers);

  return (
    <div className="container">
      <h1>MCP Servers</h1>

      <button onClick={updateMcpServers}>Refresh</button>

      {mcpServers.map((server, i) => (
        <McpServerComponent key={`mcp-server-${i}`} namedMcpServer={server} />
      ))}
    </div>
  );
};

export default McpServers;
