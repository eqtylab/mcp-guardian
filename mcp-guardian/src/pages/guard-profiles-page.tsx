import { useState } from "react";
import { Plus, Shield, Search } from "lucide-react";
import GuardProfileComponent from "../components/guard-profile-component";
import CreateGuardProfileDialog from "../components/create-guard-profile-dialog";
import { NamedGuardProfile } from "../bindings/NamedGuardProfile";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Sidebar, SidebarSection, SidebarItem, SidebarHeader } from "../components/ui/sidebar";

interface GuardProfilesPageProps {
  guardProfiles: NamedGuardProfile[];
  updateGuardProfiles: () => Promise<void>;
}

const GuardProfilesPage = ({ guardProfiles, updateGuardProfiles }: GuardProfilesPageProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const coreProfiles = guardProfiles.filter((profile) => profile.namespace === "mcp-guardian");
  const customProfiles = guardProfiles.filter((profile) => profile.namespace !== "mcp-guardian");

  const filteredCoreProfiles = coreProfiles.filter(profile => 
    `${profile.namespace}.${profile.profile_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredCustomProfiles = customProfiles.filter(profile => 
    `${profile.namespace}.${profile.profile_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedProfile = guardProfiles.find(
    profile => `${profile.namespace}.${profile.profile_name}` === selectedProfileId
  );

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Guard Profiles</h2>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              variant="ghost"
              size="icon"
              title="Create a new guard profile"
            >
              <Plus size={16} strokeWidth={2.5} />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search profiles..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </SidebarHeader>

        {/* Core Profiles */}
        <SidebarSection title="Core Profiles" count={filteredCoreProfiles.length}>
          {filteredCoreProfiles.map((profile) => (
            <SidebarItem
              key={`${profile.namespace}.${profile.profile_name}`}
              active={selectedProfileId === `${profile.namespace}.${profile.profile_name}`}
              onClick={() => setSelectedProfileId(`${profile.namespace}.${profile.profile_name}`)}
            >
              <Shield size={14} strokeWidth={2.5} className="mr-2 text-muted-foreground" />
              <span className="truncate">{profile.profile_name}</span>
            </SidebarItem>
          ))}
        </SidebarSection>

        {/* Custom Profiles */}
        <SidebarSection title="Custom Profiles" count={filteredCustomProfiles.length}>
          {filteredCustomProfiles.map((profile) => (
            <SidebarItem
              key={`${profile.namespace}.${profile.profile_name}`}
              active={selectedProfileId === `${profile.namespace}.${profile.profile_name}`}
              onClick={() => setSelectedProfileId(`${profile.namespace}.${profile.profile_name}`)}
            >
              <Shield size={14} strokeWidth={2.5} className="mr-2 text-muted-foreground" />
              <span className="truncate">{profile.profile_name}</span>
            </SidebarItem>
          ))}
        </SidebarSection>
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {selectedProfile ? `${selectedProfile.namespace}.${selectedProfile.profile_name}` : "Select a profile"}
          </h1>

          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            variant="success"
            size="sm"
            title="Create a new guard profile configuration"
            className="font-medium shadow-sm border-[1px] border-[rgba(0,0,0,0.1)]"
          >
            <Plus size={14} strokeWidth={2.5} className="mr-1" />
            New Profile
          </Button>
        </div>

        {/* Selected Profile Content */}
        {selectedProfile && (
          <GuardProfileComponent
            namedGuardProfile={selectedProfile}
            onUpdateSuccess={updateGuardProfiles}
            onDeleteSuccess={() => {
              setSelectedProfileId(null);
              updateGuardProfiles();
            }}
            isExpanded={true}
            onToggle={() => {}}
            enableEdit={selectedProfile.namespace !== "mcp-guardian"}
            hideCollapsible={true}
          />
        )}

        {/* Empty State */}
        {!selectedProfile && (
          <div className="text-center p-12 border border-dashed rounded-lg">
            <Shield size={48} strokeWidth={1.5} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No profile selected</h3>
            <p className="text-muted-foreground mb-4">Select a profile from the sidebar to view and edit its configuration</p>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              variant="success"
              size="sm"
            >
              <Plus size={14} strokeWidth={2.5} className="mr-1" />
              Create New Profile
            </Button>
          </div>
        )}
      </div>

      <CreateGuardProfileDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={async (newProfileId) => {
          setIsCreateDialogOpen(false);
          await updateGuardProfiles();
          if (newProfileId) {
            setSelectedProfileId(newProfileId);
          }
        }}
      />
    </div>
  );
};

export default GuardProfilesPage;
