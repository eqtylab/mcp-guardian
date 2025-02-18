import { useState } from "react";
import McpServerComponent from "../components/McpServerComponent";
import CreateMcpServerModal from "../components/CreateMcpServerModal";
import { NamedMcpServer } from "../bindings/NamedMcpServer";

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

      <CreateMcpServerModal
        isOpen={createModalIsOpen}
        setIsOpen={setCreateModalIsOpen}
        onSuccessfulCreate={onSuccessfulCreate}
      />
    </div>
  );
};

export default McpServersPage;
