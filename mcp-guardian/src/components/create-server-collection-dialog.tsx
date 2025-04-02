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
  DialogFooter
} from "./ui/dialog";
import { Button } from "./ui/button";
import { FormField, FormLabel } from "./ui/form-field";
import { Input } from "./ui/input";

import JsonEditor from "./json-valid-editor";

interface CreateServerCollectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateServerCollectionDialog = ({ isOpen, onClose, onSuccess }: CreateServerCollectionDialogProps) => {
  const [namespace, setNamespace] = useState("");
  const [name, setName] = useState("");
  const [config, setConfig] = useState(
    JSON.stringify(
      {
        servers: [
          {
            mcp_server: "",
            guard_profile: "",
          },
        ],
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
      const serverCollection = JSON.parse(config);
      await invoke("set_server_collection", {
        namespace,
        name,
        serverCollection,
      });
      onSuccess();
      notifySuccess(`Collection "${namespace}.${name}" created successfully`);
    } catch (e: any) {
      notifyError(e);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Server Collection</DialogTitle>
          <DialogClose />
        </DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-4">
            <FormField>
              <FormLabel htmlFor="namespace">Namespace</FormLabel>
              <Input
                id="namespace"
                value={namespace}
                onChange={(e) => setNamespace(e.target.value)}
                placeholder="e.g., custom"
              />
            </FormField>

            <FormField>
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., my-collection"
              />
            </FormField>

            <FormField error={!isValid ? "Invalid JSON configuration" : undefined}>
              <FormLabel htmlFor="config">Configuration</FormLabel>
              <JsonEditor
                value={config}
                onChange={setConfig}
                placeholder="Enter server collection configuration"
                maxHeight="300px"
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
            Create Collection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateServerCollectionDialog;
