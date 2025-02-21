// ServerCollectionComponent.tsx
import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { NamedServerCollection } from "../bindings/NamedServerCollection";
import { ServerCollection } from "../bindings/ServerCollection";
import { notifyError, notifySuccess } from "./toast";
import { ChevronDown, ChevronRight, Save, Trash2, ExternalLink } from "lucide-react";
import ClaudeExportModal from "./ClaudeExportModal";
import ConfirmDialog from "./ConfirmDialog";

import JsonEditor from "./JsonValidEditor";

interface ServerCollectionComponentProps {
  namedServerCollection: NamedServerCollection;
  onUpdateSuccess: () => void;
  onDeleteSuccess: () => void;
  isExpanded: boolean;
  onToggle: () => void;
  enableEdit: boolean;
}

const ServerCollectionComponent = ({
  namedServerCollection,
  onUpdateSuccess,
  onDeleteSuccess,
  isExpanded,
  onToggle,
  enableEdit,
}: ServerCollectionComponentProps) => {
  const { namespace, name, server_collection } = namedServerCollection;
  const [configText, setConfigText] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setConfigText(JSON.stringify(server_collection, null, 2));
  }, [server_collection]);

  const validateConfig = (text: string) => {
    try {
      JSON.parse(text);
      setIsValid(true);
      return true;
    } catch {
      setIsValid(false);
      return false;
    }
  };

  return (
    <div className="component-container">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 hover:bg-cream-100 dark:hover:bg-primary-700 rounded-t-lg"
        title={`${namespace}.${name} server collection configuration`}
      >
        <span className="font-medium">{`${namespace}.${name}`}</span>
        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </button>

      {isExpanded && (
        <div className="p-4 space-y-4">
          <JsonEditor
            value={configText}
            onChange={setConfigText}
            disabled={!enableEdit}
            placeholder="Enter server collection configuration in JSON format"
          />

          {enableEdit && (
            <div className="flex justify-end space-x-4">
              <button
                onClick={async () => {
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
                }}
                className="btn-success flex items-center gap-2"
                title="Save collection changes"
              >
                <Save size={16} />
                Save Changes
              </button>

              <button
                onClick={() => setShowExportModal(true)}
                className="bg-shield-200 flex items-center gap-2"
                title="Export this collection to Claude"
              >
                <ExternalLink size={16} />
                Export to Claude
              </button>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="btn-danger flex items-center gap-2"
                title="Delete this collection"
              >
                <Trash2 size={16} />
                Delete Collection
              </button>
            </div>
          )}
        </div>
      )}

      <ClaudeExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        serverCollectionNamespace={namespace}
        serverCollectionName={name}
      />

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={async () => {
          try {
            await invoke("delete_server_collection", { namespace, name });
            onDeleteSuccess();
            notifySuccess(`Collection "${namespace}.${name}" deleted`);
          } catch (e: any) {
            notifyError(e);
          }
        }}
        title="Delete Collection"
        message={`Are you sure you want to delete the collection "${namespace}.${name}"?`}
      />
    </div>
  );
};

export default ServerCollectionComponent;
