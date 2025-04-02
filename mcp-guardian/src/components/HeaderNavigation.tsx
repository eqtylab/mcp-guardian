import React, { useState, useEffect } from "react";
import { Shield, ChevronDown } from "lucide-react";
import { cn } from "../utils";
import { Badge } from "./ui/Badge";

interface NavItemProps {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  label: string;
  isActive: boolean;
  description: string;
  onClick: () => void;
  badge?: number;
}

const HeaderNavItem = ({ icon: Icon, label, isActive, description, onClick, badge }: NavItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors",
      "focus:bg-colors-bg-interactive focus:outline-none focus:ring-2 focus:ring-colors-accent-primary focus:ring-inset",
      "disabled:opacity-50 disabled:pointer-events-none",
      "bg-transparent hover:bg-colors-bg-interactive hover:text-colors-text-primary",
      isActive ? "bg-colors-bg-interactive text-colors-text-primary border-l-2 border-colors-accent-primary" : "",
    )}
    title={description}
    role="tab"
    aria-selected={isActive}
  >
    <Icon size={18} />
    <span>{label}</span>
    {badge !== undefined && (
      <Badge variant={badge > 0 ? "warning" : "default"} className="ml-1 min-w-4 text-center">
        {badge}
      </Badge>
    )}
  </button>
);

interface MoreMenuProps {
  isOpen: boolean;
  toggleMenu: (e: React.MouseEvent) => void;
  items: {
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<{ className?: string; size?: number }>;
  }[];
}

const MoreMenu = ({ isOpen, toggleMenu, items }: MoreMenuProps) => (
  <div className="relative">
    <button
      onClick={toggleMenu}
      className={cn(
        "flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors",
        "focus:bg-colors-bg-interactive focus:outline-none focus:ring-2 focus:ring-colors-accent-primary focus:ring-inset",
        "disabled:opacity-50 disabled:pointer-events-none",
        "bg-transparent hover:bg-colors-bg-interactive hover:text-colors-text-primary",
        isOpen ? "bg-colors-bg-interactive text-colors-text-primary" : "",
      )}
      title="More options"
      aria-expanded={isOpen}
    >
      <span>More</span>
      <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen ? "rotate-180" : "")} />
    </button>
    
    {isOpen && (
      <div className="absolute right-0 mt-1 w-40 rounded-md border border-colors-border-subtle bg-colors-bg-surface shadow-md">
        {items.map((item, index) => (
          <button 
            key={index} 
            className={cn(
              "flex w-full items-center gap-2 px-3 py-2 text-sm text-colors-text-primary",
              "hover:bg-colors-bg-interactive hover:text-colors-text-primary",
              "focus:bg-colors-bg-interactive focus:outline-none"
            )}
            onClick={(e) => {
              e.stopPropagation();
              item.onClick();
            }}
          >
            {item.icon && <item.icon size={16} />}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    )}
  </div>
);

interface HeaderNavigationProps {
  navItems: Array<{
    page: string;
    icon: React.ComponentType<{ className?: string; size?: number }>;
    description: string;
    badge?: boolean;
  }>;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  pendingCount: number;
  modifierKey: string;
}

const HeaderNavigation = ({ 
  navItems, 
  currentPage, 
  setCurrentPage, 
  pendingCount,
  modifierKey 
}: HeaderNavigationProps) => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  
  // Choose primary navigation items (first 3-4 items)
  const primaryNavItems = navItems.slice(0, 4);
  
  // Any remaining items go to the More menu
  const moreNavItems = navItems.slice(4).map(item => ({
    label: item.page,
    onClick: () => {
      setCurrentPage(item.page);
      setIsMoreMenuOpen(false);
    },
    icon: item.icon
  }));
  
  // Close more menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isMoreMenuOpen) {
        setIsMoreMenuOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMoreMenuOpen]);
  
  return (
    <header className="flex h-14 items-center justify-between border-b border-colors-border-subtle bg-colors-bg-surface px-4">
      <div className="flex items-center gap-2">
        <Shield size={18} className="text-colors-accent-primary" />
        <span className="text-sm font-medium">MCP Guardian</span>
      </div>
      
      <nav className="flex items-center" role="tablist" aria-label="Main Navigation">
        {primaryNavItems.map((item) => (
          <HeaderNavItem
            key={item.page}
            icon={item.icon}
            label={item.page}
            isActive={currentPage === item.page}
            description={item.description}
            onClick={() => setCurrentPage(item.page)}
            badge={item.badge ? pendingCount : undefined}
          />
        ))}
        
        {moreNavItems.length > 0 && (
          <MoreMenu
            isOpen={isMoreMenuOpen}
            toggleMenu={(e) => {
              e.stopPropagation();
              setIsMoreMenuOpen(!isMoreMenuOpen);
            }}
            items={moreNavItems}
          />
        )}
      </nav>
      
      <div className="text-xs text-colors-text-tertiary" title="Keyboard Shortcuts">
        {modifierKey} + (1-5): Navigate
      </div>
    </header>
  );
};

export default HeaderNavigation;