import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { notifyError, notifySuccess } from "./toast";
import { X } from "lucide-react";

import JsonEditor from "./JsonValidEditor";

interface CreateServerCollectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateServerCollectionDialog = ({ isOpen, onClose, onSuccess }: CreateServerCollectionDialogProps) => {
  const [namespace, setNamespace] = useState("");
  const [name, setName] = useState("");
  const [config, setConfig] = useState(
    JSON.stringify(
      {
        servers: [
          {
            mcp_server: "",
            guard_profile: "",
          },
        ],
      },
      null,
      2,
    ),
  );
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

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
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} aria-hidden="true" />

      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                   w-full max-w-2xl max-h-[85vh] overflow-y-auto z-50 
                   bg-bg-surface
                   border border-border-subtle
                   rounded-md shadow-lg
                   card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <div className="card-header">
          <h2 id="dialog-title" className="text-sm m-0">
            Create New Server Collection
          </h2>
          <button
            onClick={onClose}
            className="p-1 bg-transparent border-0"
            aria-label="Close dialog"
          >
              <X size={14} strokeWidth={2.5} />
            </button>
        </div>

        <div className="card-content">
          <div className="flex-col gap-md">
            <div>
              <label htmlFor="namespace" className="block mb-sm">
                Namespace
              </label>
              <input
                id="namespace"
                type="text"
                value={namespace}
                onChange={(e) => setNamespace(e.target.value)}
                placeholder="e.g., custom"
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="name" className="block mb-sm">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., my-collection"
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="config" className="block mb-sm">
                Configuration
              </label>
              <JsonEditor
                value={config}
                onChange={setConfig}
                placeholder="Enter server collection configuration"
                maxHeight="300px"
              />
            </div>

            <div className="btn-group justify-end mt-md">
              <button onClick={onClose} className="btn-sm">
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!namespace || !name) {
                    notifyError("Namespace and name are required");
                    return;
                  }

                  if (!validateConfig(config)) {
                    notifyError("Invalid configuration format");
                    return;
                  }

                  try {
                    const serverCollection = JSON.parse(config);
                    await invoke("set_server_collection", {
                      namespace,
                      name,
                      serverCollection,
                    });
                    onSuccess();
                    notifySuccess(`Collection "${namespace}.${name}" created successfully`);
                  } catch (e: any) {
                    notifyError(e);
                  }
                }}
                className="btn-success btn-sm"
                disabled={!isValid || !namespace || !name}
              >
                Create Collection
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateServerCollectionDialog;
