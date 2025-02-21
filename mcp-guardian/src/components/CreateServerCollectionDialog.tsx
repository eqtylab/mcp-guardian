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
                   bg-cream-50 dark:bg-primary-800 
                   rounded-lg shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 id="dialog-title" className="text-lg font-bold">
              Create New Server Collection
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-cream-100 dark:hover:bg-primary-700 rounded"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="namespace" className="block mb-2 font-medium">
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
              <label htmlFor="name" className="block mb-2 font-medium">
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
              <label htmlFor="config" className="block mb-2 font-medium">
                Configuration
              </label>
              <JsonEditor
                value={config}
                onChange={setConfig}
                placeholder="Enter server collection configuration"
                maxHeight="300px"
              />
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button onClick={onClose} className="bg-cream-100 dark:bg-primary-700">
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
                className="btn-success"
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
