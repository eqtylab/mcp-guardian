import { useState } from "react";
import GuardProfileComponent from "../components/GuardProfileComponent";
import CreateGuardProfileModal from "../components/CreateGuardProfileModal";
import { NamedGuardProfile } from "../bindings/NamedGuardProfile";

interface GuardProfilesPageProps {
  guardProfiles: NamedGuardProfile[];
  updateGuardProfiles: () => Promise<void>;
}

const GuardProfilesPage = ({ guardProfiles, updateGuardProfiles }: GuardProfilesPageProps) => {
  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
  const [openCollapsible, setOpenCollapsible] = useState<number | null>(null);

  const onSuccessfulCreate = () => {
    setCreateModalIsOpen(false);
    updateGuardProfiles();
  };

  const onSuccessfulDelete = () => {
    setOpenCollapsible(null);
    updateGuardProfiles();
  };

  const coreProfiles = guardProfiles.filter((profile) => profile.namespace === "mcp-guardian");
  const customProfiles = guardProfiles.filter((profile) => profile.namespace !== "mcp-guardian");

  return (
    <div className="container">
      <h1>Guard Profiles</h1>

      <h2>Core Profiles</h2>

      {coreProfiles.map((server, i) => (
        <GuardProfileComponent
          key={`guard-profile-${i}`}
          namedGuardProfile={server}
          onUpdateSuceess={updateGuardProfiles}
          onDeleteSuccess={onSuccessfulDelete}
          open={openCollapsible === i}
          onToggle={() => setOpenCollapsible(openCollapsible === i ? null : i)}
          enableEdit={false}
        />
      ))}

      <h2>Custom Profiles</h2>

      {customProfiles.map((server, _i) => {
        const i = _i + coreProfiles.length;
        return (
          <GuardProfileComponent
            key={`guard-profile-${i}`}
            namedGuardProfile={server}
            onUpdateSuceess={updateGuardProfiles}
            onDeleteSuccess={onSuccessfulDelete}
            open={openCollapsible === i}
            onToggle={() => setOpenCollapsible(openCollapsible === i ? null : i)}
            enableEdit={true}
          />
        );
      })}

      <button onClick={() => setCreateModalIsOpen(true)}>Create New Guard Profile</button>

      <CreateGuardProfileModal
        isOpen={createModalIsOpen}
        setIsOpen={setCreateModalIsOpen}
        onSuccessfulCreate={onSuccessfulCreate}
      />
    </div>
  );
};

export default GuardProfilesPage;
