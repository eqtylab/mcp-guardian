import { useState } from "react";
import { Plus } from "lucide-react";
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
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Guard Profiles</h1>

        <button
          onClick={() => setIsCreateDialogOpen(true)}
          className="btn-success flex items-center gap-2"
          title="Create a new guard profile configuration"
        >
          <Plus size={18} />
          New Profile
        </button>
      </div>

      {/* Core Profiles Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-primary-700 dark:text-cream-200">Core Profiles</h2>
        <div className="space-y-2">
          {coreProfiles.map((profile, i) => (
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
          ))}
        </div>
      </div>

      {/* Custom Profiles Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-primary-700 dark:text-cream-200">Custom Profiles</h2>
        <div className="space-y-2">
          {customProfiles.map((profile, i) => (
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
          ))}
        </div>
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
