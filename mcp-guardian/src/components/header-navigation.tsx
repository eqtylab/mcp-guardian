import React from "react";
import { Shield } from "lucide-react";
import { cn } from "../utils";
import { ThemeToggle } from "./theme-toggle";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";

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
    <header className="flex h-14 items-center justify-between bg-zinc-900 border-b border-zinc-800 px-6">
      {/* Left section - Logo */}
      <div className="flex items-center gap-2">
        <Shield size={20} className="text-primary" />
        <span className="text-white font-medium">MCP Guardian</span>
      </div>
      
      {/* Center section - Primary Navigation */}
      <NavigationMenu.Root className="flex-1 flex justify-center">
        <NavigationMenu.List className="flex items-center gap-1">
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
                      "flex flex-col items-center py-2 px-4 relative rounded-t-md",
                      // Default state
                      "text-gray-300 hover:text-white hover:bg-zinc-800",
                      // Active state - blend with content area background
                      isActive && "bg-background text-foreground border-t border-l border-r border-zinc-800 border-b-0"
                    )}
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
        <div className="text-xs text-gray-400" title="Keyboard Shortcuts">
          {modifierKey} + (1-5): Navigate
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}