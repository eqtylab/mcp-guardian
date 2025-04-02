import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { NamedMcpServer } from "../bindings/NamedMcpServer";
import { notifyError, notifySuccess } from "./toast";
import { ChevronDown, ChevronRight, Save, Trash2 } from "lucide-react";
import ConfirmDialog from "./confirm-dialog";
import { Button } from "./ui/button";
import { Card, CardHeader, CardContent } from "./ui/card";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./ui/collapsible";
import { MonacoJsonEditor, SCHEMA_URIS, SCHEMAS } from "./json-editor";

interface McpServerComponentProps {
  namedMcpServer: NamedMcpServer;
  onUpdateSuccess: () => void;
  onDeleteSuccess: () => void;
  isExpanded: boolean;
  onToggle: () => void;
  enableEdit: boolean;
  hideCollapsible?: boolean;
}

const McpServerComponent = ({
  namedMcpServer,
  onUpdateSuccess,
  onDeleteSuccess,
  isExpanded,
  onToggle,
  enableEdit,
  hideCollapsible = false,
}: McpServerComponentProps) => {
  const { namespace, name, mcp_server } = namedMcpServer;
  const [configText, setConfigText] = useState("{}"); // Initialize with valid empty JSON
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    // Ensure mcp_server is not null or undefined before stringifying
    if (mcp_server) {
      try {
        setConfigText(JSON.stringify(mcp_server, null, 2));
      } catch (error) {
        console.error("Error stringifying mcp_server:", error);
        setConfigText("{}"); // Set a valid empty object as fallback
      }
    } else {
      setConfigText("{}"); // Set a valid empty object if mcp_server is null or undefined
    }
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

  // For sidebar mode, render without collapsible UI
  if (hideCollapsible) {
    return (
      <>
        <div className="space-y-4">
          <MonacoJsonEditor
            value={configText}
            onChange={setConfigText}
            disabled={!enableEdit}
            placeholder="Enter MCP server configuration"
            schema={SCHEMAS.MCP_SERVER}
            schemaUri={SCHEMA_URIS.MCP_SERVER}
            maxHeight="400px"
            label={`${namespace}.${name}`}
          />

          {enableEdit && (
            <div className="flex justify-end gap-4">
              <Button
                onClick={updateMcpServer}
                variant="success"
                title="Save server changes"
              >
                <Save size={16} className="mr-2" />
                Save Changes
              </Button>

              <Button
                onClick={() => setShowDeleteConfirm(true)}
                variant="danger"
                title="Delete this server"
              >
                <Trash2 size={16} className="mr-2" />
                Delete Server
              </Button>
            </div>
          )}
        </div>

        <ConfirmDialog
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
          title="Delete MCP Server"
          message={`Are you sure you want to delete the server "${namespace}.${name}"? This action cannot be undone.`}
        />
      </>
    );
  }

  // Original collapsible card view
  return (
    <Card className="mb-4">
      <Collapsible open={isExpanded} onOpenChange={onToggle}>
        <CardHeader className="cursor-pointer p-3">
          <CollapsibleTrigger className="flex justify-between items-center w-full bg-transparent hover:bg-transparent border-0">
            <span className="font-medium">{`${namespace}.${name}`}</span>
            {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </CollapsibleTrigger>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="p-4 space-y-4">
            <MonacoJsonEditor
              value={configText}
              onChange={setConfigText}
              disabled={!enableEdit}
              placeholder="Enter MCP server configuration"
              schema={SCHEMAS.MCP_SERVER}
              schemaUri={SCHEMA_URIS.MCP_SERVER}
            />

            {enableEdit && (
              <div className="flex justify-end gap-4">
                <Button
                  onClick={updateMcpServer}
                  variant="success"
                  title="Save server changes"
                >
                  <Save size={16} className="mr-2" />
                  Save Changes
                </Button>

                <Button
                  onClick={() => setShowDeleteConfirm(true)}
                  variant="danger"
                  title="Delete this server"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete Server
                </Button>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete MCP Server"
        message={`Are you sure you want to delete the server "${namespace}.${name}"? This action cannot be undone.`}
      />
    </Card>
  );
};

export default McpServerComponent;