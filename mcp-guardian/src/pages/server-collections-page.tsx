import { useState } from "react";
import { Plus } from "lucide-react";
import ServerCollectionComponent from "../components/server-collection-component";
import CreateServerCollectionDialog from "../components/create-server-collection-dialog";
import { NamedServerCollection } from "../bindings/NamedServerCollection";
import { Button } from "../components/ui/button";

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

        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          variant="success"
          title="Create a new server collection"
          className="font-medium shadow-sm border-[1px] border-[rgba(0,0,0,0.1)]"
        >
          <Plus size={18} className="mr-2" />
          New Collection
        </Button>
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
              isExpanded={openCollectionId === i}
              onToggle={() => setOpenCollectionId(openCollectionId === i ? null : i)}
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
