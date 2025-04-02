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

interface NavItemProps {
  icon: any;
  label: string;
  isActive: boolean;
  description: string;
  onClick: () => void;
  badge?: number;
}

const NavItem = ({ icon: Icon, label, isActive, description, onClick, badge }: NavItemProps) => (
  <button
    onClick={onClick}
    className={`nav-item ${isActive ? "active" : ""}`}
    title={description}
    role="tab"
    aria-selected={isActive}
  >
    <Icon size={16} strokeWidth={2} />
    <span>{label}</span>
    {badge !== undefined && (
      <span className={`nav-badge ${badge > 0 ? "" : "empty"}`}>
        {badge}
      </span>
    )}
  </button>
);

const App = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.SPLASH);
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
    <main className="main-container">
      <nav className="sidebar" role="tablist" aria-label="Main Navigation">
        <div className="sidebar-header">
          <h3 className="flex-row gap-sm m-0 text-sm">
            <Shield size={16} className="text-accent-primary" />
            <span>MCP Guardian</span>
          </h3>
        </div>
        
        <div className="flex-1">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.page}
              icon={item.icon}
              label={item.page}
              isActive={currentPage === item.page}
              description={item.description}
              onClick={() => setCurrentPage(item.page)}
              badge={item.badge ? pendingCount : undefined}
            />
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="muted">
            {modifierKey} + (1-5): Navigate
          </div>
        </div>
      </nav>

      <div className="content-container">
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
      <ToastContainer position="bottom-right" theme="dark" />
    </main>
  );
};

export default App;
