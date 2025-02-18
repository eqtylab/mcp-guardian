import { useState } from "react";
import ServerCollectionComponent from "../components/ServerCollectionComponent";
import CreateServerCollectionModal from "../components/CreateServerCollectionModal";
import { NamedServerCollection } from "../bindings/NamedServerCollection";

interface ServerCollectionsPageProps {
  serverCollections: NamedServerCollection[];
  updateServerCollections: () => Promise<void>;
}

const ServerCollectionsPage = ({ serverCollections, updateServerCollections }: ServerCollectionsPageProps) => {
  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
  const [openCollapsible, setOpenCollapsible] = useState<number | null>(null);

  const onSuccessfulCreate = () => {
    setCreateModalIsOpen(false);
    updateServerCollections();
  };

  const onSuccessfulDelete = () => {
    setOpenCollapsible(null);
    updateServerCollections();
  };

  return (
    <div className="container">
      <h1>Server Collections</h1>

      {serverCollections.map((server, i) => (
        <ServerCollectionComponent
          key={`server-collection-${i}`}
          namedServerCollection={server}
          onUpdateSuccess={updateServerCollections}
          onDeleteSuccess={onSuccessfulDelete}
          open={openCollapsible === i}
          onToggle={() => setOpenCollapsible(openCollapsible === i ? null : i)}
        />
      ))}

      <button onClick={() => setCreateModalIsOpen(true)}>Create New Server Collection</button>

      <CreateServerCollectionModal
        isOpen={createModalIsOpen}
        setIsOpen={setCreateModalIsOpen}
        onSuccessfulCreate={onSuccessfulCreate}
      />
    </div>
  );
};

export default ServerCollectionsPage;
