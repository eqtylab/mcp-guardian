// ClaudeExportModal.tsx
import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { deterministicStringify } from "../utils";
import { notifyError, notifySuccess } from "./toast";
import { X } from "lucide-react";

interface ClaudeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverCollectionNamespace: string;
  serverCollectionName: string;
}

const ClaudeExportModal = ({
  isOpen,
  onClose,
  serverCollectionNamespace,
  serverCollectionName,
}: ClaudeExportModalProps) => {
  const [claudeConfig, setClaudeConfig] = useState<string>("");
  const [proxyPath, setProxyPath] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      (async () => {
        const config = await getClaudeConfig();
        setClaudeConfig(deterministicStringify(config));
      })();
    }
  }, [isOpen, serverCollectionNamespace, serverCollectionName, proxyPath]);

  const getClaudeConfig = async () => {
    const argSet: any = {
      namespace: serverCollectionNamespace,
      name: serverCollectionName,
      ...(proxyPath && { proxyPath }),
    };

    try {
      const config = await invoke("generate_claude_config_for_server_collection", argSet);
      notifySuccess(`Claude config "${argSet.namespace}.${argSet.name}" generated`);
      return config;
    } catch (e: any) {
      notifyError(e);
      return null;
    }
  };

  const applyClaudeConfig = async () => {
    const argSet: any = {
      namespace: serverCollectionNamespace,
      name: serverCollectionName,
      ...(proxyPath && { proxyPath }),
    };

    try {
      await invoke("apply_claude_config_for_server_collection", argSet);
      notifySuccess(`Claude config "${argSet.namespace}.${argSet.name}" applied`);
      onClose();
    } catch (e: any) {
      notifyError(e);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                   w-full max-w-2xl max-h-[85vh] overflow-y-auto z-50 
                   bg-bg-surface
                   border border-border-subtle
                   rounded-md shadow-lg
                   card"
        role="dialog"
      >
        <div className="card-header">
          <h2 className="text-sm m-0">Export Server Collection</h2>
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
              <label className="block mb-sm">Claude Desktop Config:</label>
              <textarea
                value={claudeConfig}
                className="json-editor w-full h-80"
                readOnly
              />
            </div>

            <div>
              <label className="block mb-sm">Proxy Path:</label>
              <input
                type="text"
                className="w-full"
                placeholder="Specify path for `mcp-guardian-proxy` if it's not in PATH"
                value={proxyPath}
                onChange={(e) => setProxyPath(e.target.value)}
              />
            </div>

            <div className="btn-group justify-end mt-md">
              <button onClick={onClose} className="btn-sm">
                Cancel
              </button>
              <button onClick={applyClaudeConfig} className="btn-success btn-sm">
                Apply to Claude Desktop
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClaudeExportModal;
