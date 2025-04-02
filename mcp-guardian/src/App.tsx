import { useState, useEffect, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";

import { Home, Server, Shield, Library, MessageSquare } from "lucide-react";
import SplashPage from "./pages/splash-page";
import McpServersPage from "./pages/mcp-servers-page";
import GuardProfilesPage from "./pages/guard-profiles-page";
import ServerCollectionsPage from "./pages/server-collections-page";
import PendingMessagesPage from "./pages/pending-messages-page";
import { ToastContainer } from "react-toastify";
import { NamedMcpServer } from "./bindings/NamedMcpServer";
import { NamedGuardProfile } from "./bindings/NamedGuardProfile";
import { NamedServerCollection } from "./bindings/NamedServerCollection";
import HeaderNavigation from "./components/header-navigation";
import "./App.css";

enum Page {
  SPLASH = "Home",
  SERVERS = "MCP Servers",
  GUARD_PROFILES = "Guard Profiles",
  SERVER_COLLECTIONS = "Server Collections",
  PENDING_MESSAGES = "Pending Messages",
}

const NAV_ITEMS = [
  {
    page: Page.SPLASH,
    icon: Home,
    description: "MCP Guardian dashboard and overview",
  },
  {
    page: Page.SERVERS,
    icon: Server,
    description: "Manage MCP server configurations",
  },
  {
    page: Page.GUARD_PROFILES,
    icon: Shield,
    description: "Configure guard profiles for message interception",
  },
  {
    page: Page.SERVER_COLLECTIONS,
    icon: Library,
    description: "Manage collections of MCP servers",
  },
  {
    page: Page.PENDING_MESSAGES,
    icon: MessageSquare,
    description: "Review and approve pending messages",
    badge: true,
  },
];

const getMcpServers = (): Promise<NamedMcpServer[]> => invoke("list_mcp_servers", {});
const getGuardProfiles = (): Promise<NamedGuardProfile[]> => invoke("list_guard_profiles", {});
const getServerCollections = (): Promise<NamedServerCollection[]> => invoke("list_server_collections", {});
const getPendingMessages = (): Promise<any> => invoke("get_pending_messages", {});

const App = () => {
  const [currentPage, setCurrentPage] = useState<string>(Page.SPLASH);
  const [mcpServers, setMcpServers] = useState<NamedMcpServer[]>([]);
  const [guardProfiles, setGuardProfiles] = useState<NamedGuardProfile[]>([]);
  const [serverCollections, setServerCollections] = useState<NamedServerCollection[]>([]);
  const [pendingMessages, setPendingMessages] = useState({} as any);

  const updateMcpServers = () => getMcpServers().then(setMcpServers);
  const updateGuardProfiles = () => getGuardProfiles().then(setGuardProfiles);
  const updateServerCollections = () => getServerCollections().then(setServerCollections);
  const updatePendingMessages = () => getPendingMessages().then(setPendingMessages);

  // Keyboard navigation
  const handleKeyNav = useCallback((e: KeyboardEvent) => {
    // Check for Alt/Option (Mac) or Command (Mac)
    const isMacCommand = e.metaKey && !e.ctrlKey && !e.altKey;
    const isAltOption = e.altKey && !e.ctrlKey && !e.metaKey;

    if ((isMacCommand || isAltOption) && e.key >= "1" && e.key <= "5") {
      e.preventDefault();
      const index = parseInt(e.key) - 1;
      const targetPage = Object.values(Page)[index];
      if (targetPage) {
        setCurrentPage(targetPage);
      }
    }
  }, []);

  useEffect(() => {
    // Explicitly type the event handler
    const handler = (e: KeyboardEvent) => handleKeyNav(e);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleKeyNav]);

  useEffect(() => {
    updateMcpServers();
    updateGuardProfiles();
    updateServerCollections();
    const interval = setInterval(updatePendingMessages, 250);
    return () => clearInterval(interval);
  }, []);

  const pendingCount = Object.keys(pendingMessages).length;
  const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  const modifierKey = isMac ? "⌘" : "Alt";

  return (
    <main className="flex flex-col h-screen overflow-hidden bg-background text-foreground">
      <HeaderNavigation 
        navItems={NAV_ITEMS}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pendingCount={pendingCount}
        modifierKey={modifierKey}
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          {currentPage === Page.SPLASH ? (
            <SplashPage />
          ) : currentPage === Page.SERVERS ? (
            <McpServersPage mcpServers={mcpServers} updateMcpServers={updateMcpServers} />
          ) : currentPage === Page.GUARD_PROFILES ? (
            <GuardProfilesPage guardProfiles={guardProfiles} updateGuardProfiles={updateGuardProfiles} />
          ) : currentPage === Page.SERVER_COLLECTIONS ? (
            <ServerCollectionsPage
              serverCollections={serverCollections}
              updateServerCollections={updateServerCollections}
            />
          ) : currentPage === Page.PENDING_MESSAGES ? (
            <PendingMessagesPage pendingMessages={pendingMessages} updatePendingMessages={updatePendingMessages} />
          ) : (
            <div>Page not found</div>
          )}
        </div>
      </div>
      <ToastContainer 
        position="bottom-right" 
        theme="auto" 
        className="!text-foreground !bg-card !border !border-border"
      />
    </main>
  );
};

export default App;