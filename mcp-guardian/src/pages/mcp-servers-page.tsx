import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import McpServerComponent from "../components/mcp-server-component";
import CreateMcpServerDialog from "../components/create-mcp-server-dialog";
import { NamedMcpServer } from "../bindings/NamedMcpServer";
import { notifyError, notifySuccess } from "../components/toast";
import { Plus, ServerIcon, Search } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Sidebar, SidebarSection, SidebarItem, SidebarHeader } from "../components/ui/sidebar";

interface McpServersPageProps {
  mcpServers: NamedMcpServer[];
  updateMcpServers: () => Promise<void>;
}

const McpServersPage = ({ mcpServers, updateMcpServers }: McpServersPageProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const coreServers = mcpServers.filter((server) => server.namespace === "mcp-guardian");
  const customServers = mcpServers.filter((server) => server.namespace !== "mcp-guardian");

  const filteredCoreServers = coreServers.filter(server => 
    `${server.namespace}.${server.name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredCustomServers = customServers.filter(server => 
    `${server.namespace}.${server.name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedServer = mcpServers.find(
    server => `${server.namespace}.${server.name}` === selectedServerId
  );

  const importClaudeConfig = async () => {
    try {
      await invoke("import_claude_config");
      await updateMcpServers();
      notifySuccess("Claude configuration successfully imported");
    } catch (e: any) {
      notifyError(e);
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">MCP Servers</h2>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              variant="ghost"
              size="icon"
              title="Create a new MCP server"
            >
              <Plus size={18} />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search servers..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </SidebarHeader>

        {/* Core Servers */}
        <SidebarSection title="Core Servers" count={filteredCoreServers.length}>
          {filteredCoreServers.map((server) => (
            <SidebarItem
              key={`${server.namespace}.${server.name}`}
              active={selectedServerId === `${server.namespace}.${server.name}`}
              onClick={() => setSelectedServerId(`${server.namespace}.${server.name}`)}
            >
              <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center mr-2">
                <ServerIcon size={16} className="text-muted-foreground" />
              </div>
              <span className="truncate">{server.name}</span>
            </SidebarItem>
          ))}
        </SidebarSection>

        {/* Custom Servers */}
        <SidebarSection title="Custom Servers" count={filteredCustomServers.length}>
          {filteredCustomServers.map((server) => (
            <SidebarItem
              key={`${server.namespace}.${server.name}`}
              active={selectedServerId === `${server.namespace}.${server.name}`}
              onClick={() => setSelectedServerId(`${server.namespace}.${server.name}`)}
            >
              <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center mr-2">
                <ServerIcon size={16} className="text-muted-foreground" />
              </div>
              <span className="truncate">{server.name}</span>
            </SidebarItem>
          ))}
        </SidebarSection>
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {selectedServer ? `${selectedServer.namespace}.${selectedServer.name}` : "Select a server"}
          </h1>

          <div className="flex gap-2">
            {selectedServer && (
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                variant="success"
                title="Create a new MCP server configuration"
                className="font-medium shadow-sm border-[1px] border-[rgba(0,0,0,0.1)]"
              >
                <Plus size={16} className="mr-2" />
                New Server
              </Button>
            )}
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

        {/* Selected Server Content */}
        {selectedServer && (
          <McpServerComponent
            namedMcpServer={selectedServer}
            onUpdateSuccess={updateMcpServers}
            onDeleteSuccess={() => {
              setSelectedServerId(null);
              updateMcpServers();
            }}
            isExpanded={true}
            onToggle={() => {}}
            enableEdit={selectedServer.namespace !== "mcp-guardian"}
            hideCollapsible={true}
          />
        )}

        {/* Empty State */}
        {!selectedServer && (
          <div className="text-center p-12 border border-dashed rounded-lg">
            <ServerIcon size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No server selected</h3>
            <p className="text-muted-foreground mb-4">Select a server from the sidebar to view and edit its configuration</p>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              variant="success"
            >
              <Plus size={16} className="mr-2" />
              Create New Server
            </Button>
          </div>
        )}
      </div>

      <CreateMcpServerDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={async (newServerId) => {
          setIsCreateDialogOpen(false);
          await updateMcpServers();
          if (newServerId) {
            setSelectedServerId(newServerId);
          }
        }}
      />
    </div>
  );
};

export default McpServersPage;
