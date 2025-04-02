import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { notifyError, notifySuccess } from "./toast";

import {
  CyberDialog as Dialog,
  CyberDialogContent as DialogContent,
  CyberDialogHeader as DialogHeader,
  CyberDialogTitle as DialogTitle,
  CyberDialogClose as DialogClose,
  CyberDialogBody as DialogBody,
  CyberDialogFooter as DialogFooter,
} from "./ui/cyber-dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { FormField, FormLabel } from "./ui/form-field";
import MonacoJsonEditor from "./json-editor/monaco-json-editor";
import mcpServerSchema from "./json-editor/schemas/mcp_server_schema.json";

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
      <DialogContent variant="cyber" glow="subtle">
        <DialogHeader variant="cyber">
          <DialogTitle>Create New MCP Server</DialogTitle>
          <DialogClose variant="cyber" />
        </DialogHeader>
        <DialogBody variant="cyber">
          <div className="flex flex-col space-y-4">
            <FormField>
              <FormLabel htmlFor="namespace">Namespace</FormLabel>
              <Input
                id="namespace"
                variant="cyber"
                glow="focus"
                value={namespace}
                onChange={(e) => setNamespace(e.target.value)}
                placeholder="e.g., development"
              />
            </FormField>

            <FormField>
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input
                id="name"
                variant="cyber"
                glow="focus"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., local-server"
              />
            </FormField>

            <FormField>
              <FormLabel htmlFor="config">Configuration</FormLabel>
              <MonacoJsonEditor
                value={config}
                onChange={(newValue) => {
                  setConfig(newValue);
                  validateConfig(newValue);
                }}
                schema={mcpServerSchema}
                schemaUri="http://mcp-guardian/schemas/mcp_server_schema.json"
                label="MCP Server Configuration"
                maxHeight="300px"
                placeholder="Enter server configuration in JSON format"
              />
            </FormField>
          </div>
        </DialogBody>
        <DialogFooter variant="cyber">
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