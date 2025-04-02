import { useState } from "react";
import { Plus, Shield } from "lucide-react";
import GuardProfileComponent from "../components/GuardProfileComponent";
import CreateGuardProfileDialog from "../components/CreateGuardProfileDialog";
import { NamedGuardProfile } from "../bindings/NamedGuardProfile";

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
      <div className="flex-row space-between mb-md">
        <h1>Guard Profiles</h1>

        <button
          onClick={() => setIsCreateDialogOpen(true)}
          className="btn-primary btn-sm"
          title="Create a new guard profile configuration"
        >
          <Plus size={14} strokeWidth={2.5} />
          New Profile
        </button>
      </div>

      {/* Core Profiles Section */}
      <div className="mb-lg">
        <div className="flex-row space-between mb-sm">
          <h2 className="text-sm">Core Profiles</h2>
          <div className="tag">{coreProfiles.length}</div>
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
          <div className="card card-content text-center">
            <p className="text-sm mb-0">No core profiles available</p>
          </div>
        )}
      </div>

      {/* Custom Profiles Section */}
      <div className="mb-lg">
        <div className="flex-row space-between mb-sm">
          <h2 className="text-sm">Custom Profiles</h2>
          <div className="tag">{customProfiles.length}</div>
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
          <div className="card">
            <div className="card-content text-center">
              <p className="text-sm mb-0">No custom profiles created</p>
            </div>
          </div>
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
