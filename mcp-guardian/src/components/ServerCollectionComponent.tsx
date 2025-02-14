import { useState } from "react";
import Collapsible from "react-collapsible";
import { invoke } from "@tauri-apps/api/core";
import { NamedServerCollection } from "../bindings/NamedServerCollection";
import { ServerCollection } from "../bindings/ServerCollection";
import ClaudeExportModal from "./ClaudeExportModal";
import "./ServerCollectionComponent.css";

interface ServerCollectionComponentProps {
  namedServerCollection: NamedServerCollection;
  onDeleteSuccess: () => void;
  open: boolean;
  onToggle: () => void;
}

const ServerCollectionComponent = ({
  namedServerCollection,
  onDeleteSuccess,
  open,
  onToggle,
}: ServerCollectionComponentProps) => {
  const { namespace, name, server_collection } = namedServerCollection;

  const [configText, setConfigText] = useState(JSON.stringify(server_collection, null, 2));
  const [claudeExportModalIsOpen, setClaudeExportModalIsOpen] = useState(false);

  const updateServerCollection = async (serverCollection: ServerCollection) => {
    await invoke("set_server_collection", { namespace, name, serverCollection });
  };

  const deleteServerCollection = async () => {
    await invoke("delete_server_collection", { namespace, name: name });
    onDeleteSuccess();
  };

  return (
    <div className="server-collection-component-container">
      <Collapsible
        trigger={`\u25B8 ${namespace}.${name}`}
        triggerWhenOpen={`\u25BE ${namespace}.${name}`}
        transitionTime={150}
        open={open}
        handleTriggerClick={onToggle}
      >
        <div className="collection-server-grid">
          <textarea
            className="collection-textarea"
            value={configText}
            onChange={(e) => setConfigText(e.target.value)}
            rows={configText.split("\n").length}
          />
          <div className="collection-button-container">
            <div className="collection-save-btn-div">
              <button className="collection-save-btn" onClick={() => updateServerCollection(JSON.parse(configText))}>
                Save
              </button>
            </div>
            <div className="collection-delete-btn-div">
              <button className="collection-delete-btn" onClick={deleteServerCollection}>
                Delete
              </button>
            </div>
            <div className="collection-export-btn-div">
              <button className="collection-export-btn" onClick={() => setClaudeExportModalIsOpen(true)}>
                Export to Claude
              </button>
            </div>
          </div>
        </div>
      </Collapsible>

      <ClaudeExportModal
        isOpen={claudeExportModalIsOpen}
        setIsOpen={setClaudeExportModalIsOpen}
        serverCollectionNamespace={namespace}
        serverCollectionName={name}
      />
    </div>
  );
};

export default ServerCollectionComponent;
