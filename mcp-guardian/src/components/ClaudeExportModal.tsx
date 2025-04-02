// ClaudeExportModal.tsx
import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { deterministicStringify } from "../utils";
import { notifyError, notifySuccess } from "./toast";

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogClose,
  DialogBody,
  DialogFooter
} from "./ui/Dialog";
import { Button } from "./ui/Button";
import { FormField, FormLabel } from "./ui/FormField";
import { Input } from "./ui/Input";
import { Textarea } from "./ui/Textarea";

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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export Server Collection</DialogTitle>
          <DialogClose />
        </DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-4">
            <FormField>
              <FormLabel>Claude Desktop Config:</FormLabel>
              <Textarea
                value={claudeConfig}
                className="font-mono h-80"
                readOnly
              />
            </FormField>

            <FormField>
              <FormLabel>Proxy Path:</FormLabel>
              <Input
                placeholder="Specify path for `mcp-guardian-proxy` if it's not in PATH"
                value={proxyPath}
                onChange={(e) => setProxyPath(e.target.value)}
              />
            </FormField>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="success" onClick={applyClaudeConfig}>
            Apply to Claude Desktop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClaudeExportModal;
