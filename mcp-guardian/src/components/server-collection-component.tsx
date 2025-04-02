// ServerCollectionComponent.tsx
import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { NamedServerCollection } from "../bindings/NamedServerCollection";
import { ServerCollection } from "../bindings/ServerCollection";
import { notifyError, notifySuccess } from "./toast";
import { ChevronDown, ChevronRight, Save, Trash2, ExternalLink } from "lucide-react";
import ClaudeExportModal from "./claude-export-modal";
import ConfirmDialog from "./confirm-dialog";
import MonacoJsonEditor from "./json-editor/monaco-json-editor";
import serverCollectionSchema from "./json-editor/schemas/server_collection_schema.json";
import { Button } from "./ui/button";
import { Card, CardHeader, CardContent } from "./ui/card";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./ui/collapsible";

interface ServerCollectionComponentProps {
  namedServerCollection: NamedServerCollection;
  onUpdateSuccess: () => void;
  onDeleteSuccess: () => void;
  isExpanded: boolean;
  onToggle: () => void;
  enableEdit: boolean;
  hideCollapsible?: boolean;
}

const ServerCollectionComponent = ({
  namedServerCollection,
  onUpdateSuccess,
  onDeleteSuccess,
  isExpanded,
  onToggle,
  enableEdit,
  hideCollapsible = false,
}: ServerCollectionComponentProps) => {
  const { namespace, name, server_collection } = namedServerCollection;
  const [configText, setConfigText] = useState("");
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setConfigText(JSON.stringify(server_collection, null, 2));
  }, [server_collection]);

  const handleSave = async () => {
    try {
      const serverCollection: ServerCollection = JSON.parse(configText);
      await invoke("set_server_collection", {
        namespace,
        name,
        serverCollection,
      });
      onUpdateSuccess();
      notifySuccess(`Collection "${namespace}.${name}" updated`);
    } catch (e: any) {
      notifyError(e);
    }
  };

  const handleDelete = async () => {
    try {
      await invoke("delete_server_collection", { namespace, name });
      onDeleteSuccess();
      notifySuccess(`Collection "${namespace}.${name}" deleted`);
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
            placeholder="Enter server collection configuration in JSON format"
            schema={serverCollectionSchema}
            schemaUri="http://mcp-guardian/schemas/server_collection_schema.json"
            label="Server Collection Configuration"
          />

          {enableEdit && (
            <div className="flex justify-end gap-4">
              <Button
                onClick={handleSave}
                variant="success"
                title="Save collection changes"
                className="shadow-sm"
              >
                <Save size={16} className="mr-2" />
                Save Changes
              </Button>

              <Button
                onClick={() => setShowExportModal(true)}
                variant="secondary"
                title="Export this collection to Claude"
                className="shadow-sm"
              >
                <ExternalLink size={16} className="mr-2" />
                Export to Claude
              </Button>

              <Button
                onClick={() => setShowDeleteConfirm(true)}
                variant="danger"
                title="Delete this collection"
                className="shadow-sm"
              >
                <Trash2 size={16} className="mr-2" />
                Delete Collection
              </Button>
            </div>
          )}
        </div>

        <ClaudeExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          serverCollectionNamespace={namespace}
          serverCollectionName={name}
        />

        <ConfirmDialog
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
          title="Delete Collection"
          message={`Are you sure you want to delete the collection "${namespace}.${name}"?`}
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
              placeholder="Enter server collection configuration in JSON format"
              schema={serverCollectionSchema}
              schemaUri="http://mcp-guardian/schemas/server_collection_schema.json"
              label="Server Collection Configuration"
            />

            {enableEdit && (
              <div className="flex justify-end gap-4">
                <Button
                  onClick={handleSave}
                  variant="success"
                  title="Save collection changes"
                  className="shadow-sm"
                >
                  <Save size={16} className="mr-2" />
                  Save Changes
                </Button>

                <Button
                  onClick={() => setShowExportModal(true)}
                  variant="secondary"
                  title="Export this collection to Claude"
                  className="shadow-sm"
                >
                  <ExternalLink size={16} className="mr-2" />
                  Export to Claude
                </Button>

                <Button
                  onClick={() => setShowDeleteConfirm(true)}
                  variant="danger"
                  title="Delete this collection"
                  className="shadow-sm"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete Collection
                </Button>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>

      <ClaudeExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        serverCollectionNamespace={namespace}
        serverCollectionName={name}
      />

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Collection"
        message={`Are you sure you want to delete the collection "${namespace}.${name}"?`}
      />
    </Card>
  );
};

export default ServerCollectionComponent;
