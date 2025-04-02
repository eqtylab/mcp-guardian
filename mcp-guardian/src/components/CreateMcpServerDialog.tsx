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
             bg-colors-bg-surface
             border border-colors-border-subtle
             rounded-md shadow-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="p-3 bg-colors-bg-elevated border-b border-colors-border-subtle flex justify-between items-center">
          <h2 id="modal-title" className="text-sm m-0 font-medium">
            Create New MCP Server
          </h2>
          <button
            onClick={onClose}
            className="p-1 bg-transparent border-0 text-colors-text-primary hover:text-colors-text-secondary transition-colors"
            aria-label="Close dialog"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 bg-colors-bg-surface">
          <div className="flex flex-col space-y-4">
            <div>
              <label htmlFor="namespace" className="block mb-2 font-medium text-colors-text-secondary">
                Namespace
              </label>
              <input
                id="namespace"
                type="text"
                value={namespace}
                onChange={(e) => setNamespace(e.target.value)}
                placeholder="e.g., development"
                className="w-full bg-colors-bg-elevated border border-colors-border-subtle text-colors-text-primary
                           rounded-sm p-2 focus:border-colors-accent-primary focus:outline-none
                           focus:ring-1 focus:ring-colors-accent-primary"
              />
            </div>

            <div>
              <label htmlFor="name" className="block mb-2 font-medium text-colors-text-secondary">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., local-server"
                className="w-full bg-colors-bg-elevated border border-colors-border-subtle text-colors-text-primary
                           rounded-sm p-2 focus:border-colors-accent-primary focus:outline-none
                           focus:ring-1 focus:ring-colors-accent-primary"
              />
            </div>

            <div>
              <label htmlFor="config" className="block mb-2 font-medium text-colors-text-secondary">
                Configuration
              </label>
              <textarea
                id="config"
                value={config}
                onChange={(e) => {
                  setConfig(e.target.value);
                  validateConfig(e.target.value);
                }}
                className={`w-full font-mono text-sm bg-colors-bg-elevated border rounded-sm p-2
                          text-colors-text-primary focus:outline-none focus:ring-1
                          ${!isValid 
                            ? "border-colors-status-danger focus:border-colors-status-danger focus:ring-colors-status-danger" 
                            : "border-colors-border-subtle focus:border-colors-accent-primary focus:ring-colors-accent-primary"
                          }`}
                rows={10}
                placeholder="Enter server configuration in JSON format"
              />
              {!isValid && (
                <p className="text-colors-status-danger text-sm mt-1">
                  Invalid JSON configuration
                </p>
              )}
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button 
                onClick={onClose}
                className="py-2 px-3 rounded-sm bg-colors-bg-interactive border border-colors-border-subtle
                           text-colors-text-primary text-sm font-medium transition-colors
                           hover:bg-colors-bg-interactive/80 focus:outline-none focus:ring-1 
                           focus:ring-colors-accent-primary"
              >
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
                className="py-2 px-3 rounded-sm bg-colors-status-success text-[hsla(220,18%,10%,0.9)]
                           border-transparent text-sm font-medium transition-colors
                           hover:bg-colors-status-success/90 focus:outline-none focus:ring-1
                           focus:ring-colors-status-success disabled:opacity-50 disabled:cursor-not-allowed"
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
