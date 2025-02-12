import { useState } from "react";
import Collapsible from "react-collapsible";
import { invoke } from "@tauri-apps/api/core";
import { NamedGuardProfile } from "../bindings/NamedGuardProfile";
import { GuardProfile } from "../bindings/GuardProfile";
import "./GuardProfileComponent.css";

interface GuardProfileComponentProps {
  namedGuardProfile: NamedGuardProfile;
}

const GuardProfileComponent = ({ namedGuardProfile }: GuardProfileComponentProps) => {
  const { namespace, profile_name, guard_profile } = namedGuardProfile;

  const [configText, setConfigText] = useState(JSON.stringify(guard_profile, null, 2));

  const updateGuardProfile = async (guardProfile: GuardProfile) => {
    await invoke("set_guard_profile", { namespace, profileName: profile_name, guardProfile });
  };

  return (
    <div className="mcp-server-component-container">
      <Collapsible
        trigger={`\u25B8 ${namespace}.${profile_name}`}
        triggerWhenOpen={`\u25BE ${namespace}.${profile_name}`}
        transitionTime={150}
      >
        <div className="server-grid">
          <div>
            <textarea
              value={configText}
              onChange={(e) => setConfigText(e.target.value)}
              rows={configText.split("\n").length}
            />
          </div>
          <div className="save-btn-div">
            <button className="save-btn" onClick={() => updateGuardProfile(JSON.parse(configText))}>
              Save
            </button>
          </div>
        </div>
      </Collapsible>
    </div>
  );
};

export default GuardProfileComponent;
