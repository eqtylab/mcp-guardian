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
  CyberDialogFooter as DialogFooter
} from "./ui/cyber-dialog";
import { Button } from "./ui/button";
import { FormField, FormLabel } from "./ui/form-field";
import { Input } from "./ui/input";
import MonacoJsonEditor from "./json-editor/monaco-json-editor";
import guardProfileSchema from "./json-editor/schemas/guard_profile_schema.json";

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
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent variant="cyber" glow="subtle" className="max-w-2xl">
        <DialogHeader variant="cyber">
          <DialogTitle>Create New Guard Profile</DialogTitle>
          <DialogClose variant="cyber" />
        </DialogHeader>
        <DialogBody variant="cyber">
          <div className="flex flex-col gap-4">
            <FormField>
              <FormLabel htmlFor="namespace">Namespace</FormLabel>
              <Input
                id="namespace"
                variant="cyber"
                glow="focus"
                value={namespace}
                onChange={(e) => setNamespace(e.target.value)}
                placeholder="e.g., custom"
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
                placeholder="e.g., my-profile"
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
                schema={guardProfileSchema}
                schemaUri="http://mcp-guardian/schemas/guard_profile_schema.json"
                label="Guard Profile Configuration"
                maxHeight="300px"
                placeholder="Enter guard profile configuration in JSON format"
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
            Create Profile
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGuardProfileDialog;
