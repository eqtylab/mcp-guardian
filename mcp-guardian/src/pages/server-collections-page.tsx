import { useState } from "react";
import { Plus, Library, Search } from "lucide-react";
import ServerCollectionComponent from "../components/server-collection-component";
import CreateServerCollectionDialog from "../components/create-server-collection-dialog";
import { NamedServerCollection } from "../bindings/NamedServerCollection";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Sidebar, SidebarSection, SidebarItem, SidebarHeader } from "../components/ui/sidebar";

interface ServerCollectionsPageProps {
  serverCollections: NamedServerCollection[];
  updateServerCollections: () => Promise<void>;
}

const ServerCollectionsPage = ({ serverCollections, updateServerCollections }: ServerCollectionsPageProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredCollections = serverCollections.filter((collection) =>
    `${collection.namespace}.${collection.name}`.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const selectedCollection = serverCollections.find(
    (collection) => `${collection.namespace}.${collection.name}` === selectedCollectionId,
  );

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Server Collections</h2>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              variant="ghost"
              size="sm"
              title="Create a new server collection"
            >
              <Plus size={18} />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search collections..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </SidebarHeader>

        {/* Collections */}
        <SidebarSection title="Collections" count={filteredCollections.length}>
          {filteredCollections.map((collection) => (
            <SidebarItem
              key={`${collection.namespace}.${collection.name}`}
              active={selectedCollectionId === `${collection.namespace}.${collection.name}`}
              onClick={() => setSelectedCollectionId(`${collection.namespace}.${collection.name}`)}
            >
              <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center mr-2">
                <Library size={16} className="text-muted-foreground" />
              </div>
              <span className="truncate">{collection.name}</span>
            </SidebarItem>
          ))}
        </SidebarSection>
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {selectedCollection ? `${selectedCollection.namespace}.${selectedCollection.name}` : "Select a collection"}
          </h1>

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

        {/* Selected Collection Content */}
        {selectedCollection && (
          <ServerCollectionComponent
            namedServerCollection={selectedCollection}
            onUpdateSuccess={updateServerCollections}
            onDeleteSuccess={() => {
              setSelectedCollectionId(null);
              updateServerCollections();
            }}
            isExpanded={true}
            onToggle={() => {}}
            enableEdit={true}
            hideCollapsible={true}
          />
        )}

        {/* Empty State */}
        {!selectedCollection && (
          <div className="text-center p-12 border border-dashed rounded-lg">
            <Library size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No collection selected</h3>
            <p className="text-muted-foreground mb-4">
              Select a collection from the sidebar to view and edit its configuration
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)} variant="success">
              <Plus size={16} className="mr-2" />
              Create New Collection
            </Button>
          </div>
        )}
      </div>

      <CreateServerCollectionDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={async () => {
          setIsCreateDialogOpen(false);
          await updateServerCollections();
          // if (newCollectionId) {
          //   setSelectedCollectionId(newCollectionId);
          // }
        }}
      />
    </div>
  );
};

export default ServerCollectionsPage;
