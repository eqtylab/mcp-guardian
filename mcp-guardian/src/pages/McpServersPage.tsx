import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import McpServerComponent from "../components/McpServerComponent";
import CreateMcpServerModal from "../components/CreateMcpServerModal";
import { NamedMcpServer } from "../bindings/NamedMcpServer";

const getMcpServers = (): Promise<NamedMcpServer[]> => invoke("list_mcp_servers", {});

const McpServers = () => {
  const [mcpServers, setMcpServers] = useState<NamedMcpServer[]>([]);
  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);

  const updateMcpServers = async () => {
    const newServers: NamedMcpServer[] = await getMcpServers();
    setMcpServers(newServers);
  };

  const afterSuccessfulCreate = () => {
    setCreateModalIsOpen(false);
    updateMcpServers();
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

      <button onClick={() => setCreateModalIsOpen(true)}>Create New MCP Server</button>

      <CreateMcpServerModal
        isOpen={createModalIsOpen}
        setIsOpen={setCreateModalIsOpen}
        afterSuccessfulCreate={afterSuccessfulCreate}
      />
    </div>
  );
};

export default McpServers;
