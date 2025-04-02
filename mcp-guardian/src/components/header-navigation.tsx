import React, { useState, useEffect } from "react";
import { Shield, ChevronDown } from "lucide-react";
import { cn } from "../utils";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem
} from "./ui/navigation-menu";

interface NavItemProps {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  label: string;
  isActive: boolean;
  description: string;
  onClick: () => void;
  badge?: number;
}

const HeaderNavItem = ({ icon: Icon, label, isActive, description, onClick, badge }: NavItemProps) => (
  <Button
    onClick={onClick}
    variant="ghost"
    className={cn(
      "flex items-center gap-2 px-3 py-2 h-auto rounded-none",
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
  </Button>
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
    <Button
      onClick={toggleMenu}
      variant="ghost"
      className={cn(
        "flex items-center gap-2 px-3 py-2 h-auto rounded-none",
        isOpen ? "bg-colors-bg-interactive text-colors-text-primary" : "",
      )}
      title="More options"
      aria-expanded={isOpen}
    >
      <span>More</span>
      <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen ? "rotate-180" : "")} />
    </Button>
    
    {isOpen && (
      <div className="absolute right-0 mt-1 w-40 rounded-md border border-colors-border-subtle bg-colors-bg-surface shadow-md">
        {items.map((item, index) => (
          <Button 
            key={index}
            variant="ghost"
            className={cn(
              "flex w-full items-center justify-start gap-2 px-3 py-2 text-sm rounded-none"
            )}
            onClick={(e) => {
              e.stopPropagation();
              item.onClick();
            }}
          >
            {item.icon && <item.icon size={16} />}
            <span>{item.label}</span>
          </Button>
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
      
      <NavigationMenu>
        <NavigationMenuList className="flex items-center" role="tablist" aria-label="Main Navigation">
          {primaryNavItems.map((item) => (
            <NavigationMenuItem key={item.page}>
              <HeaderNavItem
                icon={item.icon}
                label={item.page}
                isActive={currentPage === item.page}
                description={item.description}
                onClick={() => setCurrentPage(item.page)}
                badge={item.badge ? pendingCount : undefined}
              />
            </NavigationMenuItem>
          ))}
          
          {moreNavItems.length > 0 && (
            <NavigationMenuItem>
              <MoreMenu
                isOpen={isMoreMenuOpen}
                toggleMenu={(e) => {
                  e.stopPropagation();
                  setIsMoreMenuOpen(!isMoreMenuOpen);
                }}
                items={moreNavItems}
              />
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>
      
      <div className="text-xs text-colors-text-tertiary" title="Keyboard Shortcuts">
        {modifierKey} + (1-5): Navigate
      </div>
    </header>
  );
};

export default HeaderNavigation;