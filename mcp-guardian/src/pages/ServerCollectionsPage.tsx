import { useState } from "react";
import { Plus } from "lucide-react";
import ServerCollectionComponent from "../components/ServerCollectionComponent";
import CreateServerCollectionDialog from "../components/CreateServerCollectionDialog";
import { NamedServerCollection } from "../bindings/NamedServerCollection";

interface ServerCollectionsPageProps {
  serverCollections: NamedServerCollection[];
  updateServerCollections: () => Promise<void>;
}

const ServerCollectionsPage = ({ serverCollections, updateServerCollections }: ServerCollectionsPageProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [openCollectionId, setOpenCollectionId] = useState<number | null>(null);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Server Collections</h1>

        <button
          onClick={() => setIsCreateDialogOpen(true)}
          className="btn-success flex items-center gap-2"
          title="Create a new server collection"
        >
          <Plus size={18} />
          New Collection
        </button>
      </div>

      {/* Custom Collections Section */}
      <div className="space-y-4">
        <div className="space-y-2">
          {serverCollections.map((collection, i) => (
            <ServerCollectionComponent
              key={`${collection.namespace}.${collection.name}`}
              namedServerCollection={collection}
              onUpdateSuccess={updateServerCollections}
              onDeleteSuccess={() => {
                setOpenCollectionId(null);
                updateServerCollections();
              }}
              isExpanded={openCollectionId === i + serverCollections.length}
              onToggle={() =>
                setOpenCollectionId(
                  openCollectionId === i + serverCollections.length ? null : i + serverCollections.length,
                )
              }
              enableEdit={true}
            />
          ))}
        </div>
      </div>

      <CreateServerCollectionDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={async () => {
          setIsCreateDialogOpen(false);
          await updateServerCollections();
        }}
      />
    </div>
  );
};

export default ServerCollectionsPage;
