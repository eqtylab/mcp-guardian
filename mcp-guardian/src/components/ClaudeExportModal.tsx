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
                   bg-cream-50 dark:bg-primary-800 
                   rounded-lg shadow-xl"
        role="dialog"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Export Server Collection</h2>
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
              <label className="block font-medium mb-2">Claude Desktop Config:</label>
              <textarea
                value={claudeConfig}
                className="w-full h-96 font-mono text-sm p-3 bg-cream-100 dark:bg-primary-700 rounded-md"
                readOnly
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Proxy Path:</label>
              <input
                type="text"
                className="w-full"
                placeholder="Specify path for `mcp-guardian-proxy` if it's not in PATH"
                value={proxyPath}
                onChange={(e) => setProxyPath(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button onClick={onClose} className="bg-cream-100 dark:bg-primary-700">
                Cancel
              </button>
              <button onClick={applyClaudeConfig} className="btn-success">
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
