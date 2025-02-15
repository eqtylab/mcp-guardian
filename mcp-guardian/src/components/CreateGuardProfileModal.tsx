import { ComponentType, useState } from "react";
import _ReactModal from "react-modal";
import { invoke } from "@tauri-apps/api/core";
import { notifyError, notifySuccess } from "./toast";

// TODO: untangle this typescript incompatibility
const ReactModal = _ReactModal as unknown as ComponentType<_ReactModal["props"]>;

interface CreateGuardProfileModalProps {
  isOpen: boolean;
  setIsOpen: (b: boolean) => void;
  onSuccessfulCreate: () => void;
}

const CreateGuardProfileModal = ({ isOpen, setIsOpen, onSuccessfulCreate }: CreateGuardProfileModalProps) => {
  const [namespaceInput, setNamespaceInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [configTextInput, setConfigTextInput] = useState(
    JSON.stringify({ primary_message_interceptor: { type: "" } }, null, 2),
  );

  const createGuardProfile = async (namespace: string, name: string, configText: string) => {
    const guardProfile = JSON.parse(configText);
    try {
      await invoke("set_guard_profile", { namespace, name, guardProfile });
      onSuccessfulCreate();
      notifySuccess(`Guard profile ${namespace}.${name} created`);
    } catch (e) {
      notifyError(e);
    }
  };

  return (
    <div className="create-guard-profile-modal-container">
      <ReactModal isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
        <h1>Create Guard Profile</h1>
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
        <button className="create-btn" onClick={() => createGuardProfile(namespaceInput, nameInput, configTextInput)}>
          Create
        </button>
      </ReactModal>
    </div>
  );
};

export default CreateGuardProfileModal;
