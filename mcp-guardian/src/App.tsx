import { useState, useEffect, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";

import { Home, Server, Shield, Library, MessageSquare } from "lucide-react";
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
    className={`
      w-full px-3 py-2.5
      flex items-center gap-2.5
      text-left transition-colors duration-200
      hover:bg-cream-100 dark:hover:bg-primary-700
      ${isActive ? "bg-cream-100 dark:bg-primary-700" : ""}
    `}
    title={description}
    role="tab"
    aria-selected={isActive}
  >
    <Icon size={16} />
    <span className="font-medium text-sm">{label}</span>
    {badge !== undefined && (
      <span
        className={`
        ml-auto px-2 py-0.5 text-xs font-medium rounded-full
        ${badge > 0 ? "bg-shield-200" : "bg-cream-200 dark:bg-primary-600"}
      `}
      >
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
    <main className="flex h-screen">
      <nav
        className="w-48 border-r border-cream-100 dark:border-primary-700 flex flex-col"
        role="tablist"
        aria-label="Main Navigation"
      >
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

        <div className="p-3 border-t border-cream-100 dark:border-primary-700">
          <div className="text-xs text-primary-700 dark:text-cream-200">
            <p>{modifierKey} + (1-5): Navigate pages</p>
          </div>
        </div>
      </nav>

      <div className="flex-1 overflow-auto">
        <div className="min-h-full p-6">
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
      <ToastContainer />
    </main>
  );
};

export default App;
