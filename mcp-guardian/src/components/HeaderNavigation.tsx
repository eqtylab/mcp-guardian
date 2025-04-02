import { useState, useEffect } from "react";
import { Shield } from "lucide-react";

interface NavItemProps {
  icon: any;
  label: string;
  isActive: boolean;
  description: string;
  onClick: () => void;
  badge?: number;
}

const HeaderNavItem = ({ icon: Icon, label, isActive, description, onClick, badge }: NavItemProps) => (
  <button
    onClick={onClick}
    className={`header-nav-item ${isActive ? "active" : ""}`}
    title={description}
    role="tab"
    aria-selected={isActive}
  >
    <Icon size={18} strokeWidth={2} />
    <span>{label}</span>
    {badge !== undefined && (
      <span className={`nav-badge ${badge > 0 ? "" : "empty"}`}>
        {badge}
      </span>
    )}
  </button>
);

interface MoreMenuProps {
  isOpen: boolean;
  toggleMenu: (e: React.MouseEvent) => void;
  items: {
    label: string;
    onClick: () => void;
    icon?: any;
  }[];
}

const MoreMenu = ({ isOpen, toggleMenu, items }: MoreMenuProps) => (
  <div className="more-menu-container">
    <button
      onClick={toggleMenu}
      className={`header-nav-item ${isOpen ? "active" : ""}`}
      title="More options"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
      </svg>
      <span>More</span>
    </button>
    
    {isOpen && (
      <div className="more-menu">
        {items.map((item, index) => (
          <button key={index} className="more-menu-item" onClick={item.onClick}>
            {item.icon && <item.icon size={16} strokeWidth={2} />}
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
    icon: any;
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
    <header className="header-navigation">
      <div className="header-left">
        <div className="header-logo">
          <Shield size={18} className="text-accent-primary" />
          <span>MCP Guardian</span>
        </div>
      </div>
      
      <nav className="header-center" role="tablist" aria-label="Main Navigation">
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
      </nav>
      
      <div className="header-right">
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
        
        <div className="keyboard-hint" title="Keyboard Shortcuts">
          {modifierKey} + (1-5): Navigate
        </div>
      </div>
    </header>
  );
};

export default HeaderNavigation;