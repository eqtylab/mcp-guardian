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
    <div className="bg-bg-surface rounded-md border border-border-subtle overflow-hidden mb-2">
      <div 
        className="p-3 bg-bg-elevated border-b border-border-subtle flex justify-between items-center cursor-pointer"
        onClick={onToggle}
        title={`${namespace}.${profile_name} guard profile configuration`}
      >
        <div className="flex items-center gap-2">
          <Shield size={14} strokeWidth={2.5} className="text-accent-primary" />
          <span className="text-text-primary">{`${namespace}.${profile_name}`}</span>
        </div>
        {isExpanded ? <ChevronDown size={14} strokeWidth={2.5} /> : <ChevronRight size={14} strokeWidth={2.5} />}
      </div>

      {isExpanded && (
        <div className="p-4 bg-bg-surface">
          <div className="mb-4">
            <JsonEditor
              value={configText}
              onChange={setConfigText}
              disabled={!enableEdit}
              placeholder="Enter guard profile configuration"
            />
          </div>

          {enableEdit && (
            <div className="flex justify-end gap-4">
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
                className="bg-status-success text-bg-base hover:bg-status-success/90 
                           rounded-sm py-1 px-2 text-xs font-medium border-0
                           flex items-center gap-2 transition-colors duration-fast"
                title="Save profile changes"
              >
                <Save size={14} strokeWidth={2.5} />
                Save
              </button>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-status-danger text-white hover:bg-status-danger/90 
                           rounded-sm py-1 px-2 text-xs font-medium border-0
                           flex items-center gap-2 transition-colors duration-fast"
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
