import { useState } from "react";
import Collapsible from "react-collapsible";
import { invoke } from "@tauri-apps/api/core";
import { NamedGuardProfile } from "../bindings/NamedGuardProfile";
import { GuardProfile } from "../bindings/GuardProfile";

interface GuardProfileComponentProps {
  namedGuardProfile: NamedGuardProfile;
  onDeleteSuccess: () => void;
  open: boolean;
  onToggle: () => void;
}

const GuardProfileComponent = ({ namedGuardProfile, onDeleteSuccess, open, onToggle }: GuardProfileComponentProps) => {
  const { namespace, profile_name, guard_profile } = namedGuardProfile;

  const [configText, setConfigText] = useState(JSON.stringify(guard_profile, null, 2));

  const updateGuardProfile = async (guardProfile: GuardProfile) => {
    await invoke("set_guard_profile", { namespace, name: profile_name, guardProfile });
  };

  const deleteGuardProfile = async () => {
    await invoke("delete_guard_profile", { namespace, name: profile_name });
    onDeleteSuccess();
  };

  return (
    <div className="component-container">
      <Collapsible
        trigger={`\u25B8 ${namespace}.${profile_name}`}
        triggerWhenOpen={`\u25BE ${namespace}.${profile_name}`}
        transitionTime={150}
        open={open}
        handleTriggerClick={onToggle}
      >
        <div className="grid">
          <textarea
            className="textarea"
            value={configText}
            onChange={(e) => setConfigText(e.target.value)}
            rows={configText.split("\n").length}
          />
          <div className="button-container">
            <div className="save-btn-div">
              <button className="save-btn" onClick={() => updateGuardProfile(JSON.parse(configText))}>
                Save
              </button>
            </div>
            <div className="delete-btn-div">
              <button className="delete-btn" onClick={deleteGuardProfile}>
                Delete
              </button>
            </div>
          </div>
        </div>
      </Collapsible>
    </div>
  );
};

export default GuardProfileComponent;
