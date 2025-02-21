import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { NamedGuardProfile } from "../bindings/NamedGuardProfile";
import { GuardProfile } from "../bindings/GuardProfile";
import { notifyError, notifySuccess } from "./toast";
import { ChevronDown, ChevronRight, Save, Trash2 } from "lucide-react";

import JsonEditor from "./JSONEditor";

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
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setConfigText(JSON.stringify(guard_profile, null, 2));
  }, [guard_profile]);

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

  return (
    <div className="component-container">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 hover:bg-cream-100 dark:hover:bg-primary-700 rounded-t-lg"
        title={`${namespace}.${profile_name} guard profile configuration`}
      >
        <span className="font-medium">{`${namespace}.${profile_name}`}</span>
        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </button>

      {isExpanded && (
        <div className="p-4 space-y-4">
          <JsonEditor
            value={configText}
            onChange={setConfigText}
            disabled={!enableEdit}
            placeholder="Enter guard profile configuration"
          />

          {enableEdit && (
            <div className="flex justify-end space-x-4">
              <button
                onClick={async () => {
                  try {
                    const guardProfile: GuardProfile = JSON.parse(configText);
                    await invoke("set_guard_profile", {
                      namespace,
                      name: profile_name,
                      guardProfile,
                    });
                    onUpdateSuccess();
                    notifySuccess(`Profile "${namespace}.${profile_name}" updated`);
                  } catch (e: any) {
                    notifyError(e);
                  }
                }}
                className="btn-success flex items-center gap-2"
                disabled={!isValid}
                title="Save profile changes"
              >
                <Save size={16} />
                Save Changes
              </button>

              <button
                onClick={async () => {
                  if (confirm(`Delete profile "${namespace}.${profile_name}"?`)) {
                    try {
                      await invoke("delete_guard_profile", { namespace, name: profile_name });
                      onDeleteSuccess();
                      notifySuccess(`Profile "${namespace}.${profile_name}" deleted`);
                    } catch (e: any) {
                      notifyError(e);
                    }
                  }
                }}
                className="btn-danger flex items-center gap-2"
                title="Delete this profile"
              >
                <Trash2 size={16} />
                Delete Profile
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GuardProfileComponent;
