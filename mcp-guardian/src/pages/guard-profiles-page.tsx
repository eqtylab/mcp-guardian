import { useState } from "react";
import { Plus } from "lucide-react";
import GuardProfileComponent from "../components/guard-profile-component";
import CreateGuardProfileDialog from "../components/create-guard-profile-dialog";
import { NamedGuardProfile } from "../bindings/NamedGuardProfile";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";

interface GuardProfilesPageProps {
  guardProfiles: NamedGuardProfile[];
  updateGuardProfiles: () => Promise<void>;
}

const GuardProfilesPage = ({ guardProfiles, updateGuardProfiles }: GuardProfilesPageProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [openProfileId, setOpenProfileId] = useState<number | null>(null);

  const coreProfiles = guardProfiles.filter((profile) => profile.namespace === "mcp-guardian");
  const customProfiles = guardProfiles.filter((profile) => profile.namespace !== "mcp-guardian");

  return (
    <div className="p-0">
      <div className="flex justify-between items-center mb-4">
        <h1>Guard Profiles</h1>

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

      {/* Core Profiles Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm">Core Profiles</h2>
          <Badge variant="primary">{coreProfiles.length}</Badge>
        </div>
        
        {coreProfiles.length > 0 ? (
          coreProfiles.map((profile, i) => (
            <GuardProfileComponent
              key={`${profile.namespace}.${profile.profile_name}`}
              namedGuardProfile={profile}
              onUpdateSuccess={updateGuardProfiles}
              onDeleteSuccess={() => {
                setOpenProfileId(null);
                updateGuardProfiles();
              }}
              isExpanded={openProfileId === i}
              onToggle={() => setOpenProfileId(openProfileId === i ? null : i)}
              enableEdit={false}
            />
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-4">
              <p className="text-sm mb-0">No core profiles available</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Custom Profiles Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm">Custom Profiles</h2>
          <Badge variant="primary">{customProfiles.length}</Badge>
        </div>
        
        {customProfiles.length > 0 ? (
          customProfiles.map((profile, i) => (
            <GuardProfileComponent
              key={`${profile.namespace}.${profile.profile_name}`}
              namedGuardProfile={profile}
              onUpdateSuccess={updateGuardProfiles}
              onDeleteSuccess={() => {
                setOpenProfileId(null);
                updateGuardProfiles();
              }}
              isExpanded={openProfileId === i + coreProfiles.length}
              onToggle={() =>
                setOpenProfileId(openProfileId === i + coreProfiles.length ? null : i + coreProfiles.length)
              }
              enableEdit={true}
            />
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-4">
              <p className="text-sm mb-0">No custom profiles created</p>
            </CardContent>
          </Card>
        )}
      </div>

      <CreateGuardProfileDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={async () => {
          setIsCreateDialogOpen(false);
          await updateGuardProfiles();
        }}
      />
    </div>
  );
};

export default GuardProfilesPage;
