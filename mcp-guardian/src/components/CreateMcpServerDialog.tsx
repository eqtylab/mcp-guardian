import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { notifyError, notifySuccess } from "./toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogBody,
  DialogFooter,
} from "./ui/Dialog";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Textarea } from "./ui/Textarea";
import { FormField, FormLabel } from "./ui/FormField";

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

  const handleCreate = async () => {
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
      onClose();
    } catch (e: any) {
      notifyError(e);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New MCP Server</DialogTitle>
          <DialogClose />
        </DialogHeader>
        <DialogBody>
          <div className="flex flex-col space-y-4">
            <FormField>
              <FormLabel htmlFor="namespace">Namespace</FormLabel>
              <Input
                id="namespace"
                value={namespace}
                onChange={(e) => setNamespace(e.target.value)}
                placeholder="e.g., development"
              />
            </FormField>

            <FormField>
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., local-server"
              />
            </FormField>

            <FormField error={!isValid ? "Invalid JSON configuration" : undefined}>
              <FormLabel htmlFor="config">Configuration</FormLabel>
              <Textarea
                id="config"
                value={config}
                onChange={(e) => {
                  setConfig(e.target.value);
                  validateConfig(e.target.value);
                }}
                className="font-mono text-sm"
                rows={10}
                placeholder="Enter server configuration in JSON format"
                error={!isValid}
              />
            </FormField>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleCreate}
            disabled={!isValid || !namespace || !name}
          >
            Create Server
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMcpServerDialog;