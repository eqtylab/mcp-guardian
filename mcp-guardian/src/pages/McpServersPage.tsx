import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import McpServerComponent from "../components/McpServerComponent";
import CreateMcpServerModal from "../components/CreateMcpServerModal";
import { NamedMcpServer } from "../bindings/NamedMcpServer";
import { notifyError, notifySuccess } from "../components/toast";

interface McpServersPageProps {
  mcpServers: NamedMcpServer[];
  updateMcpServers: () => Promise<void>;
}

const McpServersPage = ({ mcpServers, updateMcpServers }: McpServersPageProps) => {
  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
  const [openCollapsible, setOpenCollapsible] = useState<number | null>(null);

  const onSuccessfulCreate = () => {
    setCreateModalIsOpen(false);
    updateMcpServers();
  };

  const onSuccessfulDelete = () => {
    setOpenCollapsible(null);
    updateMcpServers();
  };

  const importClaudeConfig = async () => {
    try {
      await invoke("import_claude_config");
      setOpenCollapsible(null);
      updateMcpServers();
      notifySuccess("Claude config imported.");
    } catch (e: any) {
      notifyError(e);
    }
  };

  return (
    <div className="container">
      <h1>MCP Servers</h1>

      {mcpServers.map((server, i) => (
        <McpServerComponent
          key={`mcp-server-${i}`}
          namedMcpServer={server}
          onUpdateSuccess={updateMcpServers}
          onDeleteSuccess={onSuccessfulDelete}
          open={openCollapsible === i}
          onToggle={() => setOpenCollapsible(openCollapsible === i ? null : i)}
        />
      ))}

      <button onClick={() => setCreateModalIsOpen(true)}>Create New MCP Server</button>
      <button onClick={importClaudeConfig}>Import Claude Config</button>

      <CreateMcpServerModal
        isOpen={createModalIsOpen}
        setIsOpen={setCreateModalIsOpen}
        onSuccessfulCreate={onSuccessfulCreate}
      />
    </div>
  );
};

export default McpServersPage;
