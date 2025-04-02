import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { notifyError, notifySuccess } from "./toast";
import { X } from "lucide-react";

interface CreateMcpServerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateMcpServerDialog = ({ isOpen, onClose, onSuccess }: CreateMcpServerDialogProps) => {
  const [namespace, setNamespace] = useState("");
  const [name, setName] = useState("");
  const [config, setConfig] = useState(
    JSON.stringify(
      {
        cmd: "",
        args: [],
        env: {},
      },
      null,
      2,
    ),
  );
  const [isValid, setIsValid] = useState(true);

  // Prevent body scrolling when modal is open
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
      {/* Modal backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} aria-hidden="true" />

      {/* Modal content */}
      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
             w-full max-w-2xl max-h-[85vh] overflow-y-auto z-50 
             bg-bg-surface
             border border-border-subtle
             rounded-md shadow-lg
             card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="card-header">
          <h2 id="modal-title" className="text-sm m-0">
            Create New MCP Server
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
              <label htmlFor="namespace" className="block mb-2 font-medium">
                Namespace
              </label>
              <input
                id="namespace"
                type="text"
                value={namespace}
                onChange={(e) => setNamespace(e.target.value)}
                placeholder="e.g., development"
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
                placeholder="e.g., local-server"
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="config" className="block mb-2 font-medium">
                Configuration
              </label>
              <textarea
                id="config"
                value={config}
                onChange={(e) => {
                  setConfig(e.target.value);
                  validateConfig(e.target.value);
                }}
                className={`w-full font-mono text-sm ${!isValid ? "border-[var(--color-danger)]" : ""}`}
                rows={10}
                placeholder="Enter server configuration in JSON format"
              />
              {!isValid && <p className="text-[var(--color-danger)] text-sm mt-1">Invalid JSON configuration</p>}
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
                    const mcpServer = JSON.parse(config);
                    await invoke("set_mcp_server", { namespace, name, mcpServer });
                    onSuccess();
                    notifySuccess(`Server "${namespace}.${name}" created successfully`);
                  } catch (e: any) {
                    notifyError(e);
                  }
                }}
                className="btn-success"
                disabled={!isValid || !namespace || !name}
              >
                Create Server
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateMcpServerDialog;
