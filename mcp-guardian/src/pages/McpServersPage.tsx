import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import McpServerComponent from "../components/McpServerComponent";
import CreateMcpServerDialog from "../components/CreateMcpServerDialog";
import { NamedMcpServer } from "../bindings/NamedMcpServer";
import { notifyError, notifySuccess } from "../components/toast";
import { Plus } from "lucide-react";
import { Button } from "../components/ui/Button";

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

        <div className="flex gap-4">
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            variant="success"
            title="Create a new MCP server configuration"
            className="font-medium shadow-sm border-[1px] border-[rgba(0,0,0,0.1)]"
          >
            <Plus size={16} className="mr-2" />
            New Server
          </Button>

          <Button 
            onClick={importClaudeConfig} 
            variant="secondary" 
            title="Import Claude's default configuration"
            className="font-medium shadow-sm border-[1px] border-[rgba(0,0,0,0.1)]"
          >
            Import Claude Config
          </Button>
        </div>
      </div>

      {/* Core Servers Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Core Servers</h2>
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
        <h2 className="text-xl font-semibold">Custom Servers</h2>
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
              isExpanded={openServerId === i + coreServers.length}
              onToggle={() => setOpenServerId(openServerId === i + coreServers.length ? null : i + coreServers.length)}
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
