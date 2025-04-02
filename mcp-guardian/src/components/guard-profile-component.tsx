import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { NamedGuardProfile } from "../bindings/NamedGuardProfile";
import { GuardProfile } from "../bindings/GuardProfile";
import { notifyError, notifySuccess } from "./toast";
import { ChevronDown, ChevronRight, Save, Trash2, Shield, Code, Webhook } from "lucide-react";
import ConfirmDialog from "./confirm-dialog";
import JsonEditor from "./json-valid-editor";
import GuardProfileVisualBuilder from "./guard-profile-builder";
import { Button } from "./ui/button";
import { Card, CardHeader, CardContent } from "./ui/card";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface GuardProfileComponentProps {
  namedGuardProfile: NamedGuardProfile;
  onUpdateSuccess: () => void;
  onDeleteSuccess: () => void;
  isExpanded: boolean;
  onToggle: () => void;
  enableEdit: boolean;
}

const GuardProfileComponent = ({
  namedGuardProfile,
  onUpdateSuccess,
  onDeleteSuccess,
  isExpanded,
  onToggle,
  enableEdit,
}: GuardProfileComponentProps) => {
  const { namespace, profile_name, guard_profile } = namedGuardProfile;
  const [configText, setConfigText] = useState("");
  const [currentGuardProfile, setCurrentGuardProfile] = useState<GuardProfile>(guard_profile);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>("visual");

  // Update local state when the profile changes from props
  useEffect(() => {
    setCurrentGuardProfile(guard_profile);
    setConfigText(JSON.stringify(guard_profile, null, 2));
  }, [guard_profile]);

  // Update JSON text when the visual builder changes the profile
  const handleVisualBuilderChange = (updatedProfile: GuardProfile) => {
    setCurrentGuardProfile(updatedProfile);
    setConfigText(JSON.stringify(updatedProfile, null, 2));
  };

  // Update visual builder when JSON text changes
  const handleJsonEditorChange = (newText: string) => {
    setConfigText(newText);
    try {
      const parsedProfile = JSON.parse(newText) as GuardProfile;
      setCurrentGuardProfile(parsedProfile);
    } catch (e) {
      // JSON is invalid, don't update the visual builder
    }
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
      // Always save from the current guard profile object, which is synced with both views
      await invoke("set_guard_profile", {
        namespace,
        name: profile_name,
        guardProfile: currentGuardProfile,
      });
      onUpdateSuccess();
      notifySuccess(`Profile "${namespace}.${profile_name}" updated`);
    } catch (e: any) {
      notifyError(e);
    }
  };

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
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="mb-4">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="visual" className="flex items-center gap-2">
                  <Webhook size={14} strokeWidth={2.5} />
                  Visual Editor
                </TabsTrigger>
                <TabsTrigger value="json" className="flex items-center gap-2">
                  <Code size={14} strokeWidth={2.5} />
                  JSON Editor
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="visual" className="mt-0">
                <GuardProfileVisualBuilder
                  profile={currentGuardProfile}
                  onChange={handleVisualBuilderChange}
                  readOnly={!enableEdit}
                />
              </TabsContent>
              
              <TabsContent value="json" className="mt-0">
                <JsonEditor
                  value={configText}
                  onChange={handleJsonEditorChange}
                  disabled={!enableEdit}
                  placeholder="Enter guard profile configuration"
                />
              </TabsContent>
            </Tabs>

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
