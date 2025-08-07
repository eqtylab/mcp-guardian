import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { NamedGuardProfile } from "../bindings/NamedGuardProfile";
import { GuardProfile } from "../bindings/GuardProfile";
import { notifyError, notifySuccess } from "./toast";
import { ChevronDown, ChevronRight, Save, Trash2, Shield, Code } from "lucide-react";
import ConfirmDialog from "./confirm-dialog";
import MonacoJsonEditor from "./json-editor/monaco-json-editor";
import { Button } from "./ui/button";
import { Card, CardHeader, CardContent } from "./ui/card";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./ui/collapsible";
import guardProfileSchema from "./json-editor/schemas/guard_profile_schema.json";

interface GuardProfileComponentProps {
  namedGuardProfile: NamedGuardProfile;
  onUpdateSuccess: () => void;
  onDeleteSuccess: () => void;
  isExpanded: boolean;
  onToggle: () => void;
  enableEdit: boolean;
  hideCollapsible?: boolean;
}

const GuardProfileComponent = ({
  namedGuardProfile,
  onUpdateSuccess,
  onDeleteSuccess,
  isExpanded,
  onToggle,
  enableEdit,
  hideCollapsible = false,
}: GuardProfileComponentProps) => {
  const { namespace, profile_name, guard_profile } = namedGuardProfile;
  const [configText, setConfigText] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Update local state when the profile changes from props
  useEffect(() => {
    setConfigText(JSON.stringify(guard_profile, null, 2));
  }, [guard_profile, namespace, profile_name]);

  // Handle JSON editor changes
  const handleJsonEditorChange = (newText: string) => {
    setConfigText(newText);
  };

  const handleDelete = async () => {
    try {
      await invoke("delete_guard_profile", { namespace, name: profile_name });
      onDeleteSuccess();
      notifySuccess(`Profile "${namespace}.${profile_name}" deleted`);
    } catch (e: any) {
      notifyError(e);
    }
  };

  const handleSave = async () => {
    try {
      // Parse and validate JSON before saving
      const parsedProfile = JSON.parse(configText) as GuardProfile;
      await invoke("set_guard_profile", {
        namespace,
        name: profile_name,
        guardProfile: parsedProfile,
      });
      onUpdateSuccess();
      notifySuccess(`Profile "${namespace}.${profile_name}" updated`);
    } catch (e: any) {
      notifyError(e);
    }
  };

  // For sidebar mode, render without collapsible UI
  if (hideCollapsible) {
    return (
      <>
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Code size={14} strokeWidth={2.5} className="text-colors-accent-primary" />
            <span className="text-sm font-medium">JSON Configuration</span>
          </div>
          <MonacoJsonEditor
            value={configText}
            onChange={handleJsonEditorChange}
            disabled={!enableEdit}
            placeholder="Enter guard profile configuration"
            schema={guardProfileSchema}
            schemaUri="http://mcp-guardian/schemas/guard_profile_schema.json"
            label="Guard Profile Configuration"
          />
        </div>

        {enableEdit && (
          <div className="flex justify-end gap-4">
            <Button
              onClick={handleSave}
              variant="success"
              size="sm"
              title="Save profile changes"
            >
              <Save size={14} strokeWidth={2.5} className="mr-1" />
              Save
            </Button>

            <Button
              onClick={() => setShowDeleteConfirm(true)}
              variant="danger"
              size="sm"
              title="Delete this profile"
            >
              <Trash2 size={14} strokeWidth={2.5} className="mr-1" />
              Delete
            </Button>
          </div>
        )}

        <ConfirmDialog
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
          title="Delete Guard Profile"
          message={`Are you sure you want to delete the profile "${namespace}.${profile_name}"? This action cannot be undone.`}
        />
      </>
    );
  }

  // Original collapsible card view
  return (
    <Card className="mb-2">
      <Collapsible open={isExpanded} onOpenChange={onToggle}>
        <CardHeader className="cursor-pointer p-3">
          <CollapsibleTrigger className="flex justify-between items-center w-full bg-transparent hover:bg-transparent border-0">
            <div className="flex items-center gap-2">
              <Shield size={14} strokeWidth={2.5} className="text-colors-accent-primary" />
              <span>{`${namespace}.${profile_name}`}</span>
            </div>
            {isExpanded ? <ChevronDown size={14} strokeWidth={2.5} /> : <ChevronRight size={14} strokeWidth={2.5} />}
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="p-4">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Code size={14} strokeWidth={2.5} className="text-colors-accent-primary" />
                <span className="text-sm font-medium">JSON Configuration</span>
              </div>
              <MonacoJsonEditor
                value={configText}
                onChange={handleJsonEditorChange}
                disabled={!enableEdit}
                placeholder="Enter guard profile configuration"
                schema={guardProfileSchema}
                schemaUri="http://mcp-guardian/schemas/guard_profile_schema.json"
                label="Guard Profile Configuration"
              />
            </div>

            {enableEdit && (
              <div className="flex justify-end gap-4">
                <Button
                  onClick={handleSave}
                  variant="success"
                  size="sm"
                  title="Save profile changes"
                >
                  <Save size={14} strokeWidth={2.5} className="mr-1" />
                  Save
                </Button>

                <Button
                  onClick={() => setShowDeleteConfirm(true)}
                  variant="danger"
                  size="sm"
                  title="Delete this profile"
                >
                  <Trash2 size={14} strokeWidth={2.5} className="mr-1" />
                  Delete
                </Button>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Guard Profile"
        message={`Are you sure you want to delete the profile "${namespace}.${profile_name}"? This action cannot be undone.`}
      />
    </Card>
  );
};

export default GuardProfileComponent;
