import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import GuardProfileComponent from "../components/GuardProfileComponent";
import CreateGuardProfileModal from "../components/CreateGuardProfileModal";
import { NamedGuardProfile } from "../bindings/NamedGuardProfile";

const getGuardProfiles = (): Promise<NamedGuardProfile[]> => invoke("list_guard_profiles", {});

const GuardProfilesPage = () => {
  const [guardProfiles, setGuardProfiles] = useState<NamedGuardProfile[]>([]);
  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
  const [openCollapsible, setOpenCollapsible] = useState<number | null>(null);

  const updateGuardProfiles = async () => {
    const newServers: NamedGuardProfile[] = await getGuardProfiles();
    setGuardProfiles(newServers);
    setOpenCollapsible(null);
  };

  const afterSuccessfulCreate = () => {
    setCreateModalIsOpen(false);
    updateGuardProfiles();
  };

  useEffect(() => {
    updateGuardProfiles();
  }, []);

  console.log("guardProfiles", guardProfiles);

  return (
    <div className="container">
      <h1>Guard Profiles</h1>

      <button onClick={updateGuardProfiles}>Refresh</button>

      {guardProfiles.map((server, i) => (
        <GuardProfileComponent
          key={`guard-profile-${i}`}
          namedGuardProfile={server}
          onDeleteSuccess={updateGuardProfiles}
          open={openCollapsible === i}
          onToggle={() => setOpenCollapsible(openCollapsible === i ? null : i)}
        />
      ))}

      <button onClick={() => setCreateModalIsOpen(true)}>Create New Guard Profile</button>

      <CreateGuardProfileModal
        isOpen={createModalIsOpen}
        setIsOpen={setCreateModalIsOpen}
        afterSuccessfulCreate={afterSuccessfulCreate}
      />
    </div>
  );
};

export default GuardProfilesPage;
