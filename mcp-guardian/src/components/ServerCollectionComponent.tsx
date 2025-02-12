import { useState } from "react";
import Collapsible from "react-collapsible";
import { invoke } from "@tauri-apps/api/core";
import { NamedServerCollection } from "../bindings/NamedServerCollection";
import { ServerCollection } from "../bindings/ServerCollection";
import "./ServerCollectionComponent.css";

interface ServerCollectionComponentProps {
  namedServerCollection: NamedServerCollection;
}

const ServerCollectionComponent = ({ namedServerCollection }: ServerCollectionComponentProps) => {
  const { namespace, name, server_collection } = namedServerCollection;

  const [configText, setConfigText] = useState(JSON.stringify(server_collection, null, 2));

  const updateServerCollection = async (serverCollection: ServerCollection) => {
    await invoke("set_server_collection", { namespace, name, serverCollection });
  };

  return (
    <div className="server-collection-component-container">
      <Collapsible
        trigger={`\u25B8 ${namespace}.${name}`}
        triggerWhenOpen={`\u25BE ${namespace}.${name}`}
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
            <button className="save-btn" onClick={() => updateServerCollection(JSON.parse(configText))}>
              Save
            </button>
          </div>
        </div>
      </Collapsible>
    </div>
  );
};

export default ServerCollectionComponent;
