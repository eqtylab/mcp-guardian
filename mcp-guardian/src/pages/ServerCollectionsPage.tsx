import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import ServerCollectionComponent from "../components/ServerCollectionComponent";
import CreateServerCollectionModal from "../components/CreateServerCollectionModal";
import { NamedServerCollection } from "../bindings/NamedServerCollection";

const getServerCollections = (): Promise<NamedServerCollection[]> => invoke("list_server_collections", {});

const ServerCollections = () => {
  const [serverCollections, setServerCollections] = useState<NamedServerCollection[]>([]);
  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);

  const updateServerCollections = async () => {
    const newServers: NamedServerCollection[] = await getServerCollections();
    setServerCollections(newServers);
  };

  const afterSuccessfulCreate = () => {
    setCreateModalIsOpen(false);
    updateServerCollections();
  };

  useEffect(() => {
    updateServerCollections();
  }, []);

  console.log("serverCollections", serverCollections);

  return (
    <div className="container">
      <h1>Server Collections</h1>

      <button onClick={updateServerCollections}>Refresh</button>

      {serverCollections.map((server, i) => (
        <ServerCollectionComponent key={`server-collection-${i}`} namedServerCollection={server} />
      ))}

      <button onClick={() => setCreateModalIsOpen(true)}>Create New Server Collection</button>

      <CreateServerCollectionModal
        isOpen={createModalIsOpen}
        setIsOpen={setCreateModalIsOpen}
        afterSuccessfulCreate={afterSuccessfulCreate}
      />
    </div>
  );
};

export default ServerCollections;
