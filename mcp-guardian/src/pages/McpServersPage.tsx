import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import McpServerComponent from "../components/McpServerComponent";
import CreateMcpServerDialog from "../components/CreateMcpServerDialog";
import { NamedMcpServer } from "../bindings/NamedMcpServer";
import { notifyError, notifySuccess } from "../components/toast";

interface McpServersPageProps {
  mcpServers: NamedMcpServer[];
  updateMcpServers: () => Promise<void>;
}

const McpServersPage = ({ mcpServers, updateMcpServers }: McpServersPageProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [openServerId, setOpenServerId] = useState<number | null>(null);

  const coreServers = mcpServers.filter((server) => server.namespace === "mcp-guardian");
  const customServers = mcpServers.filter((server) => server.namespace !== "mcp-guardian");

  const importClaudeConfig = async () => {
    try {
      await invoke("import_claude_config");
      setOpenServerId(null);
      await updateMcpServers();
      notifySuccess("Claude configuration successfully imported");
    } catch (e: any) {
      notifyError(e);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">MCP Servers</h1>

        <div className="space-x-4">
          <button
            onClick={() => setIsCreateDialogOpen(true)}
            className="btn-success"
            title="Create a new MCP server configuration"
          >
            New Server
          </button>

          <button onClick={importClaudeConfig} className="bg-shield-200" title="Import Claude's default configuration">
            Import Claude Config
          </button>
        </div>
      </div>

      {/* Core Servers Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-primary-700 dark:text-cream-200">Core Servers</h2>
        <div className="space-y-2">
          {coreServers.map((server, i) => (
            <McpServerComponent
              key={`${server.namespace}.${server.name}`}
              namedMcpServer={server}
              onUpdateSuccess={updateMcpServers}
              onDeleteSuccess={() => {
                setOpenServerId(null);
                updateMcpServers();
              }}
              isExpanded={openServerId === i}
              onToggle={() => setOpenServerId(openServerId === i ? null : i)}
              enableEdit={false}
            />
          ))}
        </div>
      </div>

      {/* Custom Servers Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-primary-700 dark:text-cream-200">Custom Servers</h2>
        <div className="space-y-2">
          {customServers.map((server, i) => (
            <McpServerComponent
              key={`${server.namespace}.${server.name}`}
              namedMcpServer={server}
              onUpdateSuccess={updateMcpServers}
              onDeleteSuccess={() => {
                setOpenServerId(null);
                updateMcpServers();
              }}
              isExpanded={openServerId === i}
              onToggle={() => setOpenServerId(openServerId === i ? null : i)}
              enableEdit={true}
            />
          ))}
        </div>
      </div>

      <CreateMcpServerDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={async () => {
          setIsCreateDialogOpen(false);
          await updateMcpServers();
        }}
      />
    </div>
  );
};

export default McpServersPage;
