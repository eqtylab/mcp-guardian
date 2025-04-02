// ClaudeExportModal.tsx
import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { deterministicStringify } from "../utils";
import { notifyError, notifySuccess } from "./toast";

import { 
  CyberDialog as Dialog, 
  CyberDialogContent as DialogContent, 
  CyberDialogHeader as DialogHeader, 
  CyberDialogTitle as DialogTitle, 
  CyberDialogClose as DialogClose,
  CyberDialogBody as DialogBody,
  CyberDialogFooter as DialogFooter
} from "./ui/cyber-dialog";
import { Button } from "./ui/button";
import { FormField, FormLabel } from "./ui/form-field";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

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
      <DialogContent variant="cyber" glow="subtle" className="max-w-2xl">
        <DialogHeader variant="cyber">
          <DialogTitle>Export Server Collection</DialogTitle>
          <DialogClose variant="cyber" />
        </DialogHeader>
        <DialogBody variant="cyber">
          <div className="flex flex-col gap-4">
            <FormField>
              <FormLabel>Claude Desktop Config:</FormLabel>
              <Textarea
                variant="cyber"
                glow="focus"
                value={claudeConfig}
                className="font-mono h-80"
                readOnly
              />
            </FormField>

            <FormField>
              <FormLabel>Proxy Path:</FormLabel>
              <Input
                variant="cyber"
                glow="focus"
                placeholder="Specify path for `mcp-guardian-proxy` if it's not in PATH"
                value={proxyPath}
                onChange={(e) => setProxyPath(e.target.value)}
              />
            </FormField>
          </div>
        </DialogBody>
        <DialogFooter variant="cyber">
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
