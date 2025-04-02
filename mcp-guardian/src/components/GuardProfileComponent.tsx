import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { NamedGuardProfile } from "../bindings/NamedGuardProfile";
import { GuardProfile } from "../bindings/GuardProfile";
import { notifyError, notifySuccess } from "./toast";
import { ChevronDown, ChevronRight, Save, Trash2, Shield } from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";
import JsonEditor from "./JsonValidEditor";

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setConfigText(JSON.stringify(guard_profile, null, 2));
  }, [guard_profile]);

  const handleDelete = async () => {
    try {
      await invoke("delete_guard_profile", { namespace, name: profile_name });
      onDeleteSuccess();
      notifySuccess(`Profile "${namespace}.${profile_name}" deleted`);
    } catch (e: any) {
      notifyError(e);
    }
  };

  return (
    <div className="card mb-sm">
      <div 
        className="card-header cursor-pointer"
        onClick={onToggle}
        title={`${namespace}.${profile_name} guard profile configuration`}
      >
        <div className="flex-row gap-sm">
          <Shield size={14} strokeWidth={2.5} className="text-accent-primary" />
          <span>{`${namespace}.${profile_name}`}</span>
        </div>
        {isExpanded ? <ChevronDown size={14} strokeWidth={2.5} /> : <ChevronRight size={14} strokeWidth={2.5} />}
      </div>

      {isExpanded && (
        <div className="card-content">
          <div className="json-editor mb-md">
            <JsonEditor
              value={configText}
              onChange={setConfigText}
              disabled={!enableEdit}
              placeholder="Enter guard profile configuration"
            />
          </div>

          {enableEdit && (
            <div className="btn-group justify-end">
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
                className="btn-success btn-sm"
                title="Save profile changes"
              >
                <Save size={14} strokeWidth={2.5} />
                Save
              </button>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="btn-danger btn-sm"
                title="Delete this profile"
              >
                <Trash2 size={14} strokeWidth={2.5} />
                Delete
              </button>
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Guard Profile"
        message={`Are you sure you want to delete the profile "${namespace}.${profile_name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default GuardProfileComponent;
