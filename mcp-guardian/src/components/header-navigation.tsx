import React from "react";
import { Shield } from "lucide-react";
import { cn } from "../utils";
import { ThemeToggle } from "./theme-toggle";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";

// Add custom styles for hover effect
const navItemHoverStyles = `
  .nav-item {
    transition: all 0.2s ease;
  }
  
  .nav-item:not(.active):hover {
    height: calc(var(--spacing) * 13);
    border-radius: 8px;
    background-color: var(--nav-hover) !important;
    color: white !important;
  }
`;

interface HeaderNavProps {
  navItems: Array<{
    page: string;
    icon: React.ComponentType<any>;
    description: string;
    badge?: boolean;
  }>;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  pendingCount: number;
  modifierKey: string;
}

/**
 * Header navigation component based on Radix UI NavigationMenu
 * Implementation follows the header_design_doc.md specifications
 */
export default function HeaderNavigation({
  navItems,
  currentPage,
  setCurrentPage,
  pendingCount,
  modifierKey
}: HeaderNavProps) {
  return (
    <>
      <style>{navItemHoverStyles}</style>
      <header className="flex h-14 items-center justify-between dark:bg-zinc-900 bg-zinc-200 px-6 border-b border-border">
      {/* Left section - Logo */}
      <div className="flex items-center gap-2">
        <Shield size={20} className="text-primary" />
        <span className="dark:text-white text-zinc-800 font-medium">MCP Guardian</span>
      </div>
      
      {/* Center section - Primary Navigation */}
      <NavigationMenu.Root className="flex-1 flex justify-center">
        <NavigationMenu.List className="flex items-center gap-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.page;
            const hasNotification = item.badge && pendingCount > 0;
            
            return (
              <NavigationMenu.Item key={item.page}>
                <NavigationMenu.Link
                  active={isActive}
                  asChild
                >
                  <button 
                    onClick={() => setCurrentPage(item.page)}
                    className={cn(
                      // Base styles
                      "flex flex-col items-center py-2 px-4 relative rounded-t-md h-14 box-border",
                      // Default state
                      "dark:text-gray-300 text-gray-800 transition-all duration-200 nav-item",
                      // Active state - blend with content area background matching exactly
                      isActive && "text-foreground border-t border-l border-r border-border border-b-0 z-10 relative nav-item active"
                    )}
                    style={isActive ? { 
                      backgroundColor: 'var(--background)',
                      marginBottom: '-1px' 
                    } : undefined}
                  >
                    <div className="relative">
                      <Icon size={18} />
                      {/* Notification badge */}
                      {hasNotification && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[10px]">
                          {pendingCount}
                        </span>
                      )}
                    </div>
                    <span className="text-xs mt-1">{item.page}</span>
                  </button>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            );
          })}
        </NavigationMenu.List>
      </NavigationMenu.Root>
      
      {/* Right section - Actions/Settings */}
      <div className="flex items-center gap-4">
        <div className="text-xs dark:text-gray-400 text-gray-700" title="Keyboard Shortcuts">
          {modifierKey} + (1-5): Navigate
        </div>
        <ThemeToggle />
      </div>
    </header>
    </>
  );
}