import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import ReactModal from "react-modal";
import SplashPage from "./pages/SplashPage";
import McpServersPage from "./pages/McpServersPage";
import GuardProfilesPage from "./pages/GuardProfilesPage";
import ServerCollectionsPage from "./pages/ServerCollectionsPage";
import PendingMessagesPage from "./pages/PendingMessagesPage";
import { ToastContainer } from "react-toastify";
import { NamedMcpServer } from "./bindings/NamedMcpServer";
import { NamedGuardProfile } from "./bindings/NamedGuardProfile";
import { NamedServerCollection } from "./bindings/NamedServerCollection";
import "./App.css";

enum Page {
  SPLASH = "MCP Guardian",
  SERVERS = "MCP Servers",
  GUARD_PROFILES = "Guard Profiles",
  SERVER_COLLECTIONS = "Server Collections",
  PENDING_MESSAGES = "Pending Messages",
}

const PAGES = [Page.SPLASH, Page.SERVERS, Page.GUARD_PROFILES, Page.SERVER_COLLECTIONS, Page.PENDING_MESSAGES];

ReactModal.setAppElement("#root");

const getMcpServers = (): Promise<NamedMcpServer[]> => invoke("list_mcp_servers", {});
const getGuardProfiles = (): Promise<NamedGuardProfile[]> => invoke("list_guard_profiles", {});
const getServerCollections = (): Promise<NamedServerCollection[]> => invoke("list_server_collections", {});
// TODO: update 'get_pending_messages' return type in backend to be 'Vec<Value>' instead of 'Value>
const getPendingMessages = (): Promise<any> => invoke("get_pending_messages", {});

const App = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const currentPage = PAGES[pageIndex];

  const [mcpServers, setMcpServers] = useState<NamedMcpServer[]>([]);
  const updateMcpServers = () => getMcpServers().then(setMcpServers);

  const [guardProfiles, setGuardProfiles] = useState<NamedGuardProfile[]>([]);
  const updateGuardProfiles = () => getGuardProfiles().then(setGuardProfiles);

  const [serverCollections, setServerCollections] = useState<NamedServerCollection[]>([]);
  const updateServerCollections = () => getServerCollections().then(setServerCollections);

  const [pendingMessages, setPendingMessages] = useState({} as any);
  const updatePendingMessages = () => getPendingMessages().then(setPendingMessages);

  useEffect(() => {
    updateMcpServers();
    updateGuardProfiles();
    updateServerCollections();
    const interval = setInterval(updatePendingMessages, 250);
    return () => clearInterval(interval);
  }, []);

  return (
    <main>
      <div className="main-grid">
        <div className="nav-link-container">
          {PAGES.map((pageName, i) => (
            <div
              key={`nav-link-${i}`}
              className={pageIndex === i ? "nav-link active" : "nav-link"}
              onClick={() => setPageIndex(i)}
            >
              {pageName}
            </div>
          ))}
        </div>
        <div>
          <div className="page">
            {currentPage === Page.SPLASH ? (
              <SplashPage />
            ) : currentPage === Page.SERVERS ? (
              <McpServersPage {...{ mcpServers, updateMcpServers }} />
            ) : currentPage === Page.GUARD_PROFILES ? (
              <GuardProfilesPage {...{ guardProfiles, updateGuardProfiles }} />
            ) : currentPage === Page.SERVER_COLLECTIONS ? (
              <ServerCollectionsPage {...{ serverCollections, updateServerCollections }} />
            ) : currentPage === Page.PENDING_MESSAGES ? (
              <PendingMessagesPage {...{ pendingMessages, updatePendingMessages }} />
            ) : (
              <div>Page not found</div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </main>
  );
};

export default App;
