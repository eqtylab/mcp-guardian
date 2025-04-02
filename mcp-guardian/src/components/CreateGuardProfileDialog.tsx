import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { notifyError, notifySuccess } from "./toast";
import { X } from "lucide-react";

interface CreateGuardProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateGuardProfileDialog = ({ isOpen, onClose, onSuccess }: CreateGuardProfileDialogProps) => {
  const [namespace, setNamespace] = useState("");
  const [name, setName] = useState("");
  const [config, setConfig] = useState(
    JSON.stringify(
      {
        primary_message_interceptor: {
          type: "",
        },
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
                   card"  /* Added card class to ensure it gets all card styling */
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <div className="card-header">
          <h2 id="dialog-title" className="text-sm m-0">
            Create New Guard Profile
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
                placeholder="e.g., my-profile"
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="config" className="block mb-sm">
                Configuration
              </label>
              <textarea
                id="config"
                value={config}
                onChange={(e) => {
                  setConfig(e.target.value);
                  validateConfig(e.target.value);
                }}
                className={`json-editor ${!isValid ? "border-status-danger" : ""}`}
                rows={10}
                placeholder="Enter guard profile configuration in JSON format"
              />
              {!isValid && <p className="text-status-danger text-xs mt-1">Invalid JSON configuration</p>}
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
                    const guardProfile = JSON.parse(config);
                    await invoke("set_guard_profile", {
                      namespace,
                      name,
                      guardProfile,
                    });
                    onSuccess();
                    notifySuccess(`Profile "${namespace}.${name}" created successfully`);
                  } catch (e: any) {
                    notifyError(e);
                  }
                }}
                className="btn-success btn-sm"
                disabled={!isValid || !namespace || !name}
              >
                Create Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateGuardProfileDialog;
