import { ComponentType, useState } from "react";
import _ReactModal from "react-modal";
import { invoke } from "@tauri-apps/api/core";

// TODO: untangle this typescript incompatibility
const ReactModal = _ReactModal as unknown as ComponentType<_ReactModal["props"]>;

interface CreateMcpServerModalProps {
  isOpen: boolean;
  setIsOpen: (b: boolean) => void;
}

const CreateMcpServerModal = ({ isOpen, setIsOpen }: CreateMcpServerModalProps) => {
  const [namespaceInput, setNamespaceInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [configTextInput, setConfigTextInput] = useState(JSON.stringify({ cmd: "", args: [], env: {} }, null, 2));

  const createMcpServer = async (namespace: string, name: string, configText: string) => {
    const mcpServer = JSON.parse(configText);
    try {
      await invoke("set_mcp_server", { namespace, name, mcpServer });
      setIsOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="create-mcp-server-modal-container">
      <ReactModal isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
        <h1>Create MCP Server</h1>
        <hr />
        Namespace:{" "}
        <input
          type="text"
          placeholder="Namespace"
          value={namespaceInput}
          onChange={(e) => setNamespaceInput(e.target.value)}
        />
        <br />
        <br />
        Name: <input type="text" placeholder="Name" value={nameInput} onChange={(e) => setNameInput(e.target.value)} />
        <br />
        <br />
        Config:
        <textarea
          value={configTextInput}
          onChange={(e) => setConfigTextInput(e.target.value)}
          rows={configTextInput.split("\n").length}
        />
        <button className="create-btn" onClick={() => createMcpServer(namespaceInput, nameInput, configTextInput)}>
          Create
        </button>
      </ReactModal>
    </div>
  );
};

export default CreateMcpServerModal;
